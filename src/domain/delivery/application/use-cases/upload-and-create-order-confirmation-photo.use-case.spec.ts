import { InMemoryOrderConfirmationPhotosRepository } from 'test/repositories/in-memory-order-confirmation-photos.repository'
import { UploadAndCreateOrderConfirmationPhotoUseCase } from './upload-and-create-order-confirmation-photo.use-case'
import { UploaderFake } from 'test/storage/uploader.fake'
import { InvalidOrderConfirmationPhotoTypeError } from './errors/invalid-order-confirmation-photo-type.error'

describe('Upload and Create Order Confirmation Photo', () => {
  let sut: UploadAndCreateOrderConfirmationPhotoUseCase
  let inMemoryOrderConfirmationPhotosRepository: InMemoryOrderConfirmationPhotosRepository
  let uploaderFake: UploaderFake

  beforeEach(() => {
    inMemoryOrderConfirmationPhotosRepository =
      new InMemoryOrderConfirmationPhotosRepository()
    uploaderFake = new UploaderFake()

    sut = new UploadAndCreateOrderConfirmationPhotoUseCase(
      inMemoryOrderConfirmationPhotosRepository,
      uploaderFake,
    )
  })

  it('should be able to upload and create an order confirmation photo', async () => {
    const result = await sut.execute({
      fileName: 'photo.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      orderConfirmationPhoto:
        inMemoryOrderConfirmationPhotosRepository.items[0],
    })
    expect(uploaderFake.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'photo.png',
      }),
    )
  })

  it('should not be able to upload an order confirmation photo with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'photo.png',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOrderConfirmationPhotoTypeError)
    expect(uploaderFake.uploads).toHaveLength(0)
  })
})
