import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('el chrome del header no hereda la tipografía de la campaña', () => {
  const css = readFileSync('app/campaign.css', 'utf8');
  assert.ok(css.includes('.site-topbar,\n.site-topbar *,'));
  assert.ok(css.includes('header.site-header,\nheader.site-header *,'));
  assert.ok(css.includes('"Plus Jakarta Sans"'));
  assert.ok(css.includes('header.site-header a.site-btn'));
  assert.ok(css.includes('#334155'));
  assert.ok(css.includes('header.site-header a.site-donate { color: #fff; }'));
  assert.ok(css.includes('.site-menu a.site-menu__link { color: #fff; }'));
});
