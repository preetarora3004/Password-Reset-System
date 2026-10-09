import type { Service } from "@workspace/server/service";

export class Controller {
    private service : Service

    constructor(service : Service) {
        this.service = service 
    }

}
