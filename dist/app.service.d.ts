import { callResult } from './interfaces/interfaces';
export declare class AppService {
    getHello(): string;
    getConfig(): any;
    createNutzer(email: string, password: string, firstName: string, lastName: string): Promise<callResult>;
    createAdresse(nutzerID: number, strasse: string, hausnummer: number, postleitzahl: string, ort: string): Promise<callResult>;
}
