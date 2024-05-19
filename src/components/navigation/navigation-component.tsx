import * as React from "react";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  List,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { usePathname } from "next/navigation";
import BreadcrumbComponent from "../breadcrumb-component";
import { cn } from "@/lib/utils";
import { SimpleNavigationLink, TooltipNavigationLink } from "./navigation-link";
import { ModeToggle } from "../theme-toggle";

const NavigationLinks = [
  {
    name: "Team Listing",
    Icon: <List />,
    url: "/team/",
  },
  {
    name: "Create Team",
    Icon: <PlusCircle />,
    url: "/team/create",
  },
];

const NavigationComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <TooltipProvider>
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
            <Link
              href="/"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <Image
                src="/pokeball-icon.svg"
                alt="Home page"
                width={32}
                height={32}
                className="h-6 w-6   invert filter transition-all group-hover:scale-110"
              />
              <span className="sr-only">Pokemon Team Builder</span>
            </Link>
            {NavigationLinks.map((link, index) => {
              return <TooltipNavigationLink key={index} link={link} />;
            })}
          </nav>
        </TooltipProvider>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Image
                    src="/pokeball-icon.svg"
                    alt="Home page"
                    width={32}
                    height={32}
                    className="h-6 w-6   invert filter transition-all group-hover:scale-110"
                  />
                  <span className="sr-only">Pokemon Team Builder</span>
                </Link>

                {NavigationLinks.map((link, index) => {
                  return <SimpleNavigationLink key={index} link={link} />;
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <BreadcrumbComponent
            homeElement="Home"
            listClasses="text-sm text-muted-foreground"
            activeClasses="text-foreground"
          />
          <div className="relative ml-auto flex-1 md:grow-0"></div>
          <ModeToggle />
        </header>
        <main className="gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">{children}</main>
      </div>
    </div>
  );
};
export default NavigationComponent;
