"use client";

import { Button } from "../ui/button";
import SignInButton from "./signin-button";
import { useAccount, useConnect } from "wagmi";

export default function ConnectButton() {
  const account = useAccount();
  const { connectors, connect } = useConnect();

  if (account.isConnected) {
    return <SignInButton />;
  }

  return connectors.map((connector) => (
    <Button
      key={connector.uid}
      onClick={() => connect({ connector })}
      type="button"
    >
      Connect
    </Button>
  ));
}
