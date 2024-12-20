import {
  Geocode,
  GeoLocation,
  GeoLocationAddressParams,
} from '@/domain/delivery/application/location/geo-location.interface'
import { Injectable } from '@nestjs/common'
import NodeGeocoder from 'node-geocoder'

@Injectable()
export class GeoLocationService implements GeoLocation {
  async generate({
    street,
    number,
    city,
    state,
  }: GeoLocationAddressParams): Promise<Geocode> {
    const geocoder = NodeGeocoder({
      provider: 'openstreetmap',
    })

    const locations = await geocoder.geocode(
      `${street}, ${number}, ${city}, ${state}`,
    )

    return {
      latitude: locations[0].latitude,
      longitude: locations[0].longitude,
    }
  }
}
