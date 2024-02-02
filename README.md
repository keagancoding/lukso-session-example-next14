Here are the corrections:

# Next 14 App Router example for creating a wallet session.

This is an example specifically for the Lukso ecosystem but could easily be tweaked to work on other chains. All this example does is provide a frontend wallet connection and prompts a `siwe` message for the user to sign, then sends that information to the backend to be verified and added to the session.

## Getting started

Install Deps

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Create .env

```bash
cp .env.example .env
```

Start Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Files

[Iron session](https://github.com/vvo/iron-session) is being used to work with the session cookies, so check out their examples for more complex use cases.

Server actions are run on the server; we use a few here and they can be found in the `@/actions/server.ts` file:

- `generateNonce()` is used to prevent against [replay attacks](https://en.wikipedia.org/wiki/Replay_attack), creates a unique nonce, and stores it in the session for later use.

- `verifySiwe()` takes the message and signature from the frontend and verifies it before adding the `siwe` to the session cookie.

- `getProfile()` retrieves the stored session address and retrieves data for the given address.

- `logout()` wipes the session data from the cookies.

## Components

- `signin-button.tsx` is a client component that handles the signing of the `siwe` message and sends it to the backend to be verified.

- `logout-button.tsx` self-explanatory, a client component that logs out and removes session.

- `connect-button.tsx` is a client component that connects to the wallet extension using wagmi hooks and if connected displays the signin button.

- `profile.tsx` is a RSC that fetches the profile, and if the profile (session) exists, displays some basic information; if not, it displays the `connect-button.tsx`.