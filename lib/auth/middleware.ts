import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, JWTPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export async function authenticate(request: NextRequest): Promise<{
  authenticated: boolean;
  user?: JWTPayload;
  error?: string;
}> {
  try {
    // Try user token first, then admin token
    let token = request.cookies.get('auth-token')?.value;
    if (!token) {
      token = request.cookies.get('admin_token')?.value;
    }
    
    if (!token) {
      return { authenticated: false, error: 'No authentication token provided' };
    }
    
    const user = await verifyJWT(token);
    return { authenticated: true, user };
  } catch (error) {
    return { authenticated: false, error: 'Invalid or expired token' };
  }
}

export async function requireAuth(
  request: NextRequest,
  allowedTypes?: ('user' | 'admin')[]
): Promise<{ authorized: boolean; user?: JWTPayload; response?: NextResponse }> {
  const preferAdminToken = allowedTypes?.length === 1 && allowedTypes[0] === 'admin';
  const preferUserToken = allowedTypes?.length === 1 && allowedTypes[0] === 'user';

  const { authenticated, user, error } = preferAdminToken
    ? await (async () => {
        try {
          const token = request.cookies.get('admin_token')?.value;
          if (!token) {
            return { authenticated: false, error: 'No authentication token provided' };
          }
          const decoded = await verifyJWT(token);
          return { authenticated: true, user: decoded };
        } catch {
          return { authenticated: false, error: 'Invalid or expired token' };
        }
      })()
    : preferUserToken
      ? await (async () => {
          try {
            const token = request.cookies.get('auth-token')?.value;
            if (!token) {
              return { authenticated: false, error: 'No authentication token provided' };
            }
            const decoded = await verifyJWT(token);
            return { authenticated: true, user: decoded };
          } catch {
            return { authenticated: false, error: 'Invalid or expired token' };
          }
        })()
      : await authenticate(request);
  
  if (!authenticated || !user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      ),
    };
  }
  
  if (allowedTypes && !allowedTypes.includes(user.type)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      ),
    };
  }
  
  return { authorized: true, user };
}
