import { baseUrl } from "@/lib/client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import axios from "axios";
import { Terminal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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

interface CreateAccountFormProps {
  onSuccess: () => void;
  walletAddress: string;
  setCreateAccountError: (err: string) => void;
  onStepChange: (step: number) => void;
}

export const CreateAccountForm = React.memo(
  ({
    onSuccess,
    walletAddress,
    setCreateAccountError,
    onStepChange,
  }: CreateAccountFormProps) => {
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
          username: formData.Username,
          bio: formData.Bio,
          profilePicture: formData.ProfilePicture,
          banner: formData.Banner,
          role: formData.role,
        });
        toast.success("Account created successfully!");
        onSuccess();
      } catch (error) {
        console.error(error);
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
                    setFormData((prev) => ({
                      ...prev,
                      Username: e.target.value,
                    }))
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
                    variant={
                      formData.role === "student" ? "default" : "outline"
                    }
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
                    variant={
                      formData.role === "teacher" ? "default" : "outline"
                    }
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
            All information is optinal, but the more you provide, the better
            your experience will be. You can always update your profile later.
          </AlertDescription>
        </Alert>

        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

        <div className="flex justify-between">
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
        </div>
      </div>
    );
  },
);

CreateAccountForm.displayName = "CreateAccountForm";
