import { Network, Prisma, PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export const NetworkRepository = {
  create: (data: Prisma.NetworkCreateArgs['data']): Promise<Network> => {
    return client.network.create({ data })
  },
  update: (
    networkId: string,
    data: Prisma.NetworkUpdateArgs['data'],
  ): Promise<Network> => {
    return client.network.update({ where: { networkId }, data })
  },
  upsert: (data: Prisma.NetworkCreateArgs['data']): Promise<Network> => {
    return client.network.upsert({
      create: data,
      update: data,
      where: { networkId: data.networkId },
    })
  },
  delete: (networkId: string): Promise<Network> => {
    return client.network.delete({ where: { networkId } })
  },
  findMany: (): Promise<Network[]> => {
    return client.network.findMany()
  },
  findUniqueOrThrow: (networkId: string): Promise<Network> => {
    return client.network.findUniqueOrThrow({ where: { networkId } })
  },
}
