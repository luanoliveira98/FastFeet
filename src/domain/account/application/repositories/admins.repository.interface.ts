import { Admin } from '../../enterprise/entities/admin.entity'

export abstract class AdminsRepository {
  abstract findByCpf(cpf: string): Promise<Admin | null>
  abstract findById(id: string): Promise<Admin | null>
  abstract save(admin: Admin): Promise<void>
}
