import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
    hausnummer: number;

    @ApiProperty({
        description: "Postleitzahl",
        default: "68161"
    })
    postleitzahl: number;


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
    hausnummer: number;

    @ApiProperty({
        description: "Postleitzahl",
        default: "68161"
    })
    postleitzahl: number;


    @ApiProperty({
        description: "Ort",
        default: "Mannheim"
    })
    ort: string;
}

export class updatePasswordOfUserQueryProperties {
    @ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    })
    email: string;
    
    @ApiProperty({
        description: "Old Password",
        default: "1234"
    })
    oldPassword: string;

    @ApiProperty({
        description: "New Password",
        default: "1234"
    })
    newPassword: string;
}

export class getBalanceAndLastTransactionsOfVerrechnungskontoQueryProperties {
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

export class createTransactionAsAdminQueryProperties {
    @ApiProperty({
        description: "Admin KEY",
        default: "s3cr3tAdm1nK3y"
    })
    adminKey: string;

    @ApiProperty({
        description: "Nutzer ID",
        default: "22"
    })
    userID: string;
    
    @ApiProperty({
        description: "Description",
        default: "Einzahlung"
    })
    description: string;

    @ApiProperty({
        description: "Value",
        default: "100"
    })
    value: number;

    @ApiProperty({
        description: "Receipient",
        default: "DE09500105171865232336"
    })
    receipient: string;
}

export class getAllSharesQueryProperties {
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

export class getPriceOfShareQueryProperties {
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
        description: "ShareID",
        default: "6037e67c8407c737441517d6"
    })
    shareID: string;
}

export class getPriceDevlopmentOfShareQueryProperties {
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
        description: "ShareID",
        default: "6037e67c8407c737441517d6"
    })
    shareID: string;

    @ApiProperty({
        description: "From",
        default: "1615485267401"
    })
    from: number;

    @ApiProperty({
        description: "Until",
        default: "1615456569032"
    })
    until: number;
}

export class getDepotValuesQueryProperties {
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
        description: "DepotID",
        default: "9"
    })
    depotID: number;
}

export class buyOrderQueryProperties {
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
        description: "ShareID",
        default: "6037e67c8407c737441517d6"
    })
    shareID: string;

    @ApiProperty({
        description: "Type (f.e. Market, Stop Market, Limit or Stop Limit)",
        default: "Market"
    })
    type: string;

    @ApiProperty({
        description: "Price",
        default: "20"
    })
    price: number;

    @ApiProperty({
        description: "Amount",
        default: "1"
    })
    amount: number;

    @ApiPropertyOptional({
        description: "Limit",
        default: "18"
    })
    limit: number;

    @ApiPropertyOptional({
        description: "Stop",
        default: "1"
    })
    stop: number;
}