import { Controller, Get, Post, Delete, Req, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { registerUserQueryProperties, registerUserBodyProperties, loginWithPasswordQueryProperties, loginWithPasswordHashQueryProperties, addInterestToUserQueryProperties, getInterestsOfLoggedInUserQueryProperties, removeInterestFromUserQueryProperties, addContactMethodToUserQueryProperties, getContactMethodsOfLoggedInUserQueryProperties, removeContactMethodFromUserQueryProperties, getListOfMatchingUsersForLoggedInUserQueryProperties } from './app.apiproperties';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

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

  @Get("/loginWithPassword")
  async loginWithPassword(@Query() loginWithPasswordQueryProperties: loginWithPasswordQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordResult = await this.appService.loginWithPassword(loginWithPasswordQueryProperties.email, loginWithPasswordQueryProperties.password);
      resolve(JSON.stringify(loginWithPasswordResult));
    }.bind(this));
  }

  @Get("/loginWithPasswordHash")
  async loginWithPasswordHash(@Query() loginWithPasswordHashQueryProperties: loginWithPasswordHashQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordResult = await this.appService.loginWithPasswordHash(loginWithPasswordHashQueryProperties.email, loginWithPasswordHashQueryProperties.hashedPassword);
      resolve(JSON.stringify(loginWithPasswordResult));
    }.bind(this));
  }

  @Get("/getListOfAvailableInterests")
  async getListOfAvailableInterests(): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var getListOfAvailableInterestsResult = await this.appService.getListOfAvailableInterests();
      resolve(JSON.stringify(getListOfAvailableInterestsResult));
    }.bind(this));
  }

  @Post("/addInterestToUser")
  async addInterestToUser(@Query() addInterestToUserQueryProperties: addInterestToUserQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordResult = await this.appService.loginWithPasswordHash(addInterestToUserQueryProperties.email, addInterestToUserQueryProperties.hashedPassword);

      if (loginWithPasswordResult.success) {
        var addInterestToUserResult = await this.appService.addInterestToUser(loginWithPasswordResult.additionalInfo.PID, addInterestToUserQueryProperties.IID, addInterestToUserQueryProperties.priority);
        resolve(JSON.stringify(addInterestToUserResult));
      } else {
        resolve(loginWithPasswordResult);
      }
    }.bind(this));
  }

  @Get("/getInterestsOfLoggedInUser")
  async getInterestsOfLoggedInUser(@Query() getInterestsOfLoggedInUserQueryProperties: getInterestsOfLoggedInUserQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordResult = await this.appService.loginWithPasswordHash(getInterestsOfLoggedInUserQueryProperties.email, getInterestsOfLoggedInUserQueryProperties.hashedPassword);

      if (loginWithPasswordResult.success) {
        var getInterestsOfLoggedInUserResult = await this.appService.getInterestsOfLoggedInUser(loginWithPasswordResult.additionalInfo.PID);
        resolve(JSON.stringify(getInterestsOfLoggedInUserResult));
      } else {
        resolve(loginWithPasswordResult);
      }
    }.bind(this));
  }

  @Delete("/removeInterestFromUser")
  async removeInterestFromUser(@Query() removeInterestFromUserQueryProperties: removeInterestFromUserQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordResult = await this.appService.loginWithPasswordHash(removeInterestFromUserQueryProperties.email, removeInterestFromUserQueryProperties.hashedPassword);

      if (loginWithPasswordResult.success) {
        var removeInterestFromUserResult = await this.appService.removeInterestFromUser(loginWithPasswordResult.additionalInfo.PID, removeInterestFromUserQueryProperties.IID);
        resolve(JSON.stringify(removeInterestFromUserResult));
      } else {
        resolve(loginWithPasswordResult);
      }
    }.bind(this));
  }

  @Get("/getListOfAvailableContactMethodTypes")
  async getListOfAvailableContactMethodTypes(): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var getListOfAvailableContactMethodTypesResult = await this.appService.getListOfAvailableContactMethodTypes();
      resolve(JSON.stringify(getListOfAvailableContactMethodTypesResult));
    }.bind(this));
  }

  @Post("/addContactMethodToUser")
  async addContactMethodToUser(@Query() addContactMethodToUserQueryProperties: addContactMethodToUserQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordResult = await this.appService.loginWithPasswordHash(addContactMethodToUserQueryProperties.email, addContactMethodToUserQueryProperties.hashedPassword);

      if (loginWithPasswordResult.success) {
        var addContactMethodToUserResult = await this.appService.addContactMethodToUser(loginWithPasswordResult.additionalInfo.PID, addContactMethodToUserQueryProperties.CMTID, addContactMethodToUserQueryProperties.contactDetail);
        resolve(JSON.stringify(addContactMethodToUserResult));
      } else {
        resolve(loginWithPasswordResult);
      }
    }.bind(this));
  }
  

  @Get("/getContactMethodsOfLoggedInUser")
  async getContactMethodsOfLoggedInUser(@Query() getContactMethodsOfLoggedInUserQueryProperties: getContactMethodsOfLoggedInUserQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordResult = await this.appService.loginWithPasswordHash(getContactMethodsOfLoggedInUserQueryProperties.email, getContactMethodsOfLoggedInUserQueryProperties.hashedPassword);

      if (loginWithPasswordResult.success) {
        var getContactMethodsOfLoggedInUserResult = await this.appService.getContactMethodsOfLoggedInUser(loginWithPasswordResult.additionalInfo.PID);
        resolve(JSON.stringify(getContactMethodsOfLoggedInUserResult));
      } else {
        resolve(loginWithPasswordResult);
      }
    }.bind(this));
  }

  @Delete("/removeContactMethodFromUser")
  async removeContactMethodFromUser(@Query() removeContactMethodFromUserQueryProperties: removeContactMethodFromUserQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordResult = await this.appService.loginWithPasswordHash(removeContactMethodFromUserQueryProperties.email, removeContactMethodFromUserQueryProperties.hashedPassword);

      if (loginWithPasswordResult.success) {
        var removeContactMethodFromUserResult = await this.appService.removeContactMethodFromUser(loginWithPasswordResult.additionalInfo.PID, removeContactMethodFromUserQueryProperties.CMID);
        resolve(JSON.stringify(removeContactMethodFromUserResult));
      } else {
        resolve(loginWithPasswordResult);
      }
    }.bind(this));
  }

  @Get("/getListOfMatchingUsersForLoggedInUser")
  async getListOfMatchingUsersForLoggedInUser(@Query() getListOfMatchingUsersForLoggedInUserQueryProperties: getListOfMatchingUsersForLoggedInUserQueryProperties): Promise<string> {
    return new Promise<string>(async function (resolve, reject) {
      var loginWithPasswordResult = await this.appService.loginWithPasswordHash(getListOfMatchingUsersForLoggedInUserQueryProperties.email, getListOfMatchingUsersForLoggedInUserQueryProperties.hashedPassword);

      if (loginWithPasswordResult.success) {
        var getListOfMatchingUsersForLoggedInUserResult = await this.appService.getListOfMatchingUsersForLoggedInUser(loginWithPasswordResult.additionalInfo.PID);
        resolve(JSON.stringify(getListOfMatchingUsersForLoggedInUserResult));
      } else {
        resolve(loginWithPasswordResult);
      }
    }.bind(this));
  }
  
}
