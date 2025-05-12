import { baseUrl } from "@/lib/client";
import { FORMA_SKETCHPAD, thirdwebClient } from "@/lib/thirdweb-client";
import { formatAddress } from "@/lib/utils";
import { useUserStore } from "@/store";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { SkeletonImage } from "@workspace/ui/components/skeleton-image";
import { Textarea } from "@workspace/ui/components/textarea";
import axios from "axios";
import { Terminal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react"; // Added useCallback
import { toast } from "sonner";
import {
  Blobbie,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useConnectModal,
  useDisconnect,
  useWalletDetailsModal,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";

interface CreateUserFormData {
  Username: string;
  Bio: string;
  ProfilePicture: string;
  Banner: string;
  role: "student" | "teacher";
}

const steps = [
  {
    id: "basic",
    title: "Basic Information",
    description: "Tell us about yourself",
  },
  {
    id: "profile",
    title: "Profile Setup",
    description: "Customize your profile",
  },
  {
    id: "role",
    title: "Select Role",
    description: "Choose your role in the platform",
  },
];

const CreateAccountForm = ({
  onSuccess,
  walletAddress,
  setCreateAccountError,
  onStepChange,
}: {
  onSuccess: () => void;
  walletAddress: string;
  setCreateAccountError: (err: string) => void;
  onStepChange: (step: number) => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CreateUserFormData>({
    Username: "",
    Bio: "",
    ProfilePicture: "",
    Banner: "",
    role: "student",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!walletAddress) return;

    setIsLoading(true);
    try {
      await axios.post(baseUrl + "/user/create", {
        walletAddress: walletAddress,
        ...formData,
      });
      toast.success("Account created successfully!");
      onSuccess();
    } catch (error) {
      console.error(error);
      // Show error dialog instead of toast
      setCreateAccountError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="username">Username (required)</Label>
              <Input
                id="username"
                value={formData.Username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, Username: e.target.value }))
                }
                placeholder="Enter your username"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.Bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, Bio: e.target.value }))
                }
                placeholder="Tell us about yourself"
              />
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="profilePicture" className="text-sm font-medium">
                Profile Picture URL
              </Label>
              <Input
                id="profilePicture"
                value={formData.ProfilePicture}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ProfilePicture: e.target.value,
                  }))
                }
                placeholder="Enter your profile picture URL"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="banner" className="text-sm font-medium">
                Banner URL
              </Label>
              <Input
                id="banner"
                value={formData.Banner}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, Banner: e.target.value }))
                }
                placeholder="Enter your banner URL"
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Select Role</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={formData.role === "student" ? "default" : "outline"}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "student" }))
                  }
                  className="h-24"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg">👨‍🎓</span>
                    <span>Student</span>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={formData.role === "teacher" ? "default" : "outline"}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "teacher" }))
                  }
                  className="h-24"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg">👨‍🏫</span>
                    <span>Teacher</span>
                  </div>
                </Button>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (onStepChange) onStepChange(currentStep);
  }, [currentStep, onStepChange]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center ${
              index < steps.length - 1 ? "flex-1" : ""
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                index <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 ${
                  index < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          All information is optinal, but the more you provide, the better your
          experience will be. You can always update your profile later.
        </AlertDescription>
      </Alert>

      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

      <DialogFooter className="flex justify-between">
        {currentStep > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isLoading}
          >
            Back
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={isLoading || !formData.Username}
          >
            Next
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !formData.Username}
          >
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
        )}
      </DialogFooter>
    </div>
  );
};

export const WalletConnectButton = () => {
  const { connect } = useConnectModal();
  const { theme } = useTheme();
  const account = useActiveAccount();
  const detailsModal = useWalletDetailsModal();
  const wallet = useActiveWallet();
  const activeChain = useActiveWalletChain();
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const { disconnect } = useDisconnect();
  const [createAccountError, setCreateAccountError] = useState<string | null>(
    null,
  );
  const [createStep, setCreateStep] = useState(0);

  useEffect(() => {
    if (!wallet) {
      return;
    }
    const unsubscribeAccount = wallet.subscribe(
      "accountChanged",
      (newAccount) => {
        console.log("Account changed via subscribe:", newAccount);
      },
    );
    const unsubscribeChain = wallet.subscribe("chainChanged", (newChain) => {
      console.log("Chain changed via subscribe:", newChain);
    });

    return () => {
      unsubscribeAccount();
      unsubscribeChain();
    };
  }, [wallet]);

  useEffect(() => {
    if (!account?.address) {
      // No active account, ensure dialog is closed and account status is reset
      setShowCreateUserDialog(false);
      setAccountCreated(false);
      return;
    }

    if (accountCreated) {
      // Account is already marked as created for this session/address, do nothing.
      return;
    }

    if (!wallet) {
      return;
    }

    // At this point, an account address exists, and we haven't confirmed account creation yet.
    // Attempt to log in / check for user existence.
    axios
      .post(baseUrl + "/user/login", {
        WalletAddress: account.address,
      })
      .then(() => {
        setAccountCreated(true);
        setShowCreateUserDialog(false); // Ensure dialog is closed if login is successful
        // Fetch user info and set in zustand
        axios.get(baseUrl + `/user/${account.address}`).then((response) => {
          setUser({
            walletAddress: account.address,
            username: response.data.username || "",
            bio: response.data.bio || "",
            profilePicture: response.data.profilePicture || "",
            banner: response.data.banner || "",
            reputation: response.data.reputation || 100,
            violations: response.data.violations || 0,
            bannedUntil: response.data.bannedUntil || null,
            role: response.data.role || "student",
          });
        });
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          // User not found, prompt for account creation (no error toast)
          setShowCreateUserDialog(true);
          setAccountCreated(false); // Ensure this is false as we are prompting creation
        } else {
          // Only show toast for real errors
          console.error("Login/check error:", error);
          toast.error("Đã xảy ra lỗi khi kết nối tới EduNFT", {
            description:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        }
      });
  }, [account?.address, accountCreated, setUser, wallet]); // Thêm wallet vào dependencies

  const wallets = [
    inAppWallet({
      auth: {
        options: ["google", "email", "facebook", "apple", "github"],
      },
    }),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.rabby"),
    createWallet("io.zerion.wallet"),
  ];

  async function handleConnect() {
    await connect({
      client: thirdwebClient,
      chain: FORMA_SKETCHPAD,
      showThirdwebBranding: false,
      theme: theme === "light" ? "light" : "dark",
      size: "compact",
      wallets: wallets,
    });
  }

  async function handleDetail() {
    detailsModal.open({
      client: thirdwebClient,
      chains: [FORMA_SKETCHPAD],
      theme: theme === "light" ? "light" : "dark",
      hideSwitchWallet: true,
    });
  }

  async function handleSwitch() {
    if (wallet?.switchChain) {
      try {
        await wallet.switchChain(FORMA_SKETCHPAD);
      } catch (error) {
        console.error("Failed to switch chain:", error);
      }
    } else {
      console.warn(
        "Wallet does not support switching chain or wallet is not connected.",
      );
    }
  }

  const handleCreateAccountSuccess = useCallback(() => {
    setAccountCreated(true);
    setShowCreateUserDialog(false);
    // Fetch user info and set in zustand
    if (account?.address) {
      axios.get(baseUrl + `/user/${account.address}`).then((response) => {
        setUser({
          walletAddress: account.address,
          username: response.data.username || "",
          bio: response.data.bio || "",
          profilePicture: response.data.profilePicture || "",
          banner: response.data.banner || "",
          reputation: response.data.reputation || 100,
          violations: response.data.violations || 0,
          bannedUntil: response.data.bannedUntil || null,
          role: response.data.role || "student",
        });
      });
    }
  }, [account?.address, setUser]); // Dependencies are stable setters from useState

  const handleCreateAccountErrorLogout = () => {
    if (wallet) disconnect(wallet);
    setCreateAccountError(null);
    setShowCreateUserDialog(false);
    window.location.reload();
  };

  return (
    <>
      {!account?.address ? (
        <Button onClick={handleConnect} className="cursor-pointer">
          Connect
        </Button>
      ) : activeChain?.id !== FORMA_SKETCHPAD.id ? (
        <Button onClick={handleSwitch} className="cursor-pointer">
          Switch network
        </Button>
      ) : (
        <Button
          variant={"outline"}
          onClick={handleDetail}
          className="flex cursor-pointer items-center dark:bg-transparent"
        >
          {user?.profilePicture ? (
            <SkeletonImage
              src={user.profilePicture}
              alt="Avatar"
              width={24}
              height={24}
              rounded="rounded-full"
              className="mr-1 size-6 rounded-full"
            />
          ) : (
            <Blobbie
              address={account.address}
              className="mr-1 size-6 rounded-full"
            />
          )}
          {formatAddress(account.address)}
        </Button>
      )}

      <Dialog
        open={showCreateUserDialog}
        onOpenChange={(open) => {
          // Prevent closing by X or overlay when dialog is for account creation
          if (!open && showCreateUserDialog) return;
          setShowCreateUserDialog(open);
        }}
      >
        <DialogContent className="no-x-close max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Your Account</DialogTitle>
            <DialogDescription>
              Please fill in your details to complete your account setup.
            </DialogDescription>
          </DialogHeader>
          {account?.address && (
            <CreateAccountForm
              walletAddress={account.address}
              onSuccess={handleCreateAccountSuccess}
              setCreateAccountError={setCreateAccountError}
              onStepChange={setCreateStep}
            />
          )}
          {account?.address && createStep === 0 && (
            <DialogFooter className="flex flex-row-reverse justify-between gap-2">
              <Button
                variant="destructive"
                onClick={() => {
                  if (wallet) disconnect(wallet);
                  setShowCreateUserDialog(false);
                }}
              >
                Cancel and Logout
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      {/* Error Dialog for account creation */}
      <Dialog
        open={!!createAccountError}
        onOpenChange={() => setCreateAccountError(null)}
      >
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
    </>
  );
};
