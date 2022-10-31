import { WebhookContext } from '@enums'
import { Type } from 'class-transformer'
import { IsEnum, IsString, MaxLength } from 'class-validator'

class AppContextSettingDto {
  [key: string]: string
}

export class AppSettingDto {
  @IsString()
  @MaxLength(50)
  id: string

  @IsString()
  @MaxLength(50)
  appId: string

  @IsString()
  @MaxLength(50)
  networkId: string

  @IsEnum(WebhookContext)
  context: WebhookContext

  @IsString()
  @MaxLength(100)
  entityId: string

  @Type(() => AppContextSettingDto)
  settings: AppContextSettingDto
}
