import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    phone?: string | null
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      role?: string
      phone?: string | null
    } & DefaultSession["user"]
  }
}