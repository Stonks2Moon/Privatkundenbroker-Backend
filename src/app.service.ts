import { Injectable } from '@nestjs/common';
import { callResult } from './interfaces/interfaces';
import { ShareManager, BörsenAPI, OrderManager, MarketManager } from "moonstonks-boersenapi";
import { getAllSharesQueryProperties } from './app.apiproperties';


var passwordHash = require('password-hash');
var mysql = require('mysql');

const api = new BörsenAPI('moonstonks token');
const orderManager: OrderManager = new OrderManager(api, 'onPlace', 'onMatch', 'onComplete', 'onDelete')

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getConfig() {
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
          resolve({ success: true, message: "Nutzer has been created", additionalInfo: { NutzerID: results.insertId, hashedPassword: hashedPassword } });
        }
      });
      connection.end();
    }.bind(this));
  }

  createAdresse(nutzerID: number, strasse: string, hausnummer: number, postleitzahl: string, ort: string): Promise<callResult> {
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

  createDepot(nutzerID: number): Promise<callResult> {
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

  createVerrechnungskonto(nutzerID: number, IBAN: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(this.getConfig());
      connection.query('INSERT INTO `Verrechnungskonto` (`NutzerID`, `IBAN`) VALUES (?, ?);', [nutzerID, IBAN], function (error, results, fields) {
        if (error) {
          if (error.code == "ER_DUP_ENTRY") {
            resolve({ success: false, message: "An Verrechnungskonto for this User or with this IBAN already exists!" });
          } else {
            console.log(error);
            resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
          }
        } else {
          resolve({ success: true, message: "Verrechnungskonto has been created" });
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
        } else {
          resolve({ success: true, message: "The password of the logged in User has been updated", additionalInfo: { newPasswordHash: newPasswordHash } });
        }
      });
      connection.end();
    }.bind(this));
  }

  getBalanceOfVerrechnungskonto(nutzerID: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(this.getConfig());
      connection.query("SELECT SUM(Betrag) As Guthaben FROM `Transaktion` WHERE NutzerID = ?", [nutzerID], function (error, results, fields) {
        if (error) {
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        };
        resolve({ success: true, message: "Balance received", data: results[0] });
      });
      connection.end();
    }.bind(this));
  }

  getLastTransactionsOfVerrechnungskonto(nutzerID: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(this.getConfig());
      connection.query("SELECT * FROM `Transaktion` WHERE `NutzerID` = ? ORDER BY `Transaktion`.`Datum` DESC", [nutzerID], function (error, results, fields) {
        if (error) {
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        };
        resolve({ success: true, message: "Transactions received", data: results });
      });
      connection.end();
    }.bind(this));
  }

  createTransactionAsAdmin(nutzerID: number, description: string, value: number, receipient: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(this.getConfig());
      connection.query('INSERT INTO `Transaktion` (`TransaktionsID`, `NutzerID`, `Beschreibung`, `Betrag`, `Datum`, `Zielkonto`) VALUES (NULL, ?, ?, ?, CURRENT_DATE( ), ?);', [nutzerID, description, value, receipient], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "Transaction has been created" });
        }
      });
      connection.end();
    }.bind(this));
  }

  getAllOwnedWertpapiereFromDatabase(nutzerID: number, depotID: number) {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(this.getConfig());
      connection.query('SELECT ISIN, AVG(Kaufpreis) AS avgKaufpreis, SUM(Kaufpreis) AS totalKaufpreis, COUNT(*) AS count FROM `Wertpapier` NATURAL JOIN Depot WHERE DepotID = ? AND NutzerID = ? GROUP BY ISIN', [depotID, nutzerID], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "Owned Wertpapiere have been obtained", data: results });
        }
      });
      connection.end();
    }.bind(this));
  }


  getAllSharesService(): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      var allShares = await ShareManager.getShares()
        .catch((err) => resolve({ success: false, message: "Failed to retrieve the shares", additionalInfo: err }));

      var timestampOfLastNight = this.getTimestampOfLastNight();

      for (var i = 0; i < allShares.length; i++) {
        // TODO: Get price of last night
        var priceOfLastNight = await this.getPriceOfLastValueBeforeTimestamp(allShares[i].id, timestampOfLastNight);
        if(priceOfLastNight !== undefined){
          allShares[i].priceOfLastNight = priceOfLastNight.price;
        } else {
          allShares[i].priceOfLastNight = allShares[i].price;
        }
      }

      resolve({ success: true, message: "All shares successfully retrieved", data: allShares });
    }.bind(this));
  }

  getPriceOfLastValueBeforeTimestamp(shareID: string, timestamp: number) {
    return new Promise<number>(async function (resolve, reject) {

      var timestampOfNightSevenDaysBeforeTimestamp = timestamp - 86400000 * 7;

      var pricesList = await ShareManager.getPricesFromUntil(shareID, timestampOfNightSevenDaysBeforeTimestamp, timestamp);
      resolve(pricesList[pricesList.length-1]);
    }.bind(this));
  }

  getShare(shareID: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var allShares = await this.getAllSharesService();
      
      if(allShares.success = true){
        var share = allShares.data.find(x => x.id === shareID)
        if(share !== undefined){
          resolve({success: true, message: "Share has been obtained", data: share});
        } else {
          resolve({success: false, message: "Share not found" });
        }
      } else {
        resolve(allShares);
      }

    }.bind(this));
  }

  getPriceOfShareService(shareID: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      await ShareManager.getPrice(shareID)
        .then((res) => resolve({ success: true, message: "Price for share successfully retrieved", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to retrieve the price of the share", additionalInfo: err }));
    }.bind(this));
  }

  getPriceDevelopmentOfShareService(shareID: string, from: number, until: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      await ShareManager.getPricesFromUntil(shareID, from, until)
        .then((res) => resolve({ success: true, message: "Price development for share successfully retrieved", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to retrieve the price development of the share", additionalInfo: err }));
    }.bind(this));
  }

  buyMarketOrder(shareID: string, amount: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      await orderManager.placeBuyMarketOrder(shareID, amount)
        .then((res) => resolve({ success: true, message: "The buy market order was successfully placed", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to place the buy market order", additionalInfo: err }));
    }.bind(this));
  }

  buyStopMarketOrder(shareID: string, amount: number, stop: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      await orderManager.placeBuyStopMarketOrder(shareID, amount, stop)
        .then((res) => resolve({ success: true, message: "The buy stop market order was successfully placed", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to place the buy stop market order", additionalInfo: err }));
    }.bind(this));
  }

  buyLimitOrder(shareID: string, amount: number, limit: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      await orderManager.placeBuyLimitOrder(shareID, amount, limit)
        .then((res) => resolve({ success: true, message: "The buy limit order was successfully placed", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to place the buy limit order", additionalInfo: err }));
    }.bind(this));
  }

  buyStopLimitOrder(shareID: string, amount: number, limit: number, stop: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      await orderManager.placeBuyStopLimitOrder(shareID, amount, limit, stop)
        .then((res) => resolve({ success: true, message: "The buy stop limit order was successfully placed", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to place the buy stop limit order", additionalInfo: err }));
    }.bind(this));
  }

  /*checkIfMarketIsOpen() {
    return new Promise<callResult>(async function (resolve, reject) {
      console.log(MarketManager.isOpen());
    });
  }*/

  getTimestampOfLastNight() {
    var now = new Date;
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    var timestampOfLastNight = Math.floor(Number(now) / 1000) * 1000 - 1;
    return timestampOfLastNight;
  }


}
