/**
 * Cloudflare Worker auth API
 * Endpoints:
 * POST /signup  -> { email, password }
 * POST /login   -> { email, password } -> returns { token }
 * GET  /me      -> requires Authorization: Bearer <token>
 *
 * Uses D1 (env.DB), bcryptjs, and jose for JWT.
 */

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = Deno ? Deno.env.get("JWT_SECRET") : undefined; // unused in CF, included for clarity

// Helper: create JWT (HS256)
async function createToken(payload, secret, expiresInSeconds = 60*60*24*7) {
  const alg = "HS256";
  const encoder = new TextEncoder();
  const key = await importKey(secret);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(key);
}

async function importKey(secret) {
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function verifyToken(token, secret) {
  const key = await importKey(secret);
  try {
    const { payload } = await jwtVerify(token, key);
    return { ok: true, payload };
  } catch (err) {
    return { ok: false, error: err };
  }
}

export default {
  async fetch(request, env) {
    // routing
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, ""); // remove trailing slash
    const secret = env.JWT_SECRET;
    if (!secret) {
      return new Response(JSON.stringify({ error: "JWT_SECRET not configured" }), { status: 500 });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (path.endsWith("/signup") && request.method === "POST") {
      return signup(request, env);
    }

    if (path.endsWith("/login") && request.method === "POST") {
      return login(request, env);
    }

    if (path.endsWith("/me") && request.method === "GET") {
      return me(request, env);
    }

    return new Response("Not found", { status: 404 });
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

async function signup(request, env) {
  try {
    const body = await request.json();
    const email = (body.email || "").toLowerCase().trim();
    const password = body.password || "";

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing email or password" }), { status: 400, headers: corsHeaders() });
    }

    // simple duplicate check
    const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
    if (existing) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 409, headers: corsHeaders() });
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const res = await env.DB.prepare("INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, strftime('%s','now'))").bind(email, hash).run();

    return new Response(JSON.stringify({ success: true }), { status: 201, headers: corsHeaders() });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders() });
  }
}

async function login(request, env) {
  try {
    const body = await request.json();
    const email = (body.email || "").toLowerCase().trim();
    const password = body.password || "";

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing email or password" }), { status: 400, headers: corsHeaders() });
    }

    const row = await env.DB.prepare("SELECT id, password_hash FROM users WHERE email = ?").bind(email).first();
    if (!row) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401, headers: corsHeaders() });
    }

    const ok = bcrypt.compareSync(password, row.password_hash);
    if (!ok) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401, headers: corsHeaders() });
    }

    // issue JWT
    const token = await createToken({ sub: String(row.id), email }, env.JWT_SECRET, 60*60*24*7);

    return new Response(JSON.stringify({ token }), { status: 200, headers: corsHeaders() });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders() });
  }
}

async function me(request, env) {
  try {
    const auth = request.headers.get("Authorization") || "";
    const m = auth.match(/^Bearer\s+(.+)$/i);
    if (!m) return new Response(JSON.stringify({ error: "Missing token" }), { status: 401, headers: corsHeaders() });
    const token = m[1];
    const verification = await verifyToken(token, env.JWT_SECRET);
    if (!verification.ok) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: corsHeaders() });

    const payload = verification.payload;
    const user = await env.DB.prepare("SELECT id, email, created_at FROM users WHERE id = ?").bind(payload.sub).first();
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: corsHeaders() });

    return new Response(JSON.stringify({ user }), { status: 200, headers: corsHeaders() });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders() });
  }
}
