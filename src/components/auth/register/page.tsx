'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { FaUser, FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface RegisterModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, closeModal }) => {
    const router = useRouter();
    const inputStyles = "border border-darklight p-2 w-full pl-10 rounded-[10px] text-sm sm:text-base text-dark dark:bg-darklight dark:text-white dark:border-darklight bg-whitedark focus:outline-none";
    const labelStyles = "text-primary font-medium dark:text-white text-sm sm:text-[16px]";
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (data.contrasena !== data.confirmpassword) {
                toast.error("Las contraseñas no coinciden");
                return;
            }

            // Realiza el envio de los datos del formulario
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    correo: data.correo,
                    contrasena: data.contrasena,
                }),
                headers: {
                    'Content-type': 'application/json',
                },
            });

            const resJSON = await res.json();

            if (resJSON.success) {
                // Intenta iniciar sesión automáticamente
                const result = await signIn('credentials', {
                    redirect: false,
                    email: data.correo,
                    password: data.contrasena
                });

                if (result?.error) {
                    toast.error("Registro exitoso, pero hubo un error al iniciar sesión automáticamente");
                    router.push('/');
                } else {
                    toast.success("¡Registro exitoso!");
                    reset();
                    closeModal();
                    router.push('/');
                    router.refresh();
                }
            } else {
                toast.error(resJSON.message || "Error al registrar usuario");
            }
        } catch (error) {
            toast.error("Error al procesar la solicitud");
            console.error(error);
        }
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 sm:p-6 rounded-[20px] w-11/12 sm:w-96 relative dark:bg-dark">
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 p-2">
                    <Image
                        src="/icons/close.svg"
                        alt="Cerrar"
                        width={24}
                        height={24}
                    />
                </button>

                <div className='flex items-center justify-center mt-5'>
                    <Image
                        src="/icons/logo.png"
                        alt="Cerrar"
                        width={200}
                        height={80}
                    />
                </div>
                <div className="flex justify-between items-center mb-4 border-b border-primary pb-4 dark:border-white">
                    <h2 className="text-sm sm:text-[16px] font-semibold text-primary flex-1 text-center dark:text-white">REGISTRO</h2>
                </div>

                <form className="mb-4" onSubmit={onSubmit}>
                    <label htmlFor="" className={labelStyles}>NOMBRES</label>
                    <div className="relative mb-[20px] mt-[15px]">
                        <input
                            type="text"
                            {...register("nombres", { required: true })}
                            className={inputStyles}
                            placeholder="Ingresa tus nombres"
                            required
                        />
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                    </div>

                    <label htmlFor="" className={labelStyles}>APELLIDOS</label>
                    <div className="relative mb-[20px] mt-[15px]">
                        <input
                            type="text"
                            {...register("apellidos", { required: true })}
                            className={inputStyles}
                            placeholder="Ingresa tus apellidos"
                            required
                        />
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                    </div>

                    <label htmlFor="" className={labelStyles}>CORREO ELECTRÓNICO</label>
                    <div className="relative mb-[20px] mt-[15px]">
                        <input
                            type="email"
                            {...register("correo", { required: true })}
                            className={inputStyles}
                            placeholder="Ingrese su correo electrónico"
                            required
                        />
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                    </div>

                    <label htmlFor="" className={labelStyles}>CONTRASEÑA</label>
                    <div className="relative mb-[20px] mt-[15px]">
                        <input
                            type="password"
                            {...register("contrasena", { required: true })}
                            className={inputStyles}
                            placeholder="Ingrese su contraseña"
                            required
                        />
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                    </div>

                    <label htmlFor="" className={labelStyles}>CONFIRMA CONTRASEÑA</label>
                    <div className="relative mb-[20px] mt-[15px]">
                        <input
                            type="password"
                            {...register("confirmpassword", { required: true })}
                            className={inputStyles}
                            placeholder="Confirme su contraseña"
                            required
                        />
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                    </div>

                    <div className="flex justify-center sm:justify-center mb-4 pt-4">
                        <button className="bg-primary text-white px-4 py-2 text-sm sm:text-base w-1/2 sm:w-1/2 rounded-[10px] flex items-center justify-center">
                            <FaSignInAlt className="mr-2" />
                            Registrarse
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;