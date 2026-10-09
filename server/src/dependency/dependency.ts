import { Controller } from "@workspace/server/controller";
import { Service } from "@workspace/server/service";
import { Repository } from "@workspace/server/repository";
import { Utiltity } from "@workspace/server/utility";
import { Cache } from "@workspace/server/cache";
import { prisma } from "@workspace/db/client";

const cache = new Cache();
const utility = new Utiltity(cache);
const repository = new Repository(prisma);
const service = new Service(repository, utility, cache);

export const controller = new Controller(service);

