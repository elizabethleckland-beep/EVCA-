
import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimitMiddleware } from '../../middleware/rateLimit';
import { streamGemini } from '../../util/streamGemini';
import { GoogleGenAI } from "@google/genai";
import { s3Util } from '../../util/s3';
import { getSession } from 'next-auth/react';
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('evca-gemini-proxy');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const orgId = (session?.user as any)?.orgId || 'unknown-org';

  return await tracer.startActiveSpan('gemini-proxy-handler', async (span) => {
    try {
      await rateLimitMiddleware(req, res);
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: 'Rate limit exceeded' });
      span.end();
      return;
    }

    const payload = req.method === 'POST' ? req.body : JSON.parse(req.query.p as string || '{}');
    const { model, contents, config, attachmentKey } = payload;

    span.setAttribute('org_id', orgId);
    span.setAttribute('model_name', model);

    // RAG Context Injection
    if (attachmentKey) {
      try {
        const snippet = await s3Util.getFileSnippet(attachmentKey, 400);
        if (snippet) {
          const contextPart = { text: `\n[ATTACHMENT CONTEXT]: ${snippet}\n` };
          if (Array.isArray(contents)) {
            contents[0].parts.unshift(contextPart);
          } else if (contents.parts) {
            contents.parts.unshift(contextPart);
          }
        }
      } catch (e) {
        console.warn("Could not fetch attachment snippet:", e);
      }
    }

    // Handle standard POST for non-streaming fallback
    if (req.method === 'POST' && req.headers['accept'] !== 'text/event-stream') {
      const startTime = Date.now();
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: model,
          contents: contents,
          config: config,
        });

        const latency = Date.now() - startTime;
        const tokens = response.usageMetadata?.totalTokenCount || 0;

        span.setAttributes({
          'tokens_used': tokens,
          'latency_ms': latency,
        });

        span.setStatus({ code: SpanStatusCode.OK });
        span.end();
        return res.status(200).json(response);
      } catch (error: any) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        span.end();
        return res.status(error.status || 500).json({ error: error.message });
      }
    }

    // Handle SSE (Server-Sent Events)
    if (req.headers['accept'] === 'text/event-stream') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const startTime = Date.now();
      try {
        const stream = streamGemini(model, contents, config);
        for await (const chunk of stream) {
          res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        }
        
        const latency = Date.now() - startTime;
        span.setAttributes({
          'latency_ms': latency,
          'streaming': true
        });

        res.write('data: [DONE]\n\n');
        res.end();
        span.setStatus({ code: SpanStatusCode.OK });
        span.end();
      } catch (error: any) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
        span.end();
      }
      return;
    }

    span.setStatus({ code: SpanStatusCode.ERROR, message: 'Method not allowed' });
    span.end();
    return res.status(405).json({ error: 'Method not allowed' });
  });
}
