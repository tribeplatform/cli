import { Network, PrismaClient } from '@prisma/client'

const client = new PrismaClient()

type NetworkWithoutId = Omit<Network, 'id'>
type PartialNetwork = Partial<NetworkWithoutId>

export class NetworkRepository {
  static async create(network: NetworkWithoutId): Promise<Network> {
    return await client.network.create({ data: network })
  }

  static async update(id: string, data: PartialNetwork): Promise<Network> {
    return await client.network.update({ where: { id }, data })
  }

  static async delete(id: string): Promise<Network> {
    return await client.network.delete({ where: { id } })
  }
}
