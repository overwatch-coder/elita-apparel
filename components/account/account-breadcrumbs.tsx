"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

const routeLabels: Record<string, string> = {
  account: "Account Info",
  orders: "Order History",
  wishlist: "Wishlist",
  addresses: "Addresses",
  profile: "Profile Settings",
};

export function AccountBreadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  // We only show breadcrumbs inside /account routes
  if (paths[0] !== "account") return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const label =
            routeLabels[path] || path.charAt(0).toUpperCase() + path.slice(1);
          const isLast = index === paths.length - 1;

          // Special case for 'account' root
          if (path === "account" && index === 0) {
            return (
              <React.Fragment key={path}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/account">Account Info</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    {label?.includes("-") ? label?.split("-")[0] : label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>
                      {label?.includes("-") ? label?.split("-")[0] : label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
