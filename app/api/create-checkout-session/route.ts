import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
})

const priceIds: Record<string, string> = {
  advanced: "price_advanced_monthly",
  premium: "price_premium_monthly",
  gold: "price_gold_monthly",
}

export async function POST(request: Request) {
  try {
    const { planId, userId } = await request.json()

    if (!priceIds[planId]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceIds[planId],
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/pricing?subscription=cancelled`,
      metadata: {
        userId,
        planId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
