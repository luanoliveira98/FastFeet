import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { UploadAndCreateOrderConfirmationPhotoUseCase } from '@/domain/delivery/application/use-cases/upload-and-create-order-confirmation-photo.use-case'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/order-confirmation-photos')
export class UploadOrderConfirmationPhotoController {
  constructor(
    private readonly uploadAndCreateOrderConfirmationPhoto: UploadAndCreateOrderConfirmationPhotoUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({ fileType: '(.png|jpg|jpeg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateOrderConfirmationPhoto.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }

    const { orderConfirmationPhoto } = result.value

    return { orderConfirmationPhotoId: orderConfirmationPhoto.id.toString() }
  }
}
