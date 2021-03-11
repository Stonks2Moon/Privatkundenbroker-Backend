import { Controller, Get, Post, Put, Delete, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { registerUserQueryProperties, loginWithPasswordQueryProperties, loginWithPasswordHashQueryProperties} from './app.apiproperties';


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
        var createAddresseResult = await this.appService.createAdresse(createNutzerResult.additionalInfo.PID, registerUserProperties.strasse, registerUserProperties.hausnummer, registerUserProperties.postleitzahl, registerUserProperties.ort)
        createNutzerResult.additionalInfo.createAddressResult = createAddresseResult;
        if (createAddresseResult.success) {
          var createDepotResult = await this.appService.createDepot(createNutzerResult.additionalInfo.PID)
          if (createDepotResult.success) {
            createNutzerResult.additionalInfo.createDepotResult = createDepotResult;
            resolve(JSON.stringify(createNutzerResult));
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
}
