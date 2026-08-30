/** MongoDB `platform.users` 컬렉션 문서 (_id는 드라이버 WithId로 부여) */
type UserDocument = {
	email: string
	nickname: string
	passwordHash: string
	createdAt: Date
	updatedAt: Date
}

export type { UserDocument }
