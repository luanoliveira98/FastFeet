import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { Uploader } from '../storage/uploader.interface'
import { InvalidOrderConfirmationPhotoTypeError } from './errors/invalid-order-confirmation-photo-type.error'
import { OrderConfirmationPhotosRepository } from '../repositories/order-confirmation-photos.repository.interface'
import { OrderConfirmationPhoto } from '../../enterprise/entities/order-confirmation-photo.entity'

interface UploadAndCreateOrderConfirmationPhotoUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateOrderConfirmationPhotoUseCaseReponse = Either<
  InvalidOrderConfirmationPhotoTypeError,
  { orderConfirmationPhoto: OrderConfirmationPhoto }
>

@Injectable()
export class UploadAndCreateOrderConfirmationPhotoUseCase {
  constructor(
    private readonly orderConfirmationPhotosRepository: OrderConfirmationPhotosRepository,
    private readonly uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateOrderConfirmationPhotoUseCaseRequest): Promise<UploadAndCreateOrderConfirmationPhotoUseCaseReponse> {
    if (!/^(image\/(jpeg|png))$/.test(fileType))
      return left(new InvalidOrderConfirmationPhotoTypeError(fileType))

    const { url } = await this.uploader.upload({ fileName, fileType, body })

    const orderConfirmationPhoto = OrderConfirmationPhoto.create({
      title: fileName,
      url,
    })

    await this.orderConfirmationPhotosRepository.create(orderConfirmationPhoto)

    return right({ orderConfirmationPhoto })
  }
}
