import { Network, PrismaClient } from '@prisma/client'

const client = new PrismaClient()

type NetworkWithoutId = Omit<Network, 'id'>
type PartialNetworkWithoutId = Partial<NetworkWithoutId>

export const NetworkRepository = {
  create: (network: NetworkWithoutId): Promise<Network> => {
    return client.network.create({ data: network })
  },
  update: (id: string, data: PartialNetworkWithoutId): Promise<Network> => {
    return client.network.update({ where: { id }, data })
  },
  upsert: (network: NetworkWithoutId): Promise<Network> => {
    return client.network.upsert({
      create: network,
      update: network,
      where: { networkId: network.networkId },
    })
  },
  delete: (id: string): Promise<Network> => {
    return client.network.delete({ where: { id } })
  },
  findMany: (): Promise<Network[]> => {
    return client.network.findMany()
  },
}
