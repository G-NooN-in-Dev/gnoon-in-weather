import { compare, hash } from 'bcryptjs'

import { PASSWORD_SALT_ROUNDS } from '@/lib/auth/constants'

/** 평문 비밀번호를 bcrypt 해시로 변환합니다. */
async function hashPassword(plainPassword: string): Promise<string> {
	return hash(plainPassword, PASSWORD_SALT_ROUNDS)
}

/** 평문과 저장된 해시를 비교합니다. */
async function verifyPassword(plainPassword: string, passwordHash: string): Promise<boolean> {
	return compare(plainPassword, passwordHash)
}

export { hashPassword, verifyPassword }
