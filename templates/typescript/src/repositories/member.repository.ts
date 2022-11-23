import { Member, Prisma, PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export const MemberRepository = {
  create: (data: Prisma.MemberCreateArgs['data']): Promise<Member> => {
    return client.member.create({ data })
  },
  update: (memberId: string, data: Prisma.MemberUpdateArgs['data']): Promise<Member> => {
    return client.member.update({ where: { memberId }, data })
  },
  upsert: (
    memberId: string,
    data: Omit<Prisma.MemberCreateArgs['data'], 'memberId'>,
  ): Promise<Member> => {
    return client.member.upsert({
      create: { memberId, ...data },
      update: data,
      where: { memberId },
    })
  },
  delete: (memberId: string): Promise<Member> => {
    return client.member.delete({ where: { memberId } })
  },
  findMany: (args?: Prisma.MemberFindManyArgs): Promise<Member[]> => {
    return client.member.findMany(args)
  },
  findUniqueOrThrow: (memberId: string): Promise<Member> => {
    return client.member.findUniqueOrThrow({ where: { memberId } })
  },
  findUnique: (memberId: string): Promise<Member> => {
    return client.member.findUnique({ where: { memberId } })
  },
}
