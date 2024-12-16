import {
  Uploader,
  UploadParams,
} from '@/domain/delivery/application/storage/uploader.interface'
import { randomUUID } from 'node:crypto'

interface Upload {
  fileName: string
  url: string
}

export class UploaderFake implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      fileName,
      url,
    })

    return { url }
  }
}
