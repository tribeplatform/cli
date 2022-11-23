import { MemberPostSettings, Prisma, PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export const MemberPostSettingsRepository = {
  create: (
    data: Prisma.MemberPostSettingsCreateArgs['data'],
  ): Promise<MemberPostSettings> => {
    return client.memberPostSettings.create({ data })
  },
  update: (
    memberId: string,
    postId: string,
    data: Prisma.MemberPostSettingsUpdateArgs['data'],
  ): Promise<MemberPostSettings> => {
    return client.memberPostSettings.update({
      where: { memberPost: { memberId, postId } },
      data,
    })
  },
  upsert: (
    memberId: string,
    postId: string,
    data: Omit<Prisma.MemberPostSettingsCreateArgs['data'], 'memberId' | 'postId'>,
  ): Promise<MemberPostSettings> => {
    return client.memberPostSettings.upsert({
      create: { memberId, postId, ...data },
      update: data,
      where: { memberPost: { memberId, postId } },
    })
  },
  delete: (memberId: string, postId: string): Promise<MemberPostSettings> => {
    return client.memberPostSettings.delete({
      where: { memberPost: { memberId, postId } },
    })
  },
  findMany: (
    args?: Prisma.MemberPostSettingsFindManyArgs,
  ): Promise<MemberPostSettings[]> => {
    return client.memberPostSettings.findMany(args)
  },
  findUniqueOrThrow: (memberId: string, postId: string): Promise<MemberPostSettings> => {
    return client.memberPostSettings.findUniqueOrThrow({
      where: { memberPost: { memberId, postId } },
    })
  },
  findUnique: (memberId: string, postId: string): Promise<MemberPostSettings> => {
    return client.memberPostSettings.findUnique({
      where: { memberPost: { memberId, postId } },
    })
  },
}
