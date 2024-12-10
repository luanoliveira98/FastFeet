import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { AuthenticateUserUseCase } from '@/domain/account/application/use-cases/authenticate-user.use-case'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AuthenticateController],
  providers: [AuthenticateUserUseCase],
})
export class HttpModule {}
