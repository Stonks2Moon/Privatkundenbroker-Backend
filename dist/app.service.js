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
        return config;
    }
    createNutzer(email, password, firstName, lastName) {
        return new Promise(async function (resolve, reject) {
            var hashedPassword = passwordHash.generate(password);
            var connection = mysql.createConnection(this.getConfig());
            connection.query('INSERT INTO `Nutzer` (`NutzerID`, `Vorname`, `Nachname`, `Email`, `Passwort`) VALUES (NULL, ?, ?, ?, ?);', [firstName, lastName, email, hashedPassword], function (error, results, fields) {
                if (error) {
                    if (error.code == "ER_DUP_ENTRY") {
                        resolve({ success: false, message: "An user with this email already exists! 🍔" });
                    }
                    else {
                        console.log(error);
                        resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                    }
                }
                else {
                    resolve({ success: true, message: "Nutzer has been created", additionalInfo: { PID: results.insertId, hashedPassword: hashedPassword } });
                }
            });
            connection.end();
        }.bind(this));
    }
    createAdresse(nutzerID, strasse, hausnummer, postleitzahl, ort) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(this.getConfig());
            connection.query('INSERT INTO `Adresse` (`NutzerID`, `Strasse`, `Hausnummer`, `Postleitzahl`, `Ort`) VALUES (?, ?, ?, ?, ?);', [nutzerID, strasse, hausnummer, postleitzahl, ort], function (error, results, fields) {
                if (error) {
                    if (error.code == "ER_DUP_ENTRY") {
                        resolve({ success: false, message: "An adress for this user already exists!" });
                    }
                    else {
                        console.log(error);
                        resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                    }
                }
                else {
                    resolve({ success: true, message: "Adress has been created" });
                }
            });
            connection.end();
        }.bind(this));
    }
    createDepot(nutzerID) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(this.getConfig());
            connection.query('INSERT INTO `Depot` (`DepotID`, `NutzerID`) VALUES (NULL, ?);', [nutzerID], function (error, results, fields) {
                if (error) {
                    if (error.code == "ER_DUP_ENTRY") {
                        resolve({ success: false, message: "An depot for this user already exists!" });
                    }
                    else {
                        console.log(error);
                        resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                    }
                }
                else {
                    resolve({ success: true, message: "Depot has been created" });
                }
            });
            connection.end();
        }.bind(this));
    }
    getNutzer(nutzerID) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(this.getConfig());
            connection.query("SELECT Nutzer.NutzerID, Vorname, Nachname, Email, Passwort, Strasse, Hausnummer, Postleitzahl, Ort FROM Nutzer JOIN Adresse ON Nutzer.NutzerID = Adresse.NutzerID WHERE Nutzer.NutzerID = ?", [nutzerID], function (error, results, fields) {
                if (error) {
                    resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                }
                ;
                resolve({ success: true, message: "User has been received", data: results });
            });
            connection.end();
        }.bind(this));
    }
};
AppService = __decorate([
    common_1.Injectable()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map