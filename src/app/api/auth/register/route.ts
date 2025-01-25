import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';
// import sendWelcomeEmail from "@/app/utils/resendClient";

// Función para validar nombres y apellidos (solo letras y espacios)
const isValidName = (str: string) => /^[a-zA-Z\s]+$/.test(str);

// Función para capitalizar la primera letra de cada palabra
function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validación básica
    if (!data.nombres || !data.apellidos || !data.correo || !data.contrasena) {
      return NextResponse.json({
        success: false,
        message: "Todos los campos son requeridos",
      }, {
        status: 400
      });
    }

    // Validación de nombres y apellidos
    if (!isValidName(data.nombres) || !isValidName(data.apellidos)) {
      return NextResponse.json({
        success: false,
        message: "Los nombres y apellidos no deben contener números.",
      }, {
        status: 400
      });
    }

    // Transformar los datos
    const nombres = capitalizeWords(data.nombres);
    const apellidos = capitalizeWords(data.apellidos);
    const correo = data.correo.toLowerCase();

    // Validación para verificar si ya existe el correo
    const userFound = await prisma.usuarios.findUnique({
      where: {
        correo
      }
    });

    if (userFound) {
      return NextResponse.json({
        success: false,
        message: "Correo ya existe"
      }, {
        status: 400
      });
    }

    // Encriptación de la contraseña y creación del usuario
    const hashedPassword = await bcrypt.hash(data.contrasena, 10);
    const newUser = await prisma.usuarios.create({
      data: {
        nombres,
        apellidos,
        correo,
        contrasena: hashedPassword,
        id_rol: 2,
      }
    });

    return NextResponse.json({
      success: true,
      user: newUser,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido"
    }, {
      status: 500,
    });
  }
}
