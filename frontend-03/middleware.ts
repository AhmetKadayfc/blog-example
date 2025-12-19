import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Middleware removed - authentication now handled client-side with localStorage
    // Route protection is enforced in individual page components
    return NextResponse.next();
}

export const config = {
    matcher: ['/create', '/edit/:path*'],
};
