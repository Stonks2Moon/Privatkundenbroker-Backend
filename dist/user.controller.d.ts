import { AppService } from './app.service';
export declare class UserController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
}
