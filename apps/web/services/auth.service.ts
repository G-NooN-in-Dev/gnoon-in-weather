import { type Collection, MongoServerError, ObjectId, type WithId } from 'mongodb'

import { createAuthError, isAuthApiError } from '@/lib/auth/errors'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import type { SignInInput, SignUpInput, UpdatePasswordInput } from '@/lib/auth/schemas'
import { getDb } from '@/lib/mongodb/client'
import { USERS_COLLECTION } from '@/lib/mongodb/constants'
import type { PublicUser } from '@/types/auth.type'
import type { UserDocument } from '@/types/user.type'

function toPublicUser(doc: WithId<UserDocument>): PublicUser {
	const { _id, email, nickname } = doc

	return { id: _id.toHexString(), email, nickname }
}

let usersIndexReady: Promise<void> | null = null

/** email·nickname unique 인덱스를 한 번만 보장합니다. */
async function ensureUsersIndexes(collection: Collection<UserDocument>): Promise<void> {
	if (!usersIndexReady) {
		usersIndexReady = Promise.all([
			collection.createIndex({ email: 1 }, { unique: true }),
			collection.createIndex({ nickname: 1 }, { unique: true })
		]).then(() => undefined)
	}

	await usersIndexReady
}

async function getUsersCollection(): Promise<Collection<UserDocument>> {
	const db = await getDb()
	const collection = db.collection<UserDocument>(USERS_COLLECTION)

	await ensureUsersIndexes(collection)

	return collection
}

/** id로 공개 사용자 정보를 조회합니다. 없거나 id가 유효하지 않으면 null. */
async function getUserById(id: string): Promise<PublicUser | null> {
	if (!ObjectId.isValid(id)) {
		return null
	}

	const users = await getUsersCollection()
	const user = await users.findOne({ _id: new ObjectId(id) })

	return user ? toPublicUser(user) : null
}

/** 이메일·비밀번호로 로그인합니다. */
async function signInUser({ email, password }: SignInInput): Promise<PublicUser> {
	const users = await getUsersCollection()
	const normalizedEmail = email.trim().toLowerCase()
	const user = await users.findOne({ email: normalizedEmail })

	if (!user) {
		throw createAuthError({
			key: 'AUTH_INVALID_CREDENTIALS',
			message: '이메일 또는 비밀번호가 올바르지 않습니다.',
			status: 401
		})
	}

	const matched = await verifyPassword(password, user.passwordHash)

	if (!matched) {
		throw createAuthError({
			key: 'AUTH_INVALID_CREDENTIALS',
			message: '이메일 또는 비밀번호가 올바르지 않습니다.',
			status: 401
		})
	}

	return toPublicUser(user)
}

/** 새 회원을 등록합니다. */
async function signUpUser({ email, nickname, password }: SignUpInput): Promise<PublicUser> {
	const users = await getUsersCollection()
	const normalizedEmail = email.trim().toLowerCase()
	const now = new Date()
	const passwordHash = await hashPassword(password)

	try {
		const doc = {
			email: normalizedEmail,
			nickname: nickname.trim(),
			passwordHash,
			createdAt: now,
			updatedAt: now
		} satisfies UserDocument

		const result = await users.insertOne(doc)

		return {
			id: result.insertedId.toHexString(),
			email: normalizedEmail,
			nickname: nickname.trim()
		}
	} catch (error) {
		if (error instanceof MongoServerError && error.code === 11000) {
			const keyPattern = error.keyPattern as Record<string, number> | undefined

			if (keyPattern?.nickname) {
				throw createAuthError({
					key: 'AUTH_NICKNAME_TAKEN',
					message: '이미 사용 중인 닉네임입니다.',
					status: 409,
					fieldErrors: { nickname: '이미 사용 중인 닉네임입니다.' }
				})
			}

			throw createAuthError({
				key: 'AUTH_EMAIL_TAKEN',
				message: '이미 사용 중인 이메일입니다.',
				status: 409,
				fieldErrors: { email: '이미 사용 중인 이메일입니다.' }
			})
		}

		throw error
	}
}

/** 닉네임의 중복 여부를 확인합니다. */
async function isTakenNickname(nickname: string, excludeUserId: string): Promise<boolean> {
	const users = await getUsersCollection()
	const existing = await users.findOne(
		{ nickname, _id: { $ne: new ObjectId(excludeUserId) } },
		{ projection: { _id: 1 } }
	)

	return existing !== null
}

/** 로그인 사용자의 닉네임을 변경합니다. 중복이면 갱신하지 않습니다. */
async function updateUserNickname(userId: string, nickname: string): Promise<PublicUser> {
	if (!ObjectId.isValid(userId)) {
		throw createAuthError({
			key: 'AUTH_UNAUTHORIZED',
			message: '로그인이 필요합니다.',
			status: 401
		})
	}

	const users = await getUsersCollection()
	const userObjectId = new ObjectId(userId)
	const current = await users.findOne({ _id: userObjectId })

	if (!current) {
		throw createAuthError({
			key: 'AUTH_UNAUTHORIZED',
			message: '로그인이 필요합니다.',
			status: 401
		})
	}

	const trimmedNickname = nickname.trim()

	if (current.nickname === trimmedNickname) {
		throw createAuthError({
			key: 'AUTH_VALIDATION_ERROR',
			message: '현재 닉네임과 같습니다.',
			status: 400,
			fieldErrors: { nickname: '현재 닉네임과 같습니다.' }
		})
	}

	// 변경 전 중복을 먼저 확인하고, unique 인덱스는 동시 요청 안전망으로 둡니다.
	const taken = await isTakenNickname(trimmedNickname, userId)

	if (taken) {
		throw createAuthError({
			key: 'AUTH_NICKNAME_TAKEN',
			message: '이미 사용 중인 닉네임입니다.',
			status: 409,
			fieldErrors: { nickname: '이미 사용 중인 닉네임입니다.' }
		})
	}

	try {
		const updated = await users.findOneAndUpdate(
			{ _id: userObjectId },
			{ $set: { nickname: trimmedNickname, updatedAt: new Date() } },
			{ returnDocument: 'after' }
		)

		if (!updated) {
			throw createAuthError({
				key: 'AUTH_UNAUTHORIZED',
				message: '로그인이 필요합니다.',
				status: 401
			})
		}

		return toPublicUser(updated)
	} catch (error) {
		if (isAuthApiError(error)) {
			throw error
		}

		if (error instanceof MongoServerError && error.code === 11000) {
			throw createAuthError({
				key: 'AUTH_NICKNAME_TAKEN',
				message: '이미 사용 중인 닉네임입니다.',
				status: 409,
				fieldErrors: { nickname: '이미 사용 중인 닉네임입니다.' }
			})
		}

		throw error
	}
}

/** 로그인 사용자의 비밀번호를 변경합니다. 현재 비밀번호가 맞아야 합니다. */
async function updateUserPassword(
	userId: string,
	{ currentPassword, newPassword }: Pick<UpdatePasswordInput, 'currentPassword' | 'newPassword'>
): Promise<PublicUser> {
	if (!ObjectId.isValid(userId)) {
		throw createAuthError({
			key: 'AUTH_UNAUTHORIZED',
			message: '로그인이 필요합니다.',
			status: 401
		})
	}

	const users = await getUsersCollection()
	const userObjectId = new ObjectId(userId)
	const current = await users.findOne({ _id: userObjectId })

	if (!current) {
		throw createAuthError({
			key: 'AUTH_UNAUTHORIZED',
			message: '로그인이 필요합니다.',
			status: 401
		})
	}

	const matched = await verifyPassword(currentPassword, current.passwordHash)

	if (!matched) {
		throw createAuthError({
			key: 'AUTH_INVALID_CREDENTIALS',
			message: '현재 비밀번호가 올바르지 않습니다.',
			status: 401,
			fieldErrors: { currentPassword: '현재 비밀번호가 올바르지 않습니다.' }
		})
	}

	const sameAsCurrent = await verifyPassword(newPassword, current.passwordHash)

	if (sameAsCurrent) {
		throw createAuthError({
			key: 'AUTH_VALIDATION_ERROR',
			message: '현재 비밀번호와 같습니다.',
			status: 400,
			fieldErrors: { newPassword: '현재 비밀번호와 같습니다.' }
		})
	}

	const passwordHash = await hashPassword(newPassword)
	const updated = await users.findOneAndUpdate(
		{ _id: userObjectId },
		{ $set: { passwordHash, updatedAt: new Date() } },
		{ returnDocument: 'after' }
	)

	if (!updated) {
		throw createAuthError({
			key: 'AUTH_UNAUTHORIZED',
			message: '로그인이 필요합니다.',
			status: 401
		})
	}

	return toPublicUser(updated)
}

export { getUserById, signInUser, signUpUser, updateUserNickname, updateUserPassword }
