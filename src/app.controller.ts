import { Controller, Get, Post, Put, Delete, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { registerUserQueryProperties, loginWithPasswordQueryProperties, loginWithPasswordHashQueryProperties, 
  updateAdressDataQueryProperties, updatePasswordOfUserQueryProperties, getBalanceAndLastTransactionsOfVerrechnungskontoQueryProperties, 
  createTransactionAsAdminQueryProperties, getAllSharesQueryProperties, getShareQueryProperties, getPriceOfShareQueryProperties, initiateAuszahlungQueryProperties,
  getPriceDevlopmentOfShareQueryProperties, getDepotValuesQueryProperties, buyOrderQueryProperties, sellOrderQueryProperties, checkIfMarketIsOpenQueryProperties,
  webhookOnPlaceQueryProperties, webhookOnMatchQueryProperties, webhookOnCompleteQueryProperties, webhookOnDeleteQueryProperties, webhookTestProperties } from './app.apiproperties';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/loginWithPassword")
  async loginWithPassword(@Query() loginWithPasswordQueryProperties: loginWithPasswordQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordResult = await this.appService.loginWithPassword(loginWithPasswordQueryProperties.email, loginWithPasswordQueryProperties.password);
      if (loginWithPasswordResult.success) {
        var getNutzerResult = await this.appService.getNutzer(loginWithPasswordResult.additionalInfo.NutzerID);
        resolve(JSON.stringify(getNutzerResult));
      } else {
        resolve(loginWithPasswordResult);
      }
    }.bind(this));
  }

  @Get("/loginWithPasswordHash")
  async loginWithPasswordHash(@Query() loginWithPasswordHashQueryProperties: loginWithPasswordHashQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordHashResult = await this.appService.loginWithPasswordHash(loginWithPasswordHashQueryProperties.email, loginWithPasswordHashQueryProperties.hashedPassword);
      
      if (loginWithPasswordHashResult.success) {
        var getNutzerResult = await this.appService.getNutzer(loginWithPasswordHashResult.additionalInfo.NutzerID);
        resolve(JSON.stringify(getNutzerResult));
      } else {
        resolve(loginWithPasswordHashResult);
      }
    }.bind(this));
  }

  @Post("/registerUser")
  async registerUser(@Query() registerUserProperties: registerUserQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var createNutzerResult = await this.appService.createNutzer(registerUserProperties.email, registerUserProperties.password, registerUserProperties.firstName, registerUserProperties.lastName);

      if (createNutzerResult.success) {
        var createAddresseResult = await this.appService.createAdresse(createNutzerResult.additionalInfo.NutzerID, registerUserProperties.strasse, registerUserProperties.hausnummer, registerUserProperties.postleitzahl, registerUserProperties.ort)
        createNutzerResult.additionalInfo.createAddressResult = createAddresseResult;
        if (createAddresseResult.success) {
          var createDepotResult = await this.appService.createDepot(createNutzerResult.additionalInfo.NutzerID);
          createNutzerResult.additionalInfo.createDepotResult = createDepotResult;
          if (createDepotResult.success) {
            var randomIBAN = "DE09" + (Math.random() * (999999999999999999 - 100000000000000000) + 100000000000000000);
            var createVerrechnungskontoResult = await this.appService.createVerrechnungskonto(createNutzerResult.additionalInfo.NutzerID, randomIBAN);
            createNutzerResult.additionalInfo.createVerrechnunskontoResult = createVerrechnungskontoResult;
            if(createVerrechnungskontoResult.success) {
              resolve(JSON.stringify(createNutzerResult));
            } else {
              resolve(JSON.stringify(createNutzerResult));
            }
          } else {
            resolve(JSON.stringify(createDepotResult));
          }
        } else {
          resolve(JSON.stringify(createAddresseResult));
        }
        
      } else {
        resolve(JSON.stringify(createNutzerResult));
      }
    }.bind(this));
  }


  @Put("/updateAdressDataOfUser")
  async updateAdressDataUser(@Query() updateAdressDataQueryProperties: updateAdressDataQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordResult = await this.appService.loginWithPasswordHash(updateAdressDataQueryProperties.email, updateAdressDataQueryProperties.hashedPassword);

      if (loginWithPasswordResult.success) {
        var updateAdressDataResult = await this.appService.updateAdressDataOfUser(loginWithPasswordResult.additionalInfo.NutzerID, updateAdressDataQueryProperties.strasse, updateAdressDataQueryProperties.hausnummer, updateAdressDataQueryProperties.postleitzahl, updateAdressDataQueryProperties.ort);
        resolve(JSON.stringify(updateAdressDataResult));
      } else {
        resolve(loginWithPasswordResult);
      }
    }.bind(this));
  }

  @Put("/updatePasswordOfUser")
  async updatePasswordOfUser(@Query() updatePasswordOfUserQueryProperties: updatePasswordOfUserQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordResult = await this.appService.loginWithPassword(updatePasswordOfUserQueryProperties.email, updatePasswordOfUserQueryProperties.oldPassword);

      if (loginWithPasswordResult.success) {
        var updatePasswordOfUserResult = await this.appService.updatePasswordOfUser(loginWithPasswordResult.additionalInfo.NutzerID, updatePasswordOfUserQueryProperties.newPassword);
        resolve(JSON.stringify(updatePasswordOfUserResult));
      } else {
        resolve(loginWithPasswordResult);
      }
    }.bind(this));
  }

  @Get("/getBalanceAndLastTransactionsOfVerrechnungskonto")
  async getBalanceAndLastTransactionsOfVerrechnungskonto(@Query() getBalanceAndLastTransactionsOfVerrechnungskontoQueryProperties: getBalanceAndLastTransactionsOfVerrechnungskontoQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordHashResult = await this.appService.loginWithPasswordHash(getBalanceAndLastTransactionsOfVerrechnungskontoQueryProperties.email, getBalanceAndLastTransactionsOfVerrechnungskontoQueryProperties.hashedPassword);
      
      if (loginWithPasswordHashResult.success) {
        var getBalanceOfVerrechnungskontoResult = await this.appService.getBalanceOfVerrechnungskonto(loginWithPasswordHashResult.additionalInfo.NutzerID);
        
        var getLastTransactionsOfVerrechnungskontoResult = await this.appService.getLastTransactionsOfVerrechnungskonto(loginWithPasswordHashResult.additionalInfo.NutzerID);

        var getBalanceAndLastTransactionsOfVerrechnungskontoResult = {success: true, message: "Balance and Last TransactionRetrieved", data: { balance: getBalanceOfVerrechnungskontoResult.data.Guthaben, transactions: getLastTransactionsOfVerrechnungskontoResult.data }}
        
        resolve(JSON.stringify(getBalanceAndLastTransactionsOfVerrechnungskontoResult));
      } else {
        resolve(loginWithPasswordHashResult);
      }
    }.bind(this));
  }
  
  @Post("/initiateAuszahlung")
  async initiateAuszahlung(@Query() initiateAuszahlungQueryProperties: initiateAuszahlungQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordHashResult = await this.appService.loginWithPasswordHash(initiateAuszahlungQueryProperties.email, initiateAuszahlungQueryProperties.hashedPassword);
      
      if (loginWithPasswordHashResult.success) {
        // Check if balance is available
        var getBalanceOfVerrechnungskontoResult = await this.appService.getBalanceOfVerrechnungskonto(loginWithPasswordHashResult.additionalInfo.NutzerID);
        if(getBalanceOfVerrechnungskontoResult.data.Guthaben >= initiateAuszahlungQueryProperties.amount && initiateAuszahlungQueryProperties.amount > 0) {
          var createTransactionAsAdminResult = await this.appService.createTransactionAsAdmin(loginWithPasswordHashResult.additionalInfo.NutzerID, "Auszahlug", (-1) * initiateAuszahlungQueryProperties.amount, initiateAuszahlungQueryProperties.IBAN);
          resolve(createTransactionAsAdminResult);
        } else {
          resolve({ success: false, message: "Insufficient funds" });
        }
      } else {
        resolve(loginWithPasswordHashResult);
      }
    }.bind(this)); 
  }

  
  @Post("/createTransactionAsAdmin")
  async createTransactionAsAdmin(@Query() createTransactionAsAdminQueryProperties: createTransactionAsAdminQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      if(createTransactionAsAdminQueryProperties.adminKey == "s3cr3tAdm1nK3y"){
        var createTransactionAsAdminResult = await this.appService.createTransactionAsAdmin(createTransactionAsAdminQueryProperties.userID, createTransactionAsAdminQueryProperties.description, createTransactionAsAdminQueryProperties.value, createTransactionAsAdminQueryProperties.receipient);
        resolve(createTransactionAsAdminResult);
      } else {
        resolve({ success: false, message: "Wrong Admin Key"});
      }
    }.bind(this)); 
  }

  @Get("/getAllShares")
  async getAllShares(@Query() getAllSharesQueryProperties: getAllSharesQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordHashResult = await this.appService.loginWithPasswordHash(getAllSharesQueryProperties.email, getAllSharesQueryProperties.hashedPassword);
      if (loginWithPasswordHashResult.success) {
        var getAllSharesServiceResult = await this.appService.getAllSharesService();
        resolve(getAllSharesServiceResult);
      } else {
        resolve(loginWithPasswordHashResult);
      }
    }.bind(this));
  }

  @Get("/getShare")
  async getShare(@Query() getShareQueryProperties: getShareQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordHashResult = await this.appService.loginWithPasswordHash(getShareQueryProperties.email, getShareQueryProperties.hashedPassword);
      if (loginWithPasswordHashResult.success) {
        var getShareResult = await this.appService.getShare(getShareQueryProperties.shareID);
        resolve(getShareResult);
      } else {
        resolve(loginWithPasswordHashResult);
      }
    }.bind(this));
  }

  @Get("/getPriceOfShare")
  async getPriceOfShare(@Query() getPriceOfShareQueryProperties: getPriceOfShareQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordHashResult = await this.appService.loginWithPasswordHash(getPriceOfShareQueryProperties.email, getPriceOfShareQueryProperties.hashedPassword);
      if (loginWithPasswordHashResult.success) {
        var getPriceOfShareServiceResult = await this.appService.getPriceOfShareService(getPriceOfShareQueryProperties.shareID);
        resolve(getPriceOfShareServiceResult);
      } else {
        resolve(loginWithPasswordHashResult);
      }
    }.bind(this));
  }

  @Get("/getPriceDevelopmentOfShare")
  async getPriceDevelopmentOfShare(@Query() getPriceDevlopmentOfShareQueryProperties: getPriceDevlopmentOfShareQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordHashResult = await this.appService.loginWithPasswordHash(getPriceDevlopmentOfShareQueryProperties.email, getPriceDevlopmentOfShareQueryProperties.hashedPassword);
      if (loginWithPasswordHashResult.success) {

        var getPriceDevelopmentOfShareResult = await this.appService.getPriceDevelopmentOfShareService(getPriceDevlopmentOfShareQueryProperties.shareID, getPriceDevlopmentOfShareQueryProperties.from, getPriceDevlopmentOfShareQueryProperties.until);
        resolve(getPriceDevelopmentOfShareResult);

      } else {
        resolve(loginWithPasswordHashResult);
      }
    }.bind(this));
  }

  @Get("/getDepotValues")
  async getDepotValues(@Query() getDepotValuesQueryProperties: getDepotValuesQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordHashResult = await this.appService.loginWithPasswordHash(getDepotValuesQueryProperties.email, getDepotValuesQueryProperties.hashedPassword);
      if (loginWithPasswordHashResult.success) {


        var getDepotValuesResult = await this.appService.getAllOwnedWertpapiereFromDatabase(loginWithPasswordHashResult.additionalInfo.NutzerID, getDepotValuesQueryProperties.depotID);
        
        var getAllSharesServiceResult = await this.appService.getAllSharesService();
        
        if(getAllSharesServiceResult.success){
          var totalDepotValue = 0;
          var totalDepotBuyPrices = 0;
  
          for(var i = 0; i<getDepotValuesResult.data.length; i++){

            var thisPositionBoersenData = getAllSharesServiceResult.data.find(x => x.id === getDepotValuesResult.data[i].ISIN);
            getDepotValuesResult.data[i].name = thisPositionBoersenData.name;
            getDepotValuesResult.data[i].currentValuePerPosition = thisPositionBoersenData.price;
            getDepotValuesResult.data[i].currentTotalValue = Number(thisPositionBoersenData.price) * getDepotValuesResult.data[i].count;
            getDepotValuesResult.data[i].currentGain = getDepotValuesResult.data[i].currentTotalValue - getDepotValuesResult.data[i].totalKaufpreis;
            getDepotValuesResult.data[i].currentGainPercent = (getDepotValuesResult.data[i].currentTotalValue - getDepotValuesResult.data[i].totalKaufpreis)/getDepotValuesResult.data[i].totalKaufpreis;
            getDepotValuesResult.data[i].thumbnail = thisPositionBoersenData.thumbnail;
            totalDepotValue += Number(thisPositionBoersenData.price) * getDepotValuesResult.data[i].count;
  
            totalDepotBuyPrices += getDepotValuesResult.data[i].totalKaufpreis;
          }
          
          resolve({success: true, message: "Depot values obtained", data: { balance: totalDepotValue, positions: getDepotValuesResult.data } });  
        }else{
          resolve(getAllSharesServiceResult);
        }

      } else {
        resolve(loginWithPasswordHashResult);
      }
    }.bind(this));
  }

  @Post("/buyOrder")
  async buyOrderHandler(@Query() buyOrderQueryProperties: buyOrderQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordHashResult = await this.appService.loginWithPasswordHash(buyOrderQueryProperties.email, buyOrderQueryProperties.hashedPassword);
      if (loginWithPasswordHashResult.success) {
        //Check if market is open
        var marketIsOpenResult = await this.appService.checkIfMarketIsOpen();
        if(marketIsOpenResult.success){
          //Check if the amount is under the maximum allowed amount
          var checkAmountResult = await this.appService.checkAmount(buyOrderQueryProperties.amount);
          if(checkAmountResult.success){

            var getPriceOfShareServiceResult = await this.appService.getPriceOfShareService(buyOrderQueryProperties.shareID);
   
              switch(buyOrderQueryProperties.type) { 
                case "Market": {
                  //Check if there is enough money on the account to execute the transaction 
                  var checkIfEnoughMoneyOnAccountResult = await this.appService.checkIfEnoughMoneyOnAccount(buyOrderQueryProperties.amount, getPriceOfShareServiceResult.data, loginWithPasswordHashResult.additionalInfo.NutzerID);
                  if(checkIfEnoughMoneyOnAccountResult.success){
                    //Place the order
                    var buyMarketOrderResult = await this.appService.buyMarketOrder(buyOrderQueryProperties.shareID, buyOrderQueryProperties.amount);
                    if(buyMarketOrderResult.success){
                      //Execute the transaction on the database
                      var createTransactionResult = await this.appService.createTransactionAsAdmin(loginWithPasswordHashResult.additionalInfo.NutzerID, "Aktienkauf: " +  buyOrderQueryProperties.shareID, -checkIfEnoughMoneyOnAccountResult.additionalInfo.totalTransactionValue, buyOrderQueryProperties.depotID)
                      
                      if(createTransactionResult.success){
                        //Create an order in the database
                        var createOrderInDatabaseResult = await this.appService.createOrderInDatabase(buyOrderQueryProperties.depotID, createTransactionResult.additionalInfo.insertId, buyMarketOrderResult.data.id, 1, buyOrderQueryProperties.shareID, 2, buyOrderQueryProperties.amount)
                        resolve(createOrderInDatabaseResult);

                      }else{
                        resolve(createTransactionResult);
                      }

                    }else{
                      resolve(buyMarketOrderResult);
                    }
                  }else {
                    resolve(checkIfEnoughMoneyOnAccountResult);
                  }
                  break; 
                } 
                case "Stop Market": { 
                  //Check if there is enough money on the account to execute the transaction 
                  var checkIfEnoughMoneyOnAccountResult = await this.appService.checkIfEnoughMoneyOnAccount(buyOrderQueryProperties.amount, buyOrderQueryProperties.stop, loginWithPasswordHashResult.additionalInfo.NutzerID);
                  if(checkIfEnoughMoneyOnAccountResult.success){
                    //Place the order
                    var buyStopMarketOrderResult = await this.appService.buyStopMarketOrder(buyOrderQueryProperties.shareID, buyOrderQueryProperties.amount, buyOrderQueryProperties.stop);
                    
                    if(buyStopMarketOrderResult.success){
                      //Execute the transaction on the database
                      var createTransactionResult = await this.appService.createTransactionAsAdmin(loginWithPasswordHashResult.additionalInfo.NutzerID, "Aktienkauf: " +  buyOrderQueryProperties.shareID, -checkIfEnoughMoneyOnAccountResult.additionalInfo.totalTransactionValue, buyOrderQueryProperties.depotID)
                      
                      if(createTransactionResult.success){
                        //Create an order in the database
                        var createOrderInDatabaseResult = await this.appService.createOrderInDatabase(buyOrderQueryProperties.depotID, createTransactionResult.additionalInfo.insertId, buyStopMarketOrderResult.data.id, 1, buyOrderQueryProperties.shareID, 2, buyOrderQueryProperties.amount)
                        resolve(createOrderInDatabaseResult);

                      }else{
                        resolve(createTransactionResult);
                      }

                    }else{
                      resolve(buyStopMarketOrderResult);
                    }
                  }else {
                    resolve(checkIfEnoughMoneyOnAccountResult);
                  }
                  break;                   
                } 
                case "Limit": { 
                  //Check if there is enough money on the account to execute the transaction 
                  var checkIfEnoughMoneyOnAccountResult = await this.appService.checkIfEnoughMoneyOnAccount(buyOrderQueryProperties.amount, buyOrderQueryProperties.limit, loginWithPasswordHashResult.additionalInfo.NutzerID);
                  if(checkIfEnoughMoneyOnAccountResult.success){
                    //Place the order
                    var buyLimitOrderResult = await this.appService.buyLimitOrder(buyOrderQueryProperties.shareID, buyOrderQueryProperties.amount, buyOrderQueryProperties.limit);
                    
                    if(buyLimitOrderResult.success){
                      //Execute the transaction on the database
                      var createTransactionResult = await this.appService.createTransactionAsAdmin(loginWithPasswordHashResult.additionalInfo.NutzerID, "Aktienkauf: " +  buyOrderQueryProperties.shareID, -checkIfEnoughMoneyOnAccountResult.additionalInfo.totalTransactionValue, buyOrderQueryProperties.depotID)
                      
                      if(createTransactionResult.success){
                        //Create an order in the database
                        var createOrderInDatabaseResult = await this.appService.createOrderInDatabase(buyOrderQueryProperties.depotID, createTransactionResult.additionalInfo.insertId, buyLimitOrderResult.data.id, 1, buyOrderQueryProperties.shareID, 2, buyOrderQueryProperties.amount)
                        resolve(createOrderInDatabaseResult);

                      }else{
                        resolve(createTransactionResult);
                      }

                    }else{
                      resolve(buyLimitOrderResult);
                    }
                  }else {
                    resolve(checkIfEnoughMoneyOnAccountResult);
                  }
                  break;                        
                } 
                case "Stop Limit": {
                  //Check if there is enough money on the account to execute the transaction 
                  var checkIfEnoughMoneyOnAccountResult = await this.appService.checkIfEnoughMoneyOnAccount(buyOrderQueryProperties.amount, buyOrderQueryProperties.stop, loginWithPasswordHashResult.additionalInfo.NutzerID);
                  if(checkIfEnoughMoneyOnAccountResult.success){
                    //Place the order
                    var buyStopLimitOrderResult = await this.appService.buyStopLimitOrder(buyOrderQueryProperties.shareID, buyOrderQueryProperties.amount, buyOrderQueryProperties.limit, buyOrderQueryProperties.stop);
                    
                    if(buyStopLimitOrderResult.success){
                      //Execute the transaction on the database
                      var createTransactionResult = await this.appService.createTransactionAsAdmin(loginWithPasswordHashResult.additionalInfo.NutzerID, "Aktienkauf: " +  buyOrderQueryProperties.shareID, -checkIfEnoughMoneyOnAccountResult.additionalInfo.totalTransactionValue, buyOrderQueryProperties.depotID)
                      
                      if(createTransactionResult.success){
                        //Create an order in the database
                        var createOrderInDatabaseResult = await this.appService.createOrderInDatabase(buyOrderQueryProperties.depotID, createTransactionResult.additionalInfo.insertId, buyStopLimitOrderResult.data.id, 1, buyOrderQueryProperties.shareID, 2, buyOrderQueryProperties.amount)
                        resolve(createOrderInDatabaseResult);

                      }else{
                        resolve(createTransactionResult);
                      }

                    }else{
                      resolve(buyStopLimitOrderResult);
                    }
                  }else {
                    resolve(checkIfEnoughMoneyOnAccountResult);
                  }
                  break;                     
                } 
                default: { 
                  resolve({success: false, message: "Please specify the type of buy order you'd like to place"});
                  break; 
                } 
              }
          }else{
            resolve(checkAmountResult);
          }
        }else {
          resolve(marketIsOpenResult);
        }
      } else {
        resolve(loginWithPasswordHashResult);
      }
    }.bind(this));
  }

  @Post("/sellOrder")
  async sellOrderHandler(@Query() sellOrderQueryProperties: sellOrderQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordHashResult = await this.appService.loginWithPasswordHash(sellOrderQueryProperties.email, sellOrderQueryProperties.hashedPassword);
      if (loginWithPasswordHashResult.success) {
        var getNutzerResult = await this.appService.getNutzer(loginWithPasswordHashResult.additionalInfo.NutzerID);
        if(!getNutzerResult.success){
          resolve(getNutzerResult)
        }
        //Check if market is open
        var marketIsOpenResult = await this.appService.checkIfMarketIsOpen();
        if(marketIsOpenResult.success){
          //Check if the amount is under the maximum allowed amount
          var checkAmountResult = await this.appService.checkAmount(sellOrderQueryProperties.amount);
          if(checkAmountResult.success){
              //Check if enough shares are in the depot
            var checkIfDepotHasEnoughSharesResult = await this.appService.checkIfDepotHasEnoughShares(sellOrderQueryProperties.amount, sellOrderQueryProperties.shareID, loginWithPasswordHashResult.additionalInfo.NutzerID, sellOrderQueryProperties.depotID);
           
            if(checkIfDepotHasEnoughSharesResult.success){
              switch(sellOrderQueryProperties.type) { 
                case "Market": {
                  //Place the order
                  var sellMarketOrderResult = await this.appService.sellMarketOrder(sellOrderQueryProperties.shareID, sellOrderQueryProperties.amount);
                    if(sellMarketOrderResult.success){
                      //Set blocked status for shares
                      var setBlockedStatusForSharesResult = await this.appService.setBlockedStatusForShares(sellOrderQueryProperties.depotID, sellOrderQueryProperties.shareID, sellOrderQueryProperties.amount, 1)
                     
                      if(setBlockedStatusForSharesResult.success){
                        //Execute the transaction on the database
                        var createTransactionResult = await this.appService.createTransactionAsAdmin(loginWithPasswordHashResult.additionalInfo.NutzerID, "Aktienverkauf: " +  sellOrderQueryProperties.shareID, 0, getNutzerResult.data.VerrechnungskontoIBAN)
                        
                        if(createTransactionResult.success){
                          //Create an order in the database
                          var createOrderInDatabaseResult = await this.appService.createOrderInDatabase(sellOrderQueryProperties.depotID, createTransactionResult.additionalInfo.insertId, sellMarketOrderResult.data.id, 1, sellOrderQueryProperties.shareID, 1, sellOrderQueryProperties.amount)
                          resolve(createOrderInDatabaseResult);
                        }else{
                          resolve(createTransactionResult);
                        }
                      }else{
                        resolve(setBlockedStatusForSharesResult);
                      }
                    }else{
                      resolve(sellMarketOrderResult);
                    }                 
                  break; 
                } 
                case "Stop Market": { 
                  //Place the order
                  var sellStopMarketOrderResult = await this.appService.sellStopMarketOrder(sellOrderQueryProperties.shareID, sellOrderQueryProperties.amount, sellOrderQueryProperties.stop);
                    if(sellStopMarketOrderResult.success){
                      //Set blocked status for shares
                      var setBlockedStatusForSharesResult = await this.appService.setBlockedStatusForShares(sellOrderQueryProperties.depotID, sellOrderQueryProperties.shareID, sellOrderQueryProperties.amount, 1)
                      
                      if(setBlockedStatusForSharesResult.success){
                        //Execute the transaction on the database
                        var createTransactionResult = await this.appService.createTransactionAsAdmin(loginWithPasswordHashResult.additionalInfo.NutzerID, "Aktienverkauf: " +  sellOrderQueryProperties.shareID, 0, getNutzerResult.data.VerrechnungskontoIBAN)
                        
                        if(createTransactionResult.success){
                          //Create an order in the database
                          var createOrderInDatabaseResult = await this.appService.createOrderInDatabase(sellOrderQueryProperties.depotID, createTransactionResult.additionalInfo.insertId, sellStopMarketOrderResult.data.id, 1, sellOrderQueryProperties.shareID, 1, sellOrderQueryProperties.amount)
                          resolve(createOrderInDatabaseResult);
                        }else{
                          resolve(createTransactionResult);
                        }
                      }else{
                        resolve(setBlockedStatusForSharesResult);
                      }
                    }else{
                      resolve(sellStopMarketOrderResult);
                    }                 
                  break;                   
                } 
                case "Limit": { 
                  //Place the order
                  var sellLimitOrderResult = await this.appService.sellLimitOrder(sellOrderQueryProperties.shareID, sellOrderQueryProperties.amount, sellOrderQueryProperties.limit);
                    if(sellLimitOrderResult.success){                                       
                      //Set blocked status for shares
                      var setBlockedStatusForSharesResult = await this.appService.setBlockedStatusForShares(sellOrderQueryProperties.depotID, sellOrderQueryProperties.shareID, sellOrderQueryProperties.amount, 1)
                      
                      if(setBlockedStatusForSharesResult.success){
                        //Execute the transaction on the database
                        var createTransactionResult = await this.appService.createTransactionAsAdmin(loginWithPasswordHashResult.additionalInfo.NutzerID, "Aktienverkauf: " +  sellOrderQueryProperties.shareID, 0, getNutzerResult.data.VerrechnungskontoIBAN)
                        
                        if(createTransactionResult.success){
                          //Create an order in the database
                          var createOrderInDatabaseResult = await this.appService.createOrderInDatabase(sellOrderQueryProperties.depotID, createTransactionResult.additionalInfo.insertId, sellLimitOrderResult.data.id, 1, sellOrderQueryProperties.shareID, 1, sellOrderQueryProperties.amount)
                          resolve(createOrderInDatabaseResult);
                        }else{
                          resolve(createTransactionResult);
                        }
                      }else{
                        resolve(setBlockedStatusForSharesResult);
                      }
                    }else{
                      resolve(sellLimitOrderResult);
                    }                 
                  break;                        
                } 
                case "Stop Limit": { 
                  //Place the order
                  var sellStopLimitOrderResult = await this.appService.sellStopLimitOrder(sellOrderQueryProperties.shareID, sellOrderQueryProperties.amount, sellOrderQueryProperties.limit, sellOrderQueryProperties.limit);
                    if(sellStopLimitOrderResult.success){
                      //Set blocked status for shares
                      var setBlockedStatusForSharesResult = await this.appService.setBlockedStatusForShares(sellOrderQueryProperties.depotID, sellOrderQueryProperties.shareID, sellOrderQueryProperties.amount, 1)
                      
                      if(setBlockedStatusForSharesResult.success){
                        //Execute the transaction on the database
                        var createTransactionResult = await this.appService.createTransactionAsAdmin(loginWithPasswordHashResult.additionalInfo.NutzerID, "Aktienverkauf: " +  sellOrderQueryProperties.shareID, 0, getNutzerResult.data.VerrechnungskontoIBAN)
                        
                        if(createTransactionResult.success){
                          //Create an order in the database
                          var createOrderInDatabaseResult = await this.appService.createOrderInDatabase(sellOrderQueryProperties.depotID, createTransactionResult.additionalInfo.insertId, sellStopLimitOrderResult.data.id, 1, sellOrderQueryProperties.shareID, 1, sellOrderQueryProperties.amount)
                          resolve(createOrderInDatabaseResult);
                        }else{
                          resolve(createTransactionResult);
                        }
                      }else{
                        resolve(setBlockedStatusForSharesResult);
                      }
                    }else{
                      resolve(sellStopLimitOrderResult);
                    }                     
                  break; 
                } 
                default: { 
                  resolve({success: false, message: "Please specify the type of sell order you'd like to place"});
                  break; 
                } 
              }
            }else{
              resolve(checkIfDepotHasEnoughSharesResult);
            }
          }else{
            resolve(checkAmountResult);
          }
        }else {
          resolve(marketIsOpenResult);
        }
      } else {
        resolve(loginWithPasswordHashResult);
      }
    }.bind(this));
  }

  @Get("/checkIfMarketIsOpen")
  async checkIfMarketIsOpen(@Query() checkIfMarketIsOpenQueryProperties: checkIfMarketIsOpenQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordHashResult = await this.appService.loginWithPasswordHash(checkIfMarketIsOpenQueryProperties.email, checkIfMarketIsOpenQueryProperties.hashedPassword);
      if (loginWithPasswordHashResult.success) {

        var checkIfMarketIsOpenResult = await this.appService.checkIfMarketIsOpen();
        resolve(checkIfMarketIsOpenResult);

      } else {
        resolve(loginWithPasswordHashResult);
      }
    }.bind(this));
  }

  @Post("/webhook/onPlace")
  async webhookOnPlace(@Query() webhookOnPlaceQueryProperties: webhookOnPlaceQueryProperties, @Body() webhookOnPlaceBodyParameter): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      if(this.appService.validateWebhookAuthToken(webhookOnPlaceQueryProperties.webhookAuthToken)) {
        var webhookOnPlaceResult = await this.appService.webhookOnPlace(webhookOnPlaceBodyParameter);
        resolve(JSON.stringify(webhookOnPlaceResult));
      } else {
        resolve({success: false, message: "Wrong webhookAuthToken"});
      }
    }.bind(this));
  }

  @Post("/webhook/onMatch")
  async webhookOnMatch(@Query() webhookOnMatchQueryProperties: webhookOnMatchQueryProperties, @Body() webhookOnMatchBodyParameter): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      if(this.appService.validateWebhookAuthToken(webhookOnMatchQueryProperties.webhookAuthToken)) {
        var webhookOnMatchResult = await this.appService.webhookOnMatch(webhookOnMatchBodyParameter);

        resolve(JSON.stringify(webhookOnMatchResult));
      } else {
        resolve({success: false, message: "Wrong webhookAuthToken"});
      }
    }.bind(this));
  }

  @Post("/webhook/onComplete")
  async webhookOnComplete(@Query() webhookOnCompleteQueryProperties: webhookOnCompleteQueryProperties, @Body() webhookOnCompleteBodyParameter): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      if(this.appService.validateWebhookAuthToken(webhookOnCompleteQueryProperties.webhookAuthToken)) {
        var webhookOnCompleteResult = await this.appService.webhookOnComplete(webhookOnCompleteBodyParameter);

        resolve(JSON.stringify(webhookOnCompleteResult));
      } else {
        resolve({success: false, message: "Wrong webhookAuthToken"});
      }
    }.bind(this));
  }

  @Post("/webhook/onDelete")
  async webhookOnDelete(@Query() webhookOnDeleteQueryProperties: webhookOnDeleteQueryProperties, @Body() webhookOnDeleteBodyParameter): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      if(this.appService.validateWebhookAuthToken(webhookOnDeleteQueryProperties.webhookAuthToken)) {
        var webhookOnDeleteResult = await this.appService.webhookOnDelete(webhookOnDeleteBodyParameter);

        resolve(JSON.stringify(webhookOnDeleteResult));
      } else {
        resolve({success: false, message: "Wrong webhookAuthToken"});
      }
    }.bind(this));
  }

  @Get("/webhook/TEST")
  async testWebhook(@Query() webhookTestProperties: webhookTestProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {

        var _testWebhook = await this.appService._testWebhook(webhookTestProperties.boerseOrderID);
        resolve(JSON.stringify(_testWebhook));

    }.bind(this));
  }
}



