import { headers } from "next/headers"

export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error(`⚠️  Webhook signature verification failed:`, err.message)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    const supabase = await createClient()

    // Log the webhook event
    await supabase.from("stripe_webhook_logs").insert({
      event_id: event.id,
      event_type: event.type,
      payload: event as any,
      processed: false,
    })

    console.log(`🔔 Received webhook event: ${event.type}`)

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        
        // Get the user_id from metadata
        const userId = subscription.metadata.user_id
        if (!userId) {
          console.error("No user_id in subscription metadata")
          break
        }

        // Determine plan type from price
        let planType = "free"
        const priceId = subscription.items.data[0]?.price.id
        
        if (priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID) {
          planType = "premium"
        } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID) {
          planType = "elite"
        }

        if (event.type === "customer.subscription.created") {
          // Call the handle_subscription_created function
          const { error } = await supabase.rpc("handle_subscription_created", {
            p_user_id: userId,
            p_stripe_customer_id: subscription.customer as string,
            p_stripe_subscription_id: subscription.id,
            p_plan_type: planType,
            p_current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            p_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })

          if (error) {
            console.error("Error creating subscription:", error)
          } else {
            console.log(`✅ Subscription created for user ${userId}`)
          }
        } else {
          // Call the handle_subscription_updated function
          const { error } = await supabase.rpc("handle_subscription_updated", {
            p_stripe_subscription_id: subscription.id,
            p_status: subscription.status,
            p_cancel_at_period_end: subscription.cancel_at_period_end,
            p_current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            p_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })

          if (error) {
            console.error("Error updating subscription:", error)
          } else {
            console.log(`✅ Subscription updated: ${subscription.id}`)
          }
        }

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        // Call the handle_subscription_deleted function
        const { error } = await supabase.rpc("handle_subscription_deleted", {
          p_stripe_subscription_id: subscription.id,
        })

        if (error) {
          console.error("Error deleting subscription:", error)
        } else {
          console.log(`✅ Subscription deleted: ${subscription.id}`)
        }

        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        console.log(`✅ Payment succeeded for invoice: ${invoice.id}`)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        console.log(`❌ Payment failed for invoice: ${invoice.id}`)
        
        // You might want to notify the user here
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark webhook as processed
    await supabase
      .from("stripe_webhook_logs")
      .update({ processed: true })
      .eq("event_id", event.id)

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed", details: error.message }, { status: 500 })
  }
}
