import { Encrypter } from '@/domain/account/application/cryptography/encrypter.interface'
import { Module } from '@nestjs/common'
import { JwtEncrypterService } from './jwt-encrypter.service'
import { HashComparer } from '@/domain/account/application/cryptography/hash-comparer.interface'
import { BcryptHasherService } from './bcrypt-hasher.service'
import { HashGenerator } from '@/domain/account/application/cryptography/hash-generator.interface'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypterService },
    { provide: HashComparer, useClass: BcryptHasherService },
    { provide: HashGenerator, useClass: BcryptHasherService },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
