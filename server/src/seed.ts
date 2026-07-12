import { PrismaClient, UserApprovalStatus, UserRole, UserStatus } from "@prisma/client";
import argon2 from "argon2";
import dummyUsers from "./dummy-users.json";
import dummyProducts from "./dummy-products.json";

const prisma = new PrismaClient();

async function main() {
    const email = "poncardask03@gmail.com";
    const plainPassword = "Iamwebdev2003?";

    // Check if the super admin already exists to prevent duplicate seeding
    const existing = await prisma.user.findUnique({ where: { email } });

    if (!existing) {
        const passwordHash = await argon2.hash(plainPassword);

        const superAdmin = await prisma.user.create({
            data: {
                firstName: "Keith Ralph",
                lastName: "Poncardas",
                email,
                passwordHash,
                role: UserRole.SUPER_ADMIN,
                status: UserStatus.ACTIVE,
                approvalStatus: UserApprovalStatus.APPROVED
            },
        });

        console.log(`✅ Super admin seeded successfully:`);
        console.log(`   ID    : ${superAdmin.id}`);
        console.log(`   Name  : ${superAdmin.firstName} ${superAdmin.lastName}`);
        console.log(`   Email : ${superAdmin.email}`);
        console.log(`   Role  : ${superAdmin.role}`);
        console.log(`   Status: ${superAdmin.status}`);
    } else {
        console.log(`⚠️  Super admin already exists (${email}). Skipping super admin seed.`);
    }

}

main()
    .catch((err) => {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
