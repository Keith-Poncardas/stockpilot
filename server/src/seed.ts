import "dotenv/config";
import {
    PrismaClient,
    UserApprovalStatus,
    UserRole,
    UserStatus,
} from "./generated/client.js";
import argon2 from "argon2";
import dummyUsers from "./dummy-users.json" with { type: "json" };
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Starting database seeding (Users only)...\n");

    // Seed Users from dummy-users.json
    console.log("--- Seeding Users ---");
    for (const userData of dummyUsers) {
        const existingUser = await prisma.user.findUnique({
            where: { email: userData.email },
        });

        if (!existingUser) {
            const plainPassword = userData.password || "Password123!";
            const passwordHash = await argon2.hash(plainPassword);

            const roleKey = (userData.role as keyof typeof UserRole) || "SUPER_ADMIN";
            const statusKey = (userData.status as keyof typeof UserStatus) || "ACTIVE";
            const approvalStatusKey = (userData.approvalStatus as keyof typeof UserApprovalStatus) || "APPROVED";

            const createdUser = await prisma.user.create({
                data: {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    passwordHash,
                    role: UserRole[roleKey] ?? UserRole.SUPER_ADMIN,
                    status: UserStatus[statusKey] ?? UserStatus.ACTIVE,
                    approvalStatus: UserApprovalStatus[approvalStatusKey] ?? UserApprovalStatus.APPROVED,
                },
            });

            console.log(`✅ Super Admin created: ${createdUser.firstName} ${createdUser.lastName} (${createdUser.email})`);
            console.log(`   Default Password: ${plainPassword}`);
        } else {
            console.log(`⚠️  User already exists: ${existingUser.email}. Skipping user creation.`);
        }
    }

    console.log("\n🎉 Seeding completed successfully!");
}

main()
    .catch((err) => {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
