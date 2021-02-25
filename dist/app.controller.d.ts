import { AppService } from './app.service';
import { registerUserQueryProperties, loginWithPasswordQueryProperties, loginWithPasswordHashQueryProperties, addInterestToUserQueryProperties, getInterestsOfLoggedInUserQueryProperties, removeInterestFromUserQueryProperties, addContactMethodToUserQueryProperties, getContactMethodsOfLoggedInUserQueryProperties, removeContactMethodFromUserQueryProperties, getListOfMatchingUsersForLoggedInUserQueryProperties } from './app.apiproperties';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    registerUser(registerUserProperties: registerUserQueryProperties): Promise<string>;
    loginWithPassword(loginWithPasswordQueryProperties: loginWithPasswordQueryProperties): Promise<string>;
    loginWithPasswordHash(loginWithPasswordHashQueryProperties: loginWithPasswordHashQueryProperties): Promise<string>;
    getListOfAvailableInterests(): Promise<string>;
    addInterestToUser(addInterestToUserQueryProperties: addInterestToUserQueryProperties): Promise<string>;
    getInterestsOfLoggedInUser(getInterestsOfLoggedInUserQueryProperties: getInterestsOfLoggedInUserQueryProperties): Promise<string>;
    removeInterestFromUser(removeInterestFromUserQueryProperties: removeInterestFromUserQueryProperties): Promise<string>;
    getListOfAvailableContactMethodTypes(): Promise<string>;
    addContactMethodToUser(addContactMethodToUserQueryProperties: addContactMethodToUserQueryProperties): Promise<string>;
    getContactMethodsOfLoggedInUser(getContactMethodsOfLoggedInUserQueryProperties: getContactMethodsOfLoggedInUserQueryProperties): Promise<string>;
    removeContactMethodFromUser(removeContactMethodFromUserQueryProperties: removeContactMethodFromUserQueryProperties): Promise<string>;
    getListOfMatchingUsersForLoggedInUser(getListOfMatchingUsersForLoggedInUserQueryProperties: getListOfMatchingUsersForLoggedInUserQueryProperties): Promise<string>;
}
