export declare class registerUserQueryProperties {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    strasse: string;
    hausnummer: string;
    postleitzahl: string;
    ort: string;
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
