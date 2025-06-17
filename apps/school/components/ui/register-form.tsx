"use client";

import { usePost } from "@/hooks/use-query";
import { baseUrl } from "@/lib/client";
import { UserInfo, UserStatus, useUserStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { WalletConnectButton } from "./wallet-connect-button";
import DisconnectButton from "./disconnect-button";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

export function RegisterForm({
  className,
  walletAddress,
  ...props
}: React.ComponentProps<"div"> & { walletAddress?: string }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });
  const setUser = useUserStore((state) => state.setUser);

  const { mutate: register, isPending } = usePost<
    UserInfo,
    { walletAddress: string; username: string; email: string }
  >(baseUrl + "/auth/register", {
    onSuccess: (data) => {
      setUser(data);
      if (data.status === UserStatus.PENDING) {
        toast.success(
          "Registration successful! Please wait for admin approval.",
        );
      } else {
        toast.success("Registration successful!");
      }
      router.push("/");
    },
    onError: (error) => {
      if (error?.message === "409") {
        toast.error(
          "This wallet address is already registered. Please try logging in.",
        );
      } else {
        toast.error(error.message || "Registration failed. Please try again.");
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }
    register({
      walletAddress,
      username: values.username,
      email: values.email,
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Enter your information to register</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <WalletConnectButton />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || !walletAddress}
                >
                  {isPending ? "Registering..." : "Register"}
                </Button>
              </form>
              <DisconnectButton />
            </Form>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
