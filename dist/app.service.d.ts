import { callResult } from './interfaces/interfaces';
export declare class AppService {
    getHello(): string;
    createPerson(firstName: string, lastName: string, gender: string, birthday: string, biography: string): Promise<callResult>;
    createUser(PID: number, email: string, password: string): Promise<callResult>;
    loginWithPassword(email: string, password: string): Promise<callResult>;
    loginWithPasswordHash(email: string, hashedPassword: string): Promise<callResult>;
    updateLastOnline(PID: number): Promise<callResult>;
    getListOfAvailableInterests(): Promise<callResult>;
    addInterestToUser(PID: number, IID: number, priority: number): Promise<callResult>;
    getInterestsOfLoggedInUser(PID: number): Promise<callResult>;
    removeInterestFromUser(PID: number, IID: number): Promise<callResult>;
    getListOfAvailableContactMethodTypes(): Promise<callResult>;
    addContactMethodToUser(PID: number, CMTID: number, contactDetail: string): Promise<callResult>;
    getContactMethodsOfLoggedInUser(PID: number): Promise<callResult>;
    removeContactMethodFromUser(PID: number, CMID: number): Promise<callResult>;
    getListOfMatchingUsersForLoggedInUser(PID: number): Promise<callResult>;
}
