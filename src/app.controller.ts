import { Controller, Get, Post, Put, Delete, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { registerUserQueryProperties, loginWithPasswordQueryProperties, loginWithPasswordHashQueryProperties, updateAdressDataQueryProperties, updatePasswordOfUserQueryProperties, getBalanceAndLastTransactionsOfVerrechnungskontoQueryProperties } from './app.apiproperties';


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
      var loginWithPasswordResult = await this.appService.loginWithPasswordHash(updatePasswordOfUserQueryProperties.email, updatePasswordOfUserQueryProperties.hashedPassword);

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
  
}
