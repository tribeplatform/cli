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
  upsert: (
    networkId: string,
    data: Omit<Prisma.NetworkCreateArgs['data'], 'networkId'>,
  ): Promise<Network> => {
    return client.network.upsert({
      create: { networkId, ...data },
      update: data,
      where: { networkId },
    })
  },
  delete: (networkId: string): Promise<Network> => {
    return client.network.delete({ where: { networkId } })
  },
  findMany: (args?: Prisma.NetworkFindManyArgs): Promise<Network[]> => {
    return client.network.findMany(args)
  },
  findUniqueOrThrow: (networkId: string): Promise<Network> => {
    return client.network.findUniqueOrThrow({ where: { networkId } })
  },
  findUnique: (networkId: string): Promise<Network> => {
    return client.network.findUnique({ where: { networkId } })
  },
}
