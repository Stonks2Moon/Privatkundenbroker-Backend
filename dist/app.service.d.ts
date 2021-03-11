import { callResult } from './interfaces/interfaces';
export declare class AppService {
    getHello(): string;
    getConfig(): any;
    createNutzer(firstName: string, lastName: string, gender: string, birthday: string, biography: string): Promise<callResult>;
    getNutzer(nutzerID: number): Promise<callResult>;
}
