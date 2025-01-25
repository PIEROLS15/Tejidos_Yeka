import { redirect } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirigir automáticamente a /ecommerce si el usuario accede a la raíz
  if (typeof window !== 'undefined' && window.location.pathname === '/') {
    redirect('/tienda');
  }

  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Tejidos Yeka</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
