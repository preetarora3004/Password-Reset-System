import type { Cache } from "@workspace/server/cache";
import type { Repository } from "@workspace/server/repository";
import type { Utiltity } from "@workspace/server/utility";

export class Service {
    private readonly repo: Repository;
    private readonly cache: Cache;
    private util: Utiltity;

    constructor(repository: Repository, utility: Utiltity, cache: Cache) {
        this.repo = repository;
        this.util = utility;
        this.cache = cache;
    }

    public async createAccount(username: string, password: string) {
        const user = await this.repo.createAccount(username, password);

        if (!user) {
            throw Error("Unable to create user");
        }

        return user;
    }

    public async tokenGeneration(userId: string) {
        const token = await this.util.generateToken(userId);

        if(!token) {
            throw Error("Retry after 15 minutes")
        }

        const date = await this.repo.saveToken(userId, token);
        const isCached = this.cache.cacheItem(
            userId,
            token,
            date.createdAt.getTime(),
        );

        return {
            success: isCached,
            token: token,
        };
    }

    public async resetPassword(
        userId: string,
        newPassword: string,
        token: string,
    ) {
        const key = this.cache.cache.get(userId);

        if (!key || token !== key.token || !key.ttl) {
            throw Error("Invalid token");
        }

        const flag = this.checkTTL(key.ttl);

        if (!flag) {
            throw Error("Expired token");
        }

        const [user, isDeleted] = await Promise.all([
            this.repo.updatePassword(userId, newPassword),
            this.repo.deleteToken(userId, token),
        ]);

        const removed = this.cache.removeCache(userId);

        return !user || !isDeleted || !removed ? false : true;
    }

    private checkTTL(ttl: number) {
        const date = new Date();

        if (ttl <= date.getTime()) {
            return false;
        }

        return true;
    }
}
