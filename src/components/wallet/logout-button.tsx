"use client";
import { logout } from "@/actions/server";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };
  return (
    <Button
      className="flex gap-2 items-center w-full"
      onClick={handleLogout}
      disabled={isPending}
      variant="outline"
      size="sm"
    >
      {isPending && <Loader2 className="animate-spin" />}
      Logout
    </Button>
  );
}
