import { Injectable } from '@nestjs/common';
import { callResult } from './interfaces/interfaces';


var passwordHash = require('password-hash');
var mysql = require('mysql');

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getConfig() {
    // TODO
    var config = require('../config.json')
    return config.database;
  }

  loginWithPassword(email: string, password: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(this.getConfig());
      connection.query('SELECT * FROM Nutzer WHERE Email = ?', [email], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          if (results.length === 1) {
            var hashedPassword = results[0].Passwort;

            var passwordVerifyResult = passwordHash.verify(password, hashedPassword);

            if (passwordVerifyResult) {
              resolve({ success: true, message: "Login successful", additionalInfo: { NutzerID: results[0].NutzerID, Vorname: results[0].Vorname, Nachname: results[0].Nachname, Email: results[0].Email, hashedPassword: hashedPassword } });
            } else {
              resolve({ success: false, message: "Login failed. Wrong email or password!" });
            }
          } else {
            resolve({ success: false, message: "Login failed. Wrong email or password!" });
          }
        }
      });
      connection.end();
    }.bind(this));
  }

  loginWithPasswordHash(email: string, hashedPassword: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(this.getConfig());
      connection.query('SELECT * FROM Nutzer WHERE Email = ? And Passwort = ?', [email, hashedPassword], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          if (results.length === 1) {
            resolve({ success: true, message: "Login successful", additionalInfo: { NutzerID: results[0].NutzerID, Vorname: results[0].Vorname, Nachname: results[0].Nachname, Email: results[0].Email, hashedPassword: hashedPassword } });
          } else {
            resolve({ success: false, message: "Login failed. Wrong email or password-hash!" });
          }
        }
      });
      connection.end();
    }.bind(this));
  }

  createNutzer(email: string, password: string, firstName: string, lastName: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var hashedPassword = passwordHash.generate(password);
      var connection = mysql.createConnection(this.getConfig());
      connection.query('INSERT INTO `Nutzer` (`NutzerID`, `Vorname`, `Nachname`, `Email`, `Passwort`) VALUES (NULL, ?, ?, ?, ?);', [firstName, lastName, email, hashedPassword], function (error, results, fields) {
        if (error) {
          if (error.code == "ER_DUP_ENTRY") {
            resolve({ success: false, message: "An user with this email already exists! 🍔" });
          } else {
            console.log(error);
            resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
          }
        } else {
          resolve({ success: true, message: "Nutzer has been created", additionalInfo: { PID: results.insertId, hashedPassword: hashedPassword } });
        }
      });
      connection.end();
    }.bind(this));
  }

  createAdresse(nutzerID: number, strasse: string, hausnummer: number, postleitzahl: string, ort: string) {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(this.getConfig());
      connection.query('INSERT INTO `Adresse` (`NutzerID`, `Strasse`, `Hausnummer`, `Postleitzahl`, `Ort`) VALUES (?, ?, ?, ?, ?);', [nutzerID, strasse, hausnummer, postleitzahl, ort], function (error, results, fields) {
        if (error) {
          if (error.code == "ER_DUP_ENTRY") {
            resolve({ success: false, message: "An adress for this user already exists!" });
          } else {
            console.log(error);
            resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
          }
        } else {
          resolve({ success: true, message: "Adress has been created" });
        }
      });
      connection.end();
    }.bind(this));

  }

  createDepot(nutzerID: number) {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(this.getConfig());
      connection.query('INSERT INTO `Depot` (`DepotID`, `NutzerID`) VALUES (NULL, ?);', [nutzerID], function (error, results, fields) {
        if (error) {
          if (error.code == "ER_DUP_ENTRY") {
            resolve({ success: false, message: "An depot for this user already exists!" });
          } else {
            console.log(error);
            resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
          }
        } else {
          resolve({ success: true, message: "Depot has been created" });
        }
      });
      connection.end();
    }.bind(this));
  }

  getNutzer(nutzerID: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(this.getConfig());
      connection.query("SELECT Nutzer.NutzerID, Vorname, Nachname, Email, Passwort, Strasse, Hausnummer, Postleitzahl, Ort FROM Nutzer JOIN Adresse ON Nutzer.NutzerID = Adresse.NutzerID WHERE Nutzer.NutzerID = ?", [nutzerID], function (error, results, fields) {
        if (error) {
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        };
        resolve({ success: true, message: "User has been received", data: results[0] });
      });
      connection.end();
    }.bind(this));
  }


  updateAdressDataOfUser(nutzerID: number, strasse: string, hausnummer: number, postleitzahl: string, ort: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(this.getConfig());
      connection.query('UPDATE `Adresse` SET `Strasse` = ?, `Hausnummer` = ?, `Postleitzahl` = ?, `Ort` = ? WHERE `Adresse`.`NutzerID` = ?;', [strasse, hausnummer, postleitzahl, ort, nutzerID], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        }
        resolve({ success: true, message: "The adress of the logged in User has been updated" });
      });
      connection.end();
    }.bind(this));
  }

  updatePasswordOfUser(nutzerID: number, newPassword: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var newPasswordHash = passwordHash.generate(newPassword);
      var connection = mysql.createConnection(this.getConfig());
      connection.query('UPDATE `Nutzer` SET `Passwort` = ? WHERE `Nutzer`.`NutzerID` = ?;', [newPasswordHash, nutzerID], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        }
        resolve({ success: true, message: "The password of the logged in User has been updated" });
      });
      connection.end();
    }.bind(this));
  }

}
