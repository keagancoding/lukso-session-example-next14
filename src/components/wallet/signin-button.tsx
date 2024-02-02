"use client";

import { Button } from "@/components/ui/button";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { useEffect, useState, useTransition } from "react";
import { generateNonce, verifySiwe } from "@/actions/server";
import { Loader2 } from "lucide-react";

export default function SignInButton() {
  const [nonce, setNonce] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const fetchNonce = async () => {
    try {
      const reqNonce = await generateNonce();
      setNonce(reqNonce.nonce);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNonce();
  }, []);

  const { address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  const signIn = async () => {
    try {
      if (!address || !chainId) return;

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "By signing in, you agree to our terms of service.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      }).prepareMessage();

      const signature = await signMessageAsync({
        message,
      });

      const verifyRes = await verifySiwe(message, signature);
      if (verifyRes.success === false) {
        throw new Error("Verification failed");
      }
    } catch (error) {
      setNonce(undefined);
      fetchNonce();
    }
  };

  const handleSignin = () => {
    startTransition(async () => {
      await signIn();
    });
  };

  return (
    <Button
      className="flex gap-2 items-center"
      onClick={handleSignin}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="animate-spin" /> : "🆙"}
      <span>Sign In</span>
    </Button>
  );
}
