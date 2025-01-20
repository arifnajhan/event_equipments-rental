export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
        '/users/:path*',
        '/api/bookings/:path*',
        '/api/payments/:path*',
        // Add other protected routes as needed
    ],
};