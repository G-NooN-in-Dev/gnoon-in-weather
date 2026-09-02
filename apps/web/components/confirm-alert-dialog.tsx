import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@shared/ui/alert-dialog'
import { Spinner } from '@shared/ui/spinner'

type ConfirmAlertDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	description: string
	isPending: boolean
	onConfirm: () => void
	confirmText: string
}

function ConfirmAlertDialog({
	open,
	onOpenChange,
	title,
	description,
	isPending,
	onConfirm,
	confirmText
}: ConfirmAlertDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
					<AlertDialogAction disabled={isPending} onClick={onConfirm}>
						{isPending ? <Spinner /> : confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default ConfirmAlertDialog
