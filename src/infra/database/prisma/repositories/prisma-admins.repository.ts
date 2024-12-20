import { AdminsRepository } from '@/domain/account/application/repositories/admins.repository.interface'
import { Admin } from '@/domain/account/enterprise/entities/admin.entity'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAdminMapper } from '../mappers/prisma-admin.mapper'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: { cpf, role: 'ADMIN' },
    })

    if (!admin) return null

    return PrismaAdminMapper.toDomain(admin)
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: { id, role: 'ADMIN' },
    })

    if (!admin) return null

    return PrismaAdminMapper.toDomain(admin)
  }

  async save(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.update({ where: { id: data.id }, data })
  }
}
