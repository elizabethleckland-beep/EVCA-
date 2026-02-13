
import type { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore - PrismaClient generation may be pending in the environment
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();
const PROJECT_KEY = process.env.PROJECT_KEY || 'EVCA_SECURE_VAULT_2025';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = (session.user as any).id;
  const userEmail = session.user.email || 'unknown';
  const orgId = (session.user as any).orgId || 'default-org';

  if (req.method === 'GET') {
    try {
      const projects = await prisma.$queryRawUnsafe(`
        SELECT id, name, "orgId", "userId", "createdAt", "updatedAt", version, "createdBy", "updatedBy",
        pgp_sym_decrypt(data, '${PROJECT_KEY}')::json as data
        FROM "Project"
        WHERE "orgId" = '${orgId}' AND "deletedAt" IS NULL
        ORDER BY "updatedAt" DESC
      `);
      return res.status(200).json(projects);
    } catch (error) {
      console.error('Fetch Projects Error:', error);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }

  if (req.method === 'POST') {
    const { name, data } = req.body;
    try {
      const jsonData = JSON.stringify(data);
      const projectId = crypto.randomUUID();
      
      await prisma.$executeRawUnsafe(`
        INSERT INTO "Project" (id, name, "orgId", "userId", data, version, "createdBy", "updatedBy", "createdAt", "updatedAt")
        VALUES (
          '${projectId}',
          '${name}',
          '${orgId}',
          '${userId}',
          pgp_sym_encrypt('${jsonData}', '${PROJECT_KEY}'),
          1,
          '${userEmail}',
          '${userEmail}',
          now(),
          now()
        )
      `);

      // Record first version in history
      await prisma.$executeRawUnsafe(`
        INSERT INTO "ProjectHistory" (id, "projectId", name, data, version, "updatedBy", "updatedAt")
        VALUES (
          gen_random_uuid()::text,
          '${projectId}',
          '${name}',
          pgp_sym_encrypt('${jsonData}', '${PROJECT_KEY}'),
          1,
          '${userEmail}',
          now()
        )
      `);

      return res.status(201).json({ success: true, id: projectId });
    } catch (error) {
      console.error('Create Project Error:', error);
      return res.status(500).json({ error: 'Failed to create project' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
