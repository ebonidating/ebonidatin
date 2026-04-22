import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
import Stripe from "stripe"
import { getStripePriceId } from "@/lib/subscription/billing-config"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
})

export async function POST(request: Request) {
  try {
    const { planId, userId, interval = "monthly" } = await request.json()

    // Get the price ID for the plan and interval
    const priceId = getStripePriceId(planId, interval)

    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan or interval configuration" },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/pricing?subscription=cancelled`,
      metadata: {
        userId,
        planId,
        interval,
      },
      subscription_data: {
        metadata: {
          userId,
          planId,
          interval,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout session error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
