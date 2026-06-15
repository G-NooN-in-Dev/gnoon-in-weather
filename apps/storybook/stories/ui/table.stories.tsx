import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { textArgType } from './_arg-types'

type TableStoryArgs = {
	invoice: string
	status: string
	method: string
	amount: string
}

const meta = {
	title: 'UI/Table',
	tags: ['autodocs'],
	argTypes: {
		invoice: textArgType('Invoice 번호'),
		status: textArgType('상태'),
		method: textArgType('결제 수단'),
		amount: textArgType('금액')
	},
	render: ({ invoice, status, method, amount }) => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Invoice</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Method</TableHead>
					<TableHead className="text-right">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell className="font-medium">{invoice}</TableCell>
					<TableCell>{status}</TableCell>
					<TableCell>{method}</TableCell>
					<TableCell className="text-right">{amount}</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	)
} satisfies Meta<TableStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		invoice: 'INV001',
		status: 'Paid',
		method: 'Credit Card',
		amount: '$250.00'
	}
}
