import { ErrorCode, WebhookType } from '@enums'
import { IsEnum, IsOptional, IsString } from 'class-validator'

import { WebhookStatus } from '../enums/webhook-status.enum'

export class WebhookResponseDto<T = unknown> {
  @IsEnum(WebhookType)
  type: WebhookType

  @IsEnum(WebhookStatus)
  status: WebhookStatus

  @IsOptional()
  data?: T

  @IsOptional()
  @IsEnum(ErrorCode)
  errorCode?: ErrorCode

  @IsOptional()
  @IsString()
  errorMessage?: string
}
