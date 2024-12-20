import { AdminsRepository } from '@/domain/account/application/repositories/admins.repository.interface'
import { Admin } from '@/domain/account/enterprise/entities/admin.entity'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async findByCpf(cpf: string): Promise<Admin | null> {
    const admin = this.items.find((item) => item.cpf === cpf)

    if (!admin) return null

    return admin
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = this.items.find((item) => item.id.toString() === id)

    if (!admin) return null

    return admin
  }

  async save(admin: Admin): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === admin.id)

    this.items[itemIndex] = admin
  }
}
