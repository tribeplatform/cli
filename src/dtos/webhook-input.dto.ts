import { WebhookContext, WebhookType } from '@enums'
import { Type } from 'class-transformer'
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator'
import { WebhookSettingDto } from './webhook-setting.dto'

export class WebhookInputDto<P = unknown> {
  @IsEnum(WebhookType)
  type: WebhookType

  @IsString()
  networkId: string

  @IsEnum(WebhookContext)
  context: WebhookContext

  @IsOptional()
  @IsString()
  entityId?: string

  @IsArray()
  @Type(() => WebhookSettingDto)
  @ValidateNested({ each: true })
  currentSettings: WebhookSettingDto[]

  @IsOptional()
  data?: P
}
