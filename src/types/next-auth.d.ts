import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        role?: number;
        apellidos?: string;
        celular?: string;
        codigo_pais?: string;
        rolNombre?: string;
    }

    interface Session {
        user: {
            role?: number;
            apellidos?: string;
            celular?: string;
            codigo_pais?: string;
            rolNombre?: string;
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: number;
        apellidos?: string;
        celular?: string;
        codigo_pais?: string;
        rolNombre?: string;
    }
}