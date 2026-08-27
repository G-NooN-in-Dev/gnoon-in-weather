/**
 * 네이버 HTML 하이라이트·엔티티를 화면용 평문으로 바꿉니다.
 * 제목·요약의 `<b>` / `&quot;` 등을 제거합니다.
 */
const entityMap: Record<string, string> = {
	'&quot;': '"',
	'&#39;': "'",
	'&amp;': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&nbsp;': ' '
}

function stripNaverHtml(value: string): string {
	const strippedHtml = value.replace(/<[^>]+>/g, '')
	return strippedHtml.replace(/&quot;|&#39;|&amp;|&lt;|&gt;|&nbsp;/g, (entity) => entityMap[entity] ?? entity).trim()
}

export { stripNaverHtml }
