import { defineConfig } from 'vitest/config';

// O RuleTester do ESLint usa describe/it globais.
export default defineConfig({ test: { globals: true, include: ['tools/lint-rules/**/*.spec.mjs'] } });
