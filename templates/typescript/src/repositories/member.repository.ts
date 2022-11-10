import { Member, PrismaClient } from '@prisma/client'

const client = new PrismaClient()

type MemberWithoutId = Omit<Member, 'id'>
type PartialMemberWithoutId = Partial<MemberWithoutId>

export const MemberRepository = {
  create: (member: MemberWithoutId): Promise<Member> => {
    return client.member.create({ data: member })
  },
  update: (id: string, data: PartialMemberWithoutId): Promise<Member> => {
    return client.member.update({ where: { id }, data })
  },
  upsert: (member: MemberWithoutId): Promise<Member> => {
    return client.member.upsert({
      create: member,
      update: member,
      where: { memberId: member.memberId },
    })
  },
  delete: (id: string): Promise<Member> => {
    return client.member.delete({ where: { id } })
  },
  findMany: (): Promise<Member[]> => {
    return client.member.findMany()
  },
}
