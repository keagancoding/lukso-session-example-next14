import { getProfile } from "@/actions/server";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import LogoutButton from "./wallet/logout-button";
import ConnectButton from "./wallet/connect-button";
import Image from "next/image";
import { Badge } from "./ui/badge";

export const Profile = async () => {
  const { profile } = await getProfile();
  if (profile) {
    const initials = profile.name.slice(0, 2).toUpperCase();
    const formattedAddress =
      profile.address.slice(0, 6) + "..." + profile.address.slice(-10);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="relative size-8 rounded-full">
            <Avatar className="size-10">
              <AvatarImage src={profile.image} alt={profile.name ?? ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 relative"
          align="center"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="bg-foreground overflow-hidden absolute top-0 left-0 right-0 -z-10 h-full">
              {profile.bg_image && (
                <Image
                  src={profile.bg_image}
                  alt=""
                  width={300}
                  height={300}
                  className="blur-[2px] object-cover w-full opacity-80 "
                />
              )}
            </div>
            <div className="pb-10 flex flex-col gap-2 items-start">
              <div className="flex items-center gap-1">
                <Avatar className="size-8 border-[2px]">
                  <AvatarImage src={profile.image} alt={profile.name ?? ""} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-background">
                    {profile.name}
                  </p>
                  <p className="text-xs leading-none text-background/50">
                    {formattedAddress}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-background"
              >{`Balance ${profile.balance.amount.toFixed(2)} ${
                profile.balance.currency
              }`}</Badge>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return <ConnectButton />;
};

{
  /* <DropdownMenuSeparator /> */
}
{
  /* <DropdownMenuGroup>
  <DropdownMenuItem asChild>
    <Link href="/dashboard/stores">
      <DashboardIcon className="mr-2 size-4" aria-hidden="true" />
      Dashboard
      <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
    </Link>
  </DropdownMenuItem>
  <DropdownMenuItem asChild>
    <Link href="/dashboard/billing">
      <Icons.credit className="mr-2 size-4" aria-hidden="true" />
      Billing
      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
    </Link>
  </DropdownMenuItem>
  <DropdownMenuItem asChild>
    <Link href="/dashboard/account">
      <GearIcon className="mr-2 size-4" aria-hidden="true" />
      Settings
      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
    </Link>
  </DropdownMenuItem>
</DropdownMenuGroup> */
}
