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
  <meta name="description" content="Mehkesh AI - Personal AI Intelligence">
  
  <!-- Exact Brand Favicon -->
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="shortcut icon" type="image/png" href="/logo.png">
  <link rel="apple-touch-icon" href="/logo.png">

  <!-- Highlight.js, Marked, DOMPurify (Edge CDNs) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.2/purify.min.js"></script>

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
      --text-dim: #64748b;
      --red: #ef4444;
      --green: #10b981;
      --sidebar-w: 260px;
      --header-h: 56px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; width: 100%; overflow: hidden; background: var(--bg-base); color: var(--text-main); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }

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
      color: #fff;
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
      color: #fff;
      font-size: 0.86rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    .new-chat-btn:hover {
      background: rgba(139, 92, 246, 0.14);
      border-color: rgba(139, 92, 246, 0.4);
      color: #fff;
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
      color: #fff;
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
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 6px;
      color: #fff;
      font-size: 0.8rem;
      outline: none;
      transition: border 0.15s;
    }
    .sidebar-search input:focus {
      border-color: var(--border-focus);
      background: rgba(255, 255, 255, 0.05);
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
      padding: 10px 8px 4px;
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
      color: #fff;
    }
    .session-item.active {
      background: rgba(139, 92, 246, 0.14);
      color: #fff;
      font-weight: 500;
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
    .session-tool-btn:hover { color: #fff; }
    .session-tool-btn.delete:hover { color: var(--red); }

    /* Sidebar Footer: User Card */
    .sidebar-footer {
      padding: 10px 14px;
      border-top: 1px solid var(--border);
      flex-shrink: 0;
      background: rgba(10, 12, 18, 0.6);
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
      color: #fff;
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
      background: rgba(9, 10, 15, 0.82);
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
      color: #fff;
    }

    /* Clean Model Selector Pill */
    .model-pill-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 12px;
      color: #fff;
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
    .model-pill-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--border-hover);
    }
    .model-dropdown-menu {
      display: none;
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      width: 250px;
      background: #111422;
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
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .model-item-sub {
      font-size: 0.72rem;
      color: var(--text-dim);
    }

    /* Chat Messages Viewport */
    .chat-scroll-area {
      flex: 1;
      overflow-y: auto;
      padding: 24px 16px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 0;
    }
    .chat-max-width {
      width: 100%;
      max-width: 780px;
      display: flex;
      flex-direction: column;
      gap: 22px;
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
      color: #fff;
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
    .starter-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(139, 92, 246, 0.45);
      transform: translateY(-1px);
    }
    .starter-card-tag {
      font-size: 0.74rem;
      font-weight: 600;
      color: #fff;
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
      position: relative;
    }
    .message-row.user { justify-content: flex-end; }
    .message-row.assistant { justify-content: flex-start; gap: 12px; }

    .user-bubble {
      max-width: 82%;
      background: #161924;
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 18px 18px 4px 18px;
      padding: 12px 18px;
      font-size: 0.94rem;
      line-height: 1.55;
      color: #fff;
      word-break: break-word;
      position: relative;
    }
    .user-bubble:hover .user-edit-btn { display: inline-flex; }
    .user-edit-btn {
      display: none;
      position: absolute;
      top: -9px;
      right: 12px;
      background: #242938;
      border: 1px solid var(--border-hover);
      color: var(--text-muted);
      font-size: 0.72rem;
      padding: 3px 6px;
      border-radius: 6px;
      cursor: pointer;
    }
    .user-edit-btn:hover { color: #fff; }

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
      color: #e2e8f0;
      word-break: break-word;
    }
    .assistant-body p { margin-bottom: 14px; }
    .assistant-body p:last-child { margin-bottom: 0; }
    .assistant-body h1, .assistant-body h2, .assistant-body h3 {
      color: #fff;
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
    .assistant-body table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 0.88rem;
    }
    .assistant-body th, .assistant-body td {
      border: 1px solid var(--border);
      padding: 8px 12px;
      text-align: left;
    }
    .assistant-body th { background: rgba(255, 255, 255, 0.04); color: #fff; }

    /* Code Blocks */
    pre {
      background: #090c14 !important;
      border: 1px solid var(--border);
      border-radius: 8px;
      margin: 14px 0;
      overflow: hidden;
      position: relative;
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
      gap: 8px;
      margin-top: 10px;
      opacity: 0.7;
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
      color: #fff;
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
      background: #11131d;
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

    /* Attachment Chip */
    .attachment-preview-chip {
      display: none;
      align-items: center;
      gap: 8px;
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.3);
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 8px;
      width: fit-content;
      font-size: 0.78rem;
      color: #fff;
    }
    .chip-remove-btn {
      background: transparent;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      font-size: 0.8rem;
    }
    .chip-remove-btn:hover { color: #fff; }

    /* Textarea */
    .composer-textarea {
      width: 100%;
      min-height: 44px;
      max-height: 180px;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
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

      background: rgba(255, 255, 255, 0.06);
      border-color: var(--border);
      color: #fff;
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
      background: #11131d;
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

    /* Attachment Chip */
    .attachment-preview-chip {
      display: none;
      align-items: center;
      gap: 8px;
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.3);
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 8px;
      width: fit-content;
      font-size: 0.78rem;
      color: #fff;
    }
    .chip-remove-btn {
      background: transparent;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      font-size: 0.8rem;
    }
    .chip-remove-btn:hover { color: #fff; }

    /* Textarea */
    .composer-textarea {
      width: 100%;
      min-height: 44px;
      max-height: 180px;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
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
      color: #fff;
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
      background: #dc2626;
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
      width: 270px;
      background: #141724;
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
    .slash-item:hover { background: rgba(139, 92, 246, 0.18); }
    .slash-cmd { font-weight: 700; color: var(--purple); }
    .slash-desc { color: var(--text-dim); font-size: 0.72rem; }

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
      background: #121522;
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
    .modal-title { font-size: 1rem; font-weight: 700; color: #fff; }
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
    .modal-tab-btn:hover { color: #fff; }
    .modal-tab-btn.active {
      color: var(--purple);
      border-bottom-color: var(--purple);
    }

    .form-input {
      width: 100%;
      padding: 9px 12px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: #fff;
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
    .secondary-btn:hover { background: var(--bg-surface-hover); color: #fff; }

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
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      color: #fff;
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
      background: #181c2d;
      border: 1px solid var(--border-hover);
      color: #fff;
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
        <button class="icon-btn" onclick="toggleSidebar()" title="Collapse Sidebar (Ctrl+[)">
          ◧
        </button>
      </div>

      <!-- New Chat Button -->
      <div class="sidebar-top">
        <button class="new-chat-btn" onclick="startNewChat()">
          <span>+ New chat</span>
          <span style="font-size:0.72rem; color:var(--text-dim);">Ctrl+K</span>
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
          <button class="icon-btn" id="openSidebarBtn" onclick="toggleSidebar()" title="Toggle Sidebar (Ctrl+[)">
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
          <button class="icon-btn" onclick="startNewChat()" title="New chat">
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
            <div class="slash-item" onclick="applySlash('/imagine ')">
              <span class="slash-cmd">/imagine</span>
              <span class="slash-desc">Generate images from description</span>
            </div>
            <div class="slash-item" onclick="applySlash('/translate hin_Deva ')">
              <span class="slash-cmd">/translate</span>
              <span class="slash-desc">Multilingual Indic translation</span>
            </div>
            <div class="slash-item" onclick="applySlash('/code ')">
              <span class="slash-cmd">/code</span>
              <span class="slash-desc">Code & architecture model</span>
            </div>
            <div class="slash-item" onclick="applySlash('/reason ')">
              <span class="slash-cmd">/reason</span>
              <span class="slash-desc">Deep reasoning model</span>
            </div>
            <div class="slash-item" onclick="applySlash('/clear')">
              <span class="slash-cmd">/clear</span>
              <span class="slash-desc">Clear current chat</span>
            </div>
          </div>

          <!-- Attachment Chip -->
          <div class="attachment-preview-chip" id="attachmentPreviewChip">
            <span>📎</span>
            <span id="attachedFileNameText">screenshot.png</span>
            <button class="chip-remove-btn" onclick="removeAttachment()">✕</button>
          </div>

          <!-- Textarea -->
          <textarea
            class="composer-textarea"
            id="chatInput"
            placeholder="Message Mehkesh AI... (Type / for commands)"
            rows="1"
          ></textarea>

          <input type="file" id="fileInput" accept="image/*" style="display:none;">

          <!-- Bottom Actions -->
          <div class="composer-toolbar">
            <div class="composer-left">
              <button class="composer-btn" onclick="document.getElementById('fileInput').click()" title="Attach image or screenshot">
                📎
              </button>
              <button class="composer-btn" id="micBtn" onclick="toggleMicRecording()" title="Voice input (Whisper AI)">
                🎙️
              </button>
            </div>
            <div class="composer-right">
              <button class="send-action-btn" id="sendBtn" onclick="sendMessage()" title="Send">
                ↑
              </button>
              <button class="stop-action-btn" id="stopBtn" onclick="stopGeneration()" title="Stop">
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
        <button class="icon-btn" onclick="closeModal('briefingModal')">✕</button>
      </div>
      <div class="modal-body">
        <div id="briefingContent" style="font-size:0.92rem; line-height:1.7; color:#e2e8f0; margin-bottom:18px;">
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
        <button class="icon-btn" onclick="closeModal('memoryModal')">✕</button>
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
        <button class="icon-btn" onclick="closeModal('settingsModal')">✕</button>
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

        <label class="form-label">Daily AI Budget</label>
        <div style="margin-top:6px; margin-bottom:16px;">
          <div style="font-size:1.1rem; font-weight:700; color:#fff;" id="profileQuotaText">0 / 2,000 Credits</div>
          <div style="height:6px; width:100%; background:rgba(255,255,255,0.06); border-radius:3px; margin-top:8px; overflow:hidden;">
            <div id="profileProgressBar" style="width:0%; height:100%; background:linear-gradient(90deg, var(--purple), var(--cyan)); border-radius:3px;"></div>
          </div>
        </div>

        <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:600; font-size:0.85rem; color:#fff;">Clear Conversations</div>
            <div style="font-size:0.75rem; color:var(--text-dim);">Permanently remove all chat history</div>
          </div>
          <button class="secondary-btn" style="color:var(--red); border-color:rgba(239,68,68,0.3); font-size:0.75rem; padding:5px 10px;" onclick="clearAllSessions()">Delete All</button>
        </div>
      </div>

      <!-- Tab 2: Admin Console (User limits, budgets, and suspensions) -->
      <div class="modal-body" id="tabPaneAdmin" style="display:none;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <div style="font-weight:700; font-size:0.95rem; color:#fff;">User Management & Limits</div>
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
        <button class="secondary-btn" onclick="signOut()">Sign Out</button>
        <button class="primary-btn" onclick="closeModal('settingsModal')">Close</button>
      </div>
    </div>
  </div>

  <!-- Auth Modal -->
  <div class="modal-backdrop" id="authModal">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">Sign in to Mehkesh AI</div>
      </div>
      <div class="modal-body">
        <p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:16px;">
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
    let currentSessionId = null;
    let currentMessages = [];
    let isGenerating = false;
    let activeAbortController = null;
    let attachedImageData = null;
    let selectedModel = "auto";
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecordingAudio = false;
    let allSessionsList = [];

    document.addEventListener("DOMContentLoaded", async () => {
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
    // Authentication
    // ========================================================================
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
        const res = await fetch("/api/auth/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password })
        });
        const data = await res.json();
        if (data.ok && data.user) {
          currentUser = data.user;
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
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        location.reload();
      } catch (e) {
        location.reload();
      }
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
      input.style.cssText = "width:100%; background:#10131e; border:1px solid var(--purple); color:#fff; padding:2px 6px; border-radius:4px; font-size:0.8rem;";

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
        body.innerHTML = marked.parse(DOMPurify.sanitize(contentText));
        enhanceCodeBlocks(body);

        const actions = document.createElement("div");
        actions.className = "assistant-action-bar";

        const copyBtn = document.createElement("button");
        copyBtn.className = "msg-action-btn";
        copyBtn.innerHTML = "📋 Copy";
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(contentText);
          copyBtn.innerHTML = "✓ Copied";
          setTimeout(() => copyBtn.innerHTML = "📋 Copy", 2000);
        };

        const speakBtn = document.createElement("button");
        speakBtn.className = "msg-action-btn";
        speakBtn.innerHTML = "🔊 Listen";
        speakBtn.onclick = () => toggleTTS(contentText, speakBtn);

        actions.appendChild(copyBtn);
        actions.appendChild(speakBtn);
        wrap.appendChild(body);
        wrap.appendChild(actions);

        row.appendChild(avatar);
        row.appendChild(wrap);
      }

      chatMaxWidth.appendChild(row);
      scrollToBottom();
      return row;
    }

    function enhanceCodeBlocks(container) {
      container.querySelectorAll("pre").forEach(pre => {
        if (pre.querySelector(".code-header-bar")) return;
        const codeEl = pre.querySelector("code");
        if (!codeEl) return;

        let lang = "CODE";
        const match = codeEl.className.match(/language-([a-zA-Z0-9_-]+)/);
        if (match && match[1]) lang = match[1].toUpperCase();

        const header = document.createElement("div");
        header.className = "code-header-bar";
        header.innerHTML = [
          '<span>' + lang + '</span>',
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
          const ext = lang.toLowerCase() === "javascript" ? "js" : (lang.toLowerCase() === "python" ? "py" : "txt");
          a.download = "script-" + Date.now() + "." + ext;
          a.click();
        };

        pre.insertBefore(header, codeEl);
      });
    }

    function toggleTTS(text, btn) {
      if (!window.speechSynthesis) return;
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        btn.innerHTML = "🔊 Listen";
        return;
      }
      const clean = text.replace(/[*#_]/g, "").slice(0, 1000);
      const utter = new SpeechSynthesisUtterance(clean);
      utter.onend = () => btn.innerHTML = "🔊 Listen";
      utter.onerror = () => btn.innerHTML = "🔊 Listen";
      window.speechSynthesis.speak(utter);
      btn.innerHTML = "⏸ Stop";
    }

    function scrollToBottom() {
      const area = document.getElementById("chatScrollArea");
      area.scrollTop = area.scrollHeight;
    }

    // ========================================================================
    // Chat Submission & Streaming Engine
    // ========================================================================
    async function sendMessage(overrideText) {
      const prompt = overrideText || document.getElementById("chatInput").value.trim();
      if (!prompt || isGenerating) return;

      document.getElementById("chatInput").value = "";
      document.getElementById("chatInput").style.height = "auto";
      hideSlash();

      if (!currentSessionId) {
        try {
          const sRes = await fetch("/api/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: prompt.slice(0, 32) })
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
        return;
      }
      if (prompt.startsWith("/translate ")) {
        handleIndicTranslation(prompt.slice(11).trim());
        return;
      }
      if (prompt.startsWith("/clear")) {
        startNewChat();
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
          image: attachedImageData
        };

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: activeAbortController.signal
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          body.innerHTML = '<span style="color:var(--red);">⚠️ ' + escapeHtml(errData.error || "Generation error") + '</span>';
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
                body.innerHTML = marked.parse(DOMPurify.sanitize(accumulatedText));
                scrollToBottom();
              }
            } catch (err) {}
          }
        }

        if (accumulatedText) {
          body.innerHTML = marked.parse(DOMPurify.sanitize(accumulatedText));
          enhanceCodeBlocks(body);
          currentMessages.push({ role: "assistant", content: accumulatedText });

          const actions = document.createElement("div");
          actions.className = "assistant-action-bar";

          const copyBtn = document.createElement("button");
          copyBtn.className = "msg-action-btn";
          copyBtn.innerHTML = "📋 Copy";
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(accumulatedText);
            copyBtn.innerHTML = "✓ Copied";
            setTimeout(() => copyBtn.innerHTML = "📋 Copy", 2000);
          };

          const speakBtn = document.createElement("button");
          speakBtn.className = "msg-action-btn";
          speakBtn.innerHTML = "🔊 Listen";
          speakBtn.onclick = () => toggleTTS(accumulatedText, speakBtn);

          actions.appendChild(copyBtn);
          actions.appendChild(speakBtn);
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
      appendMessageDOM("assistant", "🎨 Generating image...");
      try {
        const res = await fetch("/api/imagine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptText, session_id: currentSessionId })
        });
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
        }
      } catch (e) {
        showToast("Image generation failed", "error");
      }
    }

    async function handleIndicTranslation(args) {
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
        const data = await res.json();
        const chatMaxWidth = document.getElementById("chatMaxWidth");
        const lastRow = chatMaxWidth.lastElementChild;
        if (data.translation) {
          lastRow.querySelector(".assistant-body").innerHTML = '<div style="font-size:1.05rem; color:#fff; padding:6px 0;">' + escapeHtml(data.translation) + '</div>';
        } else {
          lastRow.querySelector(".assistant-body").innerHTML = '<span style="color:var(--red);">⚠️ ' + escapeHtml(data.error || "Translation failed") + '</span>';
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
              const res = await fetch("/api/audio/transcribe", { method: "POST", body: formData });
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
        if (chatInput.value.startsWith("/")) {
          document.getElementById("slashPopover").classList.add("active");
        } else {
          hideSlash();
        }
      });

      chatInput.addEventListener("keydown", (e) => {
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

    function handleIncomingFile(file) {
      if (!file || !file.type.startsWith("image/")) {
        showToast("Only image attachments supported", "info");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        attachedImageData = e.target.result;
        document.getElementById("attachedFileNameText").textContent = file.name || "Screenshot";
        document.getElementById("attachmentPreviewChip").style.display = "inline-flex";
        showToast("Image attached", "info");
      };
      reader.readAsDataURL(file);
    }

    function removeAttachment() {
      attachedImageData = null;
      document.getElementById("attachmentPreviewChip").style.display = "none";
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
          content.innerHTML = marked.parse(DOMPurify.sanitize(data.summary));
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
          content.innerHTML = marked.parse(DOMPurify.sanitize(summary));
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
