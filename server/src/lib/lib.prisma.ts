import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

// Graceful shutdown for nodemon and other process exits
const gracefulShutdown = async (signal: string) => {
    await prisma.$disconnect();
    if (signal === 'SIGUSR2') {
        process.kill(process.pid, 'SIGUSR2');
    } else {
        process.exit(0);
    }
};

process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
process.once('SIGINT', () => gracefulShutdown('SIGINT'));
process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));