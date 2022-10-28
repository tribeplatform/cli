import { WebhookContext } from '@enums'
import { Type } from 'class-transformer'
import { IsEnum, IsString, MaxLength } from 'class-validator'
import { WebhookContextSettingDto } from './webhook-context-setting.dto'

export class WebhookSettingDto {
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

  @Type(() => WebhookContextSettingDto)
  settings: WebhookContextSettingDto
}
