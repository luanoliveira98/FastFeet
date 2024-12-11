import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { AuthenticateUserUseCase } from '@/domain/account/application/use-cases/authenticate-user.use-case'
import { DatabaseModule } from '../database/database.module'
import { CreateAccountController } from './controllers/create-account.controller'
import { RegisterDeliveryPersonUseCase } from '@/domain/account/application/use-cases/register-delivery-person.use-case'
import { EditAccountController } from './controllers/edit-account.controller'
import { EditDeliveryPersonUseCase } from '@/domain/account/application/use-cases/edit-delivery-person.use-case'
import { GetAccountByIdController } from './controllers/get-account-by-id.controller'
import { GetDeliveryPersonByIdUseCase } from '@/domain/account/application/use-cases/get-delivery-person-by-id.use-case'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    EditAccountController,
    GetAccountByIdController,
  ],
  providers: [
    AuthenticateUserUseCase,
    RegisterDeliveryPersonUseCase,
    EditDeliveryPersonUseCase,
    GetDeliveryPersonByIdUseCase,
  ],
})
export class HttpModule {}
