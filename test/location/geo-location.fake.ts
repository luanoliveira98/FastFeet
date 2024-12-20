import {
  Geocode,
  GeoLocation,
  GeoLocationAddressParams,
} from '@/domain/delivery/application/location/geo-location.interface'
import { faker } from '@faker-js/faker'

export class GeoLocationFake implements GeoLocation {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generate(address: GeoLocationAddressParams): Promise<Geocode> {
    const latitude = faker.location.latitude()
    const longitude = faker.location.longitude()

    return {
      latitude,
      longitude,
    }
  }
}
