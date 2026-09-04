'use client'

import { Button } from '@shared/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { cn } from '@shared/ui/utils'
import { ChevronDownIcon, MenuIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import Logo from '@/components/logo'
import { NAV_ITEMS, type NavChildLink, type NavItem } from '@/components/nav.constants'

type MobileNavGroupProps = {
	item: NavItem & { children: readonly NavChildLink[] }
	onNavigate?: () => void
}

type NavItemsProps = {
	items: readonly NavItem[]
	/** horizontal: 데스크탑 헤더 / vertical: 모바일 Sheet */
	orientation: 'horizontal' | 'vertical'
	/** Sheet에서 링크 이동 후 패널을 닫을 때 사용 */
	onNavigate?: () => void
}

type MobileNavProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
}
function isNavActive(pathname: string, href: string) {
	if (href === '/') return pathname === '/'
	return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Sheet를 링크 클릭과 동시에 닫으면 포커스 트랩이 라우팅을 가로챌 수 있어 다음 프레임으로 미룹니다.
 */
function closeSheetAfterNavigate(onNavigate?: () => void) {
	requestAnimationFrame(() => {
		onNavigate?.()
	})
}

/** 모바일 Sheet 전용 — 부모 링크 + 펼칠 수 있는 하위 메뉴 */
function MobileNavGroup({ item, onNavigate }: MobileNavGroupProps) {
	const pathname = usePathname()

	const { children, href: parentHref, label: parentLabel } = item

	const parentActive = isNavActive(pathname, parentHref)
	// 테마지도 경로에 있으면 기본으로 펼쳐 하위 메뉴를 바로 보이게 합니다
	const [open, setOpen] = useState(parentActive)
	const [seenPathname, setSeenPathname] = useState(pathname)

	// 경로가 해당 구간으로 바뀌면 렌더 중 펼침 상태를 맞춤 (effect setState 린트 회피)
	if (pathname !== seenPathname) {
		setSeenPathname(pathname)
		if (isNavActive(pathname, parentHref)) {
			setOpen(true)
		}
	}

	return (
		<Collapsible open={open} onOpenChange={setOpen} className="flex flex-col">
			<div className="flex items-center gap-0.5">
				<Link
					href={parentHref}
					onClick={() => closeSheetAfterNavigate(onNavigate)}
					className={cn(
						'hover:bg-grayscale-50 inline-flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-3 py-2.5 transition-colors',
						parentActive ? 'text-grayscale-900 bg-grayscale-50 font-semibold' : 'hover:text-grayscale-900'
					)}
				>
					{parentLabel}
				</Link>
				<CollapsibleTrigger
					aria-label={`${parentLabel} 하위 메뉴 ${open ? '접기' : '펼치기'}`}
					className={cn(
						'text-grayscale-500 hover:bg-grayscale-50 hover:text-grayscale-900 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors',
						'focus-visible:ring-grayscale-900 focus-visible:ring-2 focus-visible:outline-none'
					)}
				>
					<ChevronDownIcon className={cn('size-4 transition-transform duration-200', open && 'rotate-180')} />
				</CollapsibleTrigger>
			</div>

			<CollapsibleContent className="flex flex-col gap-0.5 pb-1 pl-3">
				{children.map((child) => {
					const { href: childHref, label: childLabel } = child
					const childActive = pathname === childHref || pathname.startsWith(`${childHref}/`)

					return (
						<Link
							key={childHref}
							href={childHref}
							onClick={() => closeSheetAfterNavigate(onNavigate)}
							className={cn(
								'hover:bg-grayscale-50 inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors',
								childActive
									? 'text-grayscale-900 bg-grayscale-50 font-semibold'
									: 'text-grayscale-600 hover:text-grayscale-900'
							)}
						>
							{childLabel}
						</Link>
					)
				})}
			</CollapsibleContent>
		</Collapsible>
	)
}

/** 인라인·Sheet 공용 메뉴 항목 렌더 */
function NavItems({ items, orientation, onNavigate }: NavItemsProps) {
	const pathname = usePathname()
	const isVertical = orientation === 'vertical'

	return (
		<>
			{items.map((item) => {
				const { children, href, label } = item
				// 모바일 Sheet에서만 하위 메뉴를 펼칩니다
				if (isVertical && children && children.length > 0) {
					return <MobileNavGroup key={href} item={{ ...item, children }} onNavigate={onNavigate} />
				}

				const active = isNavActive(pathname, href)

				return (
					<Link
						key={href}
						href={href}
						onClick={() => {
							if (isVertical) {
								closeSheetAfterNavigate(onNavigate)
								return
							}
							onNavigate?.()
						}}
						className={cn(
							'relative inline-flex items-center gap-1.5 transition-colors',
							isVertical
								? cn(
										'hover:bg-grayscale-50 w-full rounded-md px-3 py-2.5',
										active ? 'text-grayscale-900 bg-grayscale-50 font-semibold' : 'hover:text-grayscale-900'
									)
								: cn(
										'whitespace-nowrap',
										active
											? 'font-semibold text-black after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:mt-1 after:block after:h-0.5 after:bg-black after:content-[""]'
											: 'hover:text-grayscale-900'
									)
						)}
					>
						{label}
					</Link>
				)
			})}
		</>
	)
}

/** 데스크탑 헤더용 가로 메뉴 (lg 이상 — 로고·인증과 한 줄 충돌 방지) */
function Nav() {
	return (
		<nav className="text-grayscale-500 hidden items-center gap-6 text-xl font-medium lg:flex">
			<NavItems items={NAV_ITEMS} orientation="horizontal" />
		</nav>
	)
}

/** 햄버거 → 왼쪽 Sheet 메뉴 (lg 미만: 모바일·태블릿·좁은 창) */
function MobileNav({ open, onOpenChange }: MobileNavProps) {
	return (
		<>
			{/* 헤더(z-sticky)가 Sheet 오버레이보다 위에 있어, 같은 버튼으로 열고 닫을 수 있음 */}
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				className="text-grayscale-700 shrink-0 lg:hidden"
				aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
				aria-expanded={open}
				onClick={() => onOpenChange(!open)}
			>
				{open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
			</Button>

			<Sheet open={open} onOpenChange={onOpenChange}>
				<SheetContent side="left" className="w-full max-w-80 gap-0">
					<SheetHeader className="border-border border-b">
						<SheetTitle>메뉴</SheetTitle>
						<SheetDescription hidden />
					</SheetHeader>
					<nav className="text-grayscale-600 flex flex-1 flex-col gap-1 overflow-y-auto p-3 text-base font-medium">
						<NavItems items={NAV_ITEMS} orientation="vertical" onNavigate={() => onOpenChange(false)} />
					</nav>
				</SheetContent>
			</Sheet>
		</>
	)
}

/** 햄버거·로고가 헤더 위에 있어 Sheet가 열려도 클릭됩니다. 열림 상태를 공유해 로고 이동 시 닫습니다. */
function MobileNavWithLogo() {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)
	const [seenPathname, setSeenPathname] = useState(pathname)

	// 로고·인증 등 Sheet 밖 링크로 이동해도 패널이 남지 않게 맞춥니다
	if (pathname !== seenPathname) {
		setSeenPathname(pathname)
		if (open) setOpen(false)
	}

	return (
		<>
			<MobileNav open={open} onOpenChange={setOpen} />
			<Logo onNavigate={open ? () => closeSheetAfterNavigate(() => setOpen(false)) : undefined} />
		</>
	)
}

export { MobileNavWithLogo, Nav }
