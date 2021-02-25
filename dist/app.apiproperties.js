"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListOfMatchingUsersForLoggedInUserQueryProperties = exports.removeContactMethodFromUserQueryProperties = exports.getContactMethodsOfLoggedInUserQueryProperties = exports.addContactMethodToUserQueryProperties = exports.removeInterestFromUserQueryProperties = exports.getInterestsOfLoggedInUserQueryProperties = exports.addInterestToUserQueryProperties = exports.loginWithPasswordHashQueryProperties = exports.loginWithPasswordQueryProperties = exports.registerUserBodyProperties = exports.registerUserQueryProperties = void 0;
const swagger_1 = require("@nestjs/swagger");
class registerUserQueryProperties {
}
__decorate([
    swagger_1.ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    }),
    __metadata("design:type", String)
], registerUserQueryProperties.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "Password",
        default: "1234"
    }),
    __metadata("design:type", String)
], registerUserQueryProperties.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "First Name",
        default: "Max"
    }),
    __metadata("design:type", String)
], registerUserQueryProperties.prototype, "firstName", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "Last Name",
        default: "Mustermann"
    }),
    __metadata("design:type", String)
], registerUserQueryProperties.prototype, "lastName", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "Gender",
        enum: ["m", "f", "x"],
        default: "m"
    }),
    __metadata("design:type", String)
], registerUserQueryProperties.prototype, "gender", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "Birthday in the format YYYY-MM-DD",
        default: "2000-01-01",
    }),
    __metadata("design:type", String)
], registerUserQueryProperties.prototype, "birthday", void 0);
exports.registerUserQueryProperties = registerUserQueryProperties;
class registerUserBodyProperties {
}
__decorate([
    swagger_1.ApiProperty({
        description: "Biography",
        default: "Hi, my name is Max!"
    }),
    __metadata("design:type", String)
], registerUserBodyProperties.prototype, "biography", void 0);
exports.registerUserBodyProperties = registerUserBodyProperties;
class loginWithPasswordQueryProperties {
}
__decorate([
    swagger_1.ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    }),
    __metadata("design:type", String)
], loginWithPasswordQueryProperties.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "Password",
        default: "1234"
    }),
    __metadata("design:type", String)
], loginWithPasswordQueryProperties.prototype, "password", void 0);
exports.loginWithPasswordQueryProperties = loginWithPasswordQueryProperties;
class loginWithPasswordHashQueryProperties {
}
__decorate([
    swagger_1.ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    }),
    __metadata("design:type", String)
], loginWithPasswordHashQueryProperties.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    }),
    __metadata("design:type", String)
], loginWithPasswordHashQueryProperties.prototype, "hashedPassword", void 0);
exports.loginWithPasswordHashQueryProperties = loginWithPasswordHashQueryProperties;
class addInterestToUserQueryProperties {
}
__decorate([
    swagger_1.ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    }),
    __metadata("design:type", String)
], addInterestToUserQueryProperties.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    }),
    __metadata("design:type", String)
], addInterestToUserQueryProperties.prototype, "hashedPassword", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "InterestID",
        default: "1"
    }),
    __metadata("design:type", String)
], addInterestToUserQueryProperties.prototype, "IID", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "Priority",
        default: "1",
        minimum: 1,
        maximum: 3
    }),
    __metadata("design:type", Number)
], addInterestToUserQueryProperties.prototype, "priority", void 0);
exports.addInterestToUserQueryProperties = addInterestToUserQueryProperties;
class getInterestsOfLoggedInUserQueryProperties {
}
__decorate([
    swagger_1.ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    }),
    __metadata("design:type", String)
], getInterestsOfLoggedInUserQueryProperties.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    }),
    __metadata("design:type", String)
], getInterestsOfLoggedInUserQueryProperties.prototype, "hashedPassword", void 0);
exports.getInterestsOfLoggedInUserQueryProperties = getInterestsOfLoggedInUserQueryProperties;
class removeInterestFromUserQueryProperties {
}
__decorate([
    swagger_1.ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    }),
    __metadata("design:type", String)
], removeInterestFromUserQueryProperties.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    }),
    __metadata("design:type", String)
], removeInterestFromUserQueryProperties.prototype, "hashedPassword", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "InterestID",
        default: "1"
    }),
    __metadata("design:type", String)
], removeInterestFromUserQueryProperties.prototype, "IID", void 0);
exports.removeInterestFromUserQueryProperties = removeInterestFromUserQueryProperties;
class addContactMethodToUserQueryProperties {
}
__decorate([
    swagger_1.ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    }),
    __metadata("design:type", String)
], addContactMethodToUserQueryProperties.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    }),
    __metadata("design:type", String)
], addContactMethodToUserQueryProperties.prototype, "hashedPassword", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "ContactMethodTypeID",
        default: "1"
    }),
    __metadata("design:type", String)
], addContactMethodToUserQueryProperties.prototype, "CMTID", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "Contact Detail (e.g. username)",
        default: "@tjbnde",
    }),
    __metadata("design:type", String)
], addContactMethodToUserQueryProperties.prototype, "contactDetail", void 0);
exports.addContactMethodToUserQueryProperties = addContactMethodToUserQueryProperties;
class getContactMethodsOfLoggedInUserQueryProperties {
}
__decorate([
    swagger_1.ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    }),
    __metadata("design:type", String)
], getContactMethodsOfLoggedInUserQueryProperties.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    }),
    __metadata("design:type", String)
], getContactMethodsOfLoggedInUserQueryProperties.prototype, "hashedPassword", void 0);
exports.getContactMethodsOfLoggedInUserQueryProperties = getContactMethodsOfLoggedInUserQueryProperties;
class removeContactMethodFromUserQueryProperties {
}
__decorate([
    swagger_1.ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    }),
    __metadata("design:type", String)
], removeContactMethodFromUserQueryProperties.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    }),
    __metadata("design:type", String)
], removeContactMethodFromUserQueryProperties.prototype, "hashedPassword", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "ContactMethodID"
    }),
    __metadata("design:type", Number)
], removeContactMethodFromUserQueryProperties.prototype, "CMID", void 0);
exports.removeContactMethodFromUserQueryProperties = removeContactMethodFromUserQueryProperties;
class getListOfMatchingUsersForLoggedInUserQueryProperties {
}
__decorate([
    swagger_1.ApiProperty({
        description: "EMail",
        default: "test@tjbn.de"
    }),
    __metadata("design:type", String)
], getListOfMatchingUsersForLoggedInUserQueryProperties.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: "PasswordHash",
        default: "sha1$057d3635$1$fefae8e41539b1ac3aafa1d04dfd274cbb723d5f"
    }),
    __metadata("design:type", String)
], getListOfMatchingUsersForLoggedInUserQueryProperties.prototype, "hashedPassword", void 0);
exports.getListOfMatchingUsersForLoggedInUserQueryProperties = getListOfMatchingUsersForLoggedInUserQueryProperties;
//# sourceMappingURL=app.apiproperties.js.map