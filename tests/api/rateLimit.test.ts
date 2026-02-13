
// Import necessary globals for Jest testing environment
import { describe, it, expect } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import geminiProxyHandler from '../../pages/api/geminiProxy';

describe('API Rate Limiting', () => {
  it('should allow up to 30 requests and return 429 on the 31st request', async () => {
    const ip = '127.0.0.1';

    // Helper to simulate a request
    const makeRequest = async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: { 'x-forwarded-for': ip },
        // Updated model name to 'gemini-3-pro-preview' as 'gemini-pro' is prohibited
        body: { model: 'gemini-3-pro-preview', contents: [] },
      });
      // @ts-ignore
      await geminiProxyHandler(req, res);
      return res;
    };

    // Make 30 requests
    for (let i = 0; i < 30; i++) {
      const res = await makeRequest();
      // We check that we either get a 200 (if fetch succeeds) 
      // or at least not a 429.
      expect(res._getStatusCode()).not.toBe(429);
    }

    // The 31st request should be throttled
    const res31 = await makeRequest();
    expect(res31._getStatusCode()).toBe(429);
    expect(JSON.parse(res31._getData())).toEqual({
      error: 'Too many requests, please try again later.',
    });
  });
});
