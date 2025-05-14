"use server"

import { createClient } from "@supabase/supabase-js"

// Create a Supabase client
const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase credentials are missing")
    return null
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
}

export type CartItemDB = {
  id: number
  user_id: string
  product_id: number
  quantity: number
  created_at?: string
  updated_at?: string
  product_data: {
    title: string
    price: number
    currency: string
    image: string
    seller: {
      name: string
      verified: boolean
    }
  }
}

// Check if cart_items table exists
export async function checkCartTableExists() {
  const supabase = createServerClient()
  if (!supabase) return { exists: false, error: "Supabase client not initialized" }

  try {
    // Try to query the table
    const { error } = await supabase.from("cart_items").select("id").limit(1)

    // If there's no error, the table exists
    return { exists: !error, error: error?.message }
  } catch (error) {
    console.error("Error checking cart table:", error)
    return { exists: false, error: "Failed to check cart table" }
  }
}

// Save cart to database
export async function saveCartToDatabase(userId: string, cartItems: any[]) {
  const supabase = createServerClient()
  if (!supabase) return { success: false, error: "Supabase client not initialized" }

  if (!userId || !cartItems.length) return { success: false, error: "Invalid data" }

  try {
    // Check if table exists first
    const { exists } = await checkCartTableExists()
    if (!exists) {
      return { success: false, error: "Cart table does not exist yet" }
    }

    // First, delete existing cart items for this user
    await supabase.from("cart_items").delete().eq("user_id", userId)

    // Then insert the new cart items
    const cartItemsToInsert = cartItems.map((item) => ({
      user_id: userId,
      product_id: item.id,
      quantity: item.quantity,
      product_data: {
        title: item.title,
        price: item.price,
        currency: item.currency,
        image: item.image,
        seller: item.seller,
      },
    }))

    const { error } = await supabase.from("cart_items").insert(cartItemsToInsert)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error saving cart:", error)
    return { success: false, error: "Failed to save cart" }
  }
}

// Get cart from database
export async function getCartFromDatabase(userId: string) {
  const supabase = createServerClient()
  if (!supabase) return { success: false, error: "Supabase client not initialized", items: [] }

  if (!userId) return { success: false, error: "Invalid user ID", items: [] }

  try {
    // Check if table exists first
    const { exists } = await checkCartTableExists()
    if (!exists) {
      return { success: false, error: "Cart table does not exist yet", items: [] }
    }

    const { data, error } = await supabase.from("cart_items").select("*").eq("user_id", userId)

    if (error) throw error

    // Transform the data to match the CartItem interface
    const cartItems = data.map((item: CartItemDB) => ({
      id: item.product_id,
      quantity: item.quantity,
      title: item.product_data.title,
      price: item.product_data.price,
      currency: item.product_data.currency,
      image: item.product_data.image,
      seller: item.product_data.seller,
    }))

    return { success: true, items: cartItems }
  } catch (error) {
    console.error("Error fetching cart:", error)
    return { success: false, error: "Failed to fetch cart", items: [] }
  }
}

// Clear cart in database
export async function clearCartInDatabase(userId: string) {
  const supabase = createServerClient()
  if (!supabase) return { success: false, error: "Supabase client not initialized" }

  if (!userId) return { success: false, error: "Invalid user ID" }

  try {
    // Check if table exists first
    const { exists } = await checkCartTableExists()
    if (!exists) {
      return { success: false, error: "Cart table does not exist yet" }
    }

    const { error } = await supabase.from("cart_items").delete().eq("user_id", userId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error clearing cart:", error)
    return { success: false, error: "Failed to clear cart" }
  }
}
