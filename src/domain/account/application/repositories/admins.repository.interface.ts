import { Admin } from '../../enterprise/entities/admin.entity'

export abstract class AdminsRepository {
  abstract findByCpf(cpf: string): Promise<Admin | null>
}
