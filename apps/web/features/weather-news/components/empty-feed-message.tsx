type EmptyFeedMessageProps = {
	isFiltered: boolean
	hasMore: boolean
}

function EmptyFeedMessage({ isFiltered, hasMore }: EmptyFeedMessageProps) {
	if (!isFiltered) {
		return <p className="text-grayscale-500 py-8 text-sm">표시할 날씨 뉴스가 없습니다.</p>
	}

	if (hasMore) {
		return (
			<p className="text-grayscale-500 py-8 text-sm">
				선택한 언론사 기사가 아직 없습니다. 「더 보기」로 이어서 찾아보세요.
			</p>
		)
	}
}

export default EmptyFeedMessage
