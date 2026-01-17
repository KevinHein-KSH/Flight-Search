import type { Flight, SearchParams, CityLocation } from '../types'

const AMADEUS_BASE_URL = import.meta.env.VITE_AMADEUS_API_BASE ?? 'https://test.api.amadeus.com'
const AMADEUS_KEY = import.meta.env.VITE_AMADEUS_API_KEY
const AMADEUS_SECRET = import.meta.env.VITE_AMADEUS_API_SECRET
const ENABLE_LIVE = import.meta.env.VITE_ENABLE_LIVE_API === 'true'

interface AmadeusTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

let cachedToken: { token: string; expiresAt: number } | null = null

async function fetchAmadeusToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token
  }

  if (!AMADEUS_KEY || !AMADEUS_SECRET) {
    throw new Error('Amadeus credentials are missing')
  }

  const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: AMADEUS_KEY,
      client_secret: AMADEUS_SECRET,
    }),
  })

  if (!response.ok) {
    throw new Error(`Amadeus auth failed: ${response.statusText}`)
  }

  const payload: AmadeusTokenResponse = await response.json()
  console.info('[Amadeus] token response', {
    status: response.status,
    expiresIn: payload.expires_in,
    tokenPreview: payload.access_token?.slice(0, 6),
  })
  cachedToken = {
    token: payload.access_token,
    expiresAt: Date.now() + payload.expires_in * 1000,
  }
  return payload.access_token
}


async function fetchAmadeusFlights(params: SearchParams): Promise<Flight[]> {
  const token = await fetchAmadeusToken()

  const query = new URLSearchParams({
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.departureDate,
    adults: params.passengerCounts.adults.toString(),
    ...(params.passengerCounts.children ? { children: params.passengerCounts.children.toString() } : {}),
    ...(params.passengerCounts.infants ? { infants: params.passengerCounts.infants.toString() } : {}),
    travelClass: params.cabin?.toUpperCase() ?? 'ECONOMY',
    ...(params.returnDate ? { returnDate: params.returnDate } : {}),
    nonStop: 'false',
    currencyCode: 'USD',
    max: '20',
  })

  const response = await fetch(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Amadeus search failed: ${response.statusText}`)
  }

  const payload = await response.json()
  console.info('[Amadeus] search response', {
    status: response.status,
    offers: payload?.data?.length ?? 0,
    warnings: payload?.warnings?.length ?? 0,
  })
  const carriers = payload?.dictionaries?.carriers ?? {}
  const offers = payload?.data ?? []
  return offers
    .map((offer: any, index: number) => {
      const firstItinerary = offer.itineraries?.[0]
      const returnItinerary = offer.itineraries?.[1] ?? offer.itineraries?.[offer.itineraries.length - 1]
      const firstSegment = firstItinerary?.segments?.[0]
      if (!firstItinerary || !firstSegment) return null

      const segments = firstItinerary.segments.map((segment: any) => ({
        origin: segment.departure?.iataCode ?? '',
        destination: segment.arrival?.iataCode ?? '',
        departureTime: segment.departure?.at ?? '',
        arrivalTime: segment.arrival?.at ?? '',
        airline: carriers[segment.carrierCode] ?? segment.carrierCode ?? offer.validatingAirlineCodes?.[0] ?? 'Unknown',
        flightNumber: segment.number ?? `${segment.carrierCode ?? 'XX'}${segment.number ?? ''}`,
        durationMinutes: segment.duration ? parseDurationMinutes(segment.duration) : 0,
      }))

      return {
        id: offer.id ?? `live-${index}`,
        airline: carriers[offer.validatingAirlineCodes?.[0]] ?? segments[0]?.airline ?? 'Unknown',
        originName: params.originLabel || params.origin,
        destinationName: params.destinationLabel || params.destination,
        origin: firstSegment.departure?.iataCode ?? params.origin,
        destination: firstSegment.arrival?.iataCode ?? params.destination,
        departureDate: firstSegment.departure?.at?.slice(0, 10) ?? params.departureDate,
        returnDate: returnItinerary?.segments?.[0]?.departure?.at?.slice(0, 10) ?? params.returnDate,
        price: parseFloat(offer.price?.total ?? '0'),
        currency: offer.price?.currency ?? 'USD',
        stops: Math.max((firstItinerary.segments?.length ?? 1) - 1, 0),
        durationMinutes: firstItinerary.duration ? parseDurationMinutes(firstItinerary.duration) : 0,
        cabin: params.cabin,
        fareClass: offer.travelerPricings?.[0]?.fareOption ?? 'Standard',
        segments,
      } as Flight
    })
    .filter(Boolean)
}

function parseDurationMinutes(duration: string): number {
  const match = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/.exec(duration)
  if (!match) return 0
  const days = Number(match[1] ?? 0)
  const hours = Number(match[2] ?? 0)
  const minutes = Number(match[3] ?? 0)
  return days * 24 * 60 + hours * 60 + minutes
}



export async function searchCities(keyword: string): Promise<CityLocation[]> {
  if (!ENABLE_LIVE || !AMADEUS_KEY || !AMADEUS_SECRET) {
    throw new Error('Live Amadeus API required. Set VITE_ENABLE_LIVE_API=true and provide credentials.')
  }

  const sanitized = keyword.trim()
  if (!sanitized) return []

  const token = await fetchAmadeusToken()
  const query = new URLSearchParams({
    keyword: sanitized.toUpperCase(),
    subType: 'CITY,AIRPORT',
    'page[limit]': '8',
    'page[offset]': '0',
    view: 'FULL',
    sort: 'analytics.travelers.score',
  })

  const response = await fetch(`${AMADEUS_BASE_URL}/v1/reference-data/locations?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Amadeus location search failed: ${response.statusText}`)
  }

  const payload = await response.json()
  console.info('[Amadeus] location response', {
    status: response.status,
    count: payload?.data?.length ?? 0,
  })

  return (payload?.data ?? []).map((item: any) => ({
    id: item.id,
    name: item.name ?? item.address?.cityName ?? 'Unknown',
    iataCode: item.iataCode ?? '',
    cityCode: item.address?.cityCode ?? item.iataCode ?? '',
    country: item.address?.countryName ?? '',
    subType: item.subType ?? 'CITY',
  }))
}

export async function searchFlights(params: SearchParams): Promise<Flight[]> {
  console.info('[Amadeus] searchFlights called', params)
  if (!ENABLE_LIVE || !AMADEUS_KEY || !AMADEUS_SECRET) {
    throw new Error('Live Amadeus API required. Set VITE_ENABLE_LIVE_API=true and provide credentials.')
  }
  console.log("after");
  

  return fetchAmadeusFlights(params)
}
