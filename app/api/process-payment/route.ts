import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, email, amount, plan, cardNumber, cardExpiry, cardCVC } = await request.json()

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        userId,
        plan,
      },
    })

    const supabase = await createClient()
    const subscriptionExpiresAt = new Date()
    subscriptionExpiresAt.setMonth(subscriptionExpiresAt.getMonth() + 1)

    const { error } = await supabase
      .from("profiles")
      .update({
        subscription_tier: plan,
        subscription_expires_at: subscriptionExpiresAt.toISOString(),
        gallery_access: true,
      })
      .eq("id", userId)

    if (error) throw error

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
