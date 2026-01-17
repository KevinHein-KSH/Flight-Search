export type CabinType = 'economy' | 'premium' | 'business' | 'first'
export type TripType = 'oneway' | 'roundtrip'

export interface PassengerCounts {
  adults: number
  children: number
  infants: number
}

export interface SearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  passengerCounts: PassengerCounts
  cabin: CabinType
  tripType: TripType
}

export interface FlightSegment {
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  airline: string
  flightNumber: string
  durationMinutes: number
}

export interface Flight {
  id: string
  airline: string
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  price: number
  currency: string
  stops: number
  durationMinutes: number
  cabin: CabinType
  fareClass: string
  segments: FlightSegment[]
}

export interface FilterState {
  priceRange: [number, number]
  stops: Set<number>
  airlines: Set<string>
  excludeAirlines: boolean
  sortBy: 'none' | 'price' | 'duration' | 'departure'
}

export interface CityLocation {
  id: string
  name: string
  iataCode: string
  cityCode: string
  country: string
  subType: 'CITY' | 'AIRPORT'
}

export interface PricePoint {
  date: string
  averagePrice: number
  lowestPrice: number
}
