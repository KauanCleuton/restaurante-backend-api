-- CreateTable
CREATE TABLE "_PedidosToProducts" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PedidosToProducts_AB_unique" ON "_PedidosToProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_PedidosToProducts_B_index" ON "_PedidosToProducts"("B");

-- AddForeignKey
ALTER TABLE "_PedidosToProducts" ADD CONSTRAINT "_PedidosToProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PedidosToProducts" ADD CONSTRAINT "_PedidosToProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
