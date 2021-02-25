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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const app_apiproperties_1 = require("./app.apiproperties");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async registerUser(registerUserProperties) {
        return new Promise(async function (resolve, reject) {
            var createPersonResult = await this.appService.createPerson(registerUserProperties.firstName, registerUserProperties.lastName, registerUserProperties.gender, registerUserProperties.birthday);
            if (createPersonResult.success) {
                var createUserResult = await this.appService.createUser(createPersonResult.additionalInfo.PID, registerUserProperties.email, registerUserProperties.password);
                resolve(JSON.stringify(createUserResult));
            }
            else {
                resolve(JSON.stringify(createPersonResult));
            }
        }.bind(this));
    }
    async loginWithPassword(loginWithPasswordQueryProperties) {
        return new Promise(async function (resolve, reject) {
            var loginWithPasswordResult = await this.appService.loginWithPassword(loginWithPasswordQueryProperties.email, loginWithPasswordQueryProperties.password);
            resolve(JSON.stringify(loginWithPasswordResult));
        }.bind(this));
    }
    async loginWithPasswordHash(loginWithPasswordHashQueryProperties) {
        return new Promise(async function (resolve, reject) {
            var loginWithPasswordResult = await this.appService.loginWithPasswordHash(loginWithPasswordHashQueryProperties.email, loginWithPasswordHashQueryProperties.hashedPassword);
            resolve(JSON.stringify(loginWithPasswordResult));
        }.bind(this));
    }
    async getListOfAvailableInterests() {
        return new Promise(async function (resolve, reject) {
            var getListOfAvailableInterestsResult = await this.appService.getListOfAvailableInterests();
            resolve(JSON.stringify(getListOfAvailableInterestsResult));
        }.bind(this));
    }
    async addInterestToUser(addInterestToUserQueryProperties) {
        return new Promise(async function (resolve, reject) {
            var loginWithPasswordResult = await this.appService.loginWithPasswordHash(addInterestToUserQueryProperties.email, addInterestToUserQueryProperties.hashedPassword);
            if (loginWithPasswordResult.success) {
                var addInterestToUserResult = await this.appService.addInterestToUser(loginWithPasswordResult.additionalInfo.PID, addInterestToUserQueryProperties.IID, addInterestToUserQueryProperties.priority);
                resolve(JSON.stringify(addInterestToUserResult));
            }
            else {
                resolve(loginWithPasswordResult);
            }
        }.bind(this));
    }
    async getInterestsOfLoggedInUser(getInterestsOfLoggedInUserQueryProperties) {
        return new Promise(async function (resolve, reject) {
            var loginWithPasswordResult = await this.appService.loginWithPasswordHash(getInterestsOfLoggedInUserQueryProperties.email, getInterestsOfLoggedInUserQueryProperties.hashedPassword);
            if (loginWithPasswordResult.success) {
                var getInterestsOfLoggedInUserResult = await this.appService.getInterestsOfLoggedInUser(loginWithPasswordResult.additionalInfo.PID);
                resolve(JSON.stringify(getInterestsOfLoggedInUserResult));
            }
            else {
                resolve(loginWithPasswordResult);
            }
        }.bind(this));
    }
    async removeInterestFromUser(removeInterestFromUserQueryProperties) {
        return new Promise(async function (resolve, reject) {
            var loginWithPasswordResult = await this.appService.loginWithPasswordHash(removeInterestFromUserQueryProperties.email, removeInterestFromUserQueryProperties.hashedPassword);
            if (loginWithPasswordResult.success) {
                var removeInterestFromUserResult = await this.appService.removeInterestFromUser(loginWithPasswordResult.additionalInfo.PID, removeInterestFromUserQueryProperties.IID);
                resolve(JSON.stringify(removeInterestFromUserResult));
            }
            else {
                resolve(loginWithPasswordResult);
            }
        }.bind(this));
    }
    async getListOfAvailableContactMethodTypes() {
        return new Promise(async function (resolve, reject) {
            var getListOfAvailableContactMethodTypesResult = await this.appService.getListOfAvailableContactMethodTypes();
            resolve(JSON.stringify(getListOfAvailableContactMethodTypesResult));
        }.bind(this));
    }
    async addContactMethodToUser(addContactMethodToUserQueryProperties) {
        return new Promise(async function (resolve, reject) {
            var loginWithPasswordResult = await this.appService.loginWithPasswordHash(addContactMethodToUserQueryProperties.email, addContactMethodToUserQueryProperties.hashedPassword);
            if (loginWithPasswordResult.success) {
                var addContactMethodToUserResult = await this.appService.addContactMethodToUser(loginWithPasswordResult.additionalInfo.PID, addContactMethodToUserQueryProperties.CMTID, addContactMethodToUserQueryProperties.contactDetail);
                resolve(JSON.stringify(addContactMethodToUserResult));
            }
            else {
                resolve(loginWithPasswordResult);
            }
        }.bind(this));
    }
    async getContactMethodsOfLoggedInUser(getContactMethodsOfLoggedInUserQueryProperties) {
        return new Promise(async function (resolve, reject) {
            var loginWithPasswordResult = await this.appService.loginWithPasswordHash(getContactMethodsOfLoggedInUserQueryProperties.email, getContactMethodsOfLoggedInUserQueryProperties.hashedPassword);
            if (loginWithPasswordResult.success) {
                var getContactMethodsOfLoggedInUserResult = await this.appService.getContactMethodsOfLoggedInUser(loginWithPasswordResult.additionalInfo.PID);
                resolve(JSON.stringify(getContactMethodsOfLoggedInUserResult));
            }
            else {
                resolve(loginWithPasswordResult);
            }
        }.bind(this));
    }
    async removeContactMethodFromUser(removeContactMethodFromUserQueryProperties) {
        return new Promise(async function (resolve, reject) {
            var loginWithPasswordResult = await this.appService.loginWithPasswordHash(removeContactMethodFromUserQueryProperties.email, removeContactMethodFromUserQueryProperties.hashedPassword);
            if (loginWithPasswordResult.success) {
                var removeContactMethodFromUserResult = await this.appService.removeContactMethodFromUser(loginWithPasswordResult.additionalInfo.PID, removeContactMethodFromUserQueryProperties.CMID);
                resolve(JSON.stringify(removeContactMethodFromUserResult));
            }
            else {
                resolve(loginWithPasswordResult);
            }
        }.bind(this));
    }
    async getListOfMatchingUsersForLoggedInUser(getListOfMatchingUsersForLoggedInUserQueryProperties) {
        return new Promise(async function (resolve, reject) {
            var loginWithPasswordResult = await this.appService.loginWithPasswordHash(getListOfMatchingUsersForLoggedInUserQueryProperties.email, getListOfMatchingUsersForLoggedInUserQueryProperties.hashedPassword);
            if (loginWithPasswordResult.success) {
                var getListOfMatchingUsersForLoggedInUserResult = await this.appService.getListOfMatchingUsersForLoggedInUser(loginWithPasswordResult.additionalInfo.PID);
                resolve(JSON.stringify(getListOfMatchingUsersForLoggedInUserResult));
            }
            else {
                resolve(loginWithPasswordResult);
            }
        }.bind(this));
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    common_1.Post("/registerUser"),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_apiproperties_1.registerUserQueryProperties]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "registerUser", null);
__decorate([
    common_1.Get("/loginWithPassword"),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_apiproperties_1.loginWithPasswordQueryProperties]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "loginWithPassword", null);
__decorate([
    common_1.Get("/loginWithPasswordHash"),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_apiproperties_1.loginWithPasswordHashQueryProperties]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "loginWithPasswordHash", null);
__decorate([
    common_1.Get("/getListOfAvailableInterests"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getListOfAvailableInterests", null);
__decorate([
    common_1.Post("/addInterestToUser"),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_apiproperties_1.addInterestToUserQueryProperties]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addInterestToUser", null);
__decorate([
    common_1.Get("/getInterestsOfLoggedInUser"),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_apiproperties_1.getInterestsOfLoggedInUserQueryProperties]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getInterestsOfLoggedInUser", null);
__decorate([
    common_1.Delete("/removeInterestFromUser"),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_apiproperties_1.removeInterestFromUserQueryProperties]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "removeInterestFromUser", null);
__decorate([
    common_1.Get("/getListOfAvailableContactMethodTypes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getListOfAvailableContactMethodTypes", null);
__decorate([
    common_1.Post("/addContactMethodToUser"),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_apiproperties_1.addContactMethodToUserQueryProperties]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addContactMethodToUser", null);
__decorate([
    common_1.Get("/getContactMethodsOfLoggedInUser"),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_apiproperties_1.getContactMethodsOfLoggedInUserQueryProperties]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getContactMethodsOfLoggedInUser", null);
__decorate([
    common_1.Delete("/removeContactMethodFromUser"),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_apiproperties_1.removeContactMethodFromUserQueryProperties]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "removeContactMethodFromUser", null);
__decorate([
    common_1.Get("/getListOfMatchingUsersForLoggedInUser"),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_apiproperties_1.getListOfMatchingUsersForLoggedInUserQueryProperties]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getListOfMatchingUsersForLoggedInUser", null);
AppController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map