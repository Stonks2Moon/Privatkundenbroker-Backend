import { callResult } from './interfaces/interfaces';
export declare class AppService {
    getHello(): string;
    getConfig(): any;
    createPerson(firstName: string, lastName: string, gender: string, birthday: string, biography: string): Promise<callResult>;
}
