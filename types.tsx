export type Product = {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
}

export type Milestone = {
  id: string
  title: string
  description: string
  status: string
  paymentAmount?: number
  paymentStatus?: string
  paymentDate?: string
}
