// Testes ponta a ponta: sobem o app já compilado (npm run build) e simulam a PokeAPI.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4300', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'node e2e/servidor.mjs', url: 'http://localhost:4300', reuseExistingServer: !process.env.CI },
});
