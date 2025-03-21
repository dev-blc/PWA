import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import withClassNameDiv from '../hocs/with-classname-div'
import withForwardRef from '../hocs/with-forward-ref'

const Dialog: React.FC<DialogPrimitive.DialogProps> & {
    Trigger: typeof DialogPrimitive.Trigger
    Content: typeof DialogPrimitive.Content
    Header: typeof DialogHeader
    Footer: typeof DialogFooter
    Title: typeof DialogPrimitive.Title
    Description: typeof DialogPrimitive.Description
} = props => <DialogPrimitive.Root {...props} />

const DialogOverlay = withForwardRef(DialogPrimitive.Overlay, {
    className:
        'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
})

const DialogContent = withForwardRef<HTMLDivElement, DialogPrimitive.DialogContentProps>(DialogPrimitive.Content, {
    className:
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
    renderOuter: content => (
        <DialogPrimitive.Portal>
            <DialogOverlay />
            {content}
        </DialogPrimitive.Portal>
    ),
    renderInner: children => <>{children}</>,
})

const DialogTitle = withForwardRef<HTMLHeadingElement, DialogPrimitive.DialogTitleProps>(DialogPrimitive.Title, {
    className: 'text-lg font-semibold leading-none tracking-tight',
})

const DialogDescription = withForwardRef<HTMLParagraphElement, DialogPrimitive.DialogDescriptionProps>(
    DialogPrimitive.Description,
    {
        className: 'text-sm text-muted-foreground',
    },
)

const DialogHeader = withClassNameDiv({
    className: 'flex flex-col space-y-1.5 text-center sm:text-left',
})

const DialogFooter = withClassNameDiv({
    className: 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
})

Dialog.Trigger = DialogPrimitive.Trigger
Dialog.Content = DialogContent
Dialog.Header = DialogHeader
Dialog.Title = DialogTitle
Dialog.Description = DialogDescription
Dialog.Footer = DialogFooter

export { Dialog, DialogOverlay, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription }
