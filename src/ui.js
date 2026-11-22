import { BRAND_LOGO_SVG } from "./logo.js";

export function getHTML(env = {}) {
  const googleClientId = env.GOOGLE_CLIENT_ID || "";
  const appName = env.APP_NAME || "Mehkesh AI";

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName}</title>
  <meta name="description" content="Mehkesh AI - Personal AI Intelligence">
  
  <!-- Exact Brand Favicon -->
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="shortcut icon" type="image/png" href="/logo.png">
  <link rel="apple-touch-icon" href="/logo.png">

  <!-- Highlight.js, Marked, DOMPurify, KaTeX (Edge CDNs) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.2/purify.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js"></script>

  <!-- Google Identity Services -->
  <script src="https://accounts.google.com/gsi/client" async defer onload="if(typeof initGoogleSignIn==='function')initGoogleSignIn()"></script>

  <style>
    :root {
      --bg-base: #090a0f;
      --bg-sidebar: #0d0f17;
      --bg-surface: #121522;
      --bg-surface-hover: #181d2e;
      --bg-input: #10131e;
      --border: rgba(255, 255, 255, 0.08);
      --border-hover: rgba(255, 255, 255, 0.16);
      --border-focus: rgba(139, 92, 246, 0.45);
      --purple: #8b5cf6;
      --purple-hover: #7c3aed;
      --cyan: #06b6d4;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #94a3b8;
      --red: #ef4444;
      --green: #10b981;
      --sidebar-w: 260px;
      --header-h: 56px;
    }

    html.light {
      --bg-base: #f8fafc;
      --bg-sidebar: #f1f5f9;
      --bg-surface: #ffffff;
      --bg-surface-hover: #e2e8f0;
      --bg-input: #ffffff;
      --border: rgba(0, 0, 0, 0.08);
      --border-hover: rgba(0, 0, 0, 0.16);
      --border-focus: rgba(139, 92, 246, 0.6);
      --purple: #7c3aed;
      --purple-hover: #6d28d9;
      --cyan: #0284c7;
      --text-main: #0f172a;
      --text-muted: #475569;
      --text-dim: #64748b;
      --red: #dc2626;
      --green: #059669;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      height: 100%;
      width: 100%;
      overflow: hidden;
      background: var(--bg-base);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      transition: background 0.2s ease, color 0.2s ease;
    }

    /* Root Layout */
    .app-root {
      display: flex;
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }

    /* Mobile Backdrop */
    .sidebar-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(4px);
      z-index: 40;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .sidebar-backdrop.active {
      display: block;
      opacity: 1;
    }

    /* Sidebar */
    .sidebar {
      width: var(--sidebar-w);
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      height: 100%;
      z-index: 50;
      transition: margin-left 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
      position: relative;
    }

    /* Desktop Collapsed Sidebar */
    .sidebar.collapsed {
      margin-left: calc(-1 * var(--sidebar-w));
      pointer-events: none;
      visibility: hidden;
    }

    .sidebar-header {
      height: var(--header-h);
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }
    .brand-box {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }
    .brand-logo-img {
      width: 26px;
      height: 26px;
      border-radius: 6px;
      object-fit: cover;
    }
    .brand-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-main);
    }

    /* Sidebar Top Action: New Chat */
    .sidebar-top {
      padding: 12px 14px 6px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex-shrink: 0;
    }
    .new-chat-btn {
      width: 100%;
      padding: 9px 14px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: var(--text-main);
      font-size: 0.86rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    html.light .new-chat-btn {
      background: rgba(0, 0, 0, 0.04);
    }
    .new-chat-btn:hover {
      background: rgba(139, 92, 246, 0.14);
      border-color: rgba(139, 92, 246, 0.4);
      color: var(--text-main);
    }

    /* Sidebar Navigation Links */
    .sidebar-nav-links {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 6px 10px;
      flex-shrink: 0;
    }
    .nav-link-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 10px;
      border-radius: 6px;
      font-size: 0.84rem;
      font-weight: 500;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
    }
    .nav-link-item:hover {
      background: var(--bg-surface-hover);
      color: var(--text-main);
    }

    .sidebar-divider {
      height: 1px;
      background: var(--border);
      margin: 6px 14px 8px;
      flex-shrink: 0;
    }

    /* Search Box */
    .sidebar-search {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 14px 8px;
      flex-shrink: 0;
    }
    .sidebar-search input {
      width: 100%;
      padding: 6px 10px 6px 28px;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: 6px;
      color: var(--text-main);
      font-size: 0.8rem;
      outline: none;
      transition: border 0.15s;
    }
    .sidebar-search input:focus {
      border-color: var(--border-focus);
    }
    .sidebar-search .search-icon {
      position: absolute;
      left: 22px;
      font-size: 0.72rem;
      color: var(--text-dim);
      pointer-events: none;
    }

    /* Chat Session List */
    .session-list-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 0 10px 10px;
    }
    .session-group-title {
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-dim);
      padding: 12px 10px 4px;
    }
    .session-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 10px;
      border-radius: 6px;
      margin-bottom: 2px;
      cursor: pointer;
      font-size: 0.83rem;
      color: var(--text-muted);
      transition: background 0.12s, color 0.12s;
    }
    .session-item:hover {
      background: var(--bg-surface-hover);
      color: var(--text-main);
    }
    .session-item.active {
      background: rgba(139, 92, 246, 0.14);
      color: var(--text-main);
      font-weight: 600;
    }
    .session-title-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      margin-right: 6px;
    }
    .session-tools {
      display: none;
      align-items: center;
      gap: 3px;
    }
    .session-item:hover .session-tools {
      display: flex;
    }
    .session-tool-btn {
      background: transparent;
      border: none;
      color: var(--text-dim);
      font-size: 0.76rem;
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 4px;
    }
    .session-tool-btn:hover { color: var(--text-main); }
    .session-tool-btn.delete:hover { color: var(--red); }

    /* Sidebar Footer: User Card */
    .sidebar-footer {
      padding: 10px 14px;
      border-top: 1px solid var(--border);
      flex-shrink: 0;
      background: var(--bg-sidebar);
    }
    .user-profile-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 8px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .user-profile-bar:hover {
      background: var(--bg-surface-hover);
    }
    .user-avatar-sm {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--purple), var(--cyan));
      color: #fff;
      font-size: 0.78rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }
    .user-avatar-sm img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .user-info-text {
      flex: 1;
      min-width: 0;
    }
    .user-name-display {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-main);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-status-text {
      font-size: 0.68rem;
      color: var(--text-dim);
    }

    /* Main Viewport */
    .main-viewport {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 0;
      position: relative;
      background: radial-gradient(ellipse 80% 40% at 50% -10%, rgba(139, 92, 246, 0.05), transparent 70%), var(--bg-base);
    }

    /* Clean Top Header (ChatGPT / Claude standard) */
    .topbar {
      height: var(--header-h);
      border-bottom: 1px solid var(--border);
      background: var(--bg-base);
      backdrop-filter: blur(14px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 20;
      flex-shrink: 0;
    }
    .topbar-left, .topbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .icon-btn {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-muted);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      transition: all 0.15s ease;
    }
    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: var(--border);
      color: var(--text-main);
    }
    html.light .icon-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    /* Desktop Sidebar Toggle Button Logic */
    @media (min-width: 769px) {
      #sidebar:not(.collapsed) ~ .main-viewport #openSidebarBtn {
        display: none;
      }
    }

    /* Clean Model Selector Pill */
    .model-pill-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 12px;
      color: var(--text-main);
      font-size: 0.84rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.15s;
      position: relative;
      user-select: none;
    }
    html.light .model-pill-btn {
      background: rgba(0, 0, 0, 0.04);
    }
    .model-pill-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--border-hover);
    }
    .model-dropdown-menu {
      display: none;
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      width: 260px;
      background: var(--bg-surface);
      border: 1px solid var(--border-hover);
      border-radius: 10px;
      padding: 6px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
      z-index: 100;
    }
    .model-dropdown-menu.active { display: block; }
    .model-dropdown-item {
      padding: 8px 10px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 2px;
      transition: background 0.15s;
    }
    .model-dropdown-item:hover { background: var(--bg-surface-hover); }
    .model-dropdown-item.selected { background: rgba(139, 92, 246, 0.15); }
    .model-item-title {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-main);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .model-item-sub {
      font-size: 0.72rem;
      color: var(--text-dim);
    }

    /* Guest Quota Badge */
    .guest-quota-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 20px;
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.35);
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--purple);
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
    }
    .guest-quota-badge:hover {
      background: rgba(139, 92, 246, 0.22);
      border-color: rgba(139, 92, 246, 0.55);
    }
    .topbar-signin-btn {
      padding: 5px 12px;
      border-radius: 6px;
      background: var(--purple);
      color: #fff;
      border: none;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }
    .topbar-signin-btn:hover {
      background: var(--purple-hover);
    }

    /* Chat Messages Viewport */
    .chat-scroll-area {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      padding: 24px 16px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 0;
      box-sizing: border-box;
    }
    .chat-max-width {
      width: 100%;
      max-width: 780px;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 22px;
      box-sizing: border-box;
    }

    /* Empty State Hero */
    .empty-hero {
      margin: auto 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 20px 0;
      animation: fadeIn 0.3s ease;
    }
    .hero-avatar {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      box-shadow: 0 0 25px rgba(139, 92, 246, 0.15);
    }
    .hero-avatar img {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
    .hero-title {
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text-main);
      margin-bottom: 24px;
    }

    /* Starter Suggestions Grid */
    .starter-cards-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      width: 100%;
      max-width: 700px;
    }
    .starter-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 14px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
    }
    html.light .starter-card {
      background: #ffffff;
    }
    .starter-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(139, 92, 246, 0.45);
      transform: translateY(-1px);
    }
    html.light .starter-card:hover {
      background: #f1f5f9;
    }
    .starter-card-tag {
      font-size: 0.74rem;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 4px;
    }
    .starter-card-desc {
      font-size: 0.78rem;
      color: var(--text-muted);
      line-height: 1.4;
    }

    /* Message Rows */
    .message-row {
      display: flex;
      width: 100%;
      min-width: 0;
      position: relative;
      box-sizing: border-box;
    }
    .message-row.user { justify-content: flex-end; }
    .message-row.assistant { justify-content: flex-start; gap: 12px; }

    .user-bubble {
      max-width: 82%;
      min-width: 0;
      background: var(--bg-surface);
      border: 1px solid var(--border-hover);
      border-radius: 18px 18px 4px 18px;
      padding: 12px 18px;
      font-size: 0.94rem;
      line-height: 1.55;
      color: var(--text-main);
      word-break: break-word;
      position: relative;
    }
    .user-bubble:hover .user-edit-btn { display: inline-flex; }
    .user-edit-btn {
      display: none;
      position: absolute;
      top: -9px;
      right: 12px;
      background: var(--bg-surface-hover);
      border: 1px solid var(--border-hover);
      color: var(--text-muted);
      font-size: 0.72rem;
      padding: 3px 6px;
      border-radius: 6px;
      cursor: pointer;
    }
    .user-edit-btn:hover { color: var(--text-main); }

    /* Assistant Open Document Layout */
    .assistant-avatar {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 4px;
    }
    .assistant-avatar img {
      width: 18px;
      height: 18px;
      object-fit: contain;
    }
    .assistant-content-wrap {
      flex: 1;
      min-width: 0;
      padding-top: 2px;
    }
    .assistant-body {
      font-size: 0.95rem;
      line-height: 1.65;
      color: var(--text-main);
      word-break: break-word;
    }
    .assistant-body p { margin-bottom: 14px; }
    .assistant-body p:last-child { margin-bottom: 0; }
    .assistant-body h1, .assistant-body h2, .assistant-body h3 {
      color: var(--text-main);
      margin: 18px 0 10px;
      font-weight: 700;
    }
    .assistant-body ul, .assistant-body ol { margin: 10px 0 14px 22px; }
    .assistant-body li { margin-bottom: 6px; }
    .assistant-body blockquote {
      border-left: 3px solid var(--purple);
      padding-left: 14px;
      margin: 14px 0;
      color: var(--text-muted);
      font-style: italic;
    }
    .assistant-body img {
      max-width: 100%;
      height: auto;
      border-radius: 12px;
      border: 1px solid var(--border);
      display: block;
      margin: 14px 0 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }

    /* Responsive & Accessible Tables */
    .table-container {
      width: 100%;
      overflow-x: auto;
      margin: 16px 0;
      border-radius: 8px;
      border: 1px solid var(--border);
      -webkit-overflow-scrolling: touch;
    }
    .assistant-body table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 0.88rem;
    }
    .assistant-body th, .assistant-body td {
      border-bottom: 1px solid var(--border);
      border-right: 1px solid var(--border);
      padding: 10px 14px;
      text-align: left;
    }
    .assistant-body th:last-child, .assistant-body td:last-child {
      border-right: none;
    }
    .assistant-body tr:last-child td {
      border-bottom: none;
    }
    .assistant-body th {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-main);
      font-weight: 600;
    }
    html.light .assistant-body th {
      background: rgba(0, 0, 0, 0.04);
    }
    .assistant-body tr:nth-child(even) td {
      background: rgba(255, 255, 255, 0.02);
    }
    html.light .assistant-body tr:nth-child(even) td {
      background: rgba(0, 0, 0, 0.02);
    }

    /* Code Blocks */
    pre {
      background: #090c14 !important;
      border: 1px solid var(--border);
      border-radius: 8px;
      margin: 14px 0;
      overflow: hidden;
      position: relative;
    }
    html.light pre {
      background: #0f172a !important;
    }
    .code-header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.04);
      border-bottom: 1px solid var(--border);
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .code-action-btn {
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-muted);
      font-size: 0.72rem;
      padding: 2px 7px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .code-action-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      border-color: var(--border);
    }
    pre code {
      display: block;
      padding: 14px 16px;
      overflow-x: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.86rem;
      line-height: 1.5;
    }

    /* Assistant Action Bar */
    .assistant-action-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 10px;
      opacity: 0.8;
      transition: opacity 0.15s;
    }
    .assistant-action-bar:hover { opacity: 1; }
    .msg-action-btn {
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-dim);
      font-size: 0.76rem;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s;
    }
    .msg-action-btn:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: var(--border);
      color: var(--text-main);
    }
    html.light .msg-action-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    /* Typing Dots */
    .typing-indicator {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 6px 0;
    }
    .typing-indicator span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--purple);
      animation: typingPulse 1.4s infinite ease-in-out;
    }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingPulse {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
      40% { transform: scale(1); opacity: 1; }
    }

    /* Floating Composer Dock */
    .composer-dock {
      width: 100%;
      padding: 0 16px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      background: linear-gradient(to top, var(--bg-base) 80%, transparent);
      position: relative;
    }
    .composer-box {
      width: 100%;
      max-width: 780px;
      background: var(--bg-surface);
      border: 1px solid var(--border-hover);
      border-radius: 16px;
      padding: 10px 14px 10px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
      position: relative;
      transition: border 0.15s;
    }
    .composer-box:focus-within {
      border-color: var(--border-focus);
    }

    /* Attachment Container & Cards */
    .attachment-preview-container {
      display: none;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
      width: 100%;
    }
    .attachment-card {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.3);
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 0.78rem;
      color: var(--text-main);
      max-width: 280px;
    }
    .attachment-thumb {
      width: 22px;
      height: 22px;
      border-radius: 4px;
      object-fit: cover;
    }
    .attachment-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }
    .chip-remove-btn {
      background: transparent;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      font-size: 0.85rem;
      padding: 0 2px;
    }
    .chip-remove-btn:hover { color: var(--red); }

    /* Textarea */
    .composer-textarea {
      width: 100%;
      min-height: 44px;
      max-height: 180px;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-main);
      font-size: 0.94rem;
      line-height: 1.5;
      font-family: inherit;
      resize: none;
      overflow-y: auto;
    }
    .composer-textarea::placeholder {
      color: var(--text-dim);
    }

    /* Composer Toolbar */
    .composer-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 6px;
    }
    .composer-left, .composer-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .composer-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      transition: all 0.15s;
    }
    .composer-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-main);
    }
    html.light .composer-btn:hover {
      background: rgba(0, 0, 0, 0.06);
    }
    .composer-btn.recording {
      color: var(--red);
      animation: pulseRecord 1.2s infinite;
    }
    @keyframes pulseRecord {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }

    .send-action-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--purple);
      border: none;
      color: #fff;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      font-weight: 700;
      transition: all 0.15s ease;
    }
    .send-action-btn:hover {
      background: var(--purple-hover);
      transform: scale(1.04);
    }
    .stop-action-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--red);
      border: none;
      color: #fff;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
    }

    .composer-disclaimer {
      font-size: 0.72rem;
      color: var(--text-dim);
      margin-top: 8px;
      text-align: center;
    }

    /* Slash Menu Popover */
    .slash-popover {
      display: none;
      position: absolute;
      bottom: calc(100% + 8px);
      left: 14px;
      width: 290px;
      background: var(--bg-surface);
      border: 1px solid var(--border-hover);
      border-radius: 10px;
      padding: 6px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      z-index: 100;
    }
    .slash-popover.active { display: block; }
    .slash-item {
      padding: 8px 10px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.82rem;
      transition: background 0.15s;
    }
    .slash-item:hover, .slash-item.selected {
      background: rgba(139, 92, 246, 0.18);
    }
    .slash-cmd { font-weight: 700; color: var(--purple); }
    .slash-desc { color: var(--text-dim); font-size: 0.72rem; margin-left: 8px; text-align: right; }

    /* Drag & Drop Overlay */
    .drag-drop-overlay {
      display: none;
      position: absolute;
      inset: 0;
      background: rgba(9, 10, 15, 0.85);
      border: 2px dashed var(--purple);
      z-index: 90;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 600;
      color: #fff;
      pointer-events: none;
    }
    .drag-drop-overlay.active { display: flex; }

    /* Modals */
    .modal-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(6px);
      z-index: 200;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-hover);
      border-radius: 14px;
      width: 100%;
      max-width: 520px;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .modal-card.wide {
      max-width: 720px;
    }
    .modal-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .modal-title { font-size: 1rem; font-weight: 700; color: var(--text-main); }
    .modal-body { padding: 20px; overflow-y: auto; max-height: 80vh; }
    .modal-footer {
      padding: 12px 20px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    /* Modal Navigation Tabs */
    .modal-tabs {
      display: flex;
      gap: 8px;
      padding: 0 20px;
      border-bottom: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.02);
    }
    .modal-tab-btn {
      padding: 10px 14px;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-dim);
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: all 0.15s;
    }
    .modal-tab-btn:hover { color: var(--text-main); }
    .modal-tab-btn.active {
      color: var(--purple);
      border-bottom-color: var(--purple);
    }

    .form-input {
      width: 100%;
      padding: 9px 12px;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text-main);
      font-size: 0.86rem;
      margin-top: 6px;
      margin-bottom: 14px;
      outline: none;
    }
    .form-input:focus { border-color: var(--border-focus); }
    .form-label { font-size: 0.78rem; font-weight: 600; color: var(--text-muted); }

    .primary-btn {
      padding: 8px 16px;
      border-radius: 8px;
      background: var(--purple);
      border: none;
      color: #fff;
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }
    .primary-btn:hover { background: var(--purple-hover); }
    .secondary-btn {
      padding: 8px 16px;
      border-radius: 8px;
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 0.84rem;
      cursor: pointer;
    }
    .secondary-btn:hover { background: var(--bg-surface-hover); color: var(--text-main); }

    /* Admin Table */
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 0.8rem;
    }
    .admin-table th, .admin-table td {
      padding: 8px 10px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    .admin-table th {
      color: var(--text-dim);
      font-weight: 600;
    }
    .budget-edit-input {
      width: 75px;
      padding: 3px 6px;
      background: var(--bg-input);
      border: 1px solid var(--border);
      color: var(--text-main);
      border-radius: 4px;
      font-size: 0.8rem;
    }

    /* Toast */
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 300;
    }
    .toast {
      background: var(--bg-surface);
      border: 1px solid var(--border-hover);
      color: var(--text-main);
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 0.84rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: 0; top: 0; bottom: 0;
        transform: translateX(-100%);
        margin-left: 0 !important;
      }
      .sidebar.open { transform: translateX(0); }
      .starter-cards-grid { grid-template-columns: 1fr; }
      .shortcut-tag { display: none !important; }
      .chat-scroll-area { padding-bottom: 120px; }
      .composer-dock { padding: 0 10px 10px; }
    }
  </style>
</head>
<body>

  <div class="app-root">
    <!-- Mobile Backdrop -->
    <div class="sidebar-backdrop" id="sidebarBackdrop" onclick="closeSidebarMobile()"></div>

    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="brand-box" onclick="startNewChat()">
          <img src="/logo.png" alt="Mehkesh AI" class="brand-logo-img">
          <span class="brand-name">Mehkesh AI</span>
        </div>
        <button class="icon-btn" onclick="toggleSidebar()" title="Collapse Sidebar (Ctrl+[)" aria-label="Collapse sidebar">
          ◧
        </button>
      </div>

      <!-- New Chat Button -->
      <div class="sidebar-top">
        <button class="new-chat-btn" onclick="startNewChat()">
          <span>+ New chat</span>
          <span class="shortcut-tag" style="font-size:0.72rem; color:var(--text-dim);">Ctrl+K</span>
        </button>
      </div>

      <!-- Primary Navigation Links (Zero Duplication) -->
      <nav class="sidebar-nav-links">
        <div class="nav-link-item" onclick="showDailyBriefing()">
          <span>📰</span>
          <span>Daily Briefing</span>
        </div>
        <div class="nav-link-item" onclick="openModal('memoryModal')">
          <span>🧠</span>
          <span>Memories</span>
        </div>
      </nav>

      <div class="sidebar-divider"></div>

      <!-- Search Input -->
      <div class="sidebar-search">
        <span class="search-icon">🔍</span>
        <input type="text" id="sessionSearchInput" placeholder="Search chats..." autocomplete="off">
      </div>

      <!-- Chat History -->
      <div class="session-list-scroll" id="sessionList">
        <div id="groupToday" style="display:none;">
          <div class="session-group-title">Today</div>
          <div class="group-items" id="itemsToday"></div>
        </div>
        <div id="groupYesterday" style="display:none;">
          <div class="session-group-title">Yesterday</div>
          <div class="group-items" id="itemsYesterday"></div>
        </div>
        <div id="groupPast7" style="display:none;">
          <div class="session-group-title">Previous 7 Days</div>
          <div class="group-items" id="itemsPast7"></div>
        </div>
        <div id="groupOlder" style="display:none;">
          <div class="session-group-title">Older</div>
          <div class="group-items" id="itemsOlder"></div>
        </div>
      </div>

      <!-- Sidebar Footer: User Card -->
      <div class="sidebar-footer">
        <div class="user-profile-bar" onclick="openModal('settingsModal')">
          <div class="user-avatar-sm" id="userAvatar">M</div>
          <div class="user-info-text">
            <div class="user-name-display" id="userDisplayName">Mehkesh</div>
            <div class="user-status-text" id="userRoleBadge">Personal AI • Free</div>
          </div>
          <span style="color:var(--text-dim); font-size:0.8rem;">⚙️</span>
        </div>
      </div>
    </aside>

    <!-- Main Viewport -->
    <main class="main-viewport" id="mainViewport">
      <div class="drag-drop-overlay" id="dragDropOverlay">📎 Drop files here to attach</div>

      <!-- Clean Header -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="icon-btn" id="openSidebarBtn" onclick="toggleSidebar()" title="Toggle Sidebar (Ctrl+[)" aria-label="Toggle sidebar">
            ☰
          </button>

          <!-- Model Switcher Pill (Human-Friendly Names) -->
          <div class="model-pill-btn" id="modelPillBtn" onclick="toggleModelDropdown()">
            <span id="currentModelLabel">⚡ Mehkesh Auto</span>
            <span style="font-size:0.65rem; color:var(--text-dim);">▾</span>

            <div class="model-dropdown-menu" id="modelDropdownMenu">
              <div class="model-dropdown-item selected" onclick="selectModel('auto', '⚡ Mehkesh Auto')">
                <div class="model-item-title"><span>Mehkesh Auto</span> <span style="color:var(--purple); font-size:0.65rem;">DEFAULT</span></div>
                <div class="model-item-sub">Fast and intelligent for daily requests</div>
              </div>
              <div class="model-dropdown-item" onclick="selectModel('@cf/qwen/qwen2.5-coder-32b-instruct', '💻 Code & Tech')">
                <div class="model-item-title"><span>Code & Tech</span> <span style="color:var(--cyan); font-size:0.65rem;">PROGRAMMING</span></div>
                <div class="model-item-sub">Specialized software engineering & architecture</div>
              </div>
              <div class="model-dropdown-item" onclick="selectModel('@cf/meta/llama-3.3-70b-instruct-fp8-fast', '🧠 Deep Reasoning')">
                <div class="model-item-title"><span>Deep Reasoning</span> <span style="color:var(--purple); font-size:0.65rem;">ANALYSIS</span></div>
                <div class="model-item-sub">In-depth logic, complex decisions, and analysis</div>
              </div>
              <div class="model-dropdown-item" onclick="selectModel('@cf/black-forest-labs/flux-1-schnell', '🎨 Image Studio')">
                <div class="model-item-title"><span>Image Studio</span> <span style="color:#f59e0b; font-size:0.65rem;">VISUAL</span></div>
                <div class="model-item-sub">Generate images from text descriptions</div>
              </div>
            </div>
          </div>
        </div>

        <div class="topbar-right">
          <!-- Guest Quota Badge -->
          <div class="guest-quota-badge" id="guestQuotaBadge" style="display:none;" onclick="openModal('authModal')" title="Click to sign in for unlimited access">
            <span>✨ Guest: 3 free queries</span>
          </div>

          <!-- Topbar Sign In Button -->
          <button class="topbar-signin-btn" id="topbarSignInBtn" style="display:none;" onclick="openModal('authModal')">
            Sign In
          </button>

          <!-- Theme Toggle Button -->
          <button class="icon-btn" id="themeToggleBtn" onclick="toggleTheme()" title="Toggle Theme" aria-label="Toggle dark/light theme">
            🌙
          </button>

          <!-- New Chat Button -->
          <button class="icon-btn" onclick="startNewChat()" title="New chat" aria-label="Start new chat">
            ＋
          </button>
        </div>
      </header>

      <!-- Chat Viewport -->
      <div class="chat-scroll-area" id="chatScrollArea">
        <div class="chat-max-width" id="chatMaxWidth">
          <!-- Empty State Hero -->
          <div class="empty-hero" id="emptyHero">
            <div class="hero-avatar">
              <img src="/logo.png" alt="Mehkesh AI">
            </div>
            <h1 class="hero-title">What can I help you with today?</h1>

            <!-- 4 Clean Starter Suggestions -->
            <div class="starter-cards-grid">
              <div class="starter-card" data-starter="code">
                <div class="starter-card-tag">Code Architecture</div>
                <div class="starter-card-desc">Build a serverless API with SQLite database</div>
              </div>

              <div class="starter-card" data-starter="reason">
                <div class="starter-card-tag">System Analysis</div>
                <div class="starter-card-desc">Compare latency trade-offs of edge vs centralized servers</div>
              </div>

              <div class="starter-card" data-starter="imagine">
                <div class="starter-card-tag">Create Image</div>
                <div class="starter-card-desc">/imagine photorealistic obsidian workstation with ambient violet lighting</div>
              </div>

              <div class="starter-card" data-starter="translate">
                <div class="starter-card-tag">Translate</div>
                <div class="starter-card-desc">/translate hin_Deva Translate technical docs into Hindi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Composer Dock -->
      <div class="composer-dock">
        <div class="composer-box">
          <!-- Slash Popover -->
          <div class="slash-popover" id="slashPopover">
            <div class="slash-item" data-cmd="/imagine " onclick="applySlash('/imagine ')">
              <span class="slash-cmd">/imagine</span>
              <span class="slash-desc">Generate images from description</span>
            </div>
            <div class="slash-item" data-cmd="/translate hin_Deva " onclick="applySlash('/translate hin_Deva ')">
              <span class="slash-cmd">/translate</span>
              <span class="slash-desc">Multilingual Indic translation</span>
            </div>
            <div class="slash-item" data-cmd="/code " onclick="applySlash('/code ')">
              <span class="slash-cmd">/code</span>
              <span class="slash-desc">Code & architecture model</span>
            </div>
            <div class="slash-item" data-cmd="/reason " onclick="applySlash('/reason ')">
              <span class="slash-cmd">/reason</span>
              <span class="slash-desc">Deep reasoning model</span>
            </div>
            <div class="slash-item" data-cmd="/clear" onclick="applySlash('/clear')">
              <span class="slash-cmd">/clear</span>
              <span class="slash-desc">Clear current chat</span>
            </div>
          </div>

          <!-- Attachment Preview Container -->
          <div class="attachment-preview-container" id="attachmentPreviewContainer"></div>

          <!-- Textarea -->
          <textarea
            class="composer-textarea"
            id="chatInput"
            placeholder="Message Mehkesh AI... (Type / for commands)"
            rows="1"
            aria-label="Message Mehkesh AI"
          ></textarea>

          <input type="file" id="fileInput" accept="image/*,.txt,.py,.js,.ts,.jsx,.tsx,.json,.csv,.md,.sql,.html,.css,.xml,.yml,.yaml,.sh" style="display:none;" aria-label="Attach file or screenshot">

          <!-- Bottom Actions -->
          <div class="composer-toolbar">
            <div class="composer-left">
              <button class="composer-btn" onclick="document.getElementById('fileInput').click()" title="Attach file, code, or screenshot" aria-label="Attach file">
                📎
              </button>
              <button class="composer-btn" id="micBtn" onclick="toggleMicRecording()" title="Voice input (Whisper AI)" aria-label="Record voice">
                🎙️
              </button>
            </div>
            <div class="composer-right">
              <button class="send-action-btn" id="sendBtn" onclick="sendMessage()" title="Send message" aria-label="Send message">
                ↑
              </button>
              <button class="stop-action-btn" id="stopBtn" onclick="stopGeneration()" title="Stop generation" aria-label="Stop generation">
                ■
              </button>
            </div>
          </div>
        </div>
        <div class="composer-disclaimer">Mehkesh AI can make mistakes. Verify important information.</div>
      </div>
    </main>
  </div>

  <!-- Daily Briefing Modal -->
  <div class="modal-backdrop" id="briefingModal">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">📰 Daily Intelligence Briefing</div>
        <button class="icon-btn" onclick="closeModal('briefingModal')" aria-label="Close modal">✕</button>
      </div>
      <div class="modal-body">
        <div id="briefingContent" style="font-size:0.92rem; line-height:1.7; color:var(--text-main); margin-bottom:18px;">
          <p style="color:var(--text-muted);">Loading your daily briefing...</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" onclick="refreshBriefing()">🔄 Refresh Briefing</button>
      </div>
    </div>
  </div>

  <!-- Memories Modal -->
  <div class="modal-backdrop" id="memoryModal">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">🧠 Assistant Memories</div>
        <button class="icon-btn" onclick="closeModal('memoryModal')" aria-label="Close modal">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:14px;">
          Information Mehkesh AI remembers about your preferences and projects:
        </p>
        <div style="display:flex; gap:8px; margin-bottom:14px;">
          <input type="text" id="newMemoryFactInput" class="form-input" style="margin:0;" placeholder="Add a preference or detail..." onkeydown="if(event.key==='Enter')addMemoryFact()">
          <button class="primary-btn" onclick="addMemoryFact()">Add</button>
        </div>
        <div id="memoryListContainer" style="display:flex; flex-direction:column; gap:6px; max-height:220px; overflow-y:auto;"></div>
      </div>
    </div>
  </div>

  <!-- Settings & Admin Console Modal -->
  <div class="modal-backdrop" id="settingsModal">
    <div class="modal-card wide">
      <div class="modal-header">
        <div class="modal-title">Settings & Account</div>
        <button class="icon-btn" onclick="closeModal('settingsModal')" aria-label="Close modal">✕</button>
      </div>

      <!-- Modal Tabs: Profile vs Admin Console -->
      <div class="modal-tabs">
        <button class="modal-tab-btn active" id="tabBtnProfile" onclick="switchSettingsTab('profile')">Profile & Quota</button>
        <button class="modal-tab-btn" id="tabBtnAdmin" onclick="switchSettingsTab('admin')" style="display:none;">👑 Admin Console</button>
      </div>

      <!-- Tab 1: Profile View -->
      <div class="modal-body" id="tabPaneProfile">
        <label class="form-label">Full Name</label>
        <input type="text" id="settingsNameInput" class="form-input" disabled>

        <label class="form-label">Email</label>
        <input type="text" id="settingsEmailInput" class="form-input" disabled>

        <label class="form-label">Theme Preference</label>
        <div style="display:flex; gap:8px; margin-top:6px; margin-bottom:14px;">
          <button class="secondary-btn" id="themeDarkBtn" onclick="setThemePreference('dark')">🌙 Dark</button>
          <button class="secondary-btn" id="themeLightBtn" onclick="setThemePreference('light')">☀️ Light</button>
          <button class="secondary-btn" id="themeSystemBtn" onclick="setThemePreference('system')">💻 System</button>
        </div>

        <label class="form-label">Daily AI Budget</label>
        <div style="margin-top:6px; margin-bottom:16px;">
          <div style="font-size:1.1rem; font-weight:700; color:var(--text-main);" id="profileQuotaText">0 / 2,000 Credits</div>
          <div style="height:6px; width:100%; background:rgba(255,255,255,0.06); border-radius:3px; margin-top:8px; overflow:hidden;">
            <div id="profileProgressBar" style="width:0%; height:100%; background:linear-gradient(90deg, var(--purple), var(--cyan)); border-radius:3px;"></div>
          </div>
        </div>

        <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:600; font-size:0.85rem; color:var(--text-main);">Clear Conversations</div>
            <div style="font-size:0.75rem; color:var(--text-dim);">Permanently remove all chat history</div>
          </div>
          <button class="secondary-btn" style="color:var(--red); border-color:rgba(239,68,68,0.3); font-size:0.75rem; padding:5px 10px;" onclick="clearAllSessions()">Delete All</button>
        </div>
      </div>

      <!-- Tab 2: Admin Console (User limits, budgets, and suspensions) -->
      <div class="modal-body" id="tabPaneAdmin" style="display:none;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <div style="font-weight:700; font-size:0.95rem; color:var(--text-main);">User Management & Limits</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">Adjust user daily budgets, suspend accounts, and view usage.</div>
          </div>
          <button class="secondary-btn" style="padding:4px 10px; font-size:0.75rem;" onclick="loadAdminUsers()">🔄 Refresh</button>
        </div>

        <div style="overflow-x:auto; max-height:280px; overflow-y:auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Daily Limit</th>
                <th>Used Today</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="adminUserTableBody">
              <tr><td colspan="6" style="text-align:center; color:var(--text-dim); padding:16px;">Loading user accounts...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal-footer">
        <button class="secondary-btn" id="signOutBtn" onclick="signOut()">Sign Out</button>
        <button class="primary-btn" onclick="closeModal('settingsModal')">Close</button>
      </div>
    </div>
  </div>

  <!-- Auth Modal -->
  <div class="modal-backdrop" id="authModal">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">Sign in to Mehkesh AI</div>
        <button class="icon-btn" id="authModalCloseBtn" onclick="closeModal('authModal')" aria-label="Close modal">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:16px;" id="authModalSubtitle">
          Sign in to access your personal AI assistant and chat history.
        </p>

        <div id="googleBtnContainer" style="display:flex; justify-content:center; margin-bottom:14px; min-height:44px;"></div>

        <div style="display:flex; align-items:center; gap:10px; margin:16px 0; color:var(--text-dim); font-size:0.75rem;">
          <div style="flex:1; height:1px; background:var(--border);"></div>
          <span>OR SIGN IN WITH PASSWORD</span>
          <div style="flex:1; height:1px; background:var(--border);"></div>
        </div>

        <label class="form-label">Master Admin Password</label>
        <input type="password" id="masterPasswordInput" class="form-input" placeholder="Enter password..." onkeydown="if(event.key==='Enter')submitMasterPassword()">
        <button class="primary-btn" style="width:100%;" onclick="submitMasterPassword()">Sign In</button>

        <!-- Guest Exploration Banner -->
        <div id="authGuestBanner" style="display:none; margin-top:14px; padding:10px 14px; border-radius:8px; background:rgba(139,92,246,0.1); border:1px solid rgba(139,92,246,0.25); font-size:0.78rem; text-align:center;">
          <span>✨ Want to explore first? </span>
          <a href="javascript:void(0)" onclick="closeModal('authModal')" style="color:var(--purple); font-weight:600; text-decoration:none;" id="guestBannerLink">Continue as Guest (3 free queries) →</a>
        </div>

        <div id="authErrorMsg" style="color:var(--red); font-size:0.8rem; margin-top:12px; display:none; text-align:center;"></div>
        <div style="margin-top:16px; font-size:0.75rem; color:var(--text-dim); text-align:center;">
          🔒 Secured via Google Identity Services
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Container -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- Interactive Client Script -->
  <script>
    const GOOGLE_CLIENT_ID = "${googleClientId}";
    let currentUser = null;
    let isGuest = false;
    let guestRemaining = 3;
    let currentSessionId = null;
    let currentMessages = [];
    let isGenerating = false;
    let activeAbortController = null;
    let attachedImageData = null;
    let attachedDocument = null;
    let selectedModel = "auto";
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecordingAudio = false;
    let allSessionsList = [];
    let activeUtterance = null;
    let currentTheme = localStorage.getItem("mehkesh_theme") || "dark";
    let slashIndex = 0;

    const ALL_SLASH_COMMANDS = [
      { cmd: "/imagine ", label: "/imagine", desc: "Generate images from description" },
      { cmd: "/translate hin_Deva ", label: "/translate", desc: "Multilingual Indic translation" },
      { cmd: "/code ", label: "/code", desc: "Code & architecture model" },
      { cmd: "/reason ", label: "/reason", desc: "Deep reasoning model" },
      { cmd: "/clear", label: "/clear", desc: "Clear current chat" }
    ];

    document.addEventListener("DOMContentLoaded", async () => {
      initTheme();
      // Event delegation for starter prompt cards
      const emptyHero = document.getElementById("emptyHero");
      if (emptyHero) {
        emptyHero.addEventListener("click", (e) => {
          const card = e.target.closest("[data-starter]");
          if (card && card.dataset.starter) triggerStarterPrompt(card.dataset.starter);
        });
      }
      setupEventListeners();
      await checkAuthStatus();
    });

    // ========================================================================
    // Theme Management
    // ========================================================================
    function initTheme() {
      applyTheme(currentTheme);
    }

    function toggleTheme() {
      const next = currentTheme === "light" ? "dark" : "light";
      setThemePreference(next);
    }

    function setThemePreference(pref) {
      currentTheme = pref;
      localStorage.setItem("mehkesh_theme", pref);
      applyTheme(pref);
      showToast("Theme: " + pref, "info");
    }

    function applyTheme(pref) {
      let active = pref;
      if (pref === "system") {
        active = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
      }
      document.documentElement.className = active;
      const toggleBtn = document.getElementById("themeToggleBtn");
      if (toggleBtn) {
        toggleBtn.textContent = active === "light" ? "☀️" : "🌙";
      }
    }

    // ========================================================================
    // Authentication & Guest Mode
    // ========================================================================
    async function checkAuthStatus() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data && data.authenticated && data.user) {
          currentUser = data.user;
          isGuest = false;
          hideGuestUI();
          renderUserUI();
          loadSessions();
          updateQuotaDisplay();
          closeModal("authModal");
        } else {
          currentUser = null;
          isGuest = true;
          guestRemaining = typeof data.guest_remaining !== "undefined" ? data.guest_remaining : 3;
          renderGuestUI();
          if (guestRemaining <= 0) {
            showAuthModal(true);
          } else {
            closeModal("authModal");
          }
        }
      } catch (e) {
        currentUser = null;
        isGuest = true;
        guestRemaining = 3;
        renderGuestUI();
      }
    }

    function renderGuestUI() {
      const badge = document.getElementById("guestQuotaBadge");
      const signInBtn = document.getElementById("topbarSignInBtn");
      const userBadge = document.getElementById("userRoleBadge");
      const userDisplayName = document.getElementById("userDisplayName");
      const guestBanner = document.getElementById("authGuestBanner");
      const guestLink = document.getElementById("guestBannerLink");

      if (badge) {
        badge.style.display = "inline-flex";
        badge.innerHTML = "<span>✨ Guest: " + guestRemaining + "/3 free</span>";
      }
      if (signInBtn) signInBtn.style.display = "inline-block";
      if (userDisplayName) userDisplayName.textContent = "Guest Visitor";
      if (userBadge) userBadge.textContent = "Free Guest • " + guestRemaining + " queries left";

      if (guestBanner && guestRemaining > 0) {
        guestBanner.style.display = "block";
        if (guestLink) guestLink.textContent = "Continue as Guest (" + guestRemaining + " free queries) →";
      } else if (guestBanner) {
        guestBanner.style.display = "none";
      }

      document.getElementById("settingsNameInput").value = "Guest Visitor";
      document.getElementById("settingsEmailInput").value = "guest@mehkesh.com";
      document.getElementById("profileQuotaText").textContent = (3 - guestRemaining) + " / 3 Free Queries Used";
      document.getElementById("profileProgressBar").style.width = Math.min(100, Math.round(((3 - guestRemaining) / 3) * 100)) + "%";
      document.getElementById("tabBtnAdmin").style.display = "none";
      const signOutBtn = document.getElementById("signOutBtn");
      if (signOutBtn) signOutBtn.textContent = "Sign In";
    }

    function hideGuestUI() {
      const badge = document.getElementById("guestQuotaBadge");
      const signInBtn = document.getElementById("topbarSignInBtn");
      const guestBanner = document.getElementById("authGuestBanner");
      if (badge) badge.style.display = "none";
      if (signInBtn) signInBtn.style.display = "none";
      if (guestBanner) guestBanner.style.display = "none";
      const signOutBtn = document.getElementById("signOutBtn");
      if (signOutBtn) signOutBtn.textContent = "Sign Out";
    }

    function showAuthModal(forced) {
      const sub = document.getElementById("authModalSubtitle");
      if (forced && guestRemaining <= 0) {
        sub.textContent = "You have used your 3 free guest queries today. Sign in to continue enjoying Mehkesh AI.";
      } else {
        sub.textContent = "Sign in to access your personal AI assistant and chat history.";
      }
      openModal("authModal");
      window.initGoogleSignIn();
    }

    window.initGoogleSignIn = function() {
      if (!GOOGLE_CLIENT_ID || typeof google === "undefined" || !google.accounts || !google.accounts.id) return;
      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
          auto_select: false
        });
        const container = document.getElementById("googleBtnContainer");
        if (container) {
          container.innerHTML = "";
          google.accounts.id.renderButton(container, {
            theme: "filled_blue",
            size: "large",
            shape: "pill",
            width: 280,
            text: "continue_with"
          });
        }
      } catch (e) {}
    };

    async function handleGoogleCredentialResponse(response) {
      if (!response || !response.credential) return;
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential })
        });
        const data = await res.json();
        if (data.ok && data.user) {
          currentUser = data.user;
          isGuest = false;
          hideGuestUI();
          renderUserUI();
          loadSessions();
          updateQuotaDisplay();
          closeModal("authModal");
          showToast("Welcome, " + currentUser.full_name, "success");
        } else {
          showAuthError(data.error || "Google Sign-In failed");
        }
      } catch (err) {
        showAuthError("Network error: " + err.message);
      }
    }

    async function submitMasterPassword() {
      const input = document.getElementById("masterPasswordInput");
      const password = input.value.trim();
      if (!password) return;
      try {
        // Try /api/auth/verify, fallback to /api/auth/admin
        let res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password })
        });
        if (res.status === 404) {
          res = await fetch("/api/auth/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password })
          });
        }
        const data = await res.json();
        if (data.ok && data.user) {
          currentUser = data.user;
          isGuest = false;
          hideGuestUI();
          renderUserUI();
          loadSessions();
          updateQuotaDisplay();
          closeModal("authModal");
          showToast("Master Admin authenticated", "success");
        } else {
          showAuthError(data.error || "Invalid master password");
        }
      } catch (err) {
        showAuthError("Error: " + err.message);
      }
    }

    async function signOut() {
      if (isGuest) {
        showAuthModal();
        return;
      }
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (e) {}
      // Client-side cookie wipe for defense-in-depth
      document.cookie = "auth_token=; Path=/; Max-Age=0; SameSite=Lax";
      document.cookie = "auth_password=; Path=/; Max-Age=0; SameSite=Lax";
      location.reload();
    }

    function renderUserUI() {
      if (!currentUser) return;
      document.getElementById("userDisplayName").textContent = currentUser.full_name || "Mehkesh";
      const isAdmin = currentUser.role === "admin";
      document.getElementById("userRoleBadge").textContent = isAdmin ? "Master Admin 👑" : "Pro Plan";

      const avatarBox = document.getElementById("userAvatar");
      if (currentUser.picture) {
        avatarBox.innerHTML = '<img src="' + escapeHtml(currentUser.picture) + '" alt="User">';
      } else {
        avatarBox.textContent = (currentUser.full_name || "M").charAt(0).toUpperCase();
      }

      document.getElementById("settingsNameInput").value = currentUser.full_name || "Mehkesh";
      document.getElementById("settingsEmailInput").value = currentUser.email || "";

      // Reveal Admin Console Tab if user is admin
      if (isAdmin) {
        document.getElementById("tabBtnAdmin").style.display = "inline-block";
      }
    }

    function showAuthError(msg) {
      const el = document.getElementById("authErrorMsg");
      el.textContent = msg;
      el.style.display = "block";
    }

    // ========================================================================
    // Sidebar & Navigation
    // ========================================================================
    function toggleSidebar() {
      const isMobile = window.innerWidth <= 768;
      const sidebar = document.getElementById("sidebar");
      const backdrop = document.getElementById("sidebarBackdrop");

      if (isMobile) {
        const isOpen = sidebar.classList.contains("open");
        if (isOpen) {
          sidebar.classList.remove("open");
          backdrop.classList.remove("active");
        } else {
          sidebar.classList.add("open");
          backdrop.classList.add("active");
        }
      } else {
        sidebar.classList.toggle("collapsed");
      }
    }

    function closeSidebarMobile() {
      document.getElementById("sidebar").classList.remove("open");
      document.getElementById("sidebarBackdrop").classList.remove("active");
    }

    function toggleModelDropdown() {
      document.getElementById("modelDropdownMenu").classList.toggle("active");
    }

    function selectModel(modelKey, label) {
      selectedModel = modelKey;
      document.getElementById("currentModelLabel").textContent = label;
      document.querySelectorAll(".model-dropdown-item").forEach(item => {
        item.classList.toggle("selected", item.getAttribute("onclick")?.includes(modelKey));
      });
      document.getElementById("modelDropdownMenu").classList.remove("active");
      showToast("Model: " + label, "info");
    }

    document.addEventListener("click", (e) => {
      const pill = document.getElementById("modelPillBtn");
      if (pill && !pill.contains(e.target)) {
        const menu = document.getElementById("modelDropdownMenu");
        if (menu) menu.classList.remove("active");
      }
    });

    // ========================================================================
    // Sessions Management
    // ========================================================================
    async function loadSessions() {
      if (isGuest) return;
      try {
        const res = await fetch("/api/sessions");
        const sessions = await res.json();
        if (Array.isArray(sessions)) {
          allSessionsList = sessions;
          renderSessionList(sessions);
        }
      } catch (err) {}
    }

    function renderSessionList(sessions) {
      const now = new Date();
      const today = [];
      const yesterday = [];
      const past7 = [];
      const older = [];

      sessions.forEach(s => {
        const created = new Date(s.created_at || s.updated_at || now);
        const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) today.push(s);
        else if (diffDays === 1) yesterday.push(s);
        else if (diffDays <= 7) past7.push(s);
        else older.push(s);
      });

      renderGroupDOM("groupToday", "itemsToday", today);
      renderGroupDOM("groupYesterday", "itemsYesterday", yesterday);
      renderGroupDOM("groupPast7", "itemsPast7", past7);
      renderGroupDOM("groupOlder", "itemsOlder", older);
    }

    function renderGroupDOM(groupId, itemsId, list) {
      const groupEl = document.getElementById(groupId);
      const itemsEl = document.getElementById(itemsId);
      itemsEl.innerHTML = "";

      if (list.length === 0) {
        groupEl.style.display = "none";
        return;
      }
      groupEl.style.display = "block";

      list.forEach(s => {
        const item = document.createElement("div");
        item.className = "session-item" + (s.id === currentSessionId ? " active" : "");
        item.onclick = () => switchSession(s.id);

        const titleSpan = document.createElement("span");
        titleSpan.className = "session-title-text";
        titleSpan.id = "title_" + s.id;
        titleSpan.textContent = s.title || "Chat Session";

        const toolsDiv = document.createElement("div");
        toolsDiv.className = "session-tools";

        const renameBtn = document.createElement("button");
        renameBtn.className = "session-tool-btn";
        renameBtn.textContent = "✏️";
        renameBtn.title = "Rename";
        renameBtn.onclick = (e) => {
          e.stopPropagation();
          startInlineRename(s.id);
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "session-tool-btn delete";
        deleteBtn.textContent = "✕";
        deleteBtn.title = "Delete";
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          deleteSession(s.id);
        };

        toolsDiv.appendChild(renameBtn);
        toolsDiv.appendChild(deleteBtn);
        item.appendChild(titleSpan);
        item.appendChild(toolsDiv);
        itemsEl.appendChild(item);
      });
    }

    document.addEventListener("DOMContentLoaded", () => {
      const searchInput = document.getElementById("sessionSearchInput");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          const q = e.target.value.toLowerCase().trim();
          if (!q) {
            renderSessionList(allSessionsList);
            return;
          }
          const filtered = allSessionsList.filter(s => (s.title || "").toLowerCase().includes(q));
          renderSessionList(filtered);
        });
      }
    });

    async function switchSession(sessionId) {
      if (currentSessionId === sessionId) return;
      currentSessionId = sessionId;
      closeSidebarMobile();
      renderSessionList(allSessionsList);

      const emptyHero = document.getElementById("emptyHero");
      if (emptyHero) emptyHero.remove();

      const chatMaxWidth = document.getElementById("chatMaxWidth");
      chatMaxWidth.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-dim);">Loading conversation...</div>';

      try {
        const res = await fetch("/api/sessions/" + sessionId);
        const data = await res.json();
        chatMaxWidth.innerHTML = "";
        currentMessages = [];

        if (data.messages && data.messages.length > 0) {
          data.messages.forEach(m => {
            currentMessages.push(m);
            appendMessageDOM(m.role, m.content);
          });
        } else {
          showEmptyHero();
        }
      } catch (e) {
        showToast("Failed to load session", "error");
      }
    }

    async function startNewChat() {
      currentSessionId = null;
      currentMessages = [];
      closeSidebarMobile();
      showEmptyHero();
      renderSessionList(allSessionsList);
      document.getElementById("chatInput").focus();
    }

    function showEmptyHero() {
      const chatMaxWidth = document.getElementById("chatMaxWidth");
      chatMaxWidth.innerHTML = '';
      const hero = document.createElement("div");
      hero.className = "empty-hero";
      hero.id = "emptyHero";
      hero.innerHTML = [
        '<div class="hero-avatar">',
        '  <img src="/logo.png" alt="Mehkesh AI">',
        '</div>',
        '<h1 class="hero-title">What can I help you with today?</h1>',
        '<div class="starter-cards-grid">',
        '  <div class="starter-card" data-starter="code">',
        '    <div class="starter-card-tag">Code Architecture</div>',
        '    <div class="starter-card-desc">Build a serverless API with SQLite database</div>',
        '  </div>',
        '  <div class="starter-card" data-starter="reason">',
        '    <div class="starter-card-tag">System Analysis</div>',
        '    <div class="starter-card-desc">Compare latency trade-offs of edge vs centralized servers</div>',
        '  </div>',
        '  <div class="starter-card" data-starter="imagine">',
        '    <div class="starter-card-tag">Create Image</div>',
        '    <div class="starter-card-desc">/imagine photorealistic obsidian workstation with ambient violet lighting</div>',
        '  </div>',
        '  <div class="starter-card" data-starter="translate">',
        '    <div class="starter-card-tag">Translate</div>',
        '    <div class="starter-card-desc">/translate hin_Deva Translate technical docs into Hindi</div>',
        '  </div>',
        '</div>'
      ].join('');
      hero.addEventListener("click", (e) => {
        const card = e.target.closest("[data-starter]");
        if (card && card.dataset.starter) triggerStarterPrompt(card.dataset.starter);
      });
      chatMaxWidth.appendChild(hero);
    }

    function triggerStarterPrompt(type) {
      if (type === "code") {
        selectModel("@cf/qwen/qwen2.5-coder-32b-instruct", "💻 Code & Tech");
        sendMessage("Write an optimized Cloudflare Worker API with rate limiting and SQLite D1 caching.");
      } else if (type === "reason") {
        selectModel("@cf/meta/llama-3.3-70b-instruct-fp8-fast", "🧠 Deep Reasoning");
        sendMessage("Compare edge serverless architecture vs containerized microservices. Detail trade-offs in cold-starts, latency, and operational cost.");
      } else if (type === "imagine") {
        sendMessage("/imagine A hyper-realistic obsidian workstation with subtle violet ambient backlighting, cinematic 8k");
      } else if (type === "translate") {
        sendMessage("/translate hin_Deva Good morning team! Today we are deploying our personal AI assistant globally.");
      }
    }

    async function startInlineRename(sessionId) {
      const span = document.getElementById("title_" + sessionId);
      if (!span) return;
      const currentTitle = span.textContent;
      const input = document.createElement("input");
      input.type = "text";
      input.value = currentTitle;
      input.style.cssText = "width:100%; background:var(--bg-input); border:1px solid var(--purple); color:var(--text-main); padding:2px 6px; border-radius:4px; font-size:0.8rem;";

      input.onkeydown = async (e) => {
        if (e.key === "Enter") {
          const newTitle = input.value.trim() || currentTitle;
          span.textContent = newTitle;
          input.replaceWith(span);
          await fetch("/api/sessions/" + sessionId, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle })
          });
          loadSessions();
        } else if (e.key === "Escape") {
          input.replaceWith(span);
        }
      };

      input.onblur = () => input.replaceWith(span);
      span.replaceWith(input);
      input.focus();
      input.select();
    }

    async function clearAllSessions() {
      if (!confirm("Are you sure you want to delete all conversations? This cannot be undone.")) return;
      try {
        const res = await fetch("/api/sessions", { method: "DELETE" });
        const data = await res.json();
        if (data.ok) {
          showToast("All conversations deleted", "success");
          startNewChat();
          loadSessions();
          closeModal("settingsModal");
        } else {
          showToast(data.error || "Failed to clear conversations", "error");
        }
      } catch (e) {
        showToast("Error clearing conversations", "error");
      }
    }

    async function deleteSession(sessionId) {
      if (!confirm("Delete this conversation?")) return;
      try {
        await fetch("/api/sessions/" + sessionId, { method: "DELETE" });
        if (currentSessionId === sessionId) startNewChat();
        loadSessions();
      } catch (e) {
        showToast("Failed to delete", "error");
      }
    }

    // ========================================================================
    // Message Rendering & Document Canvas
    // ========================================================================
    function appendMessageDOM(role, contentText) {
      const hero = document.getElementById("emptyHero");
      if (hero) hero.remove();

      const chatMaxWidth = document.getElementById("chatMaxWidth");
      const row = document.createElement("div");
      row.className = "message-row " + role;

      if (role === "user") {
        const bubble = document.createElement("div");
        bubble.className = "user-bubble";
        bubble.textContent = contentText;

        const editBtn = document.createElement("button");
        editBtn.className = "user-edit-btn";
        editBtn.textContent = "✏️ Edit";
        editBtn.onclick = () => {
          document.getElementById("chatInput").value = contentText;
          document.getElementById("chatInput").focus();
        };

        bubble.appendChild(editBtn);
        row.appendChild(bubble);
      } else {
        const avatar = document.createElement("div");
        avatar.className = "assistant-avatar";
        avatar.innerHTML = '<img src="/logo.png" alt="Mehkesh AI">';

        const wrap = document.createElement("div");
        wrap.className = "assistant-content-wrap";

        const body = document.createElement("div");
        body.className = "assistant-body";
        body.innerHTML = DOMPurify.sanitize(marked.parse(contentText));
        wrapTables(body);
        enhanceCodeBlocks(body);
        enhanceImages(body);
        renderMathInDOM(body);

        const actions = buildActionBar(contentText);
        wrap.appendChild(body);
        wrap.appendChild(actions);

        row.appendChild(avatar);
        row.appendChild(wrap);
      }

      chatMaxWidth.appendChild(row);
      scrollToBottom();
      return row;
    }

    function enhanceImages(container) {
      container.querySelectorAll("img").forEach(img => {
        if (img.closest(".assistant-avatar") || img.closest(".code-header-bar")) return;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.borderRadius = "12px";
        img.style.border = "1px solid var(--border)";
        img.style.display = "block";
        img.style.margin = "12px 0 8px";
        img.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.25)";

        if (!img.nextElementSibling || !img.nextElementSibling.classList.contains("img-action-wrap")) {
          const wrap = document.createElement("div");
          wrap.className = "img-action-wrap";
          wrap.style.marginTop = "8px";
          wrap.style.marginBottom = "14px";

          const a = document.createElement("a");
          a.href = img.src;
          a.download = "mehkesh-image.jpg";
          a.className = "primary-btn";
          a.style.display = "inline-flex";
          a.style.alignItems = "center";
          a.style.gap = "6px";
          a.style.textDecoration = "none";
          a.style.fontSize = "0.78rem";
          a.style.padding = "5px 12px";
          a.style.borderRadius = "6px";
          a.innerHTML = "⬇ Download Image";

          wrap.appendChild(a);
          img.parentNode.insertBefore(wrap, img.nextSibling);
        }
      });
    }

    function wrapTables(container) {
      container.querySelectorAll("table").forEach(tbl => {
        if (!tbl.parentElement.classList.contains("table-container")) {
          const wrap = document.createElement("div");
          wrap.className = "table-container";
          tbl.parentNode.insertBefore(wrap, tbl);
          wrap.appendChild(tbl);
        }
      });
    }

    function enhanceCodeBlocks(container) {
      container.querySelectorAll("pre").forEach(pre => {
        const codeEl = pre.querySelector("code");
        if (!codeEl) return;

        // Apply Highlight.js syntax highlighting
        if (window.hljs && !codeEl.dataset.highlighted) {
          try {
            hljs.highlightElement(codeEl);
            codeEl.dataset.highlighted = "true";
          } catch (e) {}
        }

        if (pre.querySelector(".code-header-bar")) return;

        let lang = "CODE";
        const match = codeEl.className.match(/language-([a-zA-Z0-9_-]+)/);
        if (match && match[1]) lang = match[1].toUpperCase();

        const header = document.createElement("div");
        header.className = "code-header-bar";
        header.innerHTML = [
          '<span>' + escapeHtml(lang) + '</span>',
          '<div style="display:flex; gap:6px;">',
          '  <button class="code-action-btn download-btn">⬇ Download</button>',
          '  <button class="code-action-btn copy-btn">📋 Copy</button>',
          '</div>'
        ].join('');

        header.querySelector(".copy-btn").onclick = () => {
          navigator.clipboard.writeText(codeEl.textContent);
          header.querySelector(".copy-btn").textContent = "✓ Copied";
          setTimeout(() => header.querySelector(".copy-btn").textContent = "📋 Copy", 2000);
        };

        header.querySelector(".download-btn").onclick = () => {
          const blob = new Blob([codeEl.textContent], { type: "text/plain" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          const langLower = lang.toLowerCase();
          const extMap = { javascript: "js", js: "js", typescript: "ts", ts: "ts", python: "py", py: "py", html: "html", css: "css", json: "json", sql: "sql", markdown: "md", md: "md", shell: "sh", bash: "sh" };
          const ext = extMap[langLower] || "txt";
          a.download = "code-" + Date.now() + "." + ext;
          a.click();
        };

        pre.insertBefore(header, codeEl);
      });
    }

    function renderMathInDOM(container) {
      if (typeof renderMathInElement === "function") {
        try {
          renderMathInElement(container, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false },
              { left: "\\\\(", right: "\\\\)", display: false },
              { left: "\\\\[", right: "\\\\]", display: true }
            ],
            throwOnError: false
          });
        } catch (e) {}
      }
    }

    function buildActionBar(text) {
      const actions = document.createElement("div");
      actions.className = "assistant-action-bar";

      // Copy
      const copyBtn = document.createElement("button");
      copyBtn.className = "msg-action-btn";
      copyBtn.innerHTML = "📋 Copy";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(text);
        copyBtn.innerHTML = "✓ Copied";
        setTimeout(() => copyBtn.innerHTML = "📋 Copy", 2000);
      };

      // Regenerate
      const regenBtn = document.createElement("button");
      regenBtn.className = "msg-action-btn";
      regenBtn.innerHTML = "🔄 Regenerate";
      regenBtn.onclick = () => regenerateLastAssistantMessage();

      // Like / Dislike
      const likeBtn = document.createElement("button");
      likeBtn.className = "msg-action-btn";
      likeBtn.innerHTML = "👍";
      likeBtn.title = "Good response";
      likeBtn.onclick = () => {
        likeBtn.style.color = "var(--green)";
        showToast("Thanks for the feedback!", "info");
      };

      const dislikeBtn = document.createElement("button");
      dislikeBtn.className = "msg-action-btn";
      dislikeBtn.innerHTML = "👎";
      dislikeBtn.title = "Poor response";
      dislikeBtn.onclick = () => {
        dislikeBtn.style.color = "var(--red)";
        showToast("Feedback recorded", "info");
      };

      // TTS Local Device Voice
      const speakBtn = document.createElement("button");
      speakBtn.className = "msg-action-btn";
      speakBtn.innerHTML = "🔊 Listen";
      speakBtn.onclick = () => toggleTTS(text, speakBtn);

      actions.appendChild(copyBtn);
      actions.appendChild(regenBtn);
      actions.appendChild(likeBtn);
      actions.appendChild(dislikeBtn);
      actions.appendChild(speakBtn);
      return actions;
    }

    function toggleTTS(text, btn) {
      if (!window.speechSynthesis) {
        showToast("Device text-to-speech not supported", "info");
        return;
      }
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        btn.innerHTML = "🔊 Listen";
        return;
      }

      // Clean technical markdown, code blocks, URLs, and formatting
      const b3 = String.fromCharCode(96, 96, 96);
      const b1 = String.fromCharCode(96);
      const clean = text
        .replace(new RegExp(b3 + "[\\\\s\\\\S]*?" + b3, "g"), "Code block omitted.")
        .replace(new RegExp(b1 + "([^" + b1 + "]+)" + b1, "g"), "$1")
        .replace(new RegExp("\\\\[([^\\\\]]+)\\\\]\\\\([^)]+\\\\)", "g"), "$1")
        .replace(new RegExp("https?:\\\\/\\\\/\\\\S+", "g"), "")
        .replace(/[*#_~>|]/g, "")
        .replace(/\\n+/g, " ")
        .trim()
        .slice(0, 1500);

      if (!clean) return;

      const utter = new SpeechSynthesisUtterance(clean);
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Neural") || v.name.includes("Premium"))) || voices.find(v => v.lang.startsWith("en"));
      if (naturalVoice) utter.voice = naturalVoice;

      utter.rate = 1.0;
      utter.pitch = 1.0;

      utter.onstart = () => { btn.innerHTML = "⏹ Stop"; };
      utter.onend = () => { btn.innerHTML = "🔊 Listen"; };
      utter.onerror = () => { btn.innerHTML = "🔊 Listen"; };

      window.speechSynthesis.speak(utter);
    }

    function regenerateLastAssistantMessage() {
      if (isGenerating) return;
      for (let i = currentMessages.length - 1; i >= 0; i--) {
        if (currentMessages[i].role === "user") {
          const userPrompt = currentMessages[i].content;
          if (currentMessages[currentMessages.length - 1].role === "assistant") {
            currentMessages.pop();
            const chatMaxWidth = document.getElementById("chatMaxWidth");
            if (chatMaxWidth.lastElementChild && chatMaxWidth.lastElementChild.classList.contains("assistant")) {
              chatMaxWidth.lastElementChild.remove();
            }
          }
          currentMessages.pop();
          sendMessage(userPrompt);
          break;
        }
      }
    }

    function scrollToBottom() {
      const area = document.getElementById("chatScrollArea");
      area.scrollTop = area.scrollHeight;
    }

    // ========================================================================
    // Chat Submission & Streaming Engine
    // ========================================================================
    async function sendMessage(overrideText) {
      if (isGuest && guestRemaining <= 0) {
        showToast("You have used your 3 free guest queries for today. Please sign in to continue.", "warning");
        showAuthModal(true);
        return;
      }
      let prompt = overrideText || document.getElementById("chatInput").value.trim();
      if (!prompt || isGenerating) return;

      document.getElementById("chatInput").value = "";
      document.getElementById("chatInput").style.height = "auto";
      hideSlash();

      // If document attached, embed it in code fence
      if (attachedDocument) {
        const fence = String.fromCharCode(96, 96, 96);
        prompt = prompt + "\\n\\n--- Attached File: " + attachedDocument.name + " ---\\n" + fence + (attachedDocument.ext || "") + "\\n" + attachedDocument.content + "\\n" + fence + "\\n---";
      }

      if (!currentSessionId && !isGuest) {
        try {
          let sTitle = prompt.slice(0, 36);
          if (prompt.startsWith("/imagine ")) {
            sTitle = "🎨 " + prompt.slice(9).trim().slice(0, 30);
          } else if (prompt.startsWith("/translate ")) {
            sTitle = "🌐 " + prompt.slice(11).trim().slice(0, 30);
          }
          const sRes = await fetch("/api/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: sTitle })
          });
          const sData = await sRes.json();
          currentSessionId = sData.id;
          loadSessions();
        } catch (e) {}
      }

      appendMessageDOM("user", prompt);
      currentMessages.push({ role: "user", content: prompt });

      if (prompt.startsWith("/imagine ")) {
        handleFluxGeneration(prompt.slice(9).trim());
        removeAttachment();
        return;
      }
      if (prompt.startsWith("/translate ")) {
        handleIndicTranslation(prompt.slice(11).trim());
        removeAttachment();
        return;
      }
      if (prompt.startsWith("/clear")) {
        startNewChat();
        removeAttachment();
        return;
      }

      isGenerating = true;
      document.getElementById("sendBtn").style.display = "none";
      document.getElementById("stopBtn").style.display = "inline-flex";

      const hero = document.getElementById("emptyHero");
      if (hero) hero.remove();

      const chatMaxWidth = document.getElementById("chatMaxWidth");
      const row = document.createElement("div");
      row.className = "message-row assistant";

      const avatar = document.createElement("div");
      avatar.className = "assistant-avatar";
      avatar.innerHTML = '<img src="/logo.png" alt="Mehkesh AI">';

      const wrap = document.createElement("div");
      wrap.className = "assistant-content-wrap";

      const body = document.createElement("div");
      body.className = "assistant-body";
      body.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';

      wrap.appendChild(body);
      row.appendChild(avatar);
      row.appendChild(wrap);
      chatMaxWidth.appendChild(row);
      scrollToBottom();

      activeAbortController = new AbortController();
      let accumulatedText = "";

      try {
        const payload = {
          messages: currentMessages,
          session_id: currentSessionId,
          model: selectedModel,
          model_override: selectedModel,
          image: attachedImageData,
          image_data: attachedImageData,
          has_image: Boolean(attachedImageData)
        };

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: activeAbortController.signal
        });

        // Track guest remaining header only for guests
        const remainingHeader = res.headers.get("x-guest-remaining");
        if (isGuest && remainingHeader !== null && remainingHeader !== "unlimited") {
          const parsed = parseInt(remainingHeader, 10);
          if (!isNaN(parsed)) {
            guestRemaining = parsed;
            renderGuestUI();
          }
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.error || "Generation error";
          body.innerHTML = '<span style="color:var(--red);">⚠️ ' + escapeHtml(errMsg) + '</span>';
          if ((res.status === 401 || res.status === 403) && (errData.guest_exhausted || errMsg.includes("limit") || errMsg.includes("guest") || errMsg.includes("queries"))) {
            guestRemaining = 0;
            renderGuestUI();
            showAuthModal(true);
          }
          finalizeGeneration();
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(String.fromCharCode(10));
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data:")) continue;
            const dataStr = trimmed.slice(5).trim();
            if (dataStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.response) {
                accumulatedText += parsed.response;
                body.innerHTML = DOMPurify.sanitize(marked.parse(accumulatedText));
                wrapTables(body);
                scrollToBottom();
              }
            } catch (err) {}
          }
        }

        if (accumulatedText) {
          body.innerHTML = DOMPurify.sanitize(marked.parse(accumulatedText));
          wrapTables(body);
          enhanceCodeBlocks(body);
          enhanceImages(body);
          renderMathInDOM(body);
          currentMessages.push({ role: "assistant", content: accumulatedText });

          const actions = buildActionBar(accumulatedText);
          wrap.appendChild(actions);
        }
      } catch (e) {
        if (e.name !== "AbortError") {
          body.innerHTML = '<span style="color:var(--red);">⚠️ Connection interrupted</span>';
        }
      } finally {
        removeAttachment();
        finalizeGeneration();
        updateQuotaDisplay();
      }
    }

    function stopGeneration() {
      if (activeAbortController) activeAbortController.abort();
      finalizeGeneration();
    }

    function finalizeGeneration() {
      isGenerating = false;
      activeAbortController = null;
      document.getElementById("sendBtn").style.display = "inline-flex";
      document.getElementById("stopBtn").style.display = "none";
    }

    async function handleFluxGeneration(promptText) {
      if (isGuest && guestRemaining <= 0) {
        showToast("You have used your 3 free guest queries for today. Please sign in to continue.", "warning");
        showAuthModal(true);
        return;
      }
      appendMessageDOM("assistant", "🎨 Generating image...");
      try {
        const res = await fetch("/api/imagine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptText, session_id: currentSessionId })
        });

        const remainingHeader = res.headers.get("x-guest-remaining");
        if (isGuest && remainingHeader !== null && remainingHeader !== "unlimited") {
          const parsed = parseInt(remainingHeader, 10);
          if (!isNaN(parsed)) {
            guestRemaining = parsed;
            renderGuestUI();
          }
        } else if (isGuest && res.ok) {
          guestRemaining = Math.max(0, guestRemaining - 1);
          renderGuestUI();
        }

        const data = await res.json();
        const chatMaxWidth = document.getElementById("chatMaxWidth");
        const lastRow = chatMaxWidth.lastElementChild;
        if (data.image) {
          lastRow.querySelector(".assistant-body").innerHTML = [
            '<img src="' + data.image + '" alt="' + escapeHtml(promptText) + '" style="max-width:100%; border-radius:10px; border:1px solid var(--border);">',
            '<div style="margin-top:10px;"><a href="' + data.image + '" download="mehkesh-image.jpg" class="primary-btn" style="display:inline-block; text-decoration:none; font-size:0.75rem; padding:5px 12px;">⬇ Download Image</a></div>'
          ].join('');
        } else {
          lastRow.querySelector(".assistant-body").innerHTML = '<span style="color:var(--red);">⚠️ ' + escapeHtml(data.error || "Image generation failed") + '</span>';
          if ((res.status === 401 || res.status === 403) && (data.guest_exhausted || (data.error && (data.error.includes("guest") || data.error.includes("limit"))))) {
            guestRemaining = 0;
            renderGuestUI();
            showAuthModal(true);
          }
        }
      } catch (e) {
        showToast("Image generation failed", "error");
      }
    }

    async function handleIndicTranslation(args) {
      if (isGuest && guestRemaining <= 0) {
        showToast("You have used your 3 free guest queries for today. Please sign in to continue.", "warning");
        showAuthModal(true);
        return;
      }
      const parts = args.split(" ");
      const targetLang = parts[0] || "hin_Deva";
      const textToTranslate = parts.slice(1).join(" ") || "Hello";

      appendMessageDOM("assistant", "🌐 Translating into " + targetLang + "...");
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textToTranslate, target_lang: targetLang })
        });

        const remainingHeader = res.headers.get("x-guest-remaining");
        if (isGuest && remainingHeader !== null && remainingHeader !== "unlimited") {
          const parsed = parseInt(remainingHeader, 10);
          if (!isNaN(parsed)) {
            guestRemaining = parsed;
            renderGuestUI();
          }
        } else if (isGuest && res.ok) {
          guestRemaining = Math.max(0, guestRemaining - 1);
          renderGuestUI();
        }

        const data = await res.json();
        const chatMaxWidth = document.getElementById("chatMaxWidth");
        const lastRow = chatMaxWidth.lastElementChild;
        if (data.translation) {
          lastRow.querySelector(".assistant-body").innerHTML = '<div style="font-size:1.05rem; color:var(--text-main); padding:6px 0;">' + escapeHtml(data.translation) + '</div>';
        } else {
          lastRow.querySelector(".assistant-body").innerHTML = '<span style="color:var(--red);">⚠️ ' + escapeHtml(data.error || "Translation failed") + '</span>';
          if ((res.status === 401 || res.status === 403) && (data.guest_exhausted || (data.error && (data.error.includes("guest") || data.error.includes("limit"))))) {
            guestRemaining = 0;
            renderGuestUI();
            showAuthModal(true);
          }
        }
      } catch (e) {
        showToast("Translation error", "error");
      }
    }

    // ========================================================================
    // Audio Voice Input (Whisper AI)
    // ========================================================================
    async function toggleMicRecording() {
      const btn = document.getElementById("micBtn");
      if (isRecordingAudio) {
        if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
        btn.classList.remove("recording");
        isRecordingAudio = false;
        showToast("Transcribing speech...", "info");
      } else {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioChunks = [];
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.push(e.data); };
          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.webm");
            try {
              let res = await fetch("/api/transcribe", { method: "POST", body: formData });
              if (res.status === 404) {
                res = await fetch("/api/audio/transcribe", { method: "POST", body: formData });
              }
              const data = await res.json();
              if (data.text) {
                const input = document.getElementById("chatInput");
                input.value = (input.value + " " + data.text).trim();
                input.style.height = Math.min(input.scrollHeight, 180) + "px";
                input.focus();
                showToast("Transcribed", "success");
              } else {
                showToast("No speech detected", "info");
              }
            } catch (err) {
              showToast("Transcription failed", "error");
            }
          };
          mediaRecorder.start();
          isRecordingAudio = true;
          btn.classList.add("recording");
          showToast("Listening... (Click mic to stop)", "info");
        } catch (err) {
          showToast("Microphone access denied", "error");
        }
      }
    }

    // ========================================================================
    // Attachments & Event Listeners
    // ========================================================================
    function setupEventListeners() {
      const chatInput = document.getElementById("chatInput");

      chatInput.addEventListener("input", () => {
        chatInput.style.height = "auto";
        chatInput.style.height = Math.min(chatInput.scrollHeight, 180) + "px";
        handleSlashFilter(chatInput.value);
      });

      chatInput.addEventListener("keydown", (e) => {
        const popover = document.getElementById("slashPopover");
        if (popover && popover.classList.contains("active")) {
          const items = popover.querySelectorAll(".slash-item");
          if (e.key === "ArrowDown") {
            e.preventDefault();
            slashIndex = (slashIndex + 1) % items.length;
            updateSlashSelection(items);
            return;
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            slashIndex = (slashIndex - 1 + items.length) % items.length;
            updateSlashSelection(items);
            return;
          } else if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault();
            if (items[slashIndex]) {
              applySlash(items[slashIndex].dataset.cmd);
            }
            return;
          } else if (e.key === "Escape") {
            hideSlash();
            return;
          }
        }

        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });

      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
          e.preventDefault();
          startNewChat();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "[") {
          e.preventDefault();
          toggleSidebar();
        }
      });

      document.getElementById("fileInput").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) handleIncomingFile(file);
      });

      window.addEventListener("paste", (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (const item of items) {
          if (item.type.indexOf("image") === 0) {
            const blob = item.getAsFile();
            handleIncomingFile(blob);
            break;
          }
        }
      });

      window.addEventListener("dragover", (e) => {
        e.preventDefault();
        document.getElementById("dragDropOverlay").classList.add("active");
      });
      window.addEventListener("dragleave", (e) => {
        if (e.clientX <= 0 || e.clientY <= 0) {
          document.getElementById("dragDropOverlay").classList.remove("active");
        }
      });
      window.addEventListener("drop", (e) => {
        e.preventDefault();
        document.getElementById("dragDropOverlay").classList.remove("active");
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleIncomingFile(e.dataTransfer.files[0]);
        }
      });
    }

    function handleSlashFilter(text) {
      const popover = document.getElementById("slashPopover");
      if (!text.startsWith("/")) {
        hideSlash();
        return;
      }
      const query = text.toLowerCase().slice(1).trim();
      const filtered = ALL_SLASH_COMMANDS.filter(c => c.label.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query));

      if (filtered.length === 0) {
        hideSlash();
        return;
      }

      popover.innerHTML = "";
      filtered.forEach((c, idx) => {
        const div = document.createElement("div");
        div.className = "slash-item" + (idx === 0 ? " selected" : "");
        div.dataset.cmd = c.cmd;
        div.onclick = () => applySlash(c.cmd);
        div.innerHTML = '<span class="slash-cmd">' + escapeHtml(c.label) + '</span><span class="slash-desc">' + escapeHtml(c.desc) + '</span>';
        popover.appendChild(div);
      });
      slashIndex = 0;
      popover.classList.add("active");
    }

    function updateSlashSelection(items) {
      items.forEach((item, i) => {
        item.classList.toggle("selected", i === slashIndex);
      });
    }

    function handleIncomingFile(file) {
      if (!file) return;

      // Handle Image Files
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          attachedImageData = e.target.result;
          attachedDocument = null;
          renderAttachmentUI(file.name || "Screenshot", true, e.target.result);
          showToast("Image attached", "info");
        };
        reader.readAsDataURL(file);
        return;
      }

      // Handle Code & Text Files
      if (file.size > 1024 * 1024) {
        showToast("Text files limited to 1MB", "info");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const ext = file.name.split(".").pop() || "txt";
        attachedDocument = {
          name: file.name,
          content: e.target.result,
          size: file.size,
          ext: ext
        };
        attachedImageData = null;
        renderAttachmentUI(file.name, false);
        showToast("Document attached", "info");
      };
      reader.readAsText(file);
    }

    function renderAttachmentUI(fileName, isImage, thumbSrc) {
      const container = document.getElementById("attachmentPreviewContainer");
      container.innerHTML = "";
      container.style.display = "flex";

      const card = document.createElement("div");
      card.className = "attachment-card";

      if (isImage && thumbSrc) {
        const img = document.createElement("img");
        img.className = "attachment-thumb";
        img.src = thumbSrc;
        card.appendChild(img);
      } else {
        const icon = document.createElement("span");
        icon.className = "attachment-doc-icon";
        icon.textContent = "📄";
        card.appendChild(icon);
      }

      const nameSpan = document.createElement("span");
      nameSpan.className = "attachment-name";
      nameSpan.textContent = fileName;
      card.appendChild(nameSpan);

      const delBtn = document.createElement("button");
      delBtn.className = "chip-remove-btn";
      delBtn.textContent = "✕";
      delBtn.onclick = removeAttachment;
      card.appendChild(delBtn);

      container.appendChild(card);
    }

    function removeAttachment() {
      attachedImageData = null;
      attachedDocument = null;
      const container = document.getElementById("attachmentPreviewContainer");
      if (container) {
        container.innerHTML = "";
        container.style.display = "none";
      }
      document.getElementById("fileInput").value = "";
    }

    function applySlash(cmd) {
      document.getElementById("chatInput").value = cmd;
      document.getElementById("chatInput").focus();
      hideSlash();
    }

    function hideSlash() {
      const p = document.getElementById("slashPopover");
      if (p) p.classList.remove("active");
    }

    // ========================================================================
    // Daily Briefing
    // ========================================================================
    async function showDailyBriefing() {
      openModal("briefingModal");
      const content = document.getElementById("briefingContent");
      content.innerHTML = '<p style="color:var(--text-muted);">Loading your daily briefing...</p>';
      try {
        const res = await fetch("/api/briefing/today");
        const data = await res.json();
        if (data && data.summary) {
          content.innerHTML = DOMPurify.sanitize(marked.parse(data.summary));
          wrapTables(content);
        } else {
          content.innerHTML = '<p style="color:var(--text-muted);">No briefing recorded for today yet. Click <strong>Refresh Briefing</strong> below to generate the daily briefing.</p>';
        }
      } catch (err) {
        content.innerHTML = '<p style="color:var(--red);">Failed to load briefing.</p>';
      }
    }

    async function refreshBriefing() {
      const content = document.getElementById("briefingContent");
      content.innerHTML = '<p style="color:var(--text-muted);">Generating your briefing with AI...</p>';
      try {
        const res = await fetch("/api/briefing/refresh", { method: "POST" });
        const data = await res.json();
        const summary = (data.briefing && data.briefing.summary) || data.summary;
        if (summary) {
          content.innerHTML = DOMPurify.sanitize(marked.parse(summary));
          wrapTables(content);
          showToast("Briefing updated", "success");
        } else {
          content.innerHTML = '<p style="color:var(--text-muted);">Briefing updated.</p>';
        }
      } catch (err) {
        content.innerHTML = '<p style="color:var(--red);">Failed to refresh briefing.</p>';
      }
    }

    // ========================================================================
    // Memories
    // ========================================================================
    async function loadMemories() {
      try {
        const res = await fetch("/api/memories");
        const list = await res.json();
        const container = document.getElementById("memoryListContainer");
        container.innerHTML = "";
        if (Array.isArray(list) && list.length > 0) {
          list.forEach(m => {
            const item = document.createElement("div");
            item.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:8px 10px; border-radius:6px; font-size:0.82rem;";
            const textSpan = document.createElement("span");
            textSpan.textContent = m.fact;
            const delBtn = document.createElement("button");
            delBtn.textContent = "✕";
            delBtn.style.cssText = "background:none; border:none; color:var(--red); cursor:pointer;";
            delBtn.onclick = () => deleteMemoryFact(m.id);
            item.appendChild(textSpan);
            item.appendChild(delBtn);
            container.appendChild(item);
          });
        } else {
          container.innerHTML = '<div style="color:var(--text-dim); font-size:0.8rem; text-align:center; padding:12px;">No stored memories yet.</div>';
        }
      } catch (e) {}
    }

    async function addMemoryFact() {
      const input = document.getElementById("newMemoryFactInput");
      const fact = input.value.trim();
      if (!fact) return;
      try {
        await fetch("/api/memories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fact })
        });
        input.value = "";
        loadMemories();
        showToast("Memory saved", "success");
      } catch (e) {
        showToast("Failed to save memory", "error");
      }
    }

    async function deleteMemoryFact(id) {
      try {
        await fetch("/api/memories/" + id, { method: "DELETE" });
        loadMemories();
      } catch (e) {}
    }

    // ========================================================================
    // Settings & Master Admin Console
    // ========================================================================
    function switchSettingsTab(tab) {
      document.getElementById("tabBtnProfile").classList.toggle("active", tab === "profile");
      document.getElementById("tabBtnAdmin").classList.toggle("active", tab === "admin");
      document.getElementById("tabPaneProfile").style.display = tab === "profile" ? "block" : "none";
      document.getElementById("tabPaneAdmin").style.display = tab === "admin" ? "block" : "none";
      if (tab === "admin") loadAdminUsers();
    }

    async function updateQuotaDisplay() {
      if (isGuest) {
        document.getElementById("profileQuotaText").textContent = (3 - guestRemaining) + " / 3 Free Queries Used";
        document.getElementById("profileProgressBar").style.width = Math.min(100, Math.round(((3 - guestRemaining) / 3) * 100)) + "%";
        return;
      }
      try {
        const res = await fetch("/api/quota");
        const q = await res.json();
        if (q && typeof q.used_today !== "undefined") {
          const used = q.used_today || 0;
          const limit = q.daily_limit || 2000;
          const pct = Math.min(100, Math.round((used / limit) * 100));
          document.getElementById("profileQuotaText").textContent = used.toLocaleString() + " / " + limit.toLocaleString() + " Credits Used Today";
          document.getElementById("profileProgressBar").style.width = pct + "%";
        }
      } catch (e) {}
    }

    async function loadAdminUsers() {
      const tbody = document.getElementById("adminUserTableBody");
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-dim); padding:16px;">Loading accounts...</td></tr>';
      try {
        const res = await fetch("/api/admin/users");
        const users = await res.json();
        if (Array.isArray(users) && users.length > 0) {
          tbody.innerHTML = "";
          users.forEach(u => {
            const tr = document.createElement("tr");

            // User Info
            const tdUser = document.createElement("td");
            tdUser.innerHTML = '<strong>' + escapeHtml(u.full_name || "User") + '</strong><br><span style="color:var(--text-dim); font-size:0.72rem;">' + escapeHtml(u.email || "") + '</span>';

            // Role
            const tdRole = document.createElement("td");
            tdRole.textContent = (u.role || "user").toUpperCase();

            // Daily Limit (Editable)
            const tdLimit = document.createElement("td");
            const budgetInput = document.createElement("input");
            budgetInput.type = "number";
            budgetInput.className = "budget-edit-input";
            budgetInput.value = u.neuron_budget || 2000;
            budgetInput.onchange = () => updateAdminBudget(u.id, budgetInput.value);
            tdLimit.appendChild(budgetInput);

            // Used Today
            const tdUsed = document.createElement("td");
            tdUsed.textContent = (u.neurons_today || 0).toLocaleString();

            // Status
            const tdStatus = document.createElement("td");
            tdStatus.innerHTML = u.is_active ? '<span style="color:var(--green);">🟢 Active</span>' : '<span style="color:var(--red);">🔴 Suspended</span>';

            // Action
            const tdAction = document.createElement("td");
            const toggleBtn = document.createElement("button");
            toggleBtn.className = "secondary-btn";
            toggleBtn.style.cssText = "padding:3px 8px; font-size:0.72rem;";
            toggleBtn.textContent = u.is_active ? "Suspend" : "Activate";
            toggleBtn.onclick = () => toggleAdminUserStatus(u.id, u.is_active ? 0 : 1);
            tdAction.appendChild(toggleBtn);

            tr.appendChild(tdUser);
            tr.appendChild(tdRole);
            tr.appendChild(tdLimit);
            tr.appendChild(tdUsed);
            tr.appendChild(tdStatus);
            tr.appendChild(tdAction);
            tbody.appendChild(tr);
          });
        } else {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-dim); padding:16px;">No users registered yet.</td></tr>';
        }
      } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--red); padding:16px;">Failed to load admin user data.</td></tr>';
      }
    }

    async function updateAdminBudget(userId, newBudget) {
      const budget = parseInt(newBudget, 10);
      if (isNaN(budget) || budget < 0) return;
      try {
        const res = await fetch("/api/admin/users/" + userId + "/budget", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ budget })
        });
        const data = await res.json();
        if (data.ok) {
          showToast("User budget updated to " + budget, "success");
        } else {
          showToast(data.error || "Failed to update budget", "error");
        }
      } catch (e) {
        showToast("Error updating budget", "error");
      }
    }

    async function toggleAdminUserStatus(userId, newStatus) {
      try {
        const res = await fetch("/api/admin/users/" + userId + "/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: newStatus })
        });
        const data = await res.json();
        if (data.ok) {
          showToast(newStatus ? "User activated" : "User suspended", "success");
          loadAdminUsers();
        } else {
          showToast(data.error || "Status update failed", "error");
        }
      } catch (e) {
        showToast("Error changing status", "error");
      }
    }

    // ========================================================================
    // Modal Helpers
    // ========================================================================
    function openModal(id) {
      const modal = document.getElementById(id);
      if (modal) modal.style.display = "flex";
      if (id === "memoryModal") loadMemories();
      if (id === "settingsModal") {
        updateQuotaDisplay();
        switchSettingsTab("profile");
      }
    }

    function closeModal(id) {
      const modal = document.getElementById(id);
      if (modal) modal.style.display = "none";
    }

    function showToast(msg, type) {
      const container = document.getElementById("toastContainer");
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.textContent = msg;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }

    function escapeHtml(str) {
      if (!str) return "";
      return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  </script>
</body>
</html>`;
}
