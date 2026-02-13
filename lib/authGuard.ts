
import { getSession } from "next-auth/react";
// @ts-ignore - Role is part of the generated Prisma client which may be missing in some environments
import { Role } from "@prisma/client";

export async function checkAuth(req: any, requiredRole?: Role) {
  const session = await getSession({ req });

  if (!session) {
    return { authenticated: false, authorized: false };
  }

  if (requiredRole) {
    // @ts-ignore
    const userRole = session.user.role as Role;
    const roles = Object.values(Role);
    const hasRole = roles.indexOf(userRole) <= roles.indexOf(requiredRole);
    
    return { 
      authenticated: true, 
      authorized: hasRole,
      session 
    };
  }

  return { authenticated: true, authorized: true, session };
}
