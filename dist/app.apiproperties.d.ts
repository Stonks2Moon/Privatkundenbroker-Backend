export declare class registerUserQueryProperties {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthday: string;
}
export declare class registerUserBodyProperties {
    biography: string;
}
export declare class loginWithPasswordQueryProperties {
    email: string;
    password: string;
}
export declare class loginWithPasswordHashQueryProperties {
    email: string;
    hashedPassword: string;
}
export declare class addInterestToUserQueryProperties {
    email: string;
    hashedPassword: string;
    IID: string;
    priority: number;
}
export declare class getInterestsOfLoggedInUserQueryProperties {
    email: string;
    hashedPassword: string;
}
export declare class removeInterestFromUserQueryProperties {
    email: string;
    hashedPassword: string;
    IID: string;
}
export declare class addContactMethodToUserQueryProperties {
    email: string;
    hashedPassword: string;
    CMTID: string;
    contactDetail: string;
}
export declare class getContactMethodsOfLoggedInUserQueryProperties {
    email: string;
    hashedPassword: string;
}
export declare class removeContactMethodFromUserQueryProperties {
    email: string;
    hashedPassword: string;
    CMID: number;
}
export declare class getListOfMatchingUsersForLoggedInUserQueryProperties {
    email: string;
    hashedPassword: string;
}
