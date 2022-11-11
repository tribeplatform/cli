import { Member, PrismaClient } from '@prisma/client'

const client = new PrismaClient()

type MemberWithoutId = Omit<Member, 'id'>
type PartialMemberWithoutId = Partial<MemberWithoutId>

export const MemberRepository = {
  create: (member: MemberWithoutId): Promise<Member> => {
    return client.member.create({ data: member })
  },
  update: (memberId: string, data: PartialMemberWithoutId): Promise<Member> => {
    return client.member.update({ where: { memberId }, data })
  },
  upsert: (member: MemberWithoutId): Promise<Member> => {
    return client.member.upsert({
      create: member,
      update: member,
      where: { memberId: member.memberId },
    })
  },
  delete: (memberId: string): Promise<Member> => {
    return client.member.delete({ where: { memberId } })
  },
  findMany: (): Promise<Member[]> => {
    return client.member.findMany()
  },
}
