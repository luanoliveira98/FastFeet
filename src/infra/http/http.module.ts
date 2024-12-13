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
import { DeleteAccountController } from './controllers/delete-account.controller'
import { DeleteDeliveryPersonUseCase } from '@/domain/account/application/use-cases/delete-delivery-person.use-case'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient.use-case'
import { GetRecipientByIdController } from './controllers/get-recipient-by-id.controller'
import { GetRecipientByIdUseCase } from '@/domain/delivery/application/use-cases/get-recipient-by-id.use-case'
import { EditRecipientController } from './controllers/edit-recipient.controller'
import { EditRecipientUseCase } from '@/domain/delivery/application/use-cases/edit-recipient.use-case'
import { DeleteRecipientController } from './controllers/delete-recipient.controller'
import { DeleteRecipientUseCase } from '@/domain/delivery/application/use-cases/delete-recipient.use-case'
import { CreateOrderController } from './controllers/create-order.controller'
import { RegisterOrderUseCase } from '@/domain/delivery/application/use-cases/register-order.use-case'
import { DeleteOrderController } from './controllers/delete-order.controller'
import { DeleteOrderUseCase } from '@/domain/delivery/application/use-cases/delete-order.use-case'
import { GetOrderByIdController } from './controllers/get-order-by-id.controller'
import { GetOrderByIdUseCase } from '@/domain/delivery/application/use-cases/get-order-by-id.use-case'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    EditAccountController,
    GetAccountByIdController,
    DeleteAccountController,
    CreateRecipientController,
    EditRecipientController,
    GetRecipientByIdController,
    DeleteRecipientController,
    CreateOrderController,
    GetOrderByIdController,
    DeleteOrderController,
  ],
  providers: [
    AuthenticateUserUseCase,
    RegisterDeliveryPersonUseCase,
    EditDeliveryPersonUseCase,
    GetDeliveryPersonByIdUseCase,
    DeleteDeliveryPersonUseCase,
    RegisterRecipientUseCase,
    EditRecipientUseCase,
    GetRecipientByIdUseCase,
    DeleteRecipientUseCase,
    RegisterOrderUseCase,
    GetOrderByIdUseCase,
    DeleteOrderUseCase,
  ],
})
export class HttpModule {}
