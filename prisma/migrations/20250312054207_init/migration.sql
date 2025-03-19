/*
  Warnings:

  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `apellidos` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `direccion` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `localidad` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `municipio` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[correo]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigoBarras]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apellido` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - The required column `codigoBarras` was added to the `Usuario` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `correo` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Departamento" AS ENUM ('TI', 'RRHH', 'VENTAS', 'ADMINISTRACION', 'PRODUCCION');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EMPLEADO');

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
DROP COLUMN "apellidos",
DROP COLUMN "direccion",
DROP COLUMN "id",
DROP COLUMN "localidad",
DROP COLUMN "municipio",
ADD COLUMN     "apellido" TEXT NOT NULL,
ADD COLUMN     "codigoBarras" TEXT NOT NULL,
ADD COLUMN     "correo" TEXT NOT NULL,
ADD COLUMN     "departamento" "Departamento",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "rol" "Rol" NOT NULL DEFAULT 'EMPLEADO',
ADD COLUMN     "usuarioId" SERIAL NOT NULL,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usuarioId");

-- CreateTable
CREATE TABLE "Asistencia" (
    "asistenciaId" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("asistenciaId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_usuarioId_fecha_key" ON "Asistencia"("usuarioId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_codigoBarras_key" ON "Usuario"("codigoBarras");

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("usuarioId") ON DELETE CASCADE ON UPDATE CASCADE;
