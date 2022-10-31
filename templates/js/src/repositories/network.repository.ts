import { Network, PrismaClient } from '@prisma/client'

const client = new PrismaClient()

type NetworkWithoutId = Omit<Network, 'id'>
type PartialNetworkWithoutId = Partial<NetworkWithoutId>

export class NetworkRepository {
  static async create(network: NetworkWithoutId): Promise<Network> {
    return await client.network.create({ data: network })
  }

  static async update(id: string, data: PartialNetworkWithoutId): Promise<Network> {
    return await client.network.update({ where: { id }, data })
  }

  static async upsert(network: NetworkWithoutId): Promise<Network> {
    return await client.network.upsert({
      create: network,
      update: network,
      where: { networkId: network.networkId },
    })
  }

  static async delete(id: string): Promise<Network> {
    return await client.network.delete({ where: { id } })
  }

  static async findMany(): Promise<Network[]> {
    return await client.network.findMany()
  }
}
