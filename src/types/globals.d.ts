export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      userRegistered?: boolean
    }
  }
}