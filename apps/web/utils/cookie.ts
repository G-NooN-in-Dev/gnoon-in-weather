/** document.cookie에서 이름으로 raw 값을 읽습니다. (값 안의 `=`도 보존) */
function readBrowserCookie(name: string): string | undefined {
	const prefix = `${name}=`
	const entry = document.cookie.split('; ').find((cookie) => cookie.startsWith(prefix))

	return entry?.slice(prefix.length)
}

export { readBrowserCookie }
