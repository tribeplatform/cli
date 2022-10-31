import { WebhookContext } from '@enums'
import { CustomSettings } from '@interfaces'
import { IsEnum, IsString, MaxLength } from 'class-validator'

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

  settings: CustomSettings
}
