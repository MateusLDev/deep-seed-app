import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ConfirmDeleteDialogProps {
  open: boolean
  title?: string
  isDeleting?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDeleteDialog = ({
  open,
  isDeleting = false,
  onConfirm,
  onCancel
}: ConfirmDeleteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={() => !isDeleting && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-left mb-3">Confirmar Exclusão</DialogTitle>

              <DialogDescription className="text-left mt-1">
                Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}