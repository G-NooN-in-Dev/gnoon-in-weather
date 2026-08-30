const AUTH_API_BASE_URL = '/api/auth'

/** HTTP-only 세션 쿠키 이름 */
const AUTH_SESSION_COOKIE_NAME = 'auth-session'

/** 세션 유효 기간 (초) — 1일 */
const AUTH_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 1

/** bcrypt 해시 라운드 */
const PASSWORD_SALT_ROUNDS = 12

export { AUTH_API_BASE_URL, AUTH_SESSION_COOKIE_NAME, AUTH_SESSION_MAX_AGE_SECONDS, PASSWORD_SALT_ROUNDS }
