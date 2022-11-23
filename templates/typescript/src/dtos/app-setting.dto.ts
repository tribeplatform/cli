import { CustomSettings } from '@interfaces'
import { PermissionContext } from '@tribeplatform/gql-client/types'
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

  @IsEnum(PermissionContext)
  context: PermissionContext

  @IsString()
  @MaxLength(100)
  entityId: string

  settings: CustomSettings
}
