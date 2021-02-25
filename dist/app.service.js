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
var mysqlCreds = {
    host: 'tjbn.de',
    port: 13306,
    user: 'FindYourBuddy',
    password: 'K6MYgZlUbP1yGijn',
    database: 'FindYourBuddy'
};
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
    createPerson(firstName, lastName, gender, birthday, biography) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(mysqlCreds);
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
    createUser(PID, email, password) {
        return new Promise(async function (resolve, reject) {
            var hashedPassword = passwordHash.generate(password);
            var connection = mysql.createConnection(mysqlCreds);
            connection.query('INSERT INTO `User` (`PID`, `EMail`, `PasswordHash`) VALUES (?, ?, ?)', [PID, email, hashedPassword], function (error, results, fields) {
                if (error) {
                    if (error.code == "ER_DUP_ENTRY") {
                        resolve({ success: false, message: "An user with this email already exists!" });
                    }
                    else {
                        console.log(error);
                        resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                    }
                }
                else {
                    resolve({ success: true, message: "User has been created", additionalInfo: { hashedPassword: hashedPassword } });
                }
            });
            connection.end();
        });
    }
    loginWithPassword(email, password) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(mysqlCreds);
            connection.query('SELECT * FROM `User` WHERE EMail = ?', [email], function (error, results, fields) {
                if (error) {
                    console.log(error);
                    resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                }
                else {
                    if (results.length === 1) {
                        var hashedPassword = results[0].PasswordHash;
                        var passwordVerifyResult = passwordHash.verify(password, hashedPassword);
                        if (passwordVerifyResult) {
                            this.updateLastOnline(results[0].PID).then(function (result) {
                                resolve({ success: true, message: "Login successful", additionalInfo: { hashedPassword: hashedPassword, firstName: results[0].FirstName, lastName: results[0].LastName, PID: results[0].PID } });
                            });
                        }
                        else {
                            resolve({ success: false, message: "Login failed. Wrong email or password!" });
                        }
                    }
                    else {
                        resolve({ success: false, message: "Login failed. Wrong email or password!" });
                    }
                }
            }.bind(this));
            connection.end();
        }.bind(this));
    }
    loginWithPasswordHash(email, hashedPassword) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(mysqlCreds);
            connection.query('SELECT * FROM `User` NATURAL JOIN Person WHERE email = ? AND PasswordHash = ?', [email, hashedPassword], function (error, results, fields) {
                if (error) {
                    console.log(error);
                    resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                }
                else {
                    if (results.length === 1) {
                        this.updateLastOnline(results[0].PID).then(function (result) {
                            resolve({ success: true, message: "Login successful", additionalInfo: { firstName: results[0].FirstName, lastName: results[0].LastName, PID: results[0].PID } });
                        });
                    }
                    else {
                        resolve({ success: false, message: "Login failed. Wrong email or password-hash!" });
                    }
                }
            }.bind(this));
            connection.end();
        }.bind(this));
    }
    updateLastOnline(PID) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(mysqlCreds);
            connection.query('UPDATE User SET LastOnline = current_date() WHERE PID = ?', [PID], function (error, results, fields) {
                if (error) {
                    console.log(error);
                    resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                }
                else {
                    resolve({ success: true, message: "LastOnline updated" });
                }
            });
            connection.end();
        });
    }
    getListOfAvailableInterests() {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(mysqlCreds);
            connection.query('SELECT * FROM `Interest`', function (error, results, fields) {
                if (error) {
                    console.log(error);
                    resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                }
                else {
                    resolve({ success: true, message: "Retreiving list of available interests successful", data: results });
                }
            });
            connection.end();
        });
    }
    addInterestToUser(PID, IID, priority) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(mysqlCreds);
            connection.query('INSERT INTO `User_has_Interest` (`PID`, `IID`, `priority`) VALUES (?, ?, ?);', [PID, IID, priority], function (error, results, fields) {
                if (error) {
                    if (error.code == "ER_DUP_ENTRY") {
                        var connection = mysql.createConnection(mysqlCreds);
                        connection.query('UPDATE `User_has_Interest` SET `priority` = ? WHERE `User_has_Interest`.`PID` = ? AND `User_has_Interest`.`IID` = ?;', [priority, PID, IID], function (error, results, fields) {
                            if (error) {
                                console.log(error);
                                resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                            }
                            resolve({ success: true, message: "The interest was already added to the user. The priority has been updated if necessary" });
                        });
                        connection.end();
                    }
                    else {
                        console.log(error);
                        resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                    }
                }
                else {
                    resolve({ success: true, message: "Adding the interest to the user was successful" });
                }
            });
            connection.end();
        });
    }
    getInterestsOfLoggedInUser(PID) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(mysqlCreds);
            connection.query('SELECT * FROM User_has_Interest NATURAL JOIN Interest WHERE PID = ?;', [PID], function (error, results, fields) {
                if (error) {
                    resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                }
                else {
                    resolve({ success: true, message: "Getting interests of logged in user was successful", data: results });
                }
            });
            connection.end();
        });
    }
    removeInterestFromUser(PID, IID) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(mysqlCreds);
            connection.query('DELETE FROM `User_has_Interest` WHERE `User_has_Interest`.`PID` = ? AND `User_has_Interest`.`IID` = ?;', [PID, IID], function (error, results, fields) {
                if (error) {
                    console.log(error);
                    resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                }
                else {
                    resolve({ success: true, message: "Removing the interest from the user was successful" });
                }
            });
            connection.end();
        });
    }
    getListOfAvailableContactMethodTypes() {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(mysqlCreds);
            connection.query('SELECT * FROM `ContactMethodType`', function (error, results, fields) {
                if (error) {
                    console.log(error);
                    resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                }
                else {
                    resolve({ success: true, message: "Retreiving list of available contact method types successful", data: results });
                }
            });
            connection.end();
        });
    }
    addContactMethodToUser(PID, CMTID, contactDetail) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(mysqlCreds);
            connection.query('INSERT INTO `ContactMethod` (`CMID`, `PID`, `CMTID`, `ContactDetail`) VALUES (NULL, ?, ?, ?);', [PID, CMTID, contactDetail], function (error, results, fields) {
                if (error) {
                    if (error.code == "ER_DUP_ENTRY") {
                        resolve({ success: false, message: "A contact method with these parameters already exists!" });
                    }
                    console.log(error);
                    resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                }
                else {
                    resolve({ success: true, message: "Adding the contact method to the user was successful" });
                }
            });
            connection.end();
        });
    }
    getContactMethodsOfLoggedInUser(PID) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(mysqlCreds);
            connection.query('SELECT * FROM `ContactMethod` NATURAL JOIN ContactMethodType WHERE PID = ?;', [PID], function (error, results, fields) {
                if (error) {
                    resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                }
                else {
                    resolve({ success: true, message: "Getting contact methods of logged in user was successful", data: results });
                }
            });
            connection.end();
        });
    }
    removeContactMethodFromUser(PID, CMID) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(mysqlCreds);
            connection.query('DELETE FROM `ContactMethod` WHERE `ContactMethod`.`CMID` = ? AND `ContactMethod`.`PID`;', [CMID, PID], function (error, results, fields) {
                if (error) {
                    console.log(error);
                    resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                }
                else {
                    resolve({ success: true, message: "Removing the contact method from the user was successful" });
                }
            });
            connection.end();
        });
    }
    getListOfMatchingUsersForLoggedInUser(PID) {
        return new Promise(async function (resolve, reject) {
            var connection = mysql.createConnection(mysqlCreds);
            connection.query('SELECT PID, COUNT(*) AS NoOfInterestInCommon, Person.FirstName, Person.LastName, Person.Gender, TIMESTAMPDIFF(YEAR, Person.Birthday, CURDATE()) AS Age, Person.Biography, User.LastOnline FROM User_has_Interest NATURAL JOIN User NATURAL JOIN Person WHERE IID IN (SELECT IID FROM User_has_Interest WHERE PID = ?) AND User.LastOnline between date_sub(now(),INTERVAL 1 WEEK) and now() AND User_has_Interest.PID != ? GROUP BY PID ORDER BY Count(*) DESC', [PID, PID], function (error, results, fields) {
                if (error) {
                    resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
                }
                else {
                    resolve({ success: true, message: "Getting matching Users for logged in user was successful", data: results });
                }
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