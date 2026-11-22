import test from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { getHTML } from '../src/ui.js';

test('Mehkesh AI UI - HTML generation & client syntax verification', (t) => {
  const html = getHTML({ GOOGLE_CLIENT_ID: 'test_client_id', APP_NAME: 'Mehkesh AI' });
  assert.ok(html.length > 50000, 'HTML output should be complete');

  // Verify client-side script parses without syntax error
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch, 'Should contain embedded client script');
  assert.doesNotThrow(() => {
    new vm.Script(scriptMatch[1]);
  }, 'Client script should be valid JavaScript');

  // Verify human-centric model choices
  assert.ok(html.includes('⚡ Mehkesh Auto'), 'Should have Mehkesh Auto');
  assert.ok(html.includes('💻 Code & Tech'), 'Should have Code & Tech');
  assert.ok(html.includes('🧠 Deep Reasoning'), 'Should have Deep Reasoning');
  assert.ok(html.includes('🎨 Image Studio'), 'Should have Image Studio');

  // Verify zero technical parameter jargon
  assert.ok(!html.includes('17B'), 'Should not contain 17B in user UI');
  assert.ok(!html.includes('32B (CODE)'), 'Should not contain 32B in user UI');
  assert.ok(!html.includes('70B fp8'), 'Should not contain 70B in user UI');
  assert.ok(!html.includes('Raw Neurons'), 'Should not expose raw neuron jargon');

  // Verify Master Admin Console features
  assert.ok(html.includes('id="tabBtnAdmin"'), 'Should contain Admin tab button');
  assert.ok(html.includes('id="tabPaneAdmin"'), 'Should contain Admin tab pane');
  assert.ok(html.includes('id="adminUserTableBody"'), 'Should contain Admin user table');
  assert.ok(html.includes('/api/admin/users'), 'Should include admin user API calls');

  // Verify superpower utilities
  assert.ok(html.includes('id="briefingModal"'), 'Should contain Daily Briefing modal');
  assert.ok(html.includes('id="memoryModal"'), 'Should contain Memories modal');
  assert.ok(html.includes('id="chatInput"'), 'Should contain composer textarea');
  assert.ok(html.includes('id="micBtn"'), 'Should contain voice recording button');
  assert.ok(html.includes('id="fileInput"'), 'Should contain screenshot/attachment file input');

  // Verify WCAG 2.1 accessibility & performance enhancements
  assert.ok(!html.includes('user-scalable=no'), 'Should not restrict user zoom/scaling for WCAG compliance');
  assert.ok(html.includes('width=device-width, initial-scale=1.0'), 'Should have standard responsive viewport');

  // Verify KaTeX math & Highlight.js code highlighting
  assert.ok(html.includes('katex.min.js'), 'Should load KaTeX CDN script');
  assert.ok(html.includes('auto-render.min.js'), 'Should load KaTeX auto-render script');
  assert.ok(html.includes('hljs.highlightElement'), 'Should call hljs.highlightElement for active syntax coloring');

  // Verify Theming (Light/Dark mode)
  assert.ok(html.includes('html.light'), 'Should contain light theme stylesheet definitions');
  assert.ok(html.includes('toggleTheme'), 'Should provide theme toggling function');
  assert.ok(html.includes('id="themeToggleBtn"'), 'Should have theme toggle button in header');

  // Verify Guest Mode with strict 3-query edge limit
  assert.ok(html.includes('id="guestQuotaBadge"'), 'Should include guest quota badge in topbar');
  assert.ok(html.includes('id="topbarSignInBtn"'), 'Should include topbar Sign In button for guest mode');
  assert.ok(html.includes('id="authModalCloseBtn"'), 'Should allow guest users to dismiss auth modal');
  assert.ok(html.includes('id="authGuestBanner"'), 'Should include guest exploration banner');

  // Verify Local Device Voice TTS & Audio Whisper
  assert.ok(html.includes('speechSynthesis'), 'Should use zero-neuron local device speech synthesis');
  assert.ok(html.includes('toggleTTS'), 'Should provide TTS listen/stop toggling');
  assert.ok(html.includes('toggleMicRecording'), 'Should provide voice recording via Whisper AI');

  // Verify Expanded File & Code Attachments
  assert.ok(html.includes('accept="image/*,.txt,.py,.js'), 'Should support code, data, and image attachments');
  assert.ok(html.includes('attachment-preview-container'), 'Should provide attachment preview dock');

  // Verify Slash Command Engine
  assert.ok(html.includes('ArrowDown'), 'Should support keyboard navigation in slash commands');
  assert.ok(html.includes('ALL_SLASH_COMMANDS'), 'Should define slash command registry');
});
