
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

  const userEmail = session.user.email || 'unknown';
  const orgId = (session.user as any).orgId || 'default-org';

  if (req.method === 'GET') {
    try {
      const results: any[] = await prisma.$queryRawUnsafe(`
        SELECT id, name, "orgId", "userId", "createdAt", "updatedAt", version, "createdBy", "updatedBy",
        pgp_sym_decrypt(data, '${PROJECT_KEY}')::json as data
        FROM "Project"
        WHERE id = '${id}' AND "orgId" = '${orgId}' AND "deletedAt" IS NULL
      `);
      if (results.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(results[0]);
    } catch (error) {
      return res.status(500).json({ error: 'Fetch error' });
    }
  }

  if (req.method === 'PUT') {
    const { name, data, version: clientVersion } = req.body;
    try {
      const jsonData = JSON.stringify(data);
      
      // Perform optimistic locking update
      const result = await prisma.$executeRawUnsafe(`
        UPDATE "Project"
        SET name = '${name}',
            data = pgp_sym_encrypt('${jsonData}', '${PROJECT_KEY}'),
            version = version + 1,
            "updatedBy" = '${userEmail}',
            "updatedAt" = now()
        WHERE id = '${id}' AND "orgId" = '${orgId}' AND version = ${clientVersion} AND "deletedAt" IS NULL
      `);

      if (result === 0) {
        return res.status(409).json({ error: 'Conflict: The project has been modified by another user. Please refresh.' });
      }

      // Record in history for tracking all versions
      await prisma.$executeRawUnsafe(`
        INSERT INTO "ProjectHistory" (id, "projectId", name, data, version, "updatedBy", "updatedAt")
        VALUES (
          gen_random_uuid()::text,
          '${id}',
          '${name}',
          pgp_sym_encrypt('${jsonData}', '${PROJECT_KEY}'),
          (SELECT version FROM "Project" WHERE id = '${id}'),
          '${userEmail}',
          now()
        )
      `);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Update error:', error);
      return res.status(500).json({ error: 'Update error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Soft delete
      await prisma.$executeRawUnsafe(`
        UPDATE "Project"
        SET "deletedAt" = now(), "updatedBy" = '${userEmail}'
        WHERE id = '${id}' AND "orgId" = '${orgId}'
      `);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Delete error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
