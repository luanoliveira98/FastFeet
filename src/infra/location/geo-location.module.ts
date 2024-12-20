import { GeoLocation } from '@/domain/delivery/application/location/geo-location.interface'
import { GeoLocationService } from './geo-location.service'
import { Module } from '@nestjs/common'

@Module({
  providers: [{ provide: GeoLocation, useClass: GeoLocationService }],
  exports: [GeoLocation],
})
export class GeoLocationModule {}
