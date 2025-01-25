import { redirect } from 'next/navigation';

export default function Home() {
  // Redirigir a /ecommerce cuando se accede a la raíz
  redirect('/tienda');
  return null; // No es necesario mostrar nada en esta página
}
