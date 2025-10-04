import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  customerName: string;
}

const DeleteConfirmDialog = ({ open, onOpenChange, onConfirm, customerName }: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-secondary border-white/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Müşteriyi Sil</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            <strong className="text-white">{customerName}</strong> adlı müşteriyi silmek istediğinizden emin misiniz?
            Bu işlem geri alınamaz ve müşteriye ait tüm cihaz ve malzeme kayıtları da silinecektir.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            İptal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
