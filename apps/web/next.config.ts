import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactCompiler: true,
	// NOTE - 핫스팟 환경에서 이미지 최적화 해제
	images: {
		unoptimized: true
	}
}

export default nextConfig
