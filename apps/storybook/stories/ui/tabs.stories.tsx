import { orientationOptions } from '@shared/ui/lib/layout-options'
import { Tabs, TabsContent, TabsList, tabsListVariantOptions, TabsTrigger } from '@shared/ui/tabs'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { radioArgType, selectArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type TabsStoryArgs = {
	value: string
	listVariant: 'default' | 'line'
	orientation: 'horizontal' | 'vertical'
	firstLabel: string
	firstContent: string
	secondLabel: string
	secondContent: string
}

const meta = {
	title: 'UI/Tabs',
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		value: selectArgType(['account', 'password'], '선택 탭'),
		listVariant: selectArgType(tabsListVariantOptions, 'TabsList variant'),
		orientation: radioArgType(orientationOptions, 'Tabs orientation'),
		firstLabel: textArgType('첫 번째 탭 라벨'),
		firstContent: textArgType('첫 번째 탭 내용'),
		secondLabel: textArgType('두 번째 탭 라벨'),
		secondContent: textArgType('두 번째 탭 내용')
	},
	args: {
		value: 'account',
		listVariant: 'default',
		orientation: 'horizontal',
		firstLabel: '계정',
		firstContent: '계정 설정 내용',
		secondLabel: '비밀번호',
		secondContent: '비밀번호 변경 내용'
	},
	render: function Render({
		value,
		listVariant,
		orientation,
		firstLabel,
		firstContent,
		secondLabel,
		secondContent
	}: TabsStoryArgs) {
		const { setArg } = useArgSync<TabsStoryArgs>()

		return (
			<Tabs
				value={value}
				orientation={orientation}
				onValueChange={(next) => {
					if (next) setArg('value', next)
				}}
				className="w-full max-w-md"
			>
				<TabsList variant={listVariant}>
					<TabsTrigger value="account">{firstLabel}</TabsTrigger>
					<TabsTrigger value="password">{secondLabel}</TabsTrigger>
				</TabsList>
				<TabsContent value="account">{firstContent}</TabsContent>
				<TabsContent value="password">{secondContent}</TabsContent>
			</Tabs>
		)
	}
} satisfies Meta<TabsStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Line: Story = {
	args: {
		listVariant: 'line'
	}
}

export const Vertical: Story = {
	args: {
		orientation: 'vertical'
	}
}
