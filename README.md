# Mehkesh AI (Dev) — Edge Multi-Model Assistant with RBAC
**Domain:** [https://AI-Dev.mehkesh.com/](https://AI-Dev.mehkesh.com/)  
**Tech Stack:** Cloudflare Workers, Cloudflare D1 (SQLite), Workers AI (8 Specialized Edge Models), Google Identity Services (GSI) OAuth, and Timing-Safe Master Authentication.

---

## Key Features & Highlights

1. **Role-Based Access Control (RBAC):**
   - **Master Admin (Mehkesh):** Retains instant master password authentication with root access to all settings, user quotas, prompt customization, and live system metrics.
   - **Google Users (Sign-In & Sign-Up Only):** Standard users can only authenticate via Google Identity Services (`POST /api/auth/google`). New accounts are auto-provisioned with isolated sessions, personal memory banks, and enforced daily neuron budgets.
2. **Dynamic Daily Neuron Budgets:**
   - 10,000 neurons/day free edge pool tracking.
   - Mehkesh has an in-app Master Admin Panel in Settings to adjust any user's daily budget, suspend users, or inspect live consumption.
3. **Cyberpunk Edge UI:**
   - Designed to match the production visual showcase with obsidian dark canvas, glowing logo, topbar live quota pill (`⚡ 2,485 / 10,000 Neurons`), floating rounded input dock, and quick action pills (`</> Code`, `💡 Reason`, `🖼️ Create Image`, `🎙️ Transcribe`, `🌐 Translate`).
4. **8 Specialized AI Models:**
   - **General Chat & Vision:** `@cf/meta/llama-4-scout-17b-16e-instruct`
   - **Coding & Tech:** `@cf/qwen/qwen2.5-coder-32b-instruct`
   - **Deep Reasoning:** `@cf/meta/llama-3.3-70b-instruct-fp8-fast`
   - **Image Generation:** `@cf/black-forest-labs/flux-1-schnell`
   - **Speech-to-Text (STT):** `@cf/openai/whisper-large-v3-turbo`
   - **Voice Narration (TTS):** `@cf/myshell-ai/melotts` + Zero-Neuron Browser Voice
   - **Indian Translation:** `@cf/ai4bharat/indictrans2-en-indic-1B`
   - **Auto-Memory:** `@cf/meta/llama-3.1-8b-instruct`

---

## Step-by-Step Execution Playbook (Run in PowerShell)

Execute these steps from the project root: `C:\Users\Mukesh\Desktop\Mukesh\Mehkesh\AI\aimehkeshdev\`

### Step 1: Copy Brand Assets
Copy your brand logo PNG from `aimehkesh` into the `public/` directory:
```powershell
Copy-Item -Path "..\aimehkesh\MehKesh.com.png" -Destination "public\logo.png" -Force
```

---

### Step 2: Initialize Git & Commit Codebase
```powershell
git init
git add .
git commit -m "feat: Initial commit for Mehkesh AI Dev with RBAC, Google OAuth, and Cyberpunk UI"
```

---

### Step 3: Create the Dedicated Cloudflare D1 Database
Create the `mehkesh-ai-dev` database:
```powershell
npx wrangler d1 create mehkesh-ai-dev
```
*Look at the output and copy the `database_id` (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).*

---

### Step 4: Update `wrangler.toml` with the Database ID
Open [wrangler.toml](file:///C:/Users/Mukesh/Desktop/Mukesh/Mehkesh/AI/aimehkeshdev/wrangler.toml) and replace `REPLACE_WITH_MEHKESH_AI_DEV_DATABASE_ID` with the actual database ID from Step 3:
```toml
[[d1_databases]]
binding = "DB"
database_name = "mehkesh-ai-dev"
database_id = "YOUR_ACTUAL_D1_DATABASE_ID"
```

---

### Step 5: Apply Multi-User RBAC Schema to D1
Execute the schema against both local and remote environments:

**Local D1 schema:**
```powershell
npx wrangler d1 execute mehkesh-ai-dev --local --file=schema.sql
```

**Remote Cloudflare D1 schema:**
```powershell
npx wrangler d1 execute mehkesh-ai-dev --remote --file=schema.sql
```

---

### Step 6: Set Confidential Cloudflare Worker Secrets

1. **Master Password (for Mehkesh):**
```powershell
npx wrangler secret put MASTER_PASSWORD
```
*(When prompted, enter your confidential master password, e.g. `password@1911` or your preferred secret).*

2. **JWT Secret:**
```powershell
npx wrangler secret put JWT_SECRET
```
*(When prompted, enter a random secure string for signing user session tokens).*

3. **(Optional) Google OAuth Client ID:**
If you already have a Google OAuth Client ID from Google Cloud Console:
```powershell
npx wrangler secret put GOOGLE_CLIENT_ID
```
*(Or set `GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com"` in `wrangler.toml`).*

---

### Step 7: Test the Application Locally
Run the local Cloudflare dev server:
```powershell
npm run dev
```
Open **`http://localhost:8787/`** in your browser:
- Test unlocking with your Master Password.
- Test Google Sign-In.
- Test quick action pills (`</> Code`, `💡 Reason`, `🖼️ Create Image`).
- Open **Settings ⚙️ -> Master Admin** tab to verify user management.

---

### Step 8: Deploy to Production at `AI-Dev.mehkesh.com`
Deploy the Cloudflare Worker and static assets:
```powershell
npx wrangler deploy
```

---

### Step 9: Verify Custom Domain Route
Cloudflare will automatically attach the custom domain route `AI-Dev.mehkesh.com` specified in `wrangler.toml`.
Visit:
👉 **[https://AI-Dev.mehkesh.com/](https://AI-Dev.mehkesh.com/)**

---

### Step 10: Commit and Push (If Remote Git Repository is Connected)
```powershell
git add .
git commit -m "chore: Configure D1 database binding and secrets for ai-mehkesh-dev"
# git push origin main
```
