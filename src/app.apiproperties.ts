import { ApiProperty } from '@nestjs/swagger';
export class registerUserQueryProperties {
    @ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    })
    email: string;

    @ApiProperty({
        description: "Password",
        default: "1234"
    })
    password: string;
    
    @ApiProperty({
        description: "First Name",
        default: "Max"
    })
    firstName: string;

    @ApiProperty({
        description: "Last Name",
        default: "Mustermann"
    })
    lastName: string;

    @ApiProperty({
        description: "Gender",
        enum: ["m", "f", "x"],
        default: "m"
    })
    gender: string;

    @ApiProperty({
        description: "Birthday in the format YYYY-MM-DD",
        default: "2000-01-01",
    })
    birthday: string;
}

export class registerUserBodyProperties {
    @ApiProperty({
        description: "Biography",
        default: "Hi, my name is Max!"
    })
    biography: string;
}

export class loginWithPasswordQueryProperties {
    @ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    })
    email: string;

    @ApiProperty({
        description: "Password",
        default: "1234"
    })
    password: string;
}

export class loginWithPasswordHashQueryProperties {
    @ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    })
    email: string;

    @ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    })
    hashedPassword: string;
}

export class addInterestToUserQueryProperties {
    @ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    })
    email: string;

    @ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    })
    hashedPassword: string;

    @ApiProperty({
        description: "InterestID",
        default: "1"
    })
    IID: string;

    @ApiProperty({
        description: "Priority",
        default: "1",
        minimum: 1,
        maximum: 3
    })
    priority: number;
}

export class getInterestsOfLoggedInUserQueryProperties {
    @ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    })
    email: string;

    @ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    })
    hashedPassword: string;
}

export class removeInterestFromUserQueryProperties {
    @ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    })
    email: string;

    @ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    })
    hashedPassword: string;

    @ApiProperty({
        description: "InterestID",
        default: "1"
    })
    IID: string;
}

export class addContactMethodToUserQueryProperties {
    @ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    })
    email: string;

    @ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    })
    hashedPassword: string;

    @ApiProperty({
        description: "ContactMethodTypeID",
        default: "1"
    })
    CMTID: string;

    @ApiProperty({
        description: "Contact Detail (e.g. username)",
        default: "@tjbnde",
    })
    contactDetail: string;
}


export class getContactMethodsOfLoggedInUserQueryProperties {
    @ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    })
    email: string;

    @ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    })
    hashedPassword: string;
}


export class removeContactMethodFromUserQueryProperties {
    @ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    })
    email: string;

    @ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    })
    hashedPassword: string;

    @ApiProperty({
        description: "ContactMethodID"
    })
    CMID: number;
}

export class getListOfMatchingUsersForLoggedInUserQueryProperties {
    @ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    })
    email: string;

    @ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    })
    hashedPassword: string;
}