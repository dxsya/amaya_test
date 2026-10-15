export interface Offer {
  id: string
  name: string
  period: string
  description: string
  price: number
  priceSuffix: string
  badge?: string
  savings?: string
}

export interface PurchaseResult {
  purchaseId: string
  offerId: string
  purchasedAt: string
}
