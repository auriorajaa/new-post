"use client";

import Link from "next/link";
import { SessionUser } from "@/lib/session";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  Logout03Icon,
  NoteAddIcon,
  BookEditIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { signOutAction } from "@/lib/actions/auth";

type Props = {
  user: SessionUser;
};

const menuItems = [
  { href: "/user/create-post", label: "Create post", icon: NoteAddIcon },
  { href: "/user/posts", label: "Your posts", icon: BookEditIcon },
];

const Profile = ({ user }: Props) => {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Open profile menu"
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
        }
      >
        <Avatar className="size-9">
          <AvatarImage
            src={user.avatar ?? undefined}
            alt={user.name}
            referrerPolicy="no-referrer"
          />
          <AvatarFallback>
            <HugeiconsIcon icon={UserIcon} className="size-5" />
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-56 p-2">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <Avatar className="size-8">
            <AvatarImage
              src={user.avatar ?? undefined}
              alt={user.name}
              referrerPolicy="no-referrer"
            />
            <AvatarFallback>
              <HugeiconsIcon icon={UserIcon} className="size-5" />
            </AvatarFallback>
          </Avatar>
          <p className="truncate text-sm font-medium">{user.name}</p>
        </div>

        <Separator className="my-2" />

        <div className="flex flex-col">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-2xl px-2 py-2 text-sm transition-colors hover:bg-accent"
            >
              <HugeiconsIcon
                icon={item.icon}
                className="size-5 text-muted-foreground"
              />
              {item.label}
            </Link>
          ))}
        </div>

        <Separator className="my-2" />

        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-2xl px-2 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            <HugeiconsIcon icon={Logout03Icon} className="size-5" />
            Sign out
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default Profile;
