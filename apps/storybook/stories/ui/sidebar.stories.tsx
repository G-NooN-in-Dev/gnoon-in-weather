import {
	Sidebar,
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
	SidebarTrigger
} from '@shared/ui/sidebar'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { textArgType } from './_arg-types'

type SidebarStoryArgs = {
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
		appTitle: textArgType('사이드바 헤더 제목'),
		groupLabel: textArgType('메뉴 그룹 라벨'),
		activeItem: textArgType('활성 메뉴 텍스트'),
		inactiveItem: textArgType('비활성 메뉴 텍스트'),
		contentTitle: textArgType('메인 영역 제목'),
		contentBody: textArgType('메인 영역 본문')
	},
	render: ({ appTitle, groupLabel, activeItem, inactiveItem, contentTitle, contentBody }) => (
		<SidebarProvider>
			<Sidebar>
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
		appTitle: '앱',
		groupLabel: '메뉴',
		activeItem: '홈',
		inactiveItem: '설정',
		contentTitle: '콘텐츠',
		contentBody: '메인 영역입니다.'
	}
}
