export interface FederatedSearch {
  query: string
}

export interface FederatedSearchItemResult {
  id: string
  url: string
  title: string
  description: string
  iconUrl?: string
}

export type FederatedSearchResult = FederatedSearchItemResult[]
