
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { s3Util } from '../../util/s3';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { fileName, fileType, fileData } = req.body; // Expecting base64 encoded fileData
    // Use Buffer.from directly as it is a global in Node.js environments like Next.js API routes
    // Fix: Casting Buffer to any to avoid "Cannot find name 'Buffer'" error in restricted TS environments
    const buffer = (Buffer as any).from(fileData, 'base64');
    const key = `uploads/${Date.now()}-${fileName}`;

    await s3Util.uploadFile(buffer, key, fileType);
    const presignedUrl = await s3Util.getPresignedUrl(key);

    return res.status(200).json({ key, presignedUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
}
