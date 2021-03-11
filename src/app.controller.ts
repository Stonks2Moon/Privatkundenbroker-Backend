import { Controller, Get, Post, Put, Delete, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { registerUserQueryProperties, loginWithPasswordQueryProperties, loginWithPasswordHashQueryProperties, getNutzerQueryProperties } from './app.apiproperties';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/registerUser")
  async registerUser(@Query() registerUserProperties: registerUserQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var createNutzerResult = await this.appService.createNutzer(registerUserProperties.email, registerUserProperties.password, registerUserProperties.firstName, registerUserProperties.lastName);

      if (createNutzerResult.success) {
        var createAddresseResult = await this.appService.createAdresse(createNutzerResult.additionalInfo.PID, registerUserProperties.strasse, registerUserProperties.hausnummer, registerUserProperties.postleitzahl, registerUserProperties.ort)
        createNutzerResult.additionalInfo.createAddressResult = createAddresseResult;
        resolve(JSON.stringify(createNutzerResult));
      } else {
        resolve(JSON.stringify(createNutzerResult));
      }
    }.bind(this));
  }

  @Get("/getUser")
  async getUser(@Query() getNutzerProperties: getNutzerQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var getNutzerResult = await this.appService.getNutzer(getNutzerProperties.nutzerID);

      resolve(JSON.stringify(getNutzerResult));
    }.bind(this));
  }

}
