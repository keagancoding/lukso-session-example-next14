"use server";

import UniversalProfileContract from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";
import { SessionData, sessionOptions } from "@/config/session";
import { getIronSession } from "iron-session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SiweMessage, generateNonce as generate } from "siwe";
import { MAINNET_RPC, TESTNET_RPC, VALID_SIGNATURE } from "@/config/consts";
import Web3 from "web3";
import { ERC725 } from "@erc725/erc725.js";
import lsp3ProfileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";

const getRPC = (chainId: number) => {
  return chainId === 42 ? MAINNET_RPC : TESTNET_RPC;
};

export const generateNonce = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.nonce = generate();
  await session.save();

  revalidatePath("/");
  return { nonce: session.nonce };
};

export const verifySiwe = async (message: string, signature: string) => {
  try {
    // convert back to SiweMessage
    const siwe = new SiweMessage(message);
    const chainRPC = getRPC(siwe.chainId);
    const web3 = new Web3(chainRPC);

    // get session
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );

    // check nonce
    if (siwe.nonce !== session.nonce) {
      return { success: false, error: "Invalid nonce" };
    }

    // check signature
    const hashedMessage = web3.eth.accounts.hashMessage(siwe.prepareMessage());
    const universalProfile = new web3.eth.Contract(
      UniversalProfileContract.abi,
      siwe.address
    );
    const isValidSignature = (await universalProfile.methods
      .isValidSignature(hashedMessage, signature)
      .call()) as string;

    if (isValidSignature !== VALID_SIGNATURE) {
      return { success: false, error: "Invalid signature" };
    }

    // save siwe to session
    session.siwe = siwe;
    await session.save();
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error try again mater" };
  }
};

export const logout = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.destroy();
  revalidatePath("/");
  return { success: true };
};

export const getProfile = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.siwe) {
    return { profile: null };
  }
  const chainRPC = getRPC(session.siwe.chainId);
  const web3 = new Web3(chainRPC);
  const balance = parseFloat(
    web3.utils.fromWei(await web3.eth.getBalance(session.siwe.address), "ether")
  );

  const erc725js = new ERC725(
    lsp3ProfileSchema,
    session.siwe.address,
    chainRPC,
    {
      ipfsGateway: "https://api.universalprofile.cloud/ipfs",
    }
  );

  const profileData = (await erc725js.fetchData("LSP3Profile")) as LSP3ProfileT;
  const formattedData = {
    name: profileData.value.LSP3Profile.name,
    image: profileData.value.LSP3Profile.profileImage[0]?.url.replace(
      "ipfs://",
      "https://api.universalprofile.cloud/ipfs/"
    ) || undefined,
    bg_image: profileData.value.LSP3Profile.backgroundImage[0]?.url.replace(
      "ipfs://",
      "https://api.universalprofile.cloud/ipfs/"
    ) || undefined,
    address: session.siwe.address,
    balance: {
      amount: balance,
      currency: chainRPC === MAINNET_RPC ? "LYX" : "LYXt",
    },
  };
  return { profile: formattedData };
};
