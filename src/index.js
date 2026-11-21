import { getHTML } from "./ui.js";
import { BRAND_LOGO_SVG } from "./logo.js";
import { signJwt, verifyJwt } from "./jwt.js";

// ============================================================================
// AI Models Configuration (Workers AI 100% Free Edge Tier)
// ============================================================================
const MODELS = {
  GENERAL: "@cf/meta/llama-4-scout-17b-16e-instruct",
  CODER: "@cf/qwen/qwen2.5-coder-32b-instruct",
  REASONING: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  FAST_EXTRACT: "@cf/meta/llama-3.1-8b-instruct",
  VISION: "@cf/meta/llama-4-scout-17b-16e-instruct",
  IMAGE_GEN: "@cf/black-forest-labs/flux-1-schnell",
  STT: "@cf/openai/whisper-large-v3-turbo",
  STT_FALLBACK: "@cf/openai/whisper",
  TTS: "@cf/myshell-ai/melotts",
  TRANSLATE: "@cf/ai4bharat/indictrans2-en-indic-1B",
};

// ============================================================================
// Security & Authentication Helpers
// ============================================================================
function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function getJwtSecret(env) {
  return env.JWT_SECRET || env.MASTER_PASSWORD || "mehkesh-ai-dev-jwt-edge-secret-key-2026";
}

function extractMasterPassword(request) {
  const header = request.headers.get("x-auth-password");
  if (header) return header.trim();

  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/auth_password=([^;]+)/);
  if (match) return decodeURIComponent(match[1]).trim();

  return null;
}

function extractJwtToken(request) {
  const header = request.headers.get("x-auth-token");
  if (header) return header.trim();

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/auth_token=([^;]+)/);
  if (match) return decodeURIComponent(match[1]).trim();

  return null;
}

async function authenticateRequest(request, env) {
  // 1. Check Master Password (Highest privilege, instant root admin for Mehkesh)
  const masterPassword = (env.MASTER_PASSWORD || "password@1911").trim();
  const providedPassword = extractMasterPassword(request);
  if (providedPassword && timingSafeEqual(providedPassword, masterPassword)) {
    return {
      id: "usr_master",
      email: env.ADMIN_EMAIL || "mehkesh@ai.mehkesh.com",
      full_name: "Mehkesh",
      picture: "",
      role: "admin",
      neuron_budget: 99999999,
      neurons_used_today: 0,
      is_active: 1,
      is_master: true,
    };
  }

  // 2. Check JWT Token (Google OAuth authenticated users)
  const token = extractJwtToken(request);
  if (token) {
    const payload = await verifyJwt(token, getJwtSecret(env));
    if (payload && payload.userId && env.DB) {
      try {
        const user = await env.DB.prepare(
          "SELECT * FROM users WHERE id = ? LIMIT 1"
        ).bind(payload.userId).first();

        if (user && user.is_active !== 0) {
          // If admin email matches, elevate to admin
          const adminEmail = (env.ADMIN_EMAIL || "").toLowerCase().trim();
          if (adminEmail && user.email.toLowerCase() === adminEmail) {
            user.role = "admin";
            user.neuron_budget = 99999999;
          }
          return user;
        }
      } catch (err) {
        console.error("User lookup error:", err);
      }
    }
  }

  return null;
}

async function checkUserQuota(user, env) {
  if (!user) return { allowed: false, reason: "Unauthenticated" };
  // Master Admin has unlimited edge access
  if (user.role === "admin" || user.id === "usr_master") {
    return { allowed: true, used: 0, budget: 99999999, is_admin: true };
  }

  if (!env.DB) return { allowed: true, used: 0, budget: user.neuron_budget || 2000 };

  try {
    const row = await env.DB.prepare(
      "SELECT SUM(approx_neurons) as used FROM activity_logs WHERE user_id = ? AND DATE(created_at) = DATE('now')"
    ).bind(user.id).first();

    const used = row?.used || 0;
    const budget = user.neuron_budget || 2000;

    if (used >= budget) {
      return {
        allowed: false,
        used,
        budget,
        reason: `Daily neuron quota reached (${used} / ${budget} neurons used today). Please contact Mehkesh to increase your quota limit.`,
      };
    }

    return { allowed: true, used, budget };
  } catch (err) {
    return { allowed: true, used: 0, budget: user.neuron_budget || 2000 };
  }
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Auth-Password, X-Auth-Token, Authorization",
      ...extraHeaders,
    },
  });
}

// ============================================================================
// Smart Multi-Model Router
// ============================================================================
function resolveModel({ hasImage, prompt, override }) {
  if (hasImage) {
    return { model: MODELS.VISION, reason: "Multimodal Vision (Llama 4 Scout)" };
  }
  if (override && override !== "auto") {
    return { model: override, reason: "Manual Override" };
  }

  const text = (prompt || "").toLowerCase();

  // Code & Technical queries
  const codeSignals = [
    /\b(code|function|const|let|var|class|def|return|sql|select|insert|update|delete|join|table)\b/,
    /\b(python|javascript|typescript|html|css|rust|golang|c\+\+|java|powershell|bash|regex|json|api)\b/,
    /\b(debug|debugger|error|exception|bug|refactor|compile|stacktrace|github|git|docker)\b/,
    /[{};<>\[\]=]{2,}/,
  ];
  if (codeSignals.some((regex) => regex.test(text))) {
    return { model: MODELS.CODER, reason: "Qwen 2.5 Coder (32B)" };
  }

  // Deep reasoning & Math queries
  const reasoningSignals = [
    /\b(reasoning|step-by-step|step by step|prove|theorem|integral|derivative|calculus|algebra|matrix)\b/,
    /\b(logic puzzle|system architecture|trade-offs|pros and cons in detail|deep analysis|quantum)\b/,
  ];
  if (reasoningSignals.some((regex) => regex.test(text))) {
    return { model: MODELS.REASONING, reason: "Llama 3.3 70B (Fast Reasoning)" };
  }

  return { model: MODELS.GENERAL, reason: "Llama 4 Scout (17B-16E MoE)" };
}

// ============================================================================
// Daily Briefing Generation (Edge Cron Trigger)
// ============================================================================
async function generateDailyBriefing(env) {
  const today = new Date().toISOString().split("T")[0];
  let recentMsgs = [];
  let memories = [];
  let neuronsYesterday = 0;

  if (env.DB) {
    try {
      const [msgsRes, memRes, neuronRes] = await Promise.all([
        env.DB.prepare(
          "SELECT role, content FROM messages WHERE created_at >= DATETIME('now', '-24 hours') ORDER BY created_at ASC LIMIT 30"
        ).all(),
        env.DB.prepare(
          "SELECT fact FROM memories WHERE user_id = 'usr_master' ORDER BY created_at DESC LIMIT 8"
        ).all(),
        env.DB.prepare(
          "SELECT SUM(approx_neurons) as total FROM activity_logs WHERE created_at >= DATETIME('now', '-24 hours')"
        ).first(),
      ]);
      recentMsgs = msgsRes?.results || [];
      memories = memRes?.results || [];
      neuronsYesterday = neuronRes?.total || 0;
    } catch (e) {
      console.error("D1 read error in briefing:", e);
    }
  }

  const conversationSummary = recentMsgs.map((m) => `${m.role}: ${m.content.slice(0, 200)}`).join("\n") || "No recent activity recorded.";
  const memoryList = memories.map((m) => "- " + m.fact).join("\n") || "- Master of the system.";

  const briefingPrompt = `You are Mehkesh AI, the personal AI assistant for Mehkesh.
Generate a concise, motivating morning briefing for ${today}.
Context of recent interactions:
${conversationSummary.slice(0, 1500)}

Key long-term facts & preferences:
${memoryList}

Structure:
1. Executive Greeting: A crisp greeting addressing Mehkesh.
2. Yesterday's Recap: 2-3 brief bullet points of what we explored, coded, or discussed.
3. Today's Strategic Focus: 2 actionable focus areas or pending tasks.
Keep it sharp, witty, and under 200 words.`;

  let summary = "";
  try {
    const aiRes = await env.AI.run(MODELS.GENERAL, {
      messages: [{ role: "user", content: briefingPrompt }],
      max_tokens: 512,
    });
    summary = aiRes.response || "Good morning, Mehkesh. All dev edge systems are operating normally. Standing by for today's objectives.";
  } catch (err) {
    summary = `Good morning, Mehkesh. Systems are online for ${today}. Ready when you are.`;
  }

  if (env.DB) {
    try {
      const briefId = "brief_" + today;
      const now = Date.now();
      const insertBriefingStmt = env.DB.prepare(`
        INSERT INTO daily_briefings (id, briefing_date, summary, pending_tasks, neurons_yesterday)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(briefing_date) DO UPDATE SET
          summary = excluded.summary,
          neurons_yesterday = excluded.neurons_yesterday,
          created_at = CURRENT_TIMESTAMP
      `).bind(briefId, today, summary, "Review today's goals and active projects.", neuronsYesterday);

      const pruneLogsStmt = env.DB.prepare(
        "DELETE FROM activity_logs WHERE created_at < DATETIME('now', '-90 days')"
      );

      const logStmt = env.DB.prepare(
        "INSERT INTO activity_logs (id, user_id, action_type, model_used, approx_neurons) VALUES (?, 'usr_master', ?, ?, ?)"
      ).bind("log_" + now, "daily_briefing", MODELS.GENERAL, 80);

      if (typeof env.DB.batch === "function") {
        await env.DB.batch([insertBriefingStmt, pruneLogsStmt, logStmt]);
      } else {
        await insertBriefingStmt.run();
        await pruneLogsStmt.run();
        await logStmt.run();
      }
    } catch (e) {
      console.error("D1 write error in briefing:", e);
    }
  }

  return { briefing_date: today, summary, neurons_yesterday: neuronsYesterday };
}

// ============================================================================
// Auto Memory Extraction in Background (Per User)
// ============================================================================
async function extractAndSaveMemory(env, userId, userText, assistantText) {
  if (!env.DB || !env.AI || !userId) return;
  try {
    const prompt = `Analyze this conversation exchange between a user and their AI assistant:
User: "${userText.slice(0, 400)}"
Assistant: "${assistantText.slice(0, 400)}"

Did the user reveal any permanent personal fact, preference, ongoing project, tech stack, or life goal?
If YES, respond ONLY with JSON: {"fact": "clear concise single-sentence fact", "category": "preference|project|personal|tech"}
If NO durable or notable fact was shared, respond ONLY with: {"fact": null}`;

    const res = await env.AI.run(MODELS.FAST_EXTRACT, {
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    let raw = (res.response || "").replace(/```json/g, "").replace(/```/g, "").trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return;
    const parsed = JSON.parse(match[0]);

    if (parsed && parsed.fact && typeof parsed.fact === "string" && parsed.fact.trim().length > 6) {
      const fact = parsed.fact.trim();
      const category = parsed.category || "general";
      const memId = "mem_" + Date.now();

      await env.DB.prepare(
        "INSERT INTO memories (id, user_id, fact, category, source) VALUES (?, ?, ?, ?, 'auto')"
      ).bind(memId, userId, fact, category).run();

      await env.DB.prepare(
        "INSERT INTO activity_logs (id, user_id, action_type, model_used, approx_neurons) VALUES (?, ?, ?, ?, ?)"
      ).bind("log_" + Date.now(), userId, "auto_memory", MODELS.FAST_EXTRACT, 10).run();
    }
  } catch (e) {
    // Graceful skip
  }
}

// ============================================================================
// Ensure D1 Database Schema
// ============================================================================
const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    picture TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    neuron_budget INTEGER NOT NULL DEFAULT 2000,
    neurons_used_today INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
  `CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`,
  `INSERT OR IGNORE INTO users (id, email, full_name, picture, role, neuron_budget, is_active)
   VALUES ('usr_master', 'mehkesh@ai.mehkesh.com', 'Mehkesh', '', 'admin', 99999999, 1)`,
  `CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `INSERT OR IGNORE INTO system_config (key, value, description)
   VALUES 
     ('default_user_budget', '2000', 'Default daily neuron quota for new Google users'),
     ('registration_open', 'true', 'Allow new Google users to sign up')`,
  `CREATE TABLE IF NOT EXISTS profile (
    id TEXT PRIMARY KEY DEFAULT 'me',
    display_name TEXT DEFAULT 'Mehkesh',
    bio TEXT DEFAULT 'Creator and Master of Mehkesh AI',
    preferences TEXT DEFAULT '{"theme":"dark","voice_engine":"browser","auto_router":true}',
    custom_instructions TEXT DEFAULT 'You are Mehkesh AI, my proactive, precise, and loyal personal AI assistant. Call me Mehkesh.',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `INSERT OR IGNORE INTO profile (id, display_name, bio, preferences, custom_instructions)
   VALUES ('me', 'Mehkesh', 'Creator and Master of Mehkesh AI', '{"theme":"dark","voice_engine":"browser","auto_router":true}', 'You are Mehkesh AI, my proactive, precise, and loyal personal AI assistant. Call me Mehkesh.')`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'usr_master',
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_user_updated ON sessions(user_id, updated_at DESC)`,
  `CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id TEXT NOT NULL DEFAULT 'usr_master',
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    model_used TEXT,
    has_media INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_messages_session_created ON messages(session_id, created_at ASC)`,
  `CREATE INDEX IF NOT EXISTS idx_messages_user_created ON messages(user_id, created_at ASC)`,
  `CREATE TABLE IF NOT EXISTS memories (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'usr_master',
    fact TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    source TEXT DEFAULT 'auto',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_memories_user_created ON memories(user_id, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'usr_master',
    action_type TEXT NOT NULL,
    model_used TEXT,
    approx_neurons INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date ON activity_logs(user_id, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS daily_briefings (
    id TEXT PRIMARY KEY,
    briefing_date TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    pending_tasks TEXT,
    neurons_yesterday INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_briefings_date ON daily_briefings(briefing_date DESC)`
];

let schemaInitialized = false;
async function ensureSchema(db) {
  if (schemaInitialized || !db) return;
  try {
    for (const sql of SCHEMA_STATEMENTS) {
      if (typeof db.prepare === "function") {
        await db.prepare(sql).run();
      } else if (typeof db.exec === "function") {
        await db.exec(sql);
      }
    }
    schemaInitialized = true;
  } catch (err) {
    console.error("[ensureSchema] D1 schema error:", err);
  }
}

// ============================================================================
// Main Cloudflare Worker Entrypoint
// ============================================================================
export default {
  // --------------------------------------------------------------------------
  // Scheduled Cron Handler (Runs at 01:30 UTC = 7:00 AM IST)
  // --------------------------------------------------------------------------
  async scheduled(event, env, ctx) {
    if (env.DB) await ensureSchema(env.DB);
    ctx.waitUntil(generateDailyBriefing(env));
  },

  // --------------------------------------------------------------------------
  // HTTP Fetch Handler
  // --------------------------------------------------------------------------
  async fetch(request, env, ctx) {
    if (env.DB) await ensureSchema(env.DB);
    const url = new URL(request.url);
    const { pathname, method } = { pathname: url.pathname, method: request.method };

    // CORS Preflight
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Auth-Password, X-Auth-Token, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 1. Serve Frontend UI
    if (method === "GET" && (pathname === "/" || pathname === "/index.html")) {
      return new Response(getHTML(env), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // 2. Serve Brand Logo SVG & Favicon
    if (method === "GET" && (pathname === "/logo.svg" || pathname === "/favicon.ico")) {
      return new Response(BRAND_LOGO_SVG, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // 3. Health & Status Check
    if (method === "GET" && pathname === "/api/health") {
      return jsonResponse({
        status: "online",
        app: env.APP_NAME || "Mehkesh AI (Dev)",
        domain: "AI-Dev.mehkesh.com",
        d1_bound: Boolean(env.DB),
        ai_bound: Boolean(env.AI),
        auth_configured: Boolean(env.MASTER_PASSWORD),
        google_auth_configured: Boolean(env.GOOGLE_CLIENT_ID),
        rbac: true,
      });
    }

    // 4. Session Check Endpoint (Current User Info)
    if (method === "GET" && pathname === "/api/auth/me") {
      const user = await authenticateRequest(request, env);
      if (!user) {
        return jsonResponse({ authenticated: false });
      }
      return jsonResponse({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          picture: user.picture,
          role: user.role,
          neuron_budget: user.neuron_budget,
          is_master: Boolean(user.is_master || user.id === "usr_master"),
        },
      });
    }

    // 5. Master Password Verification Endpoint (For Mehkesh)
    if (method === "POST" && pathname === "/api/auth/verify") {
      let password = extractMasterPassword(request);
      if (!password) {
        try {
          const body = await request.json();
          password = body?.password?.trim();
        } catch {}
      }

      const expectedPassword = (env.MASTER_PASSWORD || "password@1911").trim();
      if (!password || !timingSafeEqual(password, expectedPassword)) {
        return jsonResponse({ ok: false, error: "Invalid master password" }, 401);
      }

      const masterUser = {
        id: "usr_master",
        email: env.ADMIN_EMAIL || "mehkesh@ai.mehkesh.com",
        full_name: "Mehkesh",
        picture: "",
        role: "admin",
        neuron_budget: 99999999,
        is_master: true,
      };

      const token = await signJwt(
        { userId: "usr_master", email: masterUser.email, role: "admin", full_name: "Mehkesh" },
        getJwtSecret(env)
      );

      return jsonResponse(
        { ok: true, user: masterUser, token, message: "Welcome back, Mehkesh. Master access granted." },
        200,
        {
          "Set-Cookie": `auth_password=${encodeURIComponent(password)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
        }
      );
    }

    // 6. Google Sign-In & Sign-Up Endpoint (As in PraxisEdu)
    if (method === "POST" && pathname === "/api/auth/google") {
      let body;
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: "Invalid JSON body" }, 400);
      }

      const credential = String(body?.credential || "").trim();
      if (!credential) {
        return jsonResponse({ error: "Google credential token is required" }, 400);
      }

      let email = "";
      let fullName = "";
      let picture = "";
      let googleSub = "";

      // Step A: Verify credential via Google tokeninfo
      try {
        const googleRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
          { method: "GET" }
        );

        if (googleRes.ok) {
          const gData = await googleRes.json();
          if (gData && gData.email) {
            const isVerified = [true, "true"].includes(gData.email_verified);
            if (!isVerified) {
              return jsonResponse({ error: "Google email is not verified" }, 401);
            }
            if (env.GOOGLE_CLIENT_ID && gData.aud !== env.GOOGLE_CLIENT_ID) {
              return jsonResponse({ error: "Google token audience mismatch" }, 403);
            }
            email = String(gData.email).toLowerCase().trim();
            fullName = String(gData.name || gData.given_name || email.split("@")[0]).trim();
            picture = String(gData.picture || "");
            googleSub = String(gData.sub || "");
          }
        }
      } catch (gErr) {
        console.error("Google token verification network error:", gErr);
      }

      if (!email) {
        return jsonResponse({ error: "Unable to verify Google credential token" }, 401);
      }

      if (!env.DB) {
        return jsonResponse({ error: "Database not connected" }, 500);
      }

      // Check if user exists
      let user = await env.DB.prepare(
        "SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1"
      ).bind(email).first();

      const adminEmail = (env.ADMIN_EMAIL || "").toLowerCase().trim();
      const isAdminAccount = Boolean(adminEmail && email === adminEmail);

      if (!user) {
        // Sign-up new user
        const userId = "usr_g_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
        const role = isAdminAccount ? "admin" : "user";
        
        let defaultBudget = 2000;
        try {
          const cfg = await env.DB.prepare(
            "SELECT value FROM system_config WHERE key = 'default_user_budget'"
          ).first();
          if (cfg && cfg.value) defaultBudget = parseInt(cfg.value, 10) || 2000;
        } catch {}

        const budget = isAdminAccount ? 99999999 : defaultBudget;

        await env.DB.prepare(`
          INSERT INTO users (id, email, full_name, picture, role, neuron_budget, is_active, created_at, last_active_at)
          VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(userId, email, fullName, picture, role, budget).run();

        user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
      } else {
        // Update last_active_at and picture if changed
        await env.DB.prepare(
          "UPDATE users SET last_active_at = CURRENT_TIMESTAMP, picture = COALESCE(NULLIF(?, ''), picture) WHERE id = ?"
        ).bind(picture, user.id).run();
      }

      if (!user || user.is_active === 0) {
        return jsonResponse({ error: "Your account is inactive or suspended. Contact Mehkesh." }, 403);
      }

      // Issue signed JWT token
      const token = await signJwt(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          picture: user.picture,
        },
        getJwtSecret(env),
        86400 * 30 // 30 days
      );

      return jsonResponse(
        {
          ok: true,
          message: "Sign-in successful",
          token,
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            picture: user.picture,
            role: user.role,
            neuron_budget: user.neuron_budget,
            is_master: Boolean(user.role === "admin"),
          },
        },
        200,
        {
          "Set-Cookie": `auth_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
        }
      );
    }

    // 7. Logout Endpoint
    if (method === "POST" && pathname === "/api/auth/logout") {
      return jsonResponse({ ok: true, message: "Logged out" }, 200, {
        "Set-Cookie": "auth_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax, auth_password=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
      });
    }

    // ========================================================================
    // ENFORCE AUTHENTICATION FOR ALL /api/* ROUTES BELOW
    // ========================================================================
    if (pathname.startsWith("/api/")) {
      const user = await authenticateRequest(request, env);
      if (!user) {
        return jsonResponse({ error: "Unauthorized: Please sign in with Google or enter Master Password." }, 401);
      }

      // Attach user to context for subsequent route handlers
      const currentUserId = user.id;
      const isAdmin = user.role === "admin";

      // ----------------------------------------------------------------------
      // Profile Management
      // ----------------------------------------------------------------------
      if (pathname === "/api/profile") {
        if (!env.DB) return jsonResponse({ error: "D1 database is not bound" }, 500);

        if (method === "GET") {
          try {
            const profile = await env.DB.prepare("SELECT * FROM profile WHERE id = 'me'").first();
            return jsonResponse(profile || {
              display_name: user.full_name || "Mehkesh",
              custom_instructions: "You are Mehkesh AI, a sharp, proactive AI assistant.",
            });
          } catch (e) {
            return jsonResponse({ display_name: user.full_name || "Mehkesh" });
          }
        }

        if (method === "POST") {
          const body = await request.json().catch(() => ({}));
          const displayName = (body.display_name || user.full_name).slice(0, 50).trim();
          const customInstructions = (body.custom_instructions || "").slice(0, 2000).trim();

          if (isAdmin) {
            await env.DB.prepare(`
              INSERT INTO profile (id, display_name, custom_instructions, updated_at)
              VALUES ('me', ?, ?, CURRENT_TIMESTAMP)
              ON CONFLICT(id) DO UPDATE SET
                display_name = excluded.display_name,
                custom_instructions = excluded.custom_instructions,
                updated_at = CURRENT_TIMESTAMP
            `).bind(displayName, customInstructions).run();
          }

          return jsonResponse({ ok: true, message: "Profile updated" });
        }
      }

      // ----------------------------------------------------------------------
      // Chat Sessions Management (Strictly Isolated per user_id)
      // ----------------------------------------------------------------------
      if (pathname === "/api/sessions") {
        if (!env.DB) return jsonResponse({ error: "D1 database is not bound" }, 500);

        if (method === "GET") {
          try {
            const sessions = await env.DB.prepare(`
              SELECT s.*, 
                (SELECT COUNT(*) FROM messages m WHERE m.session_id = s.id AND m.user_id = s.user_id) as message_count,
                (SELECT content FROM messages m WHERE m.session_id = s.id AND m.user_id = s.user_id ORDER BY m.created_at DESC LIMIT 1) as last_message
              FROM sessions s
              WHERE s.user_id = ?
              ORDER BY s.updated_at DESC
              LIMIT 50
            `).bind(currentUserId).all();
            return jsonResponse(sessions?.results || []);
          } catch (e) {
            return jsonResponse([]);
          }
        }

        if (method === "POST") {
          const body = await request.json().catch(() => ({}));
          const id = "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
          const title = (body.title || "New Session").slice(0, 80).trim();
          await env.DB.prepare(
            "INSERT INTO sessions (id, user_id, title) VALUES (?, ?, ?)"
          ).bind(id, currentUserId, title).run();
          return jsonResponse({ id, title, created_at: new Date().toISOString() });
        }
      }

      if (pathname.startsWith("/api/sessions/")) {
        if (!env.DB) return jsonResponse({ error: "D1 database is not bound" }, 500);
        const sessionId = pathname.replace("/api/sessions/", "").split("/")[0].split("?")[0].trim();
        if (!sessionId) return jsonResponse({ error: "Invalid session id" }, 400);

        if (method === "GET") {
          try {
            const [session, msgs] = await Promise.all([
              env.DB.prepare("SELECT * FROM sessions WHERE id = ? AND user_id = ?").bind(sessionId, currentUserId).first(),
              env.DB.prepare(
                "SELECT id, role, content, model_used, has_media, created_at FROM messages WHERE session_id = ? AND user_id = ? ORDER BY created_at ASC"
              ).bind(sessionId, currentUserId).all(),
            ]);

            if (!session) {
              return jsonResponse({ session: { id: sessionId, title: "Chat Session" }, messages: [] });
            }
            return jsonResponse({ session, messages: msgs?.results || [] });
          } catch (e) {
            return jsonResponse({ session: { id: sessionId, title: "Chat Session" }, messages: [] });
          }
        }

        if (method === "DELETE") {
          try {
            await env.DB.prepare("DELETE FROM messages WHERE session_id = ? AND user_id = ?").bind(sessionId, currentUserId).run();
            await env.DB.prepare("DELETE FROM sessions WHERE id = ? AND user_id = ?").bind(sessionId, currentUserId).run();
          } catch (e) {}
          return jsonResponse({ ok: true, message: "Session deleted" });
        }
      }

      // ----------------------------------------------------------------------
      // Daily Briefing Endpoint
      // ----------------------------------------------------------------------
      if (pathname === "/api/briefing/today") {
        const today = new Date().toISOString().split("T")[0];
        if (env.DB) {
          const existing = await env.DB.prepare("SELECT * FROM daily_briefings WHERE briefing_date = ?").bind(today).first();
          if (existing) return jsonResponse(existing);
        }
        const generated = await generateDailyBriefing(env);
        return jsonResponse(generated);
      }

      if (pathname === "/api/briefing/refresh" && method === "POST") {
        const generated = await generateDailyBriefing(env);
        return jsonResponse({ ok: true, briefing: generated });
      }

      // ----------------------------------------------------------------------
      // Quota Meter (Shows personal budget for user, system-wide for admin)
      // ----------------------------------------------------------------------
      if (pathname === "/api/quota") {
        let userUsedToday = 0;
        let systemUsedToday = 0;
        let systemYesterday = 0;

        if (env.DB) {
          try {
            const userRow = await env.DB.prepare(
              "SELECT SUM(approx_neurons) as used FROM activity_logs WHERE user_id = ? AND DATE(created_at) = DATE('now')"
            ).bind(currentUserId).first();
            userUsedToday = userRow?.used || 0;

            if (isAdmin) {
              const sysRow = await env.DB.prepare(
                "SELECT SUM(approx_neurons) as used FROM activity_logs WHERE DATE(created_at) = DATE('now')"
              ).first();
              systemUsedToday = sysRow?.used || 0;

              const sysYest = await env.DB.prepare(
                "SELECT SUM(approx_neurons) as used FROM activity_logs WHERE DATE(created_at) = DATE('now', '-1 day')"
              ).first();
              systemYesterday = sysYest?.used || 0;
            }
          } catch (e) {}
        }

        const effectiveLimit = isAdmin ? 10000 : (user.neuron_budget || 2000);
        const displayUsed = isAdmin ? systemUsedToday : userUsedToday;

        return jsonResponse({
          is_admin: isAdmin,
          daily_limit: effectiveLimit,
          used_today: displayUsed,
          remaining_today: Math.max(0, effectiveLimit - displayUsed),
          percent_used: Math.min(100, Math.round((displayUsed / effectiveLimit) * 100)),
          system_used_today: systemUsedToday,
          system_yesterday: systemYesterday,
          system_total_pool: 10000,
        });
      }

      // ----------------------------------------------------------------------
      // Long-Term Memory Bank (Per User)
      // ----------------------------------------------------------------------
      if (pathname === "/api/memories") {
        if (!env.DB) return jsonResponse({ error: "D1 database is not bound" }, 500);

        if (method === "GET") {
          try {
            const mems = await env.DB.prepare(
              "SELECT * FROM memories WHERE user_id = ? ORDER BY created_at DESC LIMIT 100"
            ).bind(currentUserId).all();
            return jsonResponse(mems?.results || []);
          } catch (e) {
            return jsonResponse([]);
          }
        }

        if (method === "POST") {
          const body = await request.json().catch(() => ({}));
          const fact = body.fact?.trim();
          const category = (body.category || "manual").slice(0, 30).trim();
          if (!fact) return jsonResponse({ error: "Fact is required" }, 400);

          const memId = "mem_" + Date.now();
          await env.DB.prepare(
            "INSERT INTO memories (id, user_id, fact, category, source) VALUES (?, ?, ?, ?, 'manual')"
          ).bind(memId, currentUserId, fact, category).run();

          return jsonResponse({ ok: true, memory: { id: memId, fact, category, source: "manual" } });
        }
      }

      if (pathname.startsWith("/api/memories/") && method === "DELETE") {
        if (!env.DB) return jsonResponse({ error: "D1 database is not bound" }, 500);
        const memId = pathname.replace("/api/memories/", "").split("/")[0].split("?")[0].trim();
        if (!memId) return jsonResponse({ error: "Invalid memory id" }, 400);
        await env.DB.prepare("DELETE FROM memories WHERE id = ? AND user_id = ?").bind(memId, currentUserId).run();
        return jsonResponse({ ok: true, message: "Memory deleted" });
      }

      // ----------------------------------------------------------------------
      // Creative Suite: Imagine (FLUX.1 Schnell)
      // ----------------------------------------------------------------------
      if (pathname === "/api/imagine" && method === "POST") {
        if (!env.AI) return jsonResponse({ error: "Workers AI is not bound" }, 500);
        const quota = await checkUserQuota(user, env);
        if (!quota.allowed) return jsonResponse({ error: quota.reason }, 429);

        const body = await request.json().catch(() => ({}));
        const prompt = body.prompt?.trim();
        if (!prompt) return jsonResponse({ error: "Prompt is required" }, 400);

        try {
          const res = await env.AI.run(MODELS.IMAGE_GEN, { prompt, steps: 4 });
          if (env.DB) {
            ctx.waitUntil(
              env.DB.prepare(
                "INSERT INTO activity_logs (id, user_id, action_type, model_used, approx_neurons) VALUES (?, ?, ?, ?, ?)"
              ).bind("log_" + Date.now(), currentUserId, "imagine", MODELS.IMAGE_GEN, 100).run().catch(() => {})
            );
          }
          if (res.image) {
            return jsonResponse({ image: `data:image/jpeg;base64,${res.image}`, prompt });
          }
          return new Response(res, { headers: { "Content-Type": "image/jpeg" } });
        } catch (err) {
          return jsonResponse({ error: "Image generation failed: " + err.message }, 500);
        }
      }

      // ----------------------------------------------------------------------
      // Creative Suite: Transcribe (Whisper Large v3 Turbo)
      // ----------------------------------------------------------------------
      if (pathname === "/api/transcribe" && method === "POST") {
        if (!env.AI) return jsonResponse({ error: "Workers AI is not bound" }, 500);
        const quota = await checkUserQuota(user, env);
        if (!quota.allowed) return jsonResponse({ error: quota.reason }, 429);

        try {
          const audioBuffer = await request.arrayBuffer();
          if (!audioBuffer || audioBuffer.byteLength < 300) {
            return jsonResponse({ text: "" });
          }

          const audioBytes = [...new Uint8Array(audioBuffer)];
          let res;
          try {
            res = await env.AI.run(MODELS.STT, { audio: audioBytes });
          } catch (sttErr) {
            try {
              res = await env.AI.run(MODELS.STT_FALLBACK, { audio: audioBytes });
            } catch (fallbackErr) {
              return jsonResponse({ text: "", error: "Speech recognition unavailable" }, 200);
            }
          }

          if (env.DB) {
            ctx.waitUntil(
              env.DB.prepare(
                "INSERT INTO activity_logs (id, user_id, action_type, model_used, approx_neurons) VALUES (?, ?, ?, ?, ?)"
              ).bind("log_" + Date.now(), currentUserId, "transcribe", MODELS.STT, 30).run().catch(() => {})
            );
          }

          return jsonResponse({ text: res?.text || "" });
        } catch (err) {
          return jsonResponse({ text: "", error: err.message }, 200);
        }
      }

      // ----------------------------------------------------------------------
      // Creative Suite: Voice Speak (MeloTTS)
      // ----------------------------------------------------------------------
      if (pathname === "/api/speak" && method === "POST") {
        if (!env.AI) return jsonResponse({ error: "Workers AI is not bound" }, 500);
        const quota = await checkUserQuota(user, env);
        if (!quota.allowed) return jsonResponse({ error: quota.reason }, 429);

        const body = await request.json().catch(() => ({}));
        const text = body.text?.trim();
        if (!text) return jsonResponse({ error: "Text is required" }, 400);

        try {
          const audioStream = await env.AI.run(MODELS.TTS, {
            prompt: text.slice(0, 450),
            lang: "en",
          });

          if (env.DB) {
            ctx.waitUntil(
              env.DB.prepare(
                "INSERT INTO activity_logs (id, user_id, action_type, model_used, approx_neurons) VALUES (?, ?, ?, ?, ?)"
              ).bind("log_" + Date.now(), currentUserId, "speak", MODELS.TTS, 25).run().catch(() => {})
            );
          }

          return new Response(audioStream, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=86400",
            },
          });
        } catch (err) {
          return jsonResponse({ error: "Speech synthesis failed: " + err.message }, 500);
        }
      }

      // ----------------------------------------------------------------------
      // Creative Suite: Translate (IndicTrans2)
      // ----------------------------------------------------------------------
      if (pathname === "/api/translate" && method === "POST") {
        if (!env.AI) return jsonResponse({ error: "Workers AI is not bound" }, 500);
        const quota = await checkUserQuota(user, env);
        if (!quota.allowed) return jsonResponse({ error: quota.reason }, 429);

        const body = await request.json().catch(() => ({}));
        const text = body.text?.trim();
        const targetLang = (body.target_lang || "hin_Deva").trim();

        if (!text) return jsonResponse({ error: "Text is required" }, 400);

        try {
          const res = await env.AI.run(MODELS.TRANSLATE, {
            text,
            source_lang: "eng_Latn",
            target_lang: targetLang,
          });

          if (env.DB) {
            ctx.waitUntil(
              env.DB.prepare(
                "INSERT INTO activity_logs (id, user_id, action_type, model_used, approx_neurons) VALUES (?, ?, ?, ?, ?)"
              ).bind("log_" + Date.now(), currentUserId, "translate", MODELS.TRANSLATE, 15).run().catch(() => {})
            );
          }

          return jsonResponse({ translation: res.translation || res.translated_text || res });
        } catch (err) {
          return jsonResponse({ error: "Translation failed: " + err.message }, 500);
        }
      }

      // ----------------------------------------------------------------------
      // Core AI Chat Endpoint (POST /api/chat) with Smart Router & Isolation
      // ----------------------------------------------------------------------
      if (pathname === "/api/chat" && method === "POST") {
        if (!env.AI) return jsonResponse({ error: "Workers AI is not bound" }, 500);

        const quota = await checkUserQuota(user, env);
        if (!quota.allowed) {
          return jsonResponse({ error: quota.reason }, 429);
        }

        const body = await request.json().catch(() => ({}));
        const { session_id, messages, model_override, has_image, image_data } = body;

        if (!Array.isArray(messages) || messages.length === 0) {
          return jsonResponse({ error: "Messages array is required" }, 400);
        }

        const latestUserMessage = messages[messages.length - 1]?.content || "";

        // 1. Resolve Model
        const route = resolveModel({
          hasImage: Boolean(has_image),
          prompt: latestUserMessage,
          override: model_override,
        });
        const chosenModel = route.model;

        // 2. Fetch System Instructions & Memories
        let customInstructions = isAdmin
          ? "You are Mehkesh AI, a sharp, proactive, loyal personal AI assistant for Mehkesh. Call him Mehkesh."
          : `You are Mehkesh AI, an edge-native AI assistant helping ${user.full_name || "the user"}.`;

        let memoriesContext = "";
        let todayBriefingContext = "";

        if (env.DB) {
          try {
            const today = new Date().toISOString().split("T")[0];
            const [memRows, briefRow] = await Promise.all([
              env.DB.prepare("SELECT fact FROM memories WHERE user_id = ? ORDER BY created_at DESC LIMIT 8").bind(currentUserId).all(),
              env.DB.prepare("SELECT summary FROM daily_briefings WHERE briefing_date = ?").bind(today).first(),
            ]);

            if (memRows?.results?.length) {
              memoriesContext = "\nUser preferences & memories:\n" + memRows.results.map((r) => "- " + r.fact).join("\n");
            }

            if (briefRow?.summary && isAdmin) {
              todayBriefingContext = `\nToday's Briefing Context: ${briefRow.summary.slice(0, 350)}`;
            }
          } catch (e) {}
        }

        const SYSTEM_PROMPT = `${customInstructions}${memoriesContext}${todayBriefingContext}
Always maintain the prestigious persona of Mehkesh AI. When providing code or technical solutions, use markdown code blocks with exact language specified.`;

        const sanitizedMessages = messages
          .filter((m) => m && (m.role === "user" || m.role === "assistant"))
          .map((m) => ({ role: m.role, content: m.content.slice(0, 16000) }));

        const fullMessages = [
          { role: "system", content: SYSTEM_PROMPT },
          ...sanitizedMessages,
        ];

        try {
          let aiInput = {
            messages: fullMessages,
            stream: true,
            max_tokens: 2048,
          };

          if (has_image && image_data) {
            try {
              const rawBase64 = image_data.replace(/^data:image\/\w+;base64,/, "");
              const binaryString = atob(rawBase64);
              const imageBytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                imageBytes[i] = binaryString.charCodeAt(i);
              }
              aiInput.image = [...imageBytes];
            } catch (imgErr) {
              console.error("Image decode error:", imgErr);
            }
          }

          let stream;
          try {
            stream = await env.AI.run(chosenModel, aiInput);
          } catch (modelErr) {
            console.warn(`Model ${chosenModel} execution failed, falling back to ${MODELS.GENERAL}`);
            stream = await env.AI.run(MODELS.GENERAL, aiInput);
          }

          const [clientStream, loggingStream] = stream.tee();

          ctx.waitUntil(
            (async () => {
              try {
                const reader = loggingStream.getReader();
                const decoder = new TextDecoder();
                let accumulatedResponse = "";
                let buffer = "";

                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;

                  buffer += decoder.decode(value, { stream: true });
                  const lines = buffer.split("\n");
                  buffer = lines.pop();

                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith("data:")) continue;
                    const dataStr = trimmed.slice(5).trim();
                    if (dataStr === "[DONE]") break;
                    try {
                      const parsed = JSON.parse(dataStr);
                      if (parsed.response) accumulatedResponse += parsed.response;
                    } catch (e) {
                      if (dataStr) accumulatedResponse += dataStr;
                    }
                  }
                }

                if (env.DB && session_id) {
                  const now = Date.now();
                  const insertUser = env.DB.prepare(
                    "INSERT INTO messages (id, session_id, user_id, role, content, model_used, has_media) VALUES (?, ?, ?, ?, ?, ?, ?)"
                  ).bind("msg_" + now + "_u", session_id, currentUserId, "user", latestUserMessage, chosenModel, has_image ? 1 : 0);

                  const insertAssistant = env.DB.prepare(
                    "INSERT INTO messages (id, session_id, user_id, role, content, model_used, has_media) VALUES (?, ?, ?, ?, ?, ?, ?)"
                  ).bind("msg_" + (now + 1) + "_a", session_id, currentUserId, "assistant", accumulatedResponse, chosenModel, 0);

                  const updateSess = env.DB.prepare(
                    "UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?"
                  ).bind(session_id, currentUserId);

                  const logChat = env.DB.prepare(
                    "INSERT INTO activity_logs (id, user_id, action_type, model_used, approx_neurons) VALUES (?, ?, ?, ?, ?)"
                  ).bind("log_" + now, currentUserId, "chat", chosenModel, 65);

                  if (typeof env.DB.batch === "function") {
                    await env.DB.batch([insertUser, insertAssistant, updateSess, logChat]);
                  } else {
                    await insertUser.run();
                    await insertAssistant.run();
                    await updateSess.run();
                    await logChat.run();
                  }

                  await extractAndSaveMemory(env, currentUserId, latestUserMessage, accumulatedResponse);
                }
              } catch (bgErr) {
                console.error("Background stream logging error:", bgErr);
              }
            })()
          );

          return new Response(clientStream, {
            headers: {
              "Content-Type": "text/event-stream; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
              "Connection": "keep-alive",
              "Access-Control-Allow-Origin": "*",
              "X-Model-Used": chosenModel,
              "X-Model-Reason": route.reason,
            },
          });
        } catch (aiErr) {
          return jsonResponse({ error: "Workers AI execution failed: " + aiErr.message }, 500);
        }
      }

      // ======================================================================
      // MASTER ADMIN CONTROLS (/api/admin/*) — ONLY MEHKESH (ROLE: 'admin')
      // ======================================================================
      if (pathname.startsWith("/api/admin/")) {
        if (!isAdmin) {
          return jsonResponse({ error: "Forbidden: Master Admin privileges required." }, 403);
        }

        // 1. List All Users & Budgets
        if (pathname === "/api/admin/users" && method === "GET") {
          try {
            const users = await env.DB.prepare(`
              SELECT u.*,
                (SELECT SUM(approx_neurons) FROM activity_logs l WHERE l.user_id = u.id AND DATE(l.created_at) = DATE('now')) as neurons_today,
                (SELECT COUNT(*) FROM sessions s WHERE s.user_id = u.id) as sessions_count
              FROM users u
              ORDER BY u.created_at DESC
            `).all();
            return jsonResponse(users?.results || []);
          } catch (e) {
            return jsonResponse({ error: e.message }, 500);
          }
        }

        // 2. Update User Neuron Budget
        if (pathname.startsWith("/api/admin/users/") && pathname.endsWith("/budget") && method === "POST") {
          const targetUserId = pathname.replace("/api/admin/users/", "").replace("/budget", "").trim();
          const body = await request.json().catch(() => ({}));
          const newBudget = parseInt(body.budget, 10);
          if (isNaN(newBudget) || newBudget < 0) {
            return jsonResponse({ error: "Valid integer budget is required" }, 400);
          }

          await env.DB.prepare("UPDATE users SET neuron_budget = ? WHERE id = ?").bind(newBudget, targetUserId).run();
          return jsonResponse({ ok: true, message: "Budget updated", userId: targetUserId, newBudget });
        }

        // 3. Toggle User Active / Suspend Status
        if (pathname.startsWith("/api/admin/users/") && pathname.endsWith("/status") && method === "POST") {
          const targetUserId = pathname.replace("/api/admin/users/", "").replace("/status", "").trim();
          const body = await request.json().catch(() => ({}));
          const isActive = body.is_active ? 1 : 0;
          await env.DB.prepare("UPDATE users SET is_active = ? WHERE id = ?").bind(isActive, targetUserId).run();
          return jsonResponse({ ok: true, message: "User status updated", userId: targetUserId, is_active: isActive });
        }

        // 4. Update User Role (Admin / User)
        if (pathname.startsWith("/api/admin/users/") && pathname.endsWith("/role") && method === "POST") {
          const targetUserId = pathname.replace("/api/admin/users/", "").replace("/role", "").trim();
          const body = await request.json().catch(() => ({}));
          const newRole = body.role === "admin" ? "admin" : "user";
          await env.DB.prepare("UPDATE users SET role = ? WHERE id = ?").bind(newRole, targetUserId).run();
          return jsonResponse({ ok: true, message: "User role updated", userId: targetUserId, role: newRole });
        }

        // 5. Delete User & Data
        if (pathname.startsWith("/api/admin/users/") && method === "DELETE") {
          const targetUserId = pathname.replace("/api/admin/users/", "").split("/")[0].trim();
          if (targetUserId === "usr_master") {
            return jsonResponse({ error: "Cannot delete master account" }, 400);
          }
          await env.DB.prepare("DELETE FROM messages WHERE user_id = ?").bind(targetUserId).run();
          await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(targetUserId).run();
          await env.DB.prepare("DELETE FROM memories WHERE user_id = ?").bind(targetUserId).run();
          await env.DB.prepare("DELETE FROM activity_logs WHERE user_id = ?").bind(targetUserId).run();
          await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(targetUserId).run();
          return jsonResponse({ ok: true, message: "User and all associated data permanently deleted" });
        }

        // 6. Global System Config Management
        if (pathname === "/api/admin/config") {
          if (method === "GET") {
            const configs = await env.DB.prepare("SELECT * FROM system_config").all();
            return jsonResponse(configs?.results || []);
          }
          if (method === "POST") {
            const body = await request.json().catch(() => ({}));
            for (const [key, value] of Object.entries(body)) {
              await env.DB.prepare(`
                INSERT INTO system_config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
              `).bind(key, String(value)).run();
            }
            return jsonResponse({ ok: true, message: "Configuration updated" });
          }
        }

        // 7. System Stats & Edge Metrics
        if (pathname === "/api/admin/stats" && method === "GET") {
          try {
            const [totalUsers, totalSessions, totalMessages, neuronStats] = await Promise.all([
              env.DB.prepare("SELECT COUNT(*) as count FROM users").first(),
              env.DB.prepare("SELECT COUNT(*) as count FROM sessions").first(),
              env.DB.prepare("SELECT COUNT(*) as count FROM messages").first(),
              env.DB.prepare(`
                SELECT 
                  SUM(CASE WHEN DATE(created_at) = DATE('now') THEN approx_neurons ELSE 0 END) as today,
                  SUM(CASE WHEN DATE(created_at) = DATE('now', '-1 day') THEN approx_neurons ELSE 0 END) as yesterday,
                  SUM(approx_neurons) as all_time
                FROM activity_logs
              `).first(),
            ]);

            return jsonResponse({
              total_users: totalUsers?.count || 0,
              total_sessions: totalSessions?.count || 0,
              total_messages: totalMessages?.count || 0,
              neurons_today: neuronStats?.today || 0,
              neurons_yesterday: neuronStats?.yesterday || 0,
              neurons_all_time: neuronStats?.all_time || 0,
              cloudflare_daily_free_tier: 10000,
            });
          } catch (e) {
            return jsonResponse({ error: e.message }, 500);
          }
        }
      }
    }

    return jsonResponse({ error: "Not Found", path: pathname }, 404);
  },
};
