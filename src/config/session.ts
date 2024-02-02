import { SessionOptions } from "iron-session";
import { SiweMessage } from "siwe";

export interface SessionData {
  nonce?: string;
  siwe?: SiweMessage;
}

export const defaultSession: SessionData = {
  nonce: undefined,
  siwe: undefined,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASS!,
  cookieName: "session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
