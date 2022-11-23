import { WebhookType } from '@enums'
import { BaseWebhook } from '@interfaces'
import { PermissionContext } from '@tribeplatform/gql-client/types'
import { Type } from 'class-transformer'
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator'

import { AppSettingDto } from './app-setting.dto'

export class WebhookDto<T = unknown> implements BaseWebhook {
  @IsEnum(WebhookType)
  type: WebhookType

  @IsString()
  networkId: string

  @IsEnum(PermissionContext)
  context: PermissionContext

  @IsOptional()
  @IsString()
  entityId?: string

  @IsArray()
  @Type(() => AppSettingDto)
  @ValidateNested({ each: true })
  currentSettings: AppSettingDto[]

  @IsOptional()
  data?: T
}
