import { IsEnum, IsOptional, IsString } from 'class-validator'

import { ErrorCodes, WebhookType } from '@enums'
import { WebhookStatus } from '../enums/webhook-status.enum'

export class WebhookResponseDto {
  @IsEnum(WebhookType)
  type: WebhookType

  @IsEnum(WebhookStatus)
  status: WebhookStatus

  @IsOptional()
  data?: any

  @IsOptional()
  @IsEnum(ErrorCodes)
  errorCode?: ErrorCodes

  @IsOptional()
  @IsString()
  errorMessage?: string
}
