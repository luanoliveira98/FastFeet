import { HashComparer } from '@/domain/account/application/cryptography/hash-comparer.interface'
import { HashGenerator } from '@/domain/account/application/cryptography/hash-generator.interface'

export class HasherFake implements HashComparer, HashGenerator {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
