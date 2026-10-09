import type { PrismaClient, Token } from "@workspace/db/prisma/client";
import type { User } from "@workspace/db/prisma/client";

export class Repository {
    private readonly client: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.client = prisma;
    }

    public async getUserPassword(
        userId: string,
    ): Promise<{ password: string } | null> {
        const user = this.client.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                password: true,
            },
        });

        return user !== null ? user : null;
    }

    public async createAccount(
        username: string,
        password: string,
    ): Promise<User> {
        return this.client.user.create({
            data: {
                username: username,
                password: password,
            },
        });
    }

    public async saveToken(
        userId: string,
        token: string,
    ): Promise<{ createdAt: Date }> {
        return this.client.token.create({
            data: {
                userId: userId,
                code: token,
            },
            select: {
                createdAt: true,
            },
        });
    }

    public async deleteToken(userId: string, token: string) {
        return this.client.token.deleteMany({
            where: {
                userId: userId,
                AND: {
                    code: token,
                },
            },
        });
    }

    public async updatePassword(
        userId: string,
        newPassword: string,
    ): Promise<User> {
        return this.client.user.update({
            where: {
                id: userId,
            },
            data: {
                password: newPassword,
            },
        });
    }
}
