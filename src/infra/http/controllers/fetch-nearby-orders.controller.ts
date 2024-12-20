import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
} from '@nestjs/common'
import { FetchNearbyOrdersUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders.use-case'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { OrderPresenter } from '../presenters/order.presenter'

const bodySchema = z.object({
  latitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/orders-nearby')
export class FetchNearbyOrdersController {
  constructor(private readonly fetchNearbyOrders: FetchNearbyOrdersUseCase) {}

  @Get()
  async handle(@Body(bodyValidationPipe) body: BodySchema) {
    const { latitude, longitude } = body

    const result = await this.fetchNearbyOrders.execute({
      deliveryPersonLatitude: latitude,
      deliveryPersonLongitude: longitude,
    })

    if (result.isLeft()) {
      throw new InternalServerErrorException()
    }

    const { orders } = result.value

    return {
      orders: orders.map(OrderPresenter.toHttp),
    }
  }
}
