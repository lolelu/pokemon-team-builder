"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

import { cn } from "@/lib/utils";
import React from "react";

type TBreadCrumbProps = {
  homeElement: React.ReactNode;

  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
};

const BreadcrumbComponent = ({
  homeElement,

  containerClasses,
  listClasses,
  activeClasses,
  capitalizeLinks = true,
}: TBreadCrumbProps) => {
  const paths = usePathname();

  const pathNames = paths.split("/").filter((path) => path);

  return (
    <Breadcrumb className={cn("hidden md:flex", containerClasses)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">{homeElement}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathNames.map((link, index) => {
          let href = `/${pathNames.slice(0, index + 1).join("/")}`;
          let itemClasses =
            paths === href ? `${listClasses} ${activeClasses}` : listClasses;

          return (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem key={index}>
                <BreadcrumbLink
                  asChild
                  className={cn(itemClasses, capitalizeLinks && "capitalize")}
                >
                  <Link href={href}>{link}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
