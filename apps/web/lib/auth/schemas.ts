import { z } from 'zod'

/** 닉네임 유효성 검사 스키마 */
const nicknameSchema = z
	.string()
	.trim()
	.min(2, { error: '닉네임은 2자 이상이어야 합니다.' })
	.max(20, { error: '닉네임은 20자 이하여야 합니다.' })

/** 로그인 요청 body */
const signInSchema = z.object({
	email: z.email({ error: '올바른 이메일 형식이 아닙니다.' }),
	password: z.string().min(1, { error: '비밀번호를 입력해 주세요.' })
})

/** 회원가입 요청 body */
const signUpSchema = z
	.object({
		email: z.email({ error: '올바른 이메일 형식이 아닙니다.' }),
		nickname: nicknameSchema,
		password: z
			.string()
			.min(6, { error: '비밀번호는 6자 이상이어야 합니다.' })
			.max(12, { error: '비밀번호는 12자 이하여야 합니다.' }),
		passwordConfirm: z.string().min(1, { error: '비밀번호 확인을 입력해 주세요.' })
	})
	.refine((data) => data.password === data.passwordConfirm, {
		error: '비밀번호가 일치하지 않습니다.',
		path: ['passwordConfirm']
	})

/** 닉네임 변경 요청 body */
const updateNicknameSchema = z.object({
	nickname: nicknameSchema
})

type SignInInput = z.infer<typeof signInSchema>
type SignUpInput = z.infer<typeof signUpSchema>
type UpdateNicknameInput = z.infer<typeof updateNicknameSchema>

export { signInSchema, signUpSchema, updateNicknameSchema }
export type { SignInInput, SignUpInput, UpdateNicknameInput }
