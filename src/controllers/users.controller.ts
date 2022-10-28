import { CreateUserDto } from '@dtos'
import { User } from '@interfaces'
import { UserService } from '@logics'
import { validationMiddleware } from '@middlewares'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseBefore,
} from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'

@Controller()
export class UsersController {
  public userService = new UserService()

  @Get('/users')
  @OpenAPI({ summary: 'Return a list of users' })
  async getUsers() {
    const findAllUsersData: User[] = await this.userService.findAllUser()
    return { data: findAllUsersData, message: 'findAll' }
  }

  @Get('/users/:id')
  @OpenAPI({ summary: 'Return find a user' })
  async getUserById(@Param('id') userId: number) {
    const findOneUserData: User = await this.userService.findUserById(userId)
    return { data: findOneUserData, message: 'findOne' }
  }

  @Post('/users')
  @HttpCode(201)
  @UseBefore(validationMiddleware(CreateUserDto, 'body'))
  @OpenAPI({ summary: 'Create a new user' })
  async createUser(@Body() userData: CreateUserDto) {
    const createUserData: User = await this.userService.createUser(userData)
    return { data: createUserData, message: 'created' }
  }

  @Put('/users/:id')
  @UseBefore(validationMiddleware(CreateUserDto, 'body', true))
  @OpenAPI({ summary: 'Update a user' })
  async updateUser(@Param('id') userId: number, @Body() userData: CreateUserDto) {
    const updateUserData: User[] = await this.userService.updateUser(userId, userData)
    return { data: updateUserData, message: 'updated' }
  }

  @Delete('/users/:id')
  @OpenAPI({ summary: 'Delete a user' })
  async deleteUser(@Param('id') userId: number) {
    const deleteUserData: User[] = await this.userService.deleteUser(userId)
    return { data: deleteUserData, message: 'deleted' }
  }
}
