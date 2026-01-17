import { useQuery } from '@tanstack/react-query'
import { searchFlights } from '../api/flights'
import type { Flight, SearchParams } from '../types'

export function useFlightSearch(params: SearchParams) {
  return useQuery<Flight[]>({
    queryKey: ['flights', params],
    queryFn: () => searchFlights(params),
    enabled: Boolean(params.origin && params.destination && params.departureDate),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}
