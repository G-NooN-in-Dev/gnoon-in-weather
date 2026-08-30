import type { ZodError } from 'zod'

/** Zod 이슈를 필드 → 첫 메시지 맵으로 변환합니다. */
function fieldErrorsFromZod(error: ZodError): Record<string, string> {
	const fieldErrors: Record<string, string> = {}

	for (const issue of error.issues) {
		const key = issue.path[0]

		if (typeof key === 'string' && !fieldErrors[key]) {
			fieldErrors[key] = issue.message
		}
	}

	return fieldErrors
}

export { fieldErrorsFromZod }
