import { Member, PrismaClient } from '@prisma/client'

const client = new PrismaClient()

type MemberWithoutId = Omit<Member, 'id'>
type PartialMemberWithoutId = Partial<MemberWithoutId>

export class MemberRepository {
  static async create(member: MemberWithoutId): Promise<Member> {
    return await client.member.create({ data: member })
  }

  static async update(id: string, data: PartialMemberWithoutId): Promise<Member> {
    return await client.member.update({ where: { id }, data })
  }

  static async upsert(member: MemberWithoutId): Promise<Member> {
    return await client.member.upsert({
      create: member,
      update: member,
      where: { memberId: member.memberId },
    })
  }

  static async delete(id: string): Promise<Member> {
    return await client.member.delete({ where: { id } })
  }

  static async findMany(): Promise<Member[]> {
    return await client.member.findMany()
  }
}
