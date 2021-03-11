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
exports.loginWithPasswordHashQueryProperties = exports.loginWithPasswordQueryProperties = exports.registerUserQueryProperties = void 0;
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
//# sourceMappingURL=app.apiproperties.js.map