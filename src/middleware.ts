import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

// Definir los roles como enum o constantes para mejor mantenimiento
const Roles = {
    Admin: 1,
    Cliente: 2,
    Encargado: 3,
} as const;

export default withAuth(
    async function middleware(request: NextRequestWithAuth) {
        const token = await getToken({ req: request });
        const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

        // Si no hay token, redirigir al login
        if (!token) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Verificar acceso a rutas administrativas
        if (isAdminRoute) {
            if (token.role === Roles.Cliente) {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                // Verificar que el usuario esté autenticado
                return !!token;
            }
        },
    }
);

// Proteger todas las rutas que requieren autenticación
export const config = {
    matcher: [
        '/admin/:path*',
        '/dashboard/:path*',
    ]
};
