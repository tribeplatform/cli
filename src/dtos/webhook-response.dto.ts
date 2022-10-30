import { IsEnum, IsOptional, IsString } from 'class-validator'

import { ErrorCodes, WebhookType } from '@enums'
import { WebhookStatus } from '../enums/webhook-status.enum'

export class WebhookResponseDto<P = unknown> {
  @IsEnum(WebhookType)
  type: WebhookType

  @IsEnum(WebhookStatus)
  status: WebhookStatus

  @IsOptional()
  data?: P

  @IsOptional()
  @IsEnum(ErrorCodes)
  errorCode?: ErrorCodes

  @IsOptional()
  @IsString()
  errorMessage?: string
}
