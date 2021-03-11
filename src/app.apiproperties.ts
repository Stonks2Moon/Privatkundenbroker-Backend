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
