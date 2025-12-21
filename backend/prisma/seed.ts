import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: { name: "USER" },
  });

  const password = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@saas.cl" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@saas.cl",
      password,
      roleId: adminRole.id,
    },
  });

  console.log("✅ Seed ejecutado correctamente");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
