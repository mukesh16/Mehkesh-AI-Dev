import { BRAND_LOGO_SVG } from "./logo.js";

export function getHTML(env = {}) {
  const googleClientId = env.GOOGLE_CLIENT_ID || "";
  const appName = env.APP_NAME || "Mehkesh AI";

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${appName}</title>
  <meta name="description" content="Mehkesh AI - A Production-Grade Multi-Model Personal AI Assistant at the Cloudflare Edge">
  <!-- Exact Brand Favicon -->
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="shortcut icon" type="image/png" href="/logo.png">
  <link rel="apple-touch-icon" href="/logo.png">

  <!-- Highlight.js, Marked, DOMPurify (100% Free Edge CDN) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.2/purify.min.js"></script>

  <!-- Google Identity Services (GSI) for Google Sign-in / Sign-up -->
  <script src="https://accounts.google.com/gsi/client" async defer onload="if(typeof initGoogleSignIn==='function')initGoogleSignIn()"></script>

  <style>
    :root {
      --bg-base: #06070a;
      --bg-surface: #0b0d14;
      --bg-panel: #0e111a;
      --bg-card: #131724;
      --bg-input: #10131d;
      --border: #1a2030;
      --border-glow: rgba(124, 58, 237, 0.4);
      --purple: #8b5cf6;
      --purple-glow: #7c3aed;
      --pink: #ec4899;
      --pink-glow: #f43f5e;
      --cyan: #00f0ff;
      --cyan-dim: rgba(0, 240, 255, 0.15);
      --blue: #3b82f6;
      --green: #10b981;
      --amber: #f59e0b;
      --red: #ef4444;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --sidebar-w: 270px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      background: var(--bg-base);
      color: var(--text-main);
      height: 100dvh;
      overflow: hidden;
      display: flex;
    }

    /* Scrollbars */
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #1e2436; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #2d374f; }

    /* Layout */
    .sidebar {
      width: var(--sidebar-w);
      background: var(--bg-panel);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      height: 100%;
      z-index: 30;
      transition: transform 0.25s ease;
    }

    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 0;
      position: relative;
      background: radial-gradient(circle at 50% -10%, #170d2b 0%, #06070a 75%);
    }

    /* Top Navigation Bar */
    .topbar {
      height: 60px;
      border-bottom: 1px solid var(--border);
      background: rgba(11, 13, 20, 0.85);
      backdrop-filter: blur(14px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 20;
    }

    .topbar-left, .topbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      font-size: 1.05rem;
      letter-spacing: -0.02em;
      cursor: pointer;
    }

    .brand-logo-img {
      height: 28px;
      width: auto;
      border-radius: 6px;
      object-fit: contain;
      filter: drop-shadow(0 0 10px rgba(124, 58, 237, 0.5));
    }

    .logo-badge {
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      color: #fff;
      font-size: 0.6rem;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Status Pulse Pill */
    .status-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.72rem;
      padding: 4px 10px;
      border-radius: 20px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--green);
    }
    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 8px var(--green);
    }

    /* Hands-Free Button */
    .hands-free-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.76rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-muted);
      transition: all 0.2s;
    }
    .hands-free-btn:hover {
      border-color: var(--purple);
      color: var(--text-main);
    }
    .hands-free-btn.active {
      background: rgba(124, 58, 237, 0.15);
      border-color: var(--purple-glow);
      color: #c084fc;
      box-shadow: 0 0 14px rgba(124, 58, 237, 0.3);
    }

    /* Live Quota Pill (Top Right) */
    .quota-pill-top {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 20px;
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fbbf24;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    /* Model Selector Dropdown */
    .model-selector {
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 0.75rem;
      padding: 5px 8px;
      border-radius: 8px;
      outline: none;
      cursor: pointer;
    }
    .model-selector:hover, .model-selector:focus {
      border-color: var(--purple);
      color: var(--text-main);
    }

    .icon-btn {
      background: none;
      border: 1px solid transparent;
      color: var(--text-muted);
      padding: 6px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }
    .icon-btn:hover {
      color: var(--text-main);
      background: var(--bg-card);
      border-color: var(--border);
    }

    /* Sidebar Content */
    .sidebar-header {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Vibrant Gradient New Chat Button */
    .new-chat-btn {
      margin: 12px 14px 6px 14px;
      padding: 10px 14px;
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      border: none;
      border-radius: 10px;
      color: #fff;
      font-size: 0.88rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);
      transition: all 0.2s;
    }
    .new-chat-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(236, 72, 153, 0.45);
    }

    /* Sidebar Navigation Links */
    .sidebar-nav {
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 8px;
      color: var(--text-muted);
      font-size: 0.84rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      border: 1px solid transparent;
    }
    .nav-item:hover {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-main);
    }
    .nav-item.active {
      background: rgba(124, 58, 237, 0.12);
      border-color: rgba(124, 58, 237, 0.35);
      color: #fff;
      font-weight: 600;
    }

    .sidebar-section-title {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-dim);
      padding: 10px 16px 4px 16px;
      font-weight: 700;
    }

    .sessions-list {
      flex: 1;
      overflow-y: auto;
      padding: 4px 10px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .session-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 10px;
      border-radius: 8px;
      color: var(--text-muted);
      font-size: 0.82rem;
      cursor: pointer;
      transition: all 0.15s;
      border: 1px solid transparent;
    }
    .session-item:hover {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-main);
    }
    .session-item.active {
      background: rgba(124, 58, 237, 0.1);
      border-color: rgba(124, 58, 237, 0.3);
      color: #fff;
    }
    .session-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
    .session-del-btn {
      opacity: 0;
      background: none;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 4px;
    }
    .session-item:hover .session-del-btn { opacity: 1; }
    .session-del-btn:hover { color: var(--red); }

    /* Sidebar Footer User Profile Card */
    .sidebar-user-card {
      padding: 10px 12px;
      border-top: 1px solid var(--border);
      background: rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
    }
    .user-card-info {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .user-avatar-circle {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.88rem;
      color: #fff;
      flex-shrink: 0;
      overflow: hidden;
    }
    .user-avatar-circle img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .user-names {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .user-name-text {
      font-size: 0.82rem;
      font-weight: 700;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-role-badge {
      font-size: 0.65rem;
      color: var(--text-muted);
    }
    .user-role-badge.admin {
      color: #ec4899;
      font-weight: 600;
    }

    /* Main Chat View */
    .chat-container {
      flex: 1;
      overflow-y: auto;
      padding: 24px 16px 140px 16px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
    }

    /* Centered Empty State Hero */
    .hero-view {
      max-width: 760px;
      margin: auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 30px 16px;
      animation: fadeIn 0.3s ease;
    }

    .hero-logo-box {
      width: 100px;
      height: 100px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 0 35px rgba(139, 92, 246, 0.45));
      animation: pulseGlow 4s infinite alternate;
    }
    @keyframes pulseGlow {
      0% { filter: drop-shadow(0 0 20px rgba(124, 58, 237, 0.3)); transform: scale(1); }
      100% { filter: drop-shadow(0 0 45px rgba(236, 72, 153, 0.5)); transform: scale(1.02); }
    }

    .hero-title {
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #ffffff 40%, #c084fc 80%, #f472b6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    .hero-sub {
      color: var(--text-muted);
      font-size: 1.05rem;
      margin-bottom: 24px;
      max-width: 520px;
    }

    /* Floating Input Dock at Bottom */
    .input-dock {
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      max-width: 780px;
      margin: 0 auto;
      padding: 0 16px;
      z-index: 25;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .input-wrapper {
      background: rgba(16, 19, 29, 0.88);
      border: 1px solid rgba(139, 92, 246, 0.28);
      backdrop-filter: blur(16px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(124, 58, 237, 0.12);
      border-radius: 28px;
      padding: 8px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.2s;
    }
    .input-wrapper:focus-within {
      border-color: rgba(139, 92, 246, 0.6);
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.7), 0 0 35px rgba(124, 58, 237, 0.22);
    }

    .chat-textarea {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: #fff;
      font-size: 0.96rem;
      font-family: inherit;
      resize: none;
      padding: 6px 0;
      max-height: 160px;
    }
    .chat-textarea::placeholder {
      color: var(--text-dim);
    }

    .input-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .send-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      border: none;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.15s;
      box-shadow: 0 2px 10px rgba(124, 58, 237, 0.4);
    }
    .send-btn:hover {
      transform: scale(1.06);
    }

    /* Quick Action Pills */
    .quick-pills-row {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    .quick-pill {
      background: rgba(19, 23, 36, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(8px);
      padding: 6px 12px;
      border-radius: 20px;
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .quick-pill:hover {
      border-color: rgba(139, 92, 246, 0.5);
      color: #fff;
      background: rgba(124, 58, 237, 0.15);
      transform: translateY(-1px);
    }

    /* Synthwave Neon Mountain Backdrop Silhouette */
    .neon-backdrop-glow {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 120px;
      background: linear-gradient(to top, rgba(124, 58, 237, 0.08), transparent);
      pointer-events: none;
      z-index: 1;
    }

    /* Messages Display */
    .message-row {
      max-width: 820px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      gap: 14px;
      animation: fadeIn 0.2s ease-out;
      z-index: 5;
    }
    .message-row.user {
      flex-direction: row-reverse;
    }

    .msg-avatar {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .msg-avatar.assistant {
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      color: #fff;
      font-weight: 800;
      box-shadow: 0 0 14px rgba(124, 58, 237, 0.4);
    }
    .msg-avatar.user {
      background: #232a3d;
      color: #fff;
    }

    .msg-bubble {
      flex: 1;
      min-width: 0;
      padding: 14px 18px;
      border-radius: 18px;
      font-size: 0.94rem;
      line-height: 1.6;
    }
    .message-row.user .msg-bubble {
      background: linear-gradient(135deg, #1e2436, #161a29);
      border: 1px solid rgba(255, 255, 255, 0.08);
      max-width: 80%;
    }
    .message-row.assistant .msg-bubble {
      background: rgba(14, 17, 26, 0.85);
      border: 1px solid rgba(139, 92, 246, 0.2);
      backdrop-filter: blur(10px);
    }

    /* Modal Styling */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal-card {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: 16px;
      max-width: 580px;
      width: 100%;
      padding: 24px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .modal-title {
      font-size: 1.15rem;
      font-weight: 700;
    }

    .tab-row {
      display: flex;
      gap: 8px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 20px;
    }
    .tab-btn {
      padding: 8px 16px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.86rem;
      font-weight: 600;
    }
    .tab-btn.active {
      color: #fff;
      border-bottom-color: var(--purple);
    }

    .form-group {
      margin-bottom: 16px;
    }
    .form-label {
      display: block;
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-bottom: 6px;
      font-weight: 600;
    }
    .form-input, .form-textarea {
      width: 100%;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px 12px;
      color: #fff;
      font-size: 0.88rem;
      outline: none;
      font-family: inherit;
    }
    .form-input:focus, .form-textarea:focus {
      border-color: var(--purple);
    }

    .primary-btn {
      width: 100%;
      padding: 11px 16px;
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      border: none;
      border-radius: 8px;
      color: #fff;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .primary-btn:hover {
      opacity: 0.95;
      transform: translateY(-1px);
    }

    /* Admin Table */
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
      margin-top: 10px;
    }
    .admin-table th, .admin-table td {
      padding: 10px 8px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    .admin-table th {
      color: var(--text-dim);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.7rem;
    }

    /* Toast */
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 1000;
      pointer-events: none;
    }
    .toast {
      pointer-events: auto;
      background: var(--bg-panel);
      border: 1px solid var(--border);
      color: var(--text-main);
      padding: 10px 16px;
      border-radius: 10px;
      font-size: 0.84rem;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .briefing-rendered-content p { margin-bottom: 12px; }
    .briefing-rendered-content strong { color: #fff; font-weight: 700; }
    .briefing-rendered-content ol, .briefing-rendered-content ul { margin: 8px 0 14px 22px; }
    .briefing-rendered-content li { margin-bottom: 6px; }

    /* Typing Dots Animation */
    .typing-dots {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 6px;
    }
    .typing-dots span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--purple);
      display: inline-block;
      animation: typingPulse 1.4s infinite ease-in-out both;
    }
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    @keyframes typingPulse {
      0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
      40% { transform: scale(1); opacity: 1; }
    }

    /* Pre Code Block & Copy Button */
    pre {
      position: relative;
      background: #090c14 !important;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 14px 16px;
      margin: 12px 0;
      overflow-x: auto;
    }
    pre code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.88rem;
      background: transparent !important;
      padding: 0 !important;
    }
    .copy-code-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 4px 9px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .copy-code-btn:hover {
      background: var(--purple);
      color: #fff;
    }
    .copy-code-btn.copied {
      background: var(--green);
      color: #000;
      border-color: var(--green);
    }

    /* Attachment Preview Bar */
    .attachment-preview-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 12px;
      background: rgba(124, 58, 237, 0.16);
      border: 1px solid rgba(124, 58, 237, 0.35);
      border-radius: 14px;
      font-size: 0.78rem;
      color: #c084fc;
      width: fit-content;
      margin-bottom: 6px;
      backdrop-filter: blur(8px);
    }

    .google-custom-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 280px;
      padding: 10px 16px;
      background: #1a73e8;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 24px;
      color: #fff;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 14px rgba(26, 115, 232, 0.4);
    }
    .google-custom-btn:hover {
      background: #1557b0;
      transform: translateY(-1px);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: 0; top: 0; bottom: 0;
        transform: translateX(-100%);
      }
      .sidebar.open { transform: translateX(0); }
    }
  </style>
</head>
<body>

  <!-- Left Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <div class="logo-container" onclick="startNewChat()">
        <img src="/logo.png" alt="Mehkesh AI" class="brand-logo-img" onerror="this.onerror=null; this.src='/logo.svg';">
        <span>Mehkesh AI</span>
        <span class="logo-badge">DEV</span>
      </div>
      <button class="icon-btn" id="closeSidebarBtn" style="display:none;">✕</button>
    </div>

    <!-- Primary + New Chat CTA -->
    <button class="new-chat-btn" id="newChatBtn">
      <span>+ New Chat</span>
    </button>

    <!-- Sidebar Navigation -->
    <nav class="sidebar-nav">
      <div class="nav-item active" id="navChat" onclick="startNewChat()">
        <span>💬</span>
        <span>Chat</span>
      </div>
      <div class="nav-item" id="navMemory" onclick="openModal('memoryModal')">
        <span>🧠</span>
        <span>Memory</span>
      </div>
      <div class="nav-item" id="navBriefing" onclick="showDailyBriefing()">
        <span>📰</span>
        <span>Daily Briefing</span>
      </div>
      <div class="nav-item" id="navUsage" onclick="openModal('quotaModal')">
        <span>⚡</span>
        <span>Usage & Neurons</span>
      </div>
      <div class="nav-item" id="navSettings" onclick="openModal('settingsModal')">
        <span>⚙️</span>
        <span>Settings</span>
      </div>
    </nav>

    <div class="sidebar-section-title">Recent Conversations</div>
    <div class="sessions-list" id="sessionsList">
      <!-- Chat threads rendered dynamically -->
    </div>

    <!-- User Profile Footer Card -->
    <div class="sidebar-user-card" id="userProfileCard" onclick="openModal('settingsModal')">
      <div class="user-card-info">
        <div class="user-avatar-circle" id="userAvatar">M</div>
        <div class="user-names">
          <span class="user-name-text" id="userDisplayName">Mehkesh</span>
          <span class="user-role-badge" id="userRoleBadge">Pro User (Free)</span>
        </div>
      </div>
      <button class="icon-btn" id="logoutBtn" title="Sign out / Lock" onclick="event.stopPropagation(); handleLogout();">🔒</button>
    </div>
  </aside>

  <!-- Main View -->
  <main class="main">
    <!-- Topbar -->
    <header class="topbar">
      <div class="topbar-left">
        <button class="icon-btn" id="openSidebarBtn" title="Toggle Sidebar">☰</button>
        <div class="status-pill">
          <span class="status-dot"></span>
          <span>ONLINE</span>
        </div>
        <button class="hands-free-btn" id="handsFreeBtn" title="Wake word: 'Hey Mehkesh'">
          <span>🎙️</span>
          <span id="handsFreeLabel">Hands-Free</span>
        </button>
      </div>

      <div class="topbar-right">
        <!-- Live Quota Pill Top Right -->
        <div class="quota-pill-top" id="topQuotaPill" title="Daily Edge Neurons Pool" onclick="openModal('quotaModal')" style="cursor:pointer;">
          <span>⚡</span>
          <span id="topQuotaText">2,485 / 10,000 Neurons</span>
        </div>

        <!-- Model Selector -->
        <select class="model-selector" id="modelSelector">
          <option value="auto">⚡ Auto-Router</option>
          <option value="@cf/meta/llama-4-scout-17b-16e-instruct">Llama 4 Scout (17B)</option>
          <option value="@cf/qwen/qwen2.5-coder-32b-instruct">Qwen 2.5 Coder (32B)</option>
          <option value="@cf/meta/llama-3.3-70b-instruct-fp8-fast">Llama 3.3 70B (Reasoning)</option>
        </select>

        <!-- Voice Toggle -->
        <button class="icon-btn" id="voiceToggle" title="Voice Output Mode">🗣️</button>
        <button class="icon-btn" onclick="openModal('settingsModal')" title="Settings & Admin">⚙️</button>
      </div>
    </header>

    <!-- Chat & Hero Container -->
    <div class="chat-container" id="chatContainer">
      <div class="hero-view" id="heroView">
        <div class="hero-logo-box">
          <img src="/logo.png" alt="Mehkesh AI" style="width:100%; height:100%; object-fit:contain;" onerror="this.onerror=null; this.src='/logo.svg';">
        </div>
        <h1 class="hero-title">Hello, I'm Mehkesh AI</h1>
        <p class="hero-sub">Your personal, multi-model AI assistant at the edge.</p>
      </div>
    </div>

    <!-- Neon Synthwave Mountain Backdrop -->
    <div class="neon-backdrop-glow"></div>

    <!-- Floating Input Dock -->
    <div class="input-dock">
      <div id="attachmentPreviewBox" class="attachment-preview-box" style="display:none;">
        <span style="font-size:14px;">📎</span>
        <span id="attachedFileName" style="max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">file</span>
        <button onclick="removeAttachment()" title="Remove attachment" style="background:none; border:none; color:#fff; cursor:pointer; font-weight:bold; margin-left:4px;">✕</button>
      </div>

      <div class="input-wrapper">
        <button class="icon-btn" id="attachBtn" title="Attach Image or File">📎</button>
        <input type="file" id="fileInput" accept="image/*,.txt,.md,.json,.py,.js" style="display:none;">

        <textarea
          class="chat-textarea"
          id="chatInput"
          rows="1"
          placeholder="Ask anything..."
        ></textarea>

        <div class="input-actions">
          <button class="icon-btn" id="micBtn" title="Voice Input (Whisper Large v3)">🎙️</button>
          <button class="send-btn" id="sendBtn" title="Send (Enter)">➔</button>
          <button class="icon-btn" id="stopBtn" title="Stop generating" style="display:none; color:var(--red);">⏹</button>
        </div>
      </div>

      <!-- Quick Action Pills -->
      <div class="quick-pills-row">
        <div class="quick-pill" onclick="triggerCodePrompt()">
          <span>&lt;/&gt;</span>
          <span>Code</span>
        </div>
        <div class="quick-pill" onclick="triggerReasoningPrompt()">
          <span>💡</span>
          <span>Reason</span>
        </div>
        <div class="quick-pill" onclick="triggerImagePrompt()">
          <span>🖼️</span>
          <span>Create Image</span>
        </div>
        <div class="quick-pill" onclick="startMicRecording()">
          <span>🎙️</span>
          <span>Transcribe</span>
        </div>
        <div class="quick-pill" onclick="triggerTranslatePrompt()">
          <span>🌐</span>
          <span>Translate</span>
        </div>
      </div>
    </div>
  </main>

  <!-- Auth Modal (Google Sign-In & Master Password) -->
  <div class="modal-backdrop" id="authModal" style="display:none;">
    <div class="modal-card" style="max-width:420px; text-align:center;">
      <div style="margin-bottom:16px; display:flex; justify-content:center;">
        <img src="/logo.png" alt="Mehkesh AI" style="height:64px; width:auto; border-radius:14px; box-shadow:0 0 28px rgba(124,58,237,0.4);" onerror="this.onerror=null; this.src='/logo.svg';">
      </div>
      <h2 style="font-size:1.35rem; margin-bottom:6px;">Mehkesh AI</h2>
      <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:20px;">
        Production-grade multi-model AI assistant at the edge.
      </p>

      <div class="tab-row" style="justify-content:center;">
        <button class="tab-btn active" id="tabGoogleAuth" onclick="switchAuthTab('google')">Google Sign-In</button>
        <button class="tab-btn" id="tabMasterAuth" onclick="switchAuthTab('master')">Master Admin</button>
      </div>

      <!-- Tab 1: Google OAuth -->
      <div id="authGooglePane">
        <p style="font-size:0.8rem; color:var(--text-dim); margin-bottom:16px;">
          Sign in or sign up with your Google account. Zero passwords required.
        </p>

        <!-- Declarative Google GSI Divs -->
        <div id="g_id_onload"
             data-client_id="${googleClientId}"
             data-callback="handleGoogleCredentialResponse"
             data-auto_prompt="false"
             data-cancel_on_tap_outside="true">
        </div>

        <div id="googleBtnWrapper" style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:46px; gap:10px;">
          <div id="googleBtnContainer" class="g_id_signin"
               data-type="standard"
               data-shape="pill"
               data-theme="filled_blue"
               data-text="continue_with"
               data-size="large"
               data-logo_alignment="left"
               data-width="280">
          </div>

          <!-- Fallback Google Button in case iframe rendering delays or origin check needed -->
          <button id="googleCustomBtn" class="google-custom-btn" onclick="triggerGoogleSignIn()" style="display:none;">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div id="googleClientWarning" style="color:var(--amber); font-size:0.75rem; margin-top:12px; display:none;">
          ⚠️ GOOGLE_CLIENT_ID is not configured in wrangler.toml yet. Master Password can be used anytime.
        </div>
        <div id="googleOriginWarning" style="color:var(--text-dim); font-size:0.72rem; margin-top:12px; line-height:1.4;">
          🔒 Secured via Google Identity Services. Ensure <code>http://localhost:3001</code> is added to Authorized JavaScript Origins in Google Cloud Console.
        </div>
      </div>

      <!-- Tab 2: Master Password for Mehkesh -->
      <div id="authMasterPane" style="display:none;">
        <p style="font-size:0.8rem; color:var(--text-dim); margin-bottom:14px;">
          Master password unlock for <strong>Mehkesh</strong> (Full Admin Control).
        </p>
        <div class="form-group">
          <input type="password" id="masterPasswordInput" class="form-input" placeholder="Enter Master Password" autofocus>
        </div>
        <button class="primary-btn" id="masterPasswordSubmit">Unlock Master Control</button>
      </div>

      <div id="authErrorMsg" style="color:var(--red); font-size:0.82rem; margin-top:14px; display:none;"></div>
    </div>
  </div>

  <!-- Settings & Master Admin Control Modal -->
  <div class="modal-backdrop" id="settingsModal" style="display:none;">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">⚙️ Settings & Controls</h3>
        <button class="icon-btn" onclick="closeModal('settingsModal')">✕</button>
      </div>

      <div class="tab-row">
        <button class="tab-btn active" id="tabSettingsProfile" onclick="switchSettingsTab('profile')">Profile</button>
        <button class="tab-btn" id="tabSettingsAdmin" onclick="switchSettingsTab('admin')" style="display:none;">👑 Master Admin</button>
      </div>

      <!-- Profile Tab -->
      <div id="settingsProfilePane">
        <div class="form-group">
          <label class="form-label">Display Name</label>
          <input type="text" id="profileNameInput" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">Custom Instructions (System Persona)</label>
          <textarea id="profileInstructionsInput" class="form-textarea" rows="4"></textarea>
        </div>
        <button class="primary-btn" onclick="saveProfile()">Save Settings</button>
      </div>

      <!-- Admin Tab (Only for Mehkesh / role === 'admin') -->
      <div id="settingsAdminPane" style="display:none;">
        <h4 style="font-size:0.95rem; margin-bottom:12px; color:var(--purple);">Edge Resource & User Management</h4>
        
        <div style="background:var(--bg-card); padding:12px; border-radius:8px; margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:6px;">
            <span>Cloudflare Free Pool Today</span>
            <span id="adminPoolText">0 / 10,000</span>
          </div>
          <div style="height:6px; background:#1e2436; border-radius:4px; overflow:hidden;">
            <div id="adminPoolBar" style="height:100%; background:linear-gradient(90deg, #7c3aed, #ec4899); width:0%;"></div>
          </div>
        </div>

        <div style="margin-bottom:16px;">
          <label class="form-label">Default New User Daily Budget (Neurons)</label>
          <div style="display:flex; gap:8px;">
            <input type="number" id="defaultBudgetInput" class="form-input" style="width:140px;" value="2000">
            <button class="primary-btn" style="width:auto; padding:0 16px;" onclick="saveAdminConfig()">Save Default</button>
          </div>
        </div>

        <h4 style="font-size:0.88rem; margin-bottom:8px;">Registered Users</h4>
        <div style="overflow-x:auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Daily Budget</th>
                <th>Used Today</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="adminUsersTbody">
              <!-- Rendered via API -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Memory Bank Modal -->
  <div class="modal-backdrop" id="memoryModal" style="display:none;">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">🧠 Second Brain Long-Term Memories</h3>
        <button class="icon-btn" onclick="closeModal('memoryModal')">✕</button>
      </div>
      <div id="memoryList" style="display:flex; flex-direction:column; gap:8px; max-height:300px; overflow-y:auto; margin-bottom:16px;"></div>
      <div class="form-group">
        <label class="form-label">Add Memory Fact</label>
        <div style="display:flex; gap:8px;">
          <input type="text" id="newMemoryInput" class="form-input" placeholder="e.g. Building AI projects on Cloudflare Workers">
          <button class="primary-btn" style="width:auto; padding:0 16px;" onclick="addMemory()">Save</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Quota Modal -->
  <div class="modal-backdrop" id="quotaModal" style="display:none;">
    <div class="modal-card" style="max-width:440px;">
      <div class="modal-header">
        <h3 class="modal-title">⚡ Neuron Quota & Analytics</h3>
        <button class="icon-btn" onclick="closeModal('quotaModal')">✕</button>
      </div>
      <div style="display:flex; flex-direction:column; gap:16px; font-size:0.88rem;">
        <div>
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <span id="quotaModalLabel">Daily Neuron Consumption</span>
            <span id="quotaModalNumbers">0 / 2,000</span>
          </div>
          <div style="height:8px; background:#1e2436; border-radius:4px; overflow:hidden;">
            <div id="quotaModalBar" style="height:100%; background:linear-gradient(90deg, #7c3aed, #ec4899); width:0%;"></div>
          </div>
        </div>
        <p style="color:var(--text-muted); font-size:0.8rem; line-height:1.5;">
          Mehkesh AI runs 100% on Cloudflare's serverless edge tier. Daily quotas reset every night at 00:00 UTC.
        </p>
      </div>
    </div>
  </div>

  <!-- Daily Briefing Modal -->
  <div class="modal-backdrop" id="briefingModal" style="display:none;">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">📰 Today's Edge Daily Briefing</h3>
        <button class="icon-btn" onclick="closeModal('briefingModal')">✕</button>
      </div>
      <div id="briefingContent" class="briefing-rendered-content" style="font-size:0.92rem; line-height:1.7; color:#e2e8f0; margin-bottom:18px;"></div>
      <button class="primary-btn" onclick="refreshBriefing()">🔄 Refresh Briefing</button>
    </div>
  </div>

  <!-- Toast Container -->
  <div class="toast-container" id="toastContainer"></div>

  <script>
    // ========================================================================
    // Application State
    // ========================================================================
    const GOOGLE_CLIENT_ID = "${googleClientId}";
    let currentUser = null;
    let currentSessionId = null;
    let currentMessages = [];
    let isGenerating = false;
    let activeAbortController = null;
    let attachedImageData = null;
    let handsFreeActive = false;
    let speechRecognition = null;
    let useBrowserVoice = true;

    // ========================================================================
    // Initialization & Auth Flow
    // ========================================================================
    document.addEventListener("DOMContentLoaded", async () => {
      setupSpeechRecognition();
      setupEventListeners();
      await checkAuthStatus();
    });

    async function checkAuthStatus() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data && data.authenticated && data.user) {
          currentUser = data.user;
          renderUserUI();
          loadSessions();
          updateQuotaDisplay();
          closeModal("authModal");
        } else {
          showAuthModal();
        }
      } catch (e) {
        showAuthModal();
      }
    }

    function showAuthModal() {
      openModal("authModal");
      window.initGoogleSignIn();
    }

    let gsiInitialized = false;
    window.initGoogleSignIn = function() {
      if (!GOOGLE_CLIENT_ID) {
        const warning = document.getElementById("googleClientWarning");
        if (warning) warning.style.display = "block";
        return;
      }

      if (typeof google === "undefined" || !google.accounts || !google.accounts.id) {
        if (!window._gsiRetryCount) window._gsiRetryCount = 0;
        if (window._gsiRetryCount++ < 50) {
          setTimeout(window.initGoogleSignIn, 80);
        } else {
          const customBtn = document.getElementById("googleCustomBtn");
          if (customBtn) customBtn.style.display = "flex";
        }
        return;
      }

      if (gsiInitialized) return;

      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: window.handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        const container = document.getElementById("googleBtnContainer");
        if (container) {
          container.innerHTML = "";
          google.accounts.id.renderButton(container, {
            theme: "filled_blue",
            size: "large",
            shape: "pill",
            width: 280,
            text: "continue_with",
            logo_alignment: "left",
          });
          gsiInitialized = true;
        }
      } catch (err) {
        console.warn("GSI programmatic render warning:", err);
        const customBtn = document.getElementById("googleCustomBtn");
        if (customBtn) customBtn.style.display = "flex";
      }
    };

    window.triggerGoogleSignIn = function() {
      if (typeof google !== "undefined" && google.accounts && google.accounts.id) {
        try {
          google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              showAuthError("Google prompt suppressed: please ensure http://localhost:3001 is listed under Authorized JavaScript Origins in your Google Cloud Console.");
            }
          });
        } catch (e) {
          showAuthError("Google Sign-In prompt error: " + e.message);
        }
      } else {
        showAuthError("Google Identity Services script is still loading or blocked. You can also sign in via Master Admin tab.");
      }
    };

    window.handleGoogleCredentialResponse = async function(response) {
      if (!response || !response.credential) return;
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        });
        const data = await res.json();
        if (data.ok && data.user) {
          currentUser = data.user;
          renderUserUI();
          closeModal("authModal");
          loadSessions();
          updateQuotaDisplay();
          showToast("Signed in as " + data.user.full_name, "success");
        } else {
          showAuthError(data.error || "Google verification failed");
        }
      } catch (err) {
        showAuthError("Connection error during Google sign-in: " + err.message);
      }
    };

    // Master Password Form Submit (Mehkesh)
    document.getElementById("masterPasswordSubmit").addEventListener("click", async () => {
      const password = document.getElementById("masterPasswordInput").value.trim();
      if (!password) return;
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        const data = await res.json();
        if (data.ok && data.user) {
          currentUser = data.user;
          renderUserUI();
          closeModal("authModal");
          loadSessions();
          updateQuotaDisplay();
          showToast(data.message || "Master authenticated", "success");
        } else {
          showAuthError(data.error || "Invalid master password");
        }
      } catch (e) {
        showAuthError("Authentication request failed");
      }
    });

    async function handleLogout() {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {}
      currentUser = null;
      window.location.reload();
    }

    function renderUserUI() {
      if (!currentUser) return;
      document.getElementById("userDisplayName").textContent = currentUser.full_name || "Mehkesh";
      const roleBadge = document.getElementById("userRoleBadge");
      const isAdmin = currentUser.role === "admin";
      roleBadge.textContent = isAdmin ? "Master Admin 👑" : "Pro User (Free)";
      roleBadge.className = "user-role-badge" + (isAdmin ? " admin" : "");

      const avatarBox = document.getElementById("userAvatar");
      if (currentUser.picture) {
        avatarBox.innerHTML = \`<img src="\${currentUser.picture}" alt="\${currentUser.full_name}">\`;
      } else {
        avatarBox.textContent = (currentUser.full_name || "M").charAt(0).toUpperCase();
      }

      if (isAdmin) {
        document.getElementById("tabSettingsAdmin").style.display = "inline-block";
      }
    }

    // ========================================================================
    // Live Quota Updates
    // ========================================================================
    async function updateQuotaDisplay() {
      try {
        const res = await fetch("/api/quota");
        if (!res.ok) return;
        const q = await res.json();

        const label = q.is_admin ? "Cloudflare Edge Pool" : "Your Daily Quota";
        const text = \`⚡ \${q.used_today.toLocaleString()} / \${q.daily_limit.toLocaleString()} Neurons\`;
        document.getElementById("topQuotaText").textContent = text;
        document.getElementById("quotaModalLabel").textContent = label;
        document.getElementById("quotaModalNumbers").textContent = \`\${q.used_today.toLocaleString()} / \${q.daily_limit.toLocaleString()}\`;
        document.getElementById("quotaModalBar").style.width = q.percent_used + "%";
      } catch {}
    }

    // ========================================================================
    // Sessions Management
    // ========================================================================
    async function loadSessions() {
      try {
        const res = await fetch("/api/sessions");
        if (!res.ok) return;
        const sessions = await res.json();
        const list = document.getElementById("sessionsList");
        list.innerHTML = "";
        if (!sessions || sessions.length === 0) {
          list.innerHTML = '<div style="color:var(--text-dim); font-size:0.75rem; text-align:center; padding:18px 8px;">No conversations yet</div>';
          return;
        }
        sessions.forEach((s) => {
          const item = document.createElement("div");
          item.className = "session-item" + (s.id === currentSessionId ? " active" : "");
          item.dataset.sessionId = s.id;
          item.innerHTML = \`
            <span class="session-title" title="\${escapeHtml(s.title)}">\${escapeHtml(s.title || "Chat Session")}</span>
            <button class="session-del-btn" title="Delete conversation" onclick="event.stopPropagation(); deleteSession('\${s.id}')">✕</button>
          \`;
          item.onclick = () => selectSession(s.id);
          list.appendChild(item);
        });
      } catch {}
    }

    async function createSessionInternal(initialTitle = "New Chat") {
      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: initialTitle }),
        });
        if (res.ok) {
          const sess = await res.json();
          currentSessionId = sess.id;
          loadSessions();
          return sess.id;
        }
      } catch {}
      currentSessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
      return currentSessionId;
    }

    async function selectSession(sessionId) {
      if (isGenerating) return;
      currentSessionId = sessionId;
      document.querySelectorAll(".session-item").forEach((el) => {
        el.classList.toggle("active", el.dataset.sessionId === sessionId);
      });
      const sidebar = document.getElementById("sidebar");
      if (sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
      }
      try {
        const res = await fetch(\`/api/sessions/\${sessionId}\`);
        if (!res.ok) throw new Error("Failed to load session");
        const data = await res.json();
        currentMessages = (data.messages || []).map((m) => ({
          role: m.role,
          content: m.content,
          has_media: Boolean(m.has_media),
        }));
        renderFullChat(currentMessages);
      } catch (err) {
        showToast("Could not load session", "error");
      }
    }

    async function deleteSession(sessionId) {
      try {
        const res = await fetch(\`/api/sessions/\${sessionId}\`, { method: "DELETE" });
        if (res.ok) {
          if (currentSessionId === sessionId) {
            startNewChat();
          }
          loadSessions();
          showToast("Conversation deleted", "info");
        }
      } catch {}
    }

    function startNewChat() {
      if (isGenerating) return;
      currentSessionId = null;
      currentMessages = [];
      showHeroView();
      document.querySelectorAll(".session-item").forEach((el) => el.classList.remove("active"));
      const input = document.getElementById("chatInput");
      input.value = "";
      input.style.height = "auto";
      input.focus();
      removeAttachment();
      const sidebar = document.getElementById("sidebar");
      if (sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
      }
    }

    function showHeroView() {
      const container = document.getElementById("chatContainer");
      container.innerHTML = \`
        <div class="hero-view" id="heroView">
          <div class="hero-logo-box">
            <img src="/logo.png" alt="Mehkesh AI" style="width:100%; height:100%; object-fit:contain;" onerror="this.onerror=null; this.src='/logo.svg';">
          </div>
          <h1 class="hero-title">Hello, I'm Mehkesh AI</h1>
          <p class="hero-sub">Your personal, multi-model AI assistant at the edge.</p>
        </div>
      \`;
    }

    function appendMessageRow(role, contentHtml, imageBase64 = null) {
      const container = document.getElementById("chatContainer");
      const hero = document.getElementById("heroView");
      if (hero) hero.remove();

      const row = document.createElement("div");
      row.className = "message-row " + role;

      const avatar = document.createElement("div");
      avatar.className = "msg-avatar " + role;
      if (role === "assistant") {
        avatar.textContent = "M";
      } else {
        if (currentUser && currentUser.picture) {
          avatar.innerHTML = \`<img src="\${currentUser.picture}" alt="User" style="width:100%; height:100%; border-radius:10px; object-fit:cover;">\`;
        } else {
          avatar.textContent = ((currentUser && currentUser.full_name) ? currentUser.full_name.charAt(0) : "U").toUpperCase();
        }
      }

      const bubble = document.createElement("div");
      bubble.className = "msg-bubble";

      if (imageBase64) {
        const img = document.createElement("img");
        img.src = imageBase64;
        img.style.cssText = "max-width:260px; max-height:200px; border-radius:10px; display:block; margin-bottom:10px; border:1px solid rgba(255,255,255,0.15); box-shadow:0 4px 16px rgba(0,0,0,0.4);";
        bubble.appendChild(img);
      }

      const contentBox = document.createElement("div");
      contentBox.className = "msg-content-text";
      contentBox.innerHTML = contentHtml;
      bubble.appendChild(contentBox);

      row.appendChild(avatar);
      row.appendChild(bubble);
      container.appendChild(row);

      container.scrollTop = container.scrollHeight;
      return { row, bubble: contentBox };
    }

    function renderFullChat(messages) {
      const container = document.getElementById("chatContainer");
      container.innerHTML = "";
      if (!messages || messages.length === 0) {
        showHeroView();
        return;
      }
      messages.forEach((msg) => {
        let contentHtml = "";
        if (msg.role === "assistant") {
          contentHtml = marked.parse(DOMPurify.sanitize(msg.content || ""));
        } else {
          contentHtml = escapeHtml(msg.content || "");
        }
        const { bubble } = appendMessageRow(msg.role, contentHtml);
        if (msg.role === "assistant") {
          bubble.querySelectorAll("pre code").forEach((b) => hljs.highlightElement(b));
          addCopyButtons(bubble);
        }
      });
      container.scrollTop = container.scrollHeight;
    }

    function addCopyButtons(parentEl) {
      if (!parentEl) return;
      const pres = parentEl.querySelectorAll("pre");
      pres.forEach((pre) => {
        if (pre.querySelector(".copy-code-btn")) return;
        const btn = document.createElement("button");
        btn.className = "copy-code-btn";
        btn.textContent = "Copy";
        btn.onclick = async (e) => {
          e.stopPropagation();
          const code = pre.querySelector("code")?.textContent || pre.textContent;
          try {
            await navigator.clipboard.writeText(code);
            btn.textContent = "Copied! ✓";
            btn.classList.add("copied");
            setTimeout(() => {
              btn.textContent = "Copy";
              btn.classList.remove("copied");
            }, 2000);
          } catch (err) {
            showToast("Failed to copy", "error");
          }
        };
        pre.appendChild(btn);
      });
    }

    function removeAttachment() {
      attachedImageData = null;
      const box = document.getElementById("attachmentPreviewBox");
      if (box) box.style.display = "none";
      const fileInput = document.getElementById("fileInput");
      if (fileInput) fileInput.value = "";
    }

    function triggerCodePrompt() {
      const selector = document.getElementById("modelSelector");
      if (selector) selector.value = "@cf/qwen/qwen2.5-coder-32b-instruct";
      const input = document.getElementById("chatInput");
      input.value = "Write an optimized edge function in JavaScript for: ";
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
      showToast("Switched to Qwen 2.5 Coder (32B)", "info");
    }

    function triggerReasoningPrompt() {
      const selector = document.getElementById("modelSelector");
      if (selector) selector.value = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
      const input = document.getElementById("chatInput");
      input.value = "Analyze and reason step-by-step through: ";
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
      showToast("Switched to Llama 3.3 70B (Reasoning)", "info");
    }

    function triggerImagePrompt() {
      const input = document.getElementById("chatInput");
      input.value = "/imagine A futuristic cybernetic skyline in purple and cyan neon";
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }

    function triggerTranslatePrompt() {
      const input = document.getElementById("chatInput");
      input.value = "/translate hin_Deva Good morning! Ready for today's goals.";
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }

    window.resetToHero = startNewChat;
    window.renderMessages = () => renderFullChat(currentMessages);

    // ========================================================================
    // Chat & Streaming Implementation
    // ========================================================================
    async function sendMessage(text) {
      const prompt = text || document.getElementById("chatInput").value.trim();
      if (!prompt || isGenerating) return;

      document.getElementById("chatInput").value = "";
      document.getElementById("chatInput").style.height = "auto";

      // 1. Slash Command: /imagine
      if (prompt.startsWith("/imagine ")) {
        const imagePrompt = prompt.slice(9).trim();
        if (!currentSessionId) {
          await createSessionInternal("🎨 " + imagePrompt.slice(0, 30));
        }
        appendMessageRow("user", escapeHtml(prompt));
        const assistantRow = appendMessageRow(
          "assistant",
          '<div class="typing-dots"><span></span><span></span><span></span></div><span style="font-size:0.82rem; color:var(--text-muted); margin-left:8px;">Generating image with FLUX.1 Schnell at the edge...</span>'
        );
        isGenerating = true;
        document.getElementById("sendBtn").style.display = "none";
        document.getElementById("stopBtn").style.display = "flex";
        try {
          const res = await fetch("/api/imagine", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: imagePrompt, session_id: currentSessionId }),
          });
          const data = await res.json();
          if (data.image) {
            assistantRow.bubble.innerHTML = \`
              <div style="margin-bottom:8px; font-weight:600; color:var(--purple);">🎨 FLUX.1 Schnell Generated:</div>
              <img src="\${data.image}" alt="\${escapeHtml(imagePrompt)}" style="max-width:100%; border-radius:12px; border:1px solid rgba(139,92,246,0.3); box-shadow:0 8px 30px rgba(0,0,0,0.5);">
              <div style="margin-top:10px;"><a href="\${data.image}" download="mehkesh-ai-flux.jpg" class="primary-btn" style="display:inline-block; font-size:0.75rem; padding:5px 12px; text-decoration:none; width:auto;">⬇ Download Image</a></div>
            \`;
            currentMessages.push({ role: "user", content: prompt });
            currentMessages.push({ role: "assistant", content: \`![\${imagePrompt}](\${data.image})\` });
          } else {
            assistantRow.bubble.innerHTML = \`<span style="color:var(--red);">⚠️ \${data.error || "Failed to generate image"}</span>\`;
          }
        } catch (e) {
          assistantRow.bubble.innerHTML = \`<span style="color:var(--red);">⚠️ Image generation request failed</span>\`;
        } finally {
          isGenerating = false;
          document.getElementById("sendBtn").style.display = "flex";
          document.getElementById("stopBtn").style.display = "none";
          updateQuotaDisplay();
          loadSessions();
        }
        return;
      }

      // 2. Slash Command: /translate
      if (prompt.startsWith("/translate ")) {
        const parts = prompt.slice(11).trim().split(" ").filter(Boolean);
        let targetLang = "hin_Deva";
        let textToTranslate = "";
        if (parts[0] && parts[0].includes("_")) {
          targetLang = parts[0];
          textToTranslate = parts.slice(1).join(" ");
        } else {
          textToTranslate = parts.join(" ");
        }
        if (!currentSessionId) {
          await createSessionInternal("🌐 " + textToTranslate.slice(0, 30));
        }
        appendMessageRow("user", escapeHtml(prompt));
        const assistantRow = appendMessageRow(
          "assistant",
          '<div class="typing-dots"><span></span><span></span><span></span></div><span style="font-size:0.82rem; color:var(--text-muted); margin-left:8px;">Translating with IndicTrans2...</span>'
        );
        isGenerating = true;
        document.getElementById("sendBtn").style.display = "none";
        document.getElementById("stopBtn").style.display = "flex";
        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: textToTranslate, target_lang: targetLang, session_id: currentSessionId }),
          });
          const data = await res.json();
          if (data.translation) {
            assistantRow.bubble.innerHTML = \`
              <div style="margin-bottom:6px; font-weight:600; color:var(--cyan);">🌐 IndicTrans2 Translation (\${targetLang}):</div>
              <div style="font-size:1.05rem; padding:8px 0; color:#fff;">\${escapeHtml(data.translation)}</div>
            \`;
            currentMessages.push({ role: "user", content: prompt });
            currentMessages.push({ role: "assistant", content: data.translation });
          } else {
            assistantRow.bubble.innerHTML = \`<span style="color:var(--red);">⚠️ \${data.error || "Translation failed"}</span>\`;
          }
        } catch (e) {
          assistantRow.bubble.innerHTML = \`<span style="color:var(--red);">⚠️ Translation request failed</span>\`;
        } finally {
          isGenerating = false;
          document.getElementById("sendBtn").style.display = "flex";
          document.getElementById("stopBtn").style.display = "none";
          updateQuotaDisplay();
          loadSessions();
        }
        return;
      }

      // 3. Regular Chat Streaming
      if (!currentSessionId) {
        const autoTitle = prompt.length > 36 ? prompt.slice(0, 36) + "..." : prompt;
        await createSessionInternal(autoTitle);
      }

      const sentImageData = attachedImageData;
      removeAttachment();

      // Add user message
      const userMsg = { role: "user", content: prompt, has_image: Boolean(sentImageData) };
      currentMessages.push(userMsg);
      appendMessageRow("user", escapeHtml(prompt), sentImageData);

      // Add assistant placeholder row
      const assistantMsg = { role: "assistant", content: "" };
      currentMessages.push(assistantMsg);
      const assistantRow = appendMessageRow("assistant", '<div class="typing-dots"><span></span><span></span><span></span></div>');

      isGenerating = true;
      document.getElementById("sendBtn").style.display = "none";
      document.getElementById("stopBtn").style.display = "flex";

      activeAbortController = new AbortController();

      try {
        const chosenOverride = document.getElementById("modelSelector").value;
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: activeAbortController.signal,
          body: JSON.stringify({
            session_id: currentSessionId,
            messages: currentMessages.slice(0, -1),
            model_override: chosenOverride,
            has_image: Boolean(sentImageData),
            image_data: sentImageData,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          assistantMsg.content = "⚠️ " + (errData.error || "Generation error");
          assistantRow.bubble.innerHTML = \`<span style="color:var(--red);">\${escapeHtml(assistantMsg.content)}</span>\`;
          isGenerating = false;
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\\n");
          buffer = lines.pop();

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const dataStr = trimmed.slice(5).trim();
            if (dataStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.response) accumulatedText += parsed.response;
            } catch {
              if (dataStr) accumulatedText += dataStr;
            }
          }

          if (accumulatedText) {
            assistantMsg.content = accumulatedText;
            assistantRow.bubble.innerHTML = marked.parse(DOMPurify.sanitize(accumulatedText));
            const container = document.getElementById("chatContainer");
            container.scrollTop = container.scrollHeight;
          }
        }

        // Finalize markdown, apply syntax highlighting, add copy buttons
        if (accumulatedText) {
          assistantMsg.content = accumulatedText;
          assistantRow.bubble.innerHTML = marked.parse(DOMPurify.sanitize(accumulatedText));
          assistantRow.bubble.querySelectorAll("pre code").forEach((b) => hljs.highlightElement(b));
          addCopyButtons(assistantRow.bubble);
          const container = document.getElementById("chatContainer");
          container.scrollTop = container.scrollHeight;
        }

        if (useBrowserVoice && assistantMsg.content && window.speechSynthesis) {
          speakBrowser(assistantMsg.content.slice(0, 250));
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          assistantMsg.content += "\\n\\n[Connection interrupted]";
          assistantRow.bubble.innerHTML = marked.parse(DOMPurify.sanitize(assistantMsg.content));
        }
      } finally {
        isGenerating = false;
        document.getElementById("sendBtn").style.display = "flex";
        document.getElementById("stopBtn").style.display = "none";
        updateQuotaDisplay();
        loadSessions();
      }
    }

    // ========================================================================
    // Push-to-Talk & Hands-Free
    // ========================================================================
    function setupSpeechRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      speechRecognition = new SpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = false;

      speechRecognition.onresult = (e) => {
        const last = e.results[e.results.length - 1];
        const text = last[0].transcript.trim();
        if (handsFreeActive && text.toLowerCase().includes("hey mehkesh")) {
          const cleanPrompt = text.toLowerCase().replace(/hey mehkesh/g, "").trim();
          if (cleanPrompt) sendMessage(cleanPrompt);
        }
      };
    }

    function startMicRecording() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        showToast("Speech recognition not supported in this browser", "error");
        return;
      }
      const recog = new SpeechRecognition();
      recog.start();
      showToast("Listening...", "info");
      recog.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        document.getElementById("chatInput").value = transcript;
        sendMessage(transcript);
      };
    }

    function speakBrowser(text) {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#\`_]/g, ""));
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }

    // ========================================================================
    // Second Brain Long-Term Memories
    // ========================================================================
    async function loadMemories() {
      try {
        const res = await fetch("/api/memories");
        const list = await res.json();
        const container = document.getElementById("memoryList");
        container.innerHTML = "";
        list.forEach((m) => {
          const item = document.createElement("div");
          item.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:var(--bg-card); padding:8px 12px; border-radius:8px; font-size:0.84rem;";
          item.innerHTML = \`
            <span>\${escapeHtml(m.fact)}</span>
            <button class="icon-btn" onclick="deleteMemory('\${m.id}')" style="color:var(--red);">✕</button>
          \`;
          container.appendChild(item);
        });
      } catch {}
    }

    async function addMemory() {
      const input = document.getElementById("newMemoryInput");
      const fact = input.value.trim();
      if (!fact) return;
      await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fact }),
      });
      input.value = "";
      loadMemories();
      showToast("Memory saved", "success");
    }

    async function deleteMemory(id) {
      await fetch(\`/api/memories/\${id}\`, { method: "DELETE" });
      loadMemories();
    }

    // ========================================================================
    // Daily Briefing (Personalized & Markdown Rendered)
    // ========================================================================
    async function showDailyBriefing() {
      openModal("briefingModal");
      const content = document.getElementById("briefingContent");
      content.innerHTML = "<p style='color:var(--text-muted);'>Loading your personalized briefing from edge...</p>";
      try {
        const res = await fetch("/api/briefing/today");
        const data = await res.json();
        if (data && data.summary) {
          content.innerHTML = marked.parse(DOMPurify.sanitize(data.summary));
        } else {
          content.innerHTML = "<p>No briefing recorded for today yet.</p>";
        }
      } catch {
        content.innerHTML = "<p style='color:var(--red);'>Failed to load daily briefing.</p>";
      }
    }

    async function refreshBriefing() {
      const content = document.getElementById("briefingContent");
      content.innerHTML = "<p style='color:var(--text-muted);'>Generating fresh personalized edge briefing with Llama 4 Scout...</p>";
      try {
        const res = await fetch("/api/briefing/refresh", { method: "POST" });
        const data = await res.json();
        const summary = data.briefing?.summary || data.summary;
        if (summary) {
          content.innerHTML = marked.parse(DOMPurify.sanitize(summary));
          showToast("Daily briefing refreshed", "success");
        } else {
          content.innerHTML = "<p>Briefing updated.</p>";
        }
      } catch {
        content.innerHTML = "<p style='color:var(--red);'>Failed to refresh briefing.</p>";
      }
    }

    // ========================================================================
    // Master Admin Controls
    // ========================================================================
    async function loadAdminData() {
      if (!currentUser || currentUser.role !== "admin") return;
      try {
        const [usersRes, statsRes, configRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/stats"),
          fetch("/api/admin/config"),
        ]);
        const users = await usersRes.json();
        const stats = await statsRes.json();
        const configs = await configRes.json();

        // Update Pool Bar
        document.getElementById("adminPoolText").textContent = \`\${stats.neurons_today.toLocaleString()} / 10,000 Neurons\`;
        document.getElementById("adminPoolBar").style.width = Math.min(100, Math.round((stats.neurons_today / 10000) * 100)) + "%";

        const tbody = document.getElementById("adminUsersTbody");
        tbody.innerHTML = "";
        users.forEach((u) => {
          const tr = document.createElement("tr");
          tr.innerHTML = \`
            <td><strong>\${escapeHtml(u.full_name)}</strong><br><span style="color:var(--text-dim); font-size:0.7rem;">\${escapeHtml(u.email)}</span></td>
            <td><span class="user-role-badge \${u.role}">\${u.role.toUpperCase()}</span></td>
            <td><input type="number" value="\${u.neuron_budget}" style="width:80px; background:var(--bg-input); border:1px solid var(--border); color:#fff; padding:3px 6px; border-radius:4px;" onchange="updateUserBudget('\${u.id}', this.value)"></td>
            <td>\${(u.neurons_today || 0).toLocaleString()}</td>
            <td>\${u.is_active ? '🟢 Active' : '🔴 Suspended'}</td>
            <td>
              <button class="icon-btn" onclick="toggleUserStatus('\${u.id}', \${u.is_active ? 0 : 1})" title="\${u.is_active ? 'Suspend' : 'Activate'}">\${u.is_active ? '⏸' : '▶'}</button>
            </td>
          \`;
          tbody.appendChild(tr);
        });
      } catch (err) {
        console.error("Admin data load error:", err);
      }
    }

    async function updateUserBudget(userId, budget) {
      await fetch(\`/api/admin/users/\${userId}/budget\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget }),
      });
      showToast("Budget updated", "success");
    }

    async function toggleUserStatus(userId, isActive) {
      await fetch(\`/api/admin/users/\${userId}/status\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: isActive }),
      });
      loadAdminData();
      showToast("User status updated", "info");
    }

    async function saveAdminConfig() {
      const budget = document.getElementById("defaultBudgetInput").value;
      await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ default_user_budget: budget }),
      });
      showToast("Default configuration updated", "success");
    }

    // ========================================================================
    // UI Helpers & Event Listeners
    // ========================================================================
    function quickPrompt(prompt) {
      document.getElementById("chatInput").value = prompt;
      sendMessage(prompt);
    }

    function switchAuthTab(tab) {
      document.getElementById("tabGoogleAuth").classList.toggle("active", tab === "google");
      document.getElementById("tabMasterAuth").classList.toggle("active", tab === "master");
      document.getElementById("authGooglePane").style.display = tab === "google" ? "block" : "none";
      document.getElementById("authMasterPane").style.display = tab === "master" ? "block" : "none";
      if (tab === "google") {
        window.initGoogleSignIn();
      }
    }

    function switchSettingsTab(tab) {
      document.getElementById("tabSettingsProfile").classList.toggle("active", tab === "profile");
      document.getElementById("tabSettingsAdmin").classList.toggle("active", tab === "admin");
      document.getElementById("settingsProfilePane").style.display = tab === "profile" ? "block" : "none";
      document.getElementById("settingsAdminPane").style.display = tab === "admin" ? "block" : "none";
      if (tab === "admin") loadAdminData();
    }

    function setupEventListeners() {
      document.getElementById("newChatBtn").addEventListener("click", () => startNewChat());
      document.getElementById("sendBtn").addEventListener("click", () => sendMessage());
      document.getElementById("stopBtn").addEventListener("click", () => {
        if (activeAbortController) activeAbortController.abort();
      });

      const chatInput = document.getElementById("chatInput");
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
      chatInput.addEventListener("input", () => {
        chatInput.style.height = "auto";
        chatInput.style.height = Math.min(chatInput.scrollHeight, 160) + "px";
      });

      document.getElementById("attachBtn").addEventListener("click", () => {
        document.getElementById("fileInput").click();
      });

      document.getElementById("fileInput").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          attachedImageData = evt.target.result;
          const fileNameEl = document.getElementById("attachedFileName");
          if (fileNameEl) fileNameEl.textContent = file.name;
          const previewBox = document.getElementById("attachmentPreviewBox");
          if (previewBox) previewBox.style.display = "flex";
          showToast("Attached: " + file.name, "info");
        };
        reader.readAsDataURL(file);
      });

      document.getElementById("micBtn").addEventListener("click", () => startMicRecording());

      document.getElementById("handsFreeBtn").addEventListener("click", () => {
        handsFreeActive = !handsFreeActive;
        const btn = document.getElementById("handsFreeBtn");
        btn.classList.toggle("active", handsFreeActive);
        if (handsFreeActive && speechRecognition) speechRecognition.start();
        showToast(handsFreeActive ? "Hands-Free listening active: say 'Hey Mehkesh'" : "Hands-Free turned off", "info");
      });

      document.getElementById("voiceToggle").addEventListener("click", () => {
        useBrowserVoice = !useBrowserVoice;
        showToast(useBrowserVoice ? "Voice narration ON" : "Voice narration OFF", "info");
      });

      document.getElementById("openSidebarBtn").addEventListener("click", () => {
        document.getElementById("sidebar").classList.toggle("open");
      });
    }

    function openModal(id) {
      const modal = document.getElementById(id);
      if (modal) modal.style.display = "flex";
      if (id === "memoryModal") loadMemories();
      if (id === "quotaModal") updateQuotaDisplay();
    }

    function closeModal(id) {
      const modal = document.getElementById(id);
      if (modal) modal.style.display = "none";
    }

    function showAuthError(msg) {
      const err = document.getElementById("authErrorMsg");
      err.textContent = msg;
      err.style.display = "block";
    }

    function showToast(msg, type = "info") {
      const container = document.getElementById("toastContainer");
      const toast = document.createElement("div");
      toast.className = "toast " + type;
      toast.textContent = msg;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 3200);
    }

    function escapeHtml(str) {
      if (!str) return "";
      return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  </script>
</body>
</html>`;
}
