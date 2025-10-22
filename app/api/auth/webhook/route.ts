import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("🔔 Supabase Auth Hook Triggered:", payload);

    const { event, user } = payload;

    if (event === "user_signed_up") {
      // Example: Send welcome email using ZeptoMail
      await fetch("https://api.zeptomail.com/v1.1/email", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Zoho-enczapikey wSsVR612/hH0W/wvnGCtIOg6mVwBBFugQ05+31Hwv3b8GK/Bocdpn0POVAbxGPUcE28/QjsU9uosn0pVg2cNjNV5y1hUDiiF9mqRe1U4J3x17qnvhDzKXWhZkReNKY0Lwg5tn2JiEMsj+g=="
        },
        body: JSON.stringify({
          from: { address: "support@ebonidating.com" },
          to: [{ email_address: { address: user?.email, name: user?.email } }],
          subject: "Welcome to EboniDating 💖",
          htmlbody: `<div>Hi ${user?.email},<br><br>Welcome to <b>EboniDating</b>! Your account has been created successfully.</div>`
        })
      });
    }

    return NextResponse.json({ message: "Webhook received" });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
