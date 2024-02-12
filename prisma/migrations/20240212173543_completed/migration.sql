-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "numero_pedido" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "client_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesas" (
    "number" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'livre',
    "location" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" SERIAL NOT NULL,
    "client_id" TEXT NOT NULL,
    "number_persons" INTEGER NOT NULL,
    "dateReservation" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" SERIAL NOT NULL,
    "avaliacao" DOUBLE PRECISION NOT NULL,
    "comentario" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mesas_number_key" ON "mesas"("number");

-- CreateIndex
CREATE UNIQUE INDEX "assessments_id_key" ON "assessments"("id");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
