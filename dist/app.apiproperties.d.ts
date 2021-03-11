export declare class registerUserQueryProperties {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthday: string;
}
export declare class loginWithPasswordQueryProperties {
    email: string;
    password: string;
}
export declare class loginWithPasswordHashQueryProperties {
    email: string;
    hashedPassword: string;
}
export declare class getNutzerQueryProperties {
    email: string;
    hashedPassword: string;
    nutzerID: number;
}
