import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { textArgType } from './_arg-types'

type TableStoryArgs = {
	caption: string
	invoice: string
	status: string
	method: string
	amount: string
}

const meta = {
	title: 'UI/Table',
	tags: ['autodocs'],
	argTypes: {
		caption: textArgType('테이블 캡션'),
		invoice: textArgType('Invoice 번호'),
		status: textArgType('상태'),
		method: textArgType('결제 수단'),
		amount: textArgType('금액')
	},
	render: ({ caption, invoice, status, method, amount }) => (
		<Table>
			<TableCaption>{caption}</TableCaption>
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
		caption: '최근 결제 내역',
		invoice: 'INV001',
		status: 'Paid',
		method: 'Credit Card',
		amount: '$250.00'
	}
}

export const MultipleRows: Story = {
	args: Default.args,
	render: () => (
		<Table>
			<TableCaption>최근 결제 내역</TableCaption>
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
					<TableCell className="font-medium">INV001</TableCell>
					<TableCell>Paid</TableCell>
					<TableCell>Credit Card</TableCell>
					<TableCell className="text-right">$250.00</TableCell>
				</TableRow>
				<TableRow>
					<TableCell className="font-medium">INV002</TableCell>
					<TableCell>Pending</TableCell>
					<TableCell>PayPal</TableCell>
					<TableCell className="text-right">$150.00</TableCell>
				</TableRow>
				<TableRow>
					<TableCell className="font-medium">INV003</TableCell>
					<TableCell>Unpaid</TableCell>
					<TableCell>Bank Transfer</TableCell>
					<TableCell className="text-right">$350.00</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	)
}
