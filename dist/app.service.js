"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
var passwordHash = require('password-hash');
var mysql = require('mysql');
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
    getConfig() {
        var config = require('../config.json');
        console.log(config.host);
        return config;
    }
    createPerson(firstName, lastName, gender, birthday, biography) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(this.getConfig());
            connection.query('INSERT INTO `Person` (`PID`, `FirstName`, `LastName`, `Gender`, `Birthday`, `Biography`) VALUES (NULL, ?, ?, ?, ?, "")', [firstName, lastName, gender, birthday], function (error, results, fields) {
                if (error) {
                    resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                }
                ;
                resolve({ success: true, message: "Person has been created", additionalInfo: { PID: results.insertId } });
            });
            connection.end();
        });
    }
};
AppService = __decorate([
    common_1.Injectable()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map