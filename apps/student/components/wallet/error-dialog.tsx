import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { memo, useCallback } from "react";

interface ErrorDialogProps {
  open: boolean;
  onOpenChange: () => void;
  createAccountError: string | null;
  handleCreateAccountErrorLogout: () => void;
}

const ErrorDialog = memo(
  ({
    open,
    onOpenChange,
    createAccountError,
    handleCreateAccountErrorLogout,
  }: ErrorDialogProps) => {
    const handleLogout = useCallback(() => {
      handleCreateAccountErrorLogout();
    }, [handleCreateAccountErrorLogout]);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đã xảy ra lỗi khi tạo tài khoản</DialogTitle>
            <DialogDescription>{createAccountError}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleLogout}>
              Đăng xuất và thử lại
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

ErrorDialog.displayName = "ErrorDialog";

export { ErrorDialog };
