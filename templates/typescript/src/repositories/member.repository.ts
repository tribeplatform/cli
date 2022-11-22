import { Member, Prisma, PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export const MemberRepository = {
  create: (data: Prisma.MemberCreateArgs['data']): Promise<Member> => {
    return client.member.create({ data })
  },
  update: (memberId: string, data: Prisma.MemberUpdateArgs['data']): Promise<Member> => {
    return client.member.update({ where: { memberId }, data })
  },
  upsert: (data: Prisma.MemberCreateArgs['data']): Promise<Member> => {
    return client.member.upsert({
      create: data,
      update: data,
      where: { memberId: data.memberId },
    })
  },
  delete: (memberId: string): Promise<Member> => {
    return client.member.delete({ where: { memberId } })
  },
  findMany: (): Promise<Member[]> => {
    return client.member.findMany()
  },
  findUniqueOrThrow: (memberId: string): Promise<Member> => {
    return client.member.findUniqueOrThrow({ where: { memberId } })
  },
}
