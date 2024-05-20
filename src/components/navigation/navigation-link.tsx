"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationLinkProps = {
  name: string;
  Icon: any;
  url: string;
};

const TooltipNavigationLink = ({ link }: { link: NavigationLinkProps }) => {
  const pathname = usePathname();
  //a link is active if the pathname starts with the link name
  //TODO: Last fix
  const isActive = (link: string) => pathname === link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={link.url}
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            isActive(link.url)
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          } transition-colors hover:text-foreground md:h-8 md:w-8`}
        >
          <link.Icon.type {...link.Icon.props} className="h-5 w-5" />
          <span className="sr-only">{link.name}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{link.name}</TooltipContent>
    </Tooltip>
  );
};

const SimpleNavigationLink = ({ link }: { link: NavigationLinkProps }) => {
  const pathname = usePathname();
  //a link is active if the pathname starts with the link name
  const isActive = (link: string) => pathname === link;
  return (
    <Link
      href={link.url}
      className={cn(
        "flex items-center gap-4 px-2.5",
        isActive(link.url)
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <link.Icon.type {...link.Icon.props} className="h-5 w-5" />
      {link.name}
    </Link>
  );
};

export { SimpleNavigationLink, TooltipNavigationLink };
