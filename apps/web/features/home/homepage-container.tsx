function HomepageContainer() {
	return (
		<div className="flex">
			<div className="w-2/3">
				<section>실시간 날씨</section>
				<section>시간별 날씨</section>
				<section>3일 예보</section>
			</div>
			<div className="w-1/3">
				<section>검색</section>
				<section>자외선 정보</section>
				<section>일출/일몰</section>
				<section>월출/월몰</section>
				<section>기상 레이더</section>
			</div>
		</div>
	)
}

export default HomepageContainer
