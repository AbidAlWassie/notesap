// types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
      GITHUB_CLIENT_ID: string
      GITHUB_CLIENT_SECRET: string
      DISCORD_CLIENT_ID: string
      DISCORD_CLIENT_SECRET: string
      TURSO_DATABASE_URL: string
      TURSO_AUTH_TOKEN: string
      TURSO_ORG_ID: string
      NODE_ENV: "development" | "production"
    }
  }
}

export {}
