/** 로그인 / 회원가입 폼 섹션 모드 */
type AuthFormMode = 'sign-in' | 'sign-up'

type AuthFormSectionProps = {
	mode: AuthFormMode
}

export type { AuthFormMode, AuthFormSectionProps }
