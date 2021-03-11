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
        description: "Strasse",
        default: "Zezeallee"
    })
    strasse: string;

    @ApiProperty({
        description: "Hausnummer",
        default: "42"
    })
    hausnummer: string;

    @ApiProperty({
        description: "Postleitzahl",
        default: "68161"
    })
    postleitzahl: string;


    @ApiProperty({
        description: "Ort",
        default: "Mannheim"
    })
    ort: string;
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

