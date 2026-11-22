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
});
