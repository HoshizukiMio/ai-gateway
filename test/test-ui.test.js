
import { unstable_dev } from 'wrangler';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';

describe('Worker', () => {
    let worker;

    beforeAll(async () => {
        worker = await unstable_dev('src/index.js', {
            experimental: { disableExperimentalWarning: true },
        });
    });

    afterAll(async () => {
        await worker.stop();
    });

    it('should return HTML UI on root path', async () => {
        const resp = await worker.fetch('/');
        expect(resp.status).toBe(200);
        expect(resp.headers.get('content-type')).toContain('text/html');

        const text = await resp.text();
        expect(text).toContain('AI Gateway');
        expect(text).toContain('OpenAI');
        expect(text).toContain('Google Gemini');
        expect(text).toContain('Anthropic Claude');
    });
});
