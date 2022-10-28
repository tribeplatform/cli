import { AuthService } from '@/logics'
import { CreateUserDto } from '@dtos'
import { RequestWithUser, User } from '@interfaces'
import { authMiddleware, validationMiddleware } from '@middlewares'
import { Response } from 'express'
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseBefore,
} from 'routing-controllers'

@Controller()
export class AuthController {
  public authService = new AuthService()

  @Post('/signup')
  @UseBefore(validationMiddleware(CreateUserDto, 'body'))
  @HttpCode(201)
  async signUp(@Body() userData: CreateUserDto) {
    const signUpUserData: User = await this.authService.signup(userData)
    return { data: signUpUserData, message: 'signup' }
  }

  @Post('/login')
  @UseBefore(validationMiddleware(CreateUserDto, 'body'))
  async logIn(@Res() res: Response, @Body() userData: CreateUserDto) {
    const { cookie, findUser } = await this.authService.login(userData)

    res.setHeader('Set-Cookie', [cookie])
    return { data: findUser, message: 'login' }
  }

  @Post('/logout')
  @UseBefore(authMiddleware)
  async logOut(@Req() req: RequestWithUser, @Res() res: Response) {
    const userData: User = req.user
    const logOutUserData: User = await this.authService.logout(userData)

    res.setHeader('Set-Cookie', ['Authorization=; Max-age=0'])
    return { data: logOutUserData, message: 'logout' }
  }
}
