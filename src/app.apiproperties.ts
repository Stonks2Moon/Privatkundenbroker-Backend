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
        default: "sha1$3b9a1b28$1$d76673636ae2ae3d707b2ac0666473fd59f31418"
    })
    hashedPassword: string;
}

export class updateAdressDataQueryProperties {
    @ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    })
    email: string;
    
    @ApiProperty({
        description: "PasswordHash",
        default: "sha1$3b9a1b28$1$d76673636ae2ae3d707b2ac0666473fd59f31418"
    })
    hashedPassword: string;
    
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