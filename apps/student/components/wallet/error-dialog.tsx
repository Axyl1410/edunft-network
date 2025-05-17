import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

export function ErrorDialog({
  open,
  onOpenChange,
  createAccountError,
  handleCreateAccountErrorLogout,
}: {
  open: boolean;
  onOpenChange: () => void;
  createAccountError: string | null;
  handleCreateAccountErrorLogout: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Đã xảy ra lỗi khi tạo tài khoản</DialogTitle>
          <DialogDescription>{createAccountError}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleCreateAccountErrorLogout}
          >
            Đăng xuất và thử lại
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
