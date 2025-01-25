-- CreateTable
CREATE TABLE "RolesUsuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "RolesUsuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "id_google" TEXT,
    "id_rol" INTEGER,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "celular" TEXT,
    "codigo_pais" TEXT,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriasProductos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "CategoriasProductos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Colores" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo_color" TEXT NOT NULL,

    CONSTRAINT "Colores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Productos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(65,30) NOT NULL,
    "id_categoria" INTEGER,
    "id_material" INTEGER,
    "id_marca" INTEGER,
    "imagen_principal" TEXT,
    "stock" INTEGER,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materiales" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Materiales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promociones" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "porcentaje_descuento" DECIMAL(65,30) NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promociones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromocionesProductos" (
    "id" SERIAL NOT NULL,
    "id_producto" INTEGER,
    "id_promocion" INTEGER,

    CONSTRAINT "PromocionesProductos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marcas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "logo" TEXT,

    CONSTRAINT "Marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DescuentosPorCantidad" (
    "id" SERIAL NOT NULL,
    "id_marca" INTEGER,
    "cantidad" INTEGER NOT NULL,
    "precio_descuento" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DescuentosPorCantidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CotizacionesAmigurumi" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tamano" INTEGER NOT NULL,
    "descripcion" TEXT,
    "imagen_referencia" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CotizacionesAmigurumi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagenesColores" (
    "id" SERIAL NOT NULL,
    "id_producto" INTEGER,
    "id_color" INTEGER,
    "imagen" TEXT,

    CONSTRAINT "ImagenesColores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockColores" (
    "id" SERIAL NOT NULL,
    "id_producto" INTEGER,
    "id_color" INTEGER,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "StockColores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpcionesEntrega" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT,

    CONSTRAINT "OpcionesEntrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetallesEntregaDomicilio" (
    "id" SERIAL NOT NULL,
    "id_pedido" INTEGER,
    "nombre" TEXT,
    "apellidos" TEXT,
    "dni" TEXT,
    "direccion" TEXT,
    "distrito" TEXT,
    "ciudad" TEXT,
    "region" TEXT,
    "codigo_postal" TEXT,
    "celular" TEXT,
    "pais" TEXT,

    CONSTRAINT "DetallesEntregaDomicilio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntosEncuentro" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT,
    "region" TEXT,

    CONSTRAINT "PuntosEncuentro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodigosDescuento" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "descuento" DECIMAL(65,30) NOT NULL,
    "fecha_expiracion" TIMESTAMP(3),
    "cantidad_minima" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "CodigosDescuento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedidos" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "monto_total" DECIMAL(65,30) NOT NULL,
    "id_metodo_pago" INTEGER,
    "estado" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_opcion_entrega" INTEGER,
    "id_codigo_descuento" INTEGER,

    CONSTRAINT "Pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetallesPedidos" (
    "id" SERIAL NOT NULL,
    "id_pedido" INTEGER,
    "id_producto" INTEGER,
    "cantidad" INTEGER NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DetallesPedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetodosPago" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "MetodosPago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductoColores" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductoColores_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "RolesUsuarios_nombre_key" ON "RolesUsuarios"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_correo_key" ON "Usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_id_google_key" ON "Usuarios"("id_google");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriasProductos_nombre_key" ON "CategoriasProductos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Materiales_nombre_key" ON "Materiales"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Marcas_nombre_key" ON "Marcas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "CodigosDescuento_codigo_key" ON "CodigosDescuento"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "MetodosPago_nombre_key" ON "MetodosPago"("nombre");

-- CreateIndex
CREATE INDEX "_ProductoColores_B_index" ON "_ProductoColores"("B");

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "RolesUsuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "CategoriasProductos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Materiales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_id_marca_fkey" FOREIGN KEY ("id_marca") REFERENCES "Marcas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromocionesProductos" ADD CONSTRAINT "PromocionesProductos_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromocionesProductos" ADD CONSTRAINT "PromocionesProductos_id_promocion_fkey" FOREIGN KEY ("id_promocion") REFERENCES "Promociones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DescuentosPorCantidad" ADD CONSTRAINT "DescuentosPorCantidad_id_marca_fkey" FOREIGN KEY ("id_marca") REFERENCES "Marcas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagenesColores" ADD CONSTRAINT "ImagenesColores_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagenesColores" ADD CONSTRAINT "ImagenesColores_id_color_fkey" FOREIGN KEY ("id_color") REFERENCES "Colores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockColores" ADD CONSTRAINT "StockColores_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockColores" ADD CONSTRAINT "StockColores_id_color_fkey" FOREIGN KEY ("id_color") REFERENCES "Colores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesEntregaDomicilio" ADD CONSTRAINT "DetallesEntregaDomicilio_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "Pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_id_metodo_pago_fkey" FOREIGN KEY ("id_metodo_pago") REFERENCES "MetodosPago"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_id_opcion_entrega_fkey" FOREIGN KEY ("id_opcion_entrega") REFERENCES "OpcionesEntrega"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_id_codigo_descuento_fkey" FOREIGN KEY ("id_codigo_descuento") REFERENCES "CodigosDescuento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesPedidos" ADD CONSTRAINT "DetallesPedidos_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "Pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesPedidos" ADD CONSTRAINT "DetallesPedidos_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductoColores" ADD CONSTRAINT "_ProductoColores_A_fkey" FOREIGN KEY ("A") REFERENCES "Colores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductoColores" ADD CONSTRAINT "_ProductoColores_B_fkey" FOREIGN KEY ("B") REFERENCES "Productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
