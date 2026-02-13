
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).send("Not authenticated");
  }

  return res.status(200).send(`Hello, ${session.user?.email || 'Architect'}!`);
}
