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
      var createPersonResult = await this.appService.createPerson(registerUserProperties.firstName, registerUserProperties.lastName, registerUserProperties.gender, registerUserProperties.birthday);

      if (createPersonResult.success) {
        var createUserResult = await this.appService.createUser(createPersonResult.additionalInfo.PID, registerUserProperties.email, registerUserProperties.password)
        resolve(JSON.stringify(createUserResult));
      } else {
        resolve(JSON.stringify(createPersonResult));
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
