/*
  Warnings:

  - The values [SUPER_ADMIN,EMPLEADO] on the enum `Rol` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `apellido` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `codigoBarras` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `departamento` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `Asistencia` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contrasena` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Dificultad" AS ENUM ('FACIL', 'MEDIO', 'DIFICIL');

-- AlterEnum
BEGIN;
CREATE TYPE "Rol_new" AS ENUM ('ADMIN', 'USUARIO');
ALTER TABLE "Usuario" ALTER COLUMN "rol" DROP DEFAULT;
ALTER TABLE "Usuario" ALTER COLUMN "rol" TYPE "Rol_new" USING ("rol"::text::"Rol_new");
ALTER TYPE "Rol" RENAME TO "Rol_old";
ALTER TYPE "Rol_new" RENAME TO "Rol";
DROP TYPE "Rol_old";
ALTER TABLE "Usuario" ALTER COLUMN "rol" SET DEFAULT 'USUARIO';
COMMIT;

-- DropForeignKey
ALTER TABLE "Asistencia" DROP CONSTRAINT "Asistencia_usuarioId_fkey";

-- DropIndex
DROP INDEX "Usuario_codigoBarras_key";

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
DROP COLUMN "apellido",
DROP COLUMN "codigoBarras",
DROP COLUMN "departamento",
DROP COLUMN "password",
DROP COLUMN "usuarioId",
ADD COLUMN     "contrasena" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "rol" SET DEFAULT 'USUARIO',
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Asistencia";

-- DropEnum
DROP TYPE "Departamento";

-- CreateTable
CREATE TABLE "Palabra" (
    "id" SERIAL NOT NULL,
    "palabra" TEXT NOT NULL,
    "dificultad" "Dificultad" NOT NULL,

    CONSTRAINT "Palabra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partida" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "palabraId" INTEGER NOT NULL,
    "puntuacion" INTEGER NOT NULL,
    "intentosUsados" INTEGER NOT NULL,
    "tiempoUsado" DOUBLE PRECISION NOT NULL,
    "creadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Palabra_palabra_key" ON "Palabra"("palabra");

-- CreateIndex
CREATE INDEX "Palabra_dificultad_idx" ON "Palabra"("dificultad");

-- CreateIndex
CREATE INDEX "Partida_puntuacion_idx" ON "Partida"("puntuacion");

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_palabraId_fkey" FOREIGN KEY ("palabraId") REFERENCES "Palabra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
