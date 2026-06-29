import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import argon2 from "argon2";
import dummyUsers from "./dummy-users.json";

const prisma = new PrismaClient();

async function main() {
    const email = "poncardask03@gmail.com";
    const plainPassword = "iamwebdev2003";

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

    // // Seed dummy users
    // console.log(`\n⏳ Seeding dummy users...`);
    // let seededCount = 0;
    // const defaultPasswordHash = await argon2.hash("password123");

    // for (const dummy of dummyUsers) {
    //     const existingDummy = await prisma.user.findUnique({ where: { email: dummy.email } });

    //     if (!existingDummy) {
    //         await prisma.user.create({
    //             data: {
    //                 firstName: dummy.firstName,
    //                 lastName: dummy.lastName,
    //                 email: dummy.email,
    //                 role: dummy.role as UserRole,
    //                 status: dummy.status as UserStatus,
    //                 passwordHash: defaultPasswordHash,
    //             }
    //         });
    //         seededCount++;
    //     }
    // }

    // console.log(`✅ Seeded ${seededCount} dummy users.`);
}

main()
    .catch((err) => {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
