import { AppService } from './app.service';
import { registerUserQueryProperties } from './app.apiproperties';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    registerUser(registerUserProperties: registerUserQueryProperties): Promise<string>;
}
