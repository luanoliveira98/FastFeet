import { HashComparer } from '@/domain/account/application/cryptography/hash-comparer.interface'
import { HashGenerator } from '@/domain/account/application/cryptography/hash-generator.interface'
import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

@Injectable()
export class BcryptHasherService implements HashGenerator, HashComparer {
  private HASH_SALT_LENGHT = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGHT)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
