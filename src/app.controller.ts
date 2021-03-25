import { Controller, Get, Post, Put, Delete, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { registerUserQueryProperties, loginWithPasswordQueryProperties, loginWithPasswordHashQueryProperties, 
  updateAdressDataQueryProperties, updatePasswordOfUserQueryProperties, getBalanceAndLastTransactionsOfVerrechnungskontoQueryProperties, 
  createTransactionAsAdminQueryProperties, getAllSharesQueryProperties, getPriceOfShareQueryProperties, getPriceDevlopmentOfShareQueryProperties } from './app.apiproperties';
import { ShareManager } from "moonstonks-boersenapi";


const https =  require('https');





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

  //COMMUNICATION WITH BÖRSE-API

  @Get("/getAllShares")
  async getAllShares(@Query() getAllSharesQueryProperties: getAllSharesQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordHashResult = await this.appService.loginWithPasswordHash(getAllSharesQueryProperties.email, getAllSharesQueryProperties.hashedPassword);
      if (loginWithPasswordHashResult.success) {

        var response = await ShareManager.getShares()
        .then((res)=>JSON.stringify({ success: true, message: "All shares successfully retrieved", data: res}))
        .catch((err)=>JSON.stringify({ success: false, message: "Failed to retrieve the shares", additionalInfo: err})); 

        resolve(response);

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

        var response = await ShareManager.getPrice(getPriceOfShareQueryProperties.shareID)
        .then((res)=>JSON.stringify({ success: true, message: "Price for share successfully retrieved", data: res}))
        .catch((err)=>JSON.stringify({ success: false, message: "Failed to retrieve the price of the share", additionalInfo: err})); 

        resolve(response);

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


        var response = await ShareManager.getPricesFromUntil(getPriceDevlopmentOfShareQueryProperties.shareID, getPriceDevlopmentOfShareQueryProperties.from, getPriceDevlopmentOfShareQueryProperties.until)
        .then((res)=>JSON.stringify({ success: true, message: "Price development for share successfully retrieved", data: res}))
        .catch((err)=>JSON.stringify({ success: false, message: "Failed to retrieve the price development of the share", additionalInfo: err})); 

        resolve(response);

      } else {
        resolve(loginWithPasswordHashResult);
      }
    }.bind(this));
  }
}
