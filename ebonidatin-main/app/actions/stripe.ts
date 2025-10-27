"use server"

import { stripe } from "@/lib/stripe"
import { SUBSCRIPTION_PRODUCTS } from "@/lib/products"

export async function startCheckoutSession(productId: string, userId: string) {
  const product = SUBSCRIPTION_PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: {
            interval: product.interval,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/dashboard?subscription=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/pricing?subscription=cancelled`,
    metadata: {
      userId,
      planId: productId,
    },
  })

  return session.url
}
