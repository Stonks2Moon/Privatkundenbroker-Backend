import { Injectable } from '@nestjs/common';
import { callResult } from './interfaces/interfaces';
import { ShareManager, BörsenAPI, OrderManager, MarketManager } from "moonstonks-boersenapi";

var passwordHash = require('password-hash');
var mysql = require('mysql');
const config = require('../config.json')

const onPlaceURL = "http://10.58.239.142:3001/webhook/onPlace?webhookAuthToken=" + config.webhookAuthenticationToken;
const onMatchURL = "http://10.58.239.142:3001/webhook/onMatch?webhookAuthToken=" + config.webhookAuthenticationToken;
const onCompleteURL = "http://10.58.239.142:3001/webhook/onComplete?webhookAuthToken=" + config.webhookAuthenticationToken;
const onDeleteURL = "http://10.58.239.142:3001/webhook/onDelete?webhookAuthToken=" + config.webhookAuthenticationToken;

const api = new BörsenAPI(config.MoonAuthenticationToken);
const orderManager: OrderManager = new OrderManager(api, onPlaceURL, onMatchURL, onCompleteURL, onDeleteURL);

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  loginWithPassword(email: string, password: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query('SELECT * FROM Nutzer WHERE Email = ?', [email], async function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          if (results.length === 1) {
            var hashedPassword = results[0].Passwort;

            var passwordVerifyResult = passwordHash.verify(password, hashedPassword);

            if (passwordVerifyResult) {
              var depotIDsOfUser = await this._getDepotIDsOfUser(results[0].NutzerID);
              resolve({ success: true, message: "Login successful", additionalInfo: { NutzerID: results[0].NutzerID, Vorname: results[0].Vorname, Nachname: results[0].Nachname, Email: results[0].Email, hashedPassword: hashedPassword, depotIDs: depotIDsOfUser } });
            } else {
              resolve({ success: false, message: "Login failed. Wrong email or password!" });
            }
          } else {
            resolve({ success: false, message: "Login failed. Wrong email or password!" });
          }
        }
      }.bind(this));
      connection.end();
    }.bind(this));
  }

  loginWithPasswordHash(email: string, hashedPassword: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query('SELECT * FROM Nutzer WHERE Email = ? And Passwort = ?', [email, hashedPassword], async function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          if (results.length === 1) {
            var depotIDsOfUser = await this._getDepotIDsOfUser(results[0].NutzerID);

            resolve({ success: true, message: "Login successful", additionalInfo: { NutzerID: results[0].NutzerID, Vorname: results[0].Vorname, Nachname: results[0].Nachname, Email: results[0].Email, hashedPassword: hashedPassword, depotIDs: depotIDsOfUser } });
          } else {
            resolve({ success: false, message: "Login failed. Wrong email or password-hash!" });
          }
        }
      }.bind(this));
      connection.end();
    }.bind(this));
  }

  createNutzer(email: string, password: string, firstName: string, lastName: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var hashedPassword = passwordHash.generate(password);
      var connection = mysql.createConnection(config.database);
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
      var connection = mysql.createConnection(config.database);
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
      var connection = mysql.createConnection(config.database);
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
      var connection = mysql.createConnection(config.database);
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
      var connection = mysql.createConnection(config.database);
      connection.query("SELECT Nutzer.NutzerID, Vorname, Nachname, Email, Passwort, Strasse, Hausnummer, Postleitzahl, Ort, IBAN as VerrechnungskontoIBAN FROM Nutzer JOIN Adresse ON Nutzer.NutzerID = Adresse.NutzerID JOIN Verrechnungskonto ON Nutzer.NutzerID = Verrechnungskonto.NutzerID WHERE Nutzer.NutzerID = ?", [nutzerID], async function (error, results, fields) {
        if (error) {
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          var depotIDsOfUser = await this._getDepotIDsOfUser(results[0].NutzerID);
          results[0].depotIDs = depotIDsOfUser;
          resolve({ success: true, message: "User has been received", data: results[0] });
        }
      }.bind(this));
      connection.end();
    }.bind(this));
  }


  updateAdressDataOfUser(nutzerID: number, strasse: string, hausnummer: number, postleitzahl: string, ort: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
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
      var connection = mysql.createConnection(config.database);
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
      var connection = mysql.createConnection(config.database);
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
      var connection = mysql.createConnection(config.database);
      connection.query("SELECT * FROM `Transaktion` NATURAL JOIN `Order` WHERE `NutzerID` = ? ORDER BY `Transaktion`.`Datum` DESC", [nutzerID], function (error, results, fields) {
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
      var connection = mysql.createConnection(config.database);
      connection.query('INSERT INTO `Transaktion` (`TransaktionsID`, `NutzerID`, `Beschreibung`, `Betrag`, `Datum`, `Zielkonto`) VALUES (NULL, ?, ?, ?, CURRENT_DATE( ), ?);', [nutzerID, description, value, receipient], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "Transaction has been created", additionalInfo: results });
        }
      });
      connection.end();
    }.bind(this));
  }

  getAllOwnedWertpapiereFromDatabase(nutzerID: number, depotID: number) {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query('SELECT ISIN, AVG(Kaufpreis) AS avgKaufpreis, SUM(Kaufpreis) AS totalKaufpreis, Blockiert, COUNT(*) AS count FROM `Wertpapier` NATURAL JOIN Depot WHERE DepotID = ? AND NutzerID = ? GROUP BY ISIN, Blockiert', [depotID, nutzerID], function (error, results, fields) {
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

      var timestampOfLastNight = this._getTimestampOfLastNight();

      if (allShares !== undefined) {
        for (var i = 0; i < allShares.length; i++) {
          var priceOfLastNight = await this.getPriceOfLastValueBeforeTimestamp(allShares[i].id, timestampOfLastNight);
          if (priceOfLastNight !== undefined) {
            allShares[i].priceOfLastNight = priceOfLastNight.price;
          } else {
            allShares[i].priceOfLastNight = allShares[i].price;
          }
        }
      } else {
        allShares = [];
      }

      resolve({ success: true, message: "All shares successfully retrieved", data: allShares });
    }.bind(this));
  }

  getPriceOfLastValueBeforeTimestamp(shareID: string, timestamp: number) {
    return new Promise<number>(async function (resolve, reject) {

      var timestampOfNightSevenDaysBeforeTimestamp = timestamp - 86400000 * 7;

      var pricesList = await ShareManager.getPrices(shareID, {
        from: timestampOfNightSevenDaysBeforeTimestamp,
        until: timestamp
      });
      resolve(pricesList[pricesList.length - 1]);
    }.bind(this));
  }

  getShare(shareID: string): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {
      var allShares = await this.getAllSharesService();

      if (allShares.success = true) {
        var share = allShares.data.find(x => x.id === shareID)
        if (share !== undefined) {
          resolve({ success: true, message: "Share has been obtained", data: share });
        } else {
          resolve({ success: false, message: "Share not found" });
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
      await ShareManager.getPrices(shareID, {
        from: Number(from),
        until: Number(until)
      })
        .then((res) => resolve({ success: true, message: "Price development for share successfully retrieved", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to retrieve the price development of the share", additionalInfo: err }));
    }.bind(this));
  }

  buyMarketOrder(shareID: string, amount: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      await orderManager.placeBuyMarketOrder(shareID, Number(amount))
        .then((res) => resolve({ success: true, message: "The buy market order was successfully placed", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to place the buy market order", additionalInfo: err }));
    }.bind(this));
  }

  buyStopMarketOrder(shareID: string, amount: number, stop: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      await orderManager.placeBuyStopMarketOrder(shareID, Number(amount), Number(stop))
        .then((res) => resolve({ success: true, message: "The buy stop market order was successfully placed", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to place the buy stop market order", additionalInfo: err }));
    }.bind(this));
  }

  buyLimitOrder(shareID: string, amount: number, limit: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      await orderManager.placeBuyLimitOrder(shareID, Number(amount), Number(limit))
        .then((res) => resolve({ success: true, message: "The buy limit order was successfully placed", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to place the buy limit order", additionalInfo: err }));
    }.bind(this));
  }

  buyStopLimitOrder(shareID: string, amount: number, limit: number, stop: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      await orderManager.placeBuyStopLimitOrder(shareID, Number(amount), Number(limit), Number(stop))
        .then((res) => resolve({ success: true, message: "The buy stop limit order was successfully placed", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to place the buy stop limit order", additionalInfo: err }));
    }.bind(this));
  }

  sellMarketOrder(shareID: string, amount: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      await orderManager.placeSellMarketOrder(shareID, Number(amount))
        .then((res) => resolve({ success: true, message: "The sell market order was successfully placed", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to place the sell market order", additionalInfo: err }));
    }.bind(this));
  }

  sellStopMarketOrder(shareID: string, amount: number, stop: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      await orderManager.placeSellStopMarketOrder(shareID, Number(amount), Number(stop))
        .then((res) => resolve({ success: true, message: "The sell stop market order was successfully placed", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to place the sell stop market order", additionalInfo: err }));
    }.bind(this));
  }

  sellLimitOrder(shareID: string, amount: number, limit: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      await orderManager.placeSellLimitOrder(shareID, Number(amount), Number(limit))
        .then((res) => resolve({ success: true, message: "The sell limit order was successfully placed", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to place the sell limit order", additionalInfo: err }));
    }.bind(this));
  }

  sellStopLimitOrder(shareID: string, amount: number, limit: number, stop: number): Promise<callResult> {
    return new Promise<callResult>(async function (resolve, reject) {

      await orderManager.placeSellStopLimitOrder(shareID, Number(amount), Number(limit), Number(stop))
        .then((res) => resolve({ success: true, message: "The sell stop limit order was successfully placed", data: res }))
        .catch((err) => resolve({ success: false, message: "Failed to place the sell stop limit order", additionalInfo: err }));
    }.bind(this));
  }

  checkAmount(amount: number) {
    return new Promise<callResult>(async function (resolve, reject) {
      if (Number(amount) <= config.maxOrderAmount) {
        resolve({ success: true, message: "The amount is under the maximum allowed amount" })
      } else {
        resolve({ success: false, message: "The specified amount exceeds the maximum allowed amount", additionalInfo: { MaxAmount: config.maxOrderAmount } })
      }
    }.bind(this))
  }

  checkIfEnoughMoneyOnAccount(amount: number, price: number, nutzerID: number) {
    return new Promise<callResult>(async function (resolve, reject) {

      var totalTransactionValue = Number(amount) * Number(price);
      var getBalanceOfVerrechnungskontoResult = await this.getBalanceOfVerrechnungskonto(nutzerID);

      if (totalTransactionValue <= getBalanceOfVerrechnungskontoResult.data.Guthaben) {
        resolve({ success: true, message: "Enough money on the account", additionalInfo: { totalTransactionValue: totalTransactionValue } })
      } else {
        resolve({ success: false, message: "There is not enough money on the account", additionalInfo: { totalTransactionValue: totalTransactionValue, AccountMoney: getBalanceOfVerrechnungskontoResult.data.Guthaben } })
      }
    }.bind(this))
  }

  checkIfDepotHasEnoughShares(amount: number, shareID: string, nutzerID: number, depotID: number) {
    return new Promise<callResult>(async function (resolve, reject) {

      var allOwnedSharesResult: callResult = await this.getAllOwnedWertpapiereFromDatabase(nutzerID, depotID);

      if (allOwnedSharesResult.success) {
        var depotShare = allOwnedSharesResult.data.filter(x => x.Blockiert === 0).find(x => x.ISIN === shareID);

        if (depotShare === undefined) {
          resolve({ success: false, message: "Not enough shares in the depot", additionalInfo: { SharedID: shareID, DepotAmount: 0, SellAmount: amount } });
        } else {
          if (amount <= depotShare.count) {
            resolve({ success: true, message: "Enough shares in the depot", additionalInfo: { ShareID: shareID, Amount: amount } });
          } else {
            resolve({ success: false, message: "Not enough shares in the depot", additionalInfo: { SharedID: shareID, DepotAmount: depotShare.count, SellAmount: amount } });
          }
        }
      } else {
        resolve(allOwnedSharesResult);
      }

    }.bind(this))
  }

  checkOrderStatus(depotID:number, orderID: number, orderStatusID: number) {
    return new Promise<callResult>(async function (resolve, reject) {

      var getOrdersResult = await this.getOrders(depotID);
      if (getOrdersResult.success) {
        var order = getOrdersResult.data.find(x => x.OrderID === orderID)
        if (orderStatusID === order.OrderstatusID) {
          resolve({ success: true, message: "Order status matches"});
        } else {
          resolve({ success: false, message: "Order status doesn't match" });
        }
      } else {
        resolve(getOrdersResult);
      }
    }.bind(this))
  }

  getOrders(depotID: number) {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query("SELECT `Order`.* FROM `Order` JOIN Orderstatus ON `Order`.`OrderstatusID` = Orderstatus.OrderstatusID WHERE DepotID = ?", [depotID], function (error, results, fields) {
        if (error) {
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "Orders have been received", data: results });
        }
      });
      connection.end();
    }.bind(this))
  }

  checkIfMarketIsOpen() {
    return new Promise<callResult>(async function (resolve, reject) {
      await MarketManager.isOpen()
        .then((res) => resolve({ success: true, message: "The buy stop limit order was successfully placed", data: { marketIsOpen: res } }))
        .catch((err) => resolve({ success: false, message: "Failed to check if Market is Open", additionalInfo: err }));
    });
  }

  validateWebhookAuthToken(webhookAuthToken: string) {
    if (webhookAuthToken == config.webhookAuthenticationToken) {
      return true;
    } else {
      return false;
    }
  }

  getInvoices(nutzerID: number) {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query('SELECT * FROM `Rechnung` WHERE `NutzerID` = ? ORDER BY `Rechnung`.`Datum` DESC', [nutzerID], async function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          for (var i = 0; i < results.length; i++) {
            var rechnungPositionen = await this._getRechnungspositionen(results[i].RechnungsID)
            results[i].gesamtWert = rechnungPositionen.additionalInfo.gesamtwert;
            results[i].positionen = rechnungPositionen.data;
          }
          resolve({ success: true, message: "List of Invoices obtained", data: results });
        }
      }.bind(this));
      connection.end();
    }.bind(this));
  }

  webhookOnPlace(body) {
    return new Promise<callResult>(async function (resolve, reject) {
      setTimeout(async function () {
        console.log("Request at webhook (onPlace) received");
        var updateBoerseOrderRefIDResult = await this._updateBoerseOrderRefID(body.id, body.jobId);
        console.log(updateBoerseOrderRefIDResult);
        resolve({ success: true, message: "Success" });
      }.bind(this), 2000);

    }.bind(this));
  }

  webhookOnMatch(body) {
    return new Promise<callResult>(async function (resolve, reject) {
      setTimeout(async function () {
        console.log("Request at webhook (onMatch) received");
        console.log(body);
        var updateOrderStatusResult = await this._updateOrderStatusID(2, body.orderId);
        console.log(updateOrderStatusResult);
        var updateAusfuehrungspreisInDatabaseResult = await this._updateAusfuehrungspreisInDatabase(body.orderId, body.price);
        console.log(updateAusfuehrungspreisInDatabaseResult);
        resolve({ success: true, message: "Success" });
      }.bind(this), 3000);
    }.bind(this));
  }

  webhookOnComplete(body) {
    return new Promise<callResult>(async function (resolve, reject) {
      setTimeout(async function () {
        console.log("Request at webhook (onComplete) received");
        var updateOrderStatusResult = await this._updateOrderStatusID(3, body.orderId);
        console.log(updateOrderStatusResult);

        var getOrderByBoerseOrderRefIDResult = await this._getOrderByBoerseOrderRefID(body.orderId);
        console.log(getOrderByBoerseOrderRefIDResult);
        console.log(getOrderByBoerseOrderRefIDResult.data.Anzahl);


        if (getOrderByBoerseOrderRefIDResult.data.OrdertypID === 1) { //SELL

          var removeSharesFromDepotResult = await this._removeSharesFromDepot(getOrderByBoerseOrderRefIDResult.data.Anzahl, getOrderByBoerseOrderRefIDResult.data.ShareRefID, getOrderByBoerseOrderRefIDResult.data.DepotID);
          console.log(removeSharesFromDepotResult);

          var updateTransaktionsBetragResult = await this._updateTransaktionsBetrag(getOrderByBoerseOrderRefIDResult.data.TransaktionsID, getOrderByBoerseOrderRefIDResult.data.Ausfuehrungspreis * getOrderByBoerseOrderRefIDResult.data.Anzahl - config.transactionFee)
          console.log(updateTransaktionsBetragResult);

          // Create Rechnung
          var createRechnungResult = await this._createRechnung(getOrderByBoerseOrderRefIDResult.data.NutzerID, 1, "Wertpapierverkauf Abrechnung");
          var createRechnungPositionResult = await this._createRechnungsposition(createRechnungResult.additionalInfo.RechnungsID, getOrderByBoerseOrderRefIDResult.data.Anzahl, "Wertpapier: " + getOrderByBoerseOrderRefIDResult.data.ShareRefID, getOrderByBoerseOrderRefIDResult.data.Ausfuehrungspreis * getOrderByBoerseOrderRefIDResult.data.Anzahl);
          var createFeeRechnungPositionResult = await this._createRechnungsposition(createRechnungResult.additionalInfo.RechnungsID, 2, "Transaktionsgebühr", -10);

        } else { //BUY
          var addSharesToDepotResult = await this._addSharesToDepot(getOrderByBoerseOrderRefIDResult.data.Anzahl, getOrderByBoerseOrderRefIDResult.data.ShareRefID, getOrderByBoerseOrderRefIDResult.data.DepotID, getOrderByBoerseOrderRefIDResult.data.Ausfuehrungspreis);
          console.log(addSharesToDepotResult);

          var updateTransaktionsBetragResult = await this._updateTransaktionsBetrag(getOrderByBoerseOrderRefIDResult.data.TransaktionsID, (-1) * (getOrderByBoerseOrderRefIDResult.data.Ausfuehrungspreis * getOrderByBoerseOrderRefIDResult.data.Anzahl) - config.transactionFee)
          console.log(updateTransaktionsBetragResult);

          // Create Rechnung
          var createRechnungResult = await this._createRechnung(getOrderByBoerseOrderRefIDResult.data.NutzerID, 1, "Wertpapierkauf Abrechnung");
          var createRechnungPositionResult = await this._createRechnungsposition(createRechnungResult.additionalInfo.RechnungsID, getOrderByBoerseOrderRefIDResult.data.Anzahl, "Wertpapier: " + getOrderByBoerseOrderRefIDResult.data.ShareRefID, getOrderByBoerseOrderRefIDResult.data.Ausfuehrungspreis * getOrderByBoerseOrderRefIDResult.data.Anzahl);
          var createFeeRechnungPositionResult = await this._createRechnungsposition(createRechnungResult.additionalInfo.RechnungsID, 1, "Transaktionsgebühr", 10);
        }

        resolve({ success: true, message: "Success" });
      }.bind(this), 4000);

    }.bind(this));
  }

  webhookOnDelete(body) {
    return new Promise<callResult>(async function (resolve, reject) {
      setTimeout(async function () {

        console.log("Request at webhook (onDelete) received");
        var updateOrderStatusResult = await this._updateOrderStatusID(4, body.orderId);
        console.log(updateOrderStatusResult);

        var getOrderByBoerseOrderRefIDResult = await this._getOrderByBoerseOrderRefID(body.orderId);
        console.log(getOrderByBoerseOrderRefIDResult);

        if (getOrderByBoerseOrderRefIDResult.data.OrdertypID === 1) { //SELL
          //Adjust share state from blocked to unblocked
          var setBlockedStatusForSharesResult = await this.setBlockedStatusForShares(getOrderByBoerseOrderRefIDResult.data.depotID, getOrderByBoerseOrderRefIDResult.data.shareID, getOrderByBoerseOrderRefIDResult.data.amount, 0)
          console.log(setBlockedStatusForSharesResult)
          
          var updateTransaktionDescriptionResult = await this._updateTransaktionDescription(getOrderByBoerseOrderRefIDResult.data.TransaktionsID, "ABBRUCH: Aktienverkauf")
          console.log(updateTransaktionDescriptionResult);

        }else{ //BUY
          //Update the transaction value
          var updateTransaktionsBetragResult = await this._updateTransaktionsBetrag(getOrderByBoerseOrderRefIDResult.data.TransaktionsID, 0)
          console.log(updateTransaktionsBetragResult);

          var updateTransaktionDescriptionResult = await this._updateTransaktionDescription(getOrderByBoerseOrderRefIDResult.data.TransaktionsID, "ABBRUCH: Aktienkauf")
          console.log(updateTransaktionDescriptionResult);
        }
        resolve({ success: true, message: "Success" });

      }.bind(this), 5000);

    }.bind(this));
  }


  createOrderInDatabase(depotID: number, transactionID: number, boerseJobRefID: number, orderStatusID: number, shareRefID: string, orderTypID: number, amount: number) {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query("INSERT INTO `Order` (`OrderID`, `DepotID`, `TransaktionsID`, `BoerseJobRefID`, `OrderstatusID`, `ShareRefID`, `OrdertypID`, `Anzahl`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ? )", [depotID, transactionID, boerseJobRefID, orderStatusID, shareRefID, orderTypID, amount], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "Orders has been created", additionalInfo: { DepotID: depotID, TransactionID: transactionID, BoerseOrderRefID: boerseJobRefID, OrderStatusID: orderStatusID, ShareRefID: shareRefID, OrderTypID: orderTypID, Amount: amount } });
        }
      });
      connection.end();
    }.bind(this))
  }

  setBlockedStatusForShares(depotID: number, shareID: string, amount: number, blocked: number) {
    return new Promise<callResult>(async function (resolve, reject) {

      var getSharesInDepotForSpecificBlockedStatusResult = await this._getSharesInDepotForSpecificBlockedStatus(depotID, shareID, 1 - blocked)

      if (getSharesInDepotForSpecificBlockedStatusResult.success) {
        for (var i = 0; i < amount; i++) {
          var wertpapierID = getSharesInDepotForSpecificBlockedStatusResult.data[i].WertpapierID;
          var setBlockedStatusForOnShareResult = await this._setBlockedStatusForOnShare(wertpapierID, blocked);
          if (!setBlockedStatusForOnShareResult.success) {
            resolve(setBlockedStatusForOnShareResult)
          }
        }
        resolve(setBlockedStatusForOnShareResult)
      } else {
        resolve(getSharesInDepotForSpecificBlockedStatusResult);
      }
    }.bind(this))
  }

  _getTimestampOfLastNight() {
    var now = new Date;
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    var timestampOfLastNight = Math.floor(Number(now) / 1000) * 1000 - 1;
    return timestampOfLastNight;
  }

  _getDepotIDsOfUser(userID: number) {
    return new Promise(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query('SELECT * FROM `Depot` WHERE NutzerID = ?', [userID], function (error, results, fields) {
        if (error) {
          resolve([]);
        } else {
          var depotIDs = [];
          for (var i = 0; i < results.length; i++) {
            depotIDs.push(results[i].DepotID)
          }
          resolve(depotIDs);
        }
      });
      connection.end();
    }.bind(this));
  }

  _setBlockedStatusForOnShare(wertpapierID: number, blocked: number) {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query("UPDATE `Wertpapier` SET `Blockiert` = ? WHERE `Wertpapier`.`WertpapierID` = ?", [blocked, wertpapierID], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "The blocked status of the share has been updated", additionalInfo: { WertpapierID: wertpapierID, Blockiert: blocked } });
        }
      });
      connection.end();
    }.bind(this))
  }

  _getSharesInDepotForSpecificBlockedStatus(depotID: number, shareID: string, blocked: number) {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query("SELECT * FROM `Wertpapier` WHERE DepotID = ? And ISIN = ? AND Blockiert = ?", [depotID, shareID, blocked], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          if (results.length > 0) {
            resolve({ success: true, message: "Shares in Depot for specific blocked status have been received", data: results });
          } else {
            resolve({ success: false, message: "The are no shares for this blocked status in the depot or all shares have this blocked status already." });
          }
        }
      });
      connection.end();
    }.bind(this))
  }

  _updateAusfuehrungspreisInDatabase(boerseOrderRefID: string, ausfuehrungspreis: number) {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query("UPDATE `Order` SET `Ausfuehrungspreis` = '?' WHERE `Order`.`boerseOrderRefID` = ?;", [ausfuehrungspreis, boerseOrderRefID], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "Ausfuehrungspreis has been updated" });
        }
      });
      connection.end();
    }.bind(this))
  }

  _updateBoerseOrderRefID(boerseOrderRefID: string, boerseJobRefID: number) {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query("UPDATE `Order` SET `BoerseOrderRefID` = ? WHERE `Order`.`BoerseJobRefID` = ?", [boerseOrderRefID, boerseJobRefID], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "BoerseOrderRefID has been updated", additionalInfo: { BoerseOrderRefID: boerseOrderRefID, BoerseJobRefID: boerseJobRefID } });
        }
      });
      connection.end();
    }.bind(this))
  }

  _updateTransaktionsBetrag(transaktionsID: number, betrag: number) {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query("UPDATE `Transaktion` SET `Betrag` = ? WHERE `Transaktion`.`TransaktionsID` = ?;", [betrag, transaktionsID], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "Transaction value has been updated" });
        }
      });
      connection.end();
    }.bind(this))
  }

  _updateTransaktionDescription(transaktionsID: number, description: string) {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query("UPDATE `Transaktion` SET `Beschreibung` = ? WHERE `Transaktion`.`TransaktionsID` = ?;", [description, transaktionsID], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "Transaction description has been updated" });
        }
      });
      connection.end();
    }.bind(this))
  }

  _updateOrderStatusID(orderStatusID: number, boerseOrderRefID: number,) {
    return new Promise<callResult>(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query("UPDATE `Order` SET `OrderStatusID` = ? WHERE `Order`.`BoerseOrderRefID` = ?", [orderStatusID, boerseOrderRefID], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "OrderStatusID has been updated", additionalInfo: { OrderStatusID: orderStatusID, BoerseOrderRefID: boerseOrderRefID } });
        }
      });
      connection.end();
    }.bind(this))
  }

  _addSharesToDepot(amount: number, shareID: string, depotID: number, price: number) {
    return new Promise<callResult>(async function (resolve, reject) {
      for (var i = 0; i < amount; i++) {
        var addOneShareToDepotResult = await this._addOneShareToDepot(shareID, depotID, price);
        if (!addOneShareToDepotResult.success) {
          resolve(addOneShareToDepotResult)
        }
      }
      resolve(addOneShareToDepotResult)
    }.bind(this))
  }

  _addOneShareToDepot(shareID: string, depotID: number, price: number) {
    return new Promise(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query("Insert INTO Wertpapier  (`WertpapierID`, `ISIN`, `DepotID`, `Kaufpreis`)  VALUES (NULL, ?, ?, ?)", [shareID, depotID, price], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "Share has been added to depot", additionalInfo: { ShareID: shareID, DepotID: depotID, Price: price } });
        }
      });
      connection.end();
    }.bind(this));
  }

  _removeSharesFromDepot(amount: number, shareID: string, depotID: number) {
    return new Promise<callResult>(async function (resolve, reject) {
      var getBlockedWertpapiereResult = await this._getSharesInDepotForSpecificBlockedStatus(depotID, shareID, 1);

      if (getBlockedWertpapiereResult.success) {
        for (var i = 0; i < amount; i++) {
          var wertpapierID = getBlockedWertpapiereResult.data[i].WertpapierID;
          var removeOneShareFromDepotResult = await this._removeOneShareFromDepot(wertpapierID);
          if (!removeOneShareFromDepotResult.success) {
            resolve(removeOneShareFromDepotResult)
          }
        }
        resolve(removeOneShareFromDepotResult)
      } else {
        resolve(getBlockedWertpapiereResult)
      }
    }.bind(this))
  }

  _removeOneShareFromDepot(wertpapierID: number) {
    return new Promise(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query("DELETE FROM `Wertpapier` WHERE `Wertpapier`.`WertpapierID` = ?", [wertpapierID], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "Share has been removed from depot" });
        }
      });
      connection.end();
    }.bind(this));
  }

  _getOrderByBoerseOrderRefID(boerseOrderRefID: string) {
    return new Promise(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query("SELECT * FROM `Order` JOIN `Depot` ON `Order`.`DepotID` = `Depot`.`DepotID` WHERE BoerseOrderRefID = ?", [boerseOrderRefID], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "Getting Order successful", data: results[0] });
        }
      });
      connection.end();
    }.bind(this));
  }

  _testWebhook(boerseOrderRefID: string) {
    return new Promise(async function (resolve, reject) {
      var updateTransaktionDescriptionResult = await this._updateTransaktionDescription(217, "ABBRUCH: Aktienkauf")

      resolve(updateTransaktionDescriptionResult);

    }.bind(this));
  }

  _createRechnung(nutzerID: number, rechnungstypID: number, title: string) {
    return new Promise(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query("INSERT INTO Rechnung (NutzerID, RechnungstypID, Titel) VALUES (?, ?, ?)", [nutzerID, rechnungstypID, title], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "Rechnung has been created", additionalInfo: { RechnungsID: results.insertId } });
        }
      });
      connection.end();
    }.bind(this));
  }

  _getRechnungspositionen(rechnungsID: number) {
    return new Promise(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query('SELECT * FROM `Rechnungsposition` WHERE `RechnungsID` = ?', [rechnungsID], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          var gesamtwert = 0;
          for (var i = 0; i < results.length; i++) {
            gesamtwert += results[i].Wert;
          }
          resolve({ success: true, message: "List of Invoice positions obtained", data: results, additionalInfo: { gesamtwert: gesamtwert } });
        }
      });
      connection.end();
    }.bind(this));
  }

  _createRechnungsposition(rechnungsID: number, stueckzahl: number, bezeichnung: string, amount: string) {
    return new Promise(async function (resolve, reject) {
      var connection = mysql.createConnection(config.database);
      connection.query("INSERT INTO Rechnungsposition (RechnungsID, Stueckzahl, Bezeichnung, Wert) VALUES (?, ?, ?, ?)", [rechnungsID, stueckzahl, bezeichnung, amount], function (error, results, fields) {
        if (error) {
          console.log(error);
          resolve({ success: false, message: "Unhandled error! Please contact a system administrator!" });
        } else {
          resolve({ success: true, message: "Rechnungsposition has been created", additionalInfo: results.insertId });
        }
      });
      connection.end();
    }.bind(this));
  }

}
