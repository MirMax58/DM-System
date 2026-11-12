// Compatibility exports for code that imports the old auth.js entry point.
// The active implementation uses environment-based JWT configuration and MongoDB-backed users.
export { createToken, getUserFromAuthHeader, hashInvitationCode, createInvitationCode } from './utils/security.js'
