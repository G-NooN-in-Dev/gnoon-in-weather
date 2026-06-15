import {
	Sidebar,
	sidebarCollapsibleOptions,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	sidebarSideOptions,
	SidebarTrigger,
	sidebarVariantOptions
} from '@shared/ui/sidebar'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { selectArgType, textArgType } from './_arg-types'

type SidebarStoryArgs = {
	side: 'left' | 'right'
	variant: 'sidebar' | 'floating' | 'inset'
	collapsible: 'offcanvas' | 'icon' | 'none'
	appTitle: string
	groupLabel: string
	activeItem: string
	inactiveItem: string
	contentTitle: string
	contentBody: string
}

const meta = {
	title: 'UI/Sidebar',
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	argTypes: {
		side: selectArgType(sidebarSideOptions, '사이드바 위치'),
		variant: selectArgType(sidebarVariantOptions, '사이드바 variant'),
		collapsible: selectArgType(sidebarCollapsibleOptions, '접기 동작'),
		appTitle: textArgType('사이드바 헤더 제목'),
		groupLabel: textArgType('메뉴 그룹 라벨'),
		activeItem: textArgType('활성 메뉴 텍스트'),
		inactiveItem: textArgType('비활성 메뉴 텍스트'),
		contentTitle: textArgType('메인 영역 제목'),
		contentBody: textArgType('메인 영역 본문')
	},
	render: ({
		side,
		variant,
		collapsible,
		appTitle,
		groupLabel,
		activeItem,
		inactiveItem,
		contentTitle,
		contentBody
	}) => (
		<SidebarProvider>
			<Sidebar side={side} variant={variant} collapsible={collapsible}>
				<SidebarHeader className="border-b p-4 text-sm font-medium">{appTitle}</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton isActive>{activeItem}</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton>{inactiveItem}</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-12 items-center gap-2 border-b px-4">
					<SidebarTrigger />
					<span className="text-sm font-medium">{contentTitle}</span>
				</header>
				<main className="p-4 text-sm">{contentBody}</main>
			</SidebarInset>
		</SidebarProvider>
	)
} satisfies Meta<SidebarStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		side: 'left',
		variant: 'sidebar',
		collapsible: 'offcanvas',
		appTitle: '앱',
		groupLabel: '메뉴',
		activeItem: '홈',
		inactiveItem: '설정',
		contentTitle: '콘텐츠',
		contentBody: '메인 영역입니다.'
	}
}

export const Floating: Story = {
	args: { ...Default.args, variant: 'floating', appTitle: 'Floating' }
}

export const Inset: Story = {
	args: { ...Default.args, variant: 'inset', appTitle: 'Inset' }
}

export const IconCollapsible: Story = {
	args: { ...Default.args, collapsible: 'icon', appTitle: 'Icon 접기' }
}
