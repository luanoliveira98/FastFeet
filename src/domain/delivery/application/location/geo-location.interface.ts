export interface Geocode {
  latitude: number
  longitude: number
}

export interface GeoLocationAddressParams {
  street: string
  number: number
  city: string
  state: string
}

export abstract class GeoLocation {
  abstract generate(address: GeoLocationAddressParams): Promise<Geocode>
}
