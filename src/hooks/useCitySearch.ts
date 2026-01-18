import { useQuery } from '@tanstack/react-query'
import { searchCities } from '../api/flights'
import type { CityLocation } from '../types'

export function useCitySearch(keyword: string, enabled = true) {
  return useQuery<CityLocation[]>({
    queryKey: ['city-search', keyword],
    queryFn: () => searchCities(keyword),
    enabled: enabled && keyword.trim().length >= 2,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  })
}
