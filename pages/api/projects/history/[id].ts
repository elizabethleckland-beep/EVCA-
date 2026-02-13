
import type { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore - PrismaClient generation may be pending in the environment
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();
const PROJECT_KEY = process.env.PROJECT_KEY || 'EVCA_SECURE_VAULT_2025';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const session = await getSession({ req });
  
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const orgId = (session.user as any).orgId || 'default-org';

  if (req.method === 'GET') {
    try {
      // Check if user has access to the parent project
      const parent: any[] = await prisma.$queryRawUnsafe(`
        SELECT id FROM "Project" WHERE id = '${id}' AND "orgId" = '${orgId}'
      `);
      if (parent.length === 0) return res.status(404).json({ error: 'Project not found' });

      // Fetch all historical versions
      const history = await prisma.$queryRawUnsafe(`
        SELECT id, name, version, "updatedBy", "updatedAt",
        pgp_sym_decrypt(data, '${PROJECT_KEY}')::json as data
        FROM "ProjectHistory"
        WHERE "projectId" = '${id}'
        ORDER BY version DESC
      `);

      return res.status(200).json(history);
    } catch (error) {
      console.error('Fetch History Error:', error);
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
