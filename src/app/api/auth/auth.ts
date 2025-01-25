import NextAuth, { type NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';

// declare module "next-auth" {
//     interface User {
//         role?: number;
//         apellidos?: string;
//         celular?: string;
//         codigo_pais?: string;
//         rolNombre?: string;
//     }

//     interface Session {
//         user: {
//             role?: number;
//             apellidos?: string;
//             celular?: string;
//             codigo_pais?: string;
//             rolNombre?: string;
//         } & DefaultSession["user"]
//     }
// }

// declare module "next-auth/jwt" {
//     interface JWT {
//         role?: number;
//         apellidos?: string;
//         celular?: string;
//         codigo_pais?: string;
//         rolNombre?: string;
//     }
// }

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                const userFound = await prisma.usuarios.findUnique({
                    where: {
                        correo: credentials.email
                    },
                    include: {
                        rolesUsuarios: true // Asegúrate de incluir la relación correctamente
                    }
                });

                if (!userFound || !userFound.contrasena) return null;

                const matchPassword = await bcrypt.compare(credentials.password, userFound.contrasena);

                if (!matchPassword) return null;

                return {
                    id: userFound.id.toString(),
                    name: userFound.nombres,
                    email: userFound.correo,
                    role: userFound.id_rol,
                    apellidos: userFound.apellidos,
                    celular: userFound.celular,
                    codigo_pais: userFound.codigo_pais,
                    rolNombre: userFound.rolesUsuarios?.nombre || null
                } as any;
            }
        })
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.role = user.role;
                token.apellidos = user.apellidos;
                token.celular = user.celular;
                token.codigo_pais = user.codigo_pais;
                token.rolNombre = user.rolNombre;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                session.user.role = token.role;
                session.user.apellidos = token.apellidos;
                session.user.celular = token.celular;
                session.user.codigo_pais = token.codigo_pais;
                session.user.rolNombre = token.rolNombre;
            }
            return session;
        }
    },
    pages: {
        signIn: "/",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 días
    },
};