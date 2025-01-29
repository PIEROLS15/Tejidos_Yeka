'use client'

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';


interface LoginModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, closeModal }) => {

    const inputStyles = "border border-darklight p-2 w-full pl-10 rounded-[10px] text-sm sm:text-base text-dark dark:bg-darklight dark:text-white dark:border-darklight bg-whitedark focus:outline-none";
    const { register, handleSubmit } = useForm();
    const onSubmit = handleSubmit(async data => {
        console.log(data);
        const res = await signIn('credentials', {
            email: data.correo,
            password: data.contrasena,
            redirect: false,
        });

        console.log(res);

        if (res?.ok) {
            closeModal();
            toast.success('¡Inicio de sesión exitoso!');
        } else {
            toast.error('Error al iniciar sesión. Verifica tus credenciales.');
        }
    });

    if (!isOpen) return null;

    return (
        <>
            {/* Coloca el contenedor de Toast aquí */}
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]">
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
                        <h2 className="text-sm sm:text-[16px] font-semibold text-primary flex-1 text-center dark:text-white">INICIAR SESIÓN</h2>
                    </div>

                    <form onSubmit={onSubmit} className="mb-4">
                        <label htmlFor="" className='text-primary font-medium dark:text-white text-sm sm:text-[16px]'>USUARIO</label>
                        <div className="relative mb-[20px] mt-[15px]">
                            <input
                                type="email"
                                {...register("correo", { required: true })}
                                className={inputStyles}
                                placeholder="Ingresa tu correo electronico"
                                required
                            />
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                        </div>

                        <label htmlFor="" className='text-primary font-medium dark:text-white text-sm sm:text-[16px]'>CONTRASEÑA</label>
                        <div className="relative mb-4 mt-[15px]">
                            <input
                                type="password"
                                {...register("contrasena", { required: true })}
                                className={inputStyles}
                                placeholder="Ingrese su contraseña"
                                required
                            />
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                        </div>

                        <a href="" className='text-primary text-xs sm:text-sm dark:text-white'>¿Olvidaste tu contraseña?</a>

                        <div className="flex justify-center sm:justify-center mb-4 pt-4">
                            <button className="bg-primary text-white px-4 py-2 text-sm sm:text-base w-1/2 sm:w-1/2 rounded-[10px] flex items-center justify-center">
                                <FaSignInAlt className="mr-2" />
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default LoginModal;
