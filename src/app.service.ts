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
    return config; 
  }


  createNutzer(firstName: string, lastName: string, gender: string, birthday: string, biography: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(this.getConfig());
      connection.query('INSERT INTO `Person` (`PID`, `FirstName`, `LastName`, `Gender`, `Birthday`, `Biography`) VALUES (NULL, ?, ?, ?, ?, "")', [firstName, lastName, gender, birthday], function (error, results, fields) {
        if (error) {
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        };
        resolve({ success: true, message: "Person has been created", additionalInfo: { PID: results.insertId } });
      });
      connection.end();
    });
  }

  getNutzer(nutzerID: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(this.getConfig());
      connection.query("SELECT Nutzer.NutzerID, Vorname, Nachname, Email, Passwort, Strasse, Hausnummer, Postleitzahl, Ort FROM Nutzer JOIN Adresse ON Nutzer.NutzerID = Adresse.NutzerID WHERE Nutzer.NutzerID = ?", [nutzerID], function (error, results, fields) {
        if (error) {
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        };
        resolve({ success: true, message: "User has been received", data: results });
      });
      connection.end();
    }.bind(this));
  }

}
