import test from 'node:test';
import assert from 'node:assert/strict';
import { formatBlogContent } from './blog-format.js';

test('formats Sedifex numbered sections and document lists without blank lines', () => {
  const html = formatBlogContent('Introduction.\n**1. Gather Your Documents**  \nMake a checklist:\n- A valid passport\n- Travel insurance\n**2. Use Professional Support**\nPrice: **GHS 2000.00**.');
  assert.match(html, /<h2>1\. Gather Your Documents<\/h2>/);
  assert.match(html, /<ul>\s*<li>A valid passport<\/li>\s*<li>Travel insurance<\/li>\s*<\/ul>/);
  assert.match(html, /<h2>2\. Use Professional Support<\/h2>/);
  assert.match(html, /<strong>GHS 2000.00<\/strong>/);
});

test('handles escaped Markdown, rich HTML and removes active content', () => {
  assert.match(formatBlogContent(String.raw`\*\*1. Requirements\*\*`), /<h2>1\. Requirements<\/h2>/);
  const html = formatBlogContent('<p>Hello <strong>reader</strong></p><script>alert(1)</script><img src="https://example.com/photo.jpg" onerror="alert(1)"><a href="javascript:alert(1)">bad</a>');
  assert.match(html, /<strong>reader<\/strong>/);
  assert.doesNotMatch(html, /script|onerror|javascript:/);
});
