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
  admin: "Dashboard",
  products: "Products",
  new: "New",
  edit: "Edit",
  categories: "Categories",
  collections: "Collections",
  orders: "Orders",
  "whatsapp-orders": "WhatsApp Orders",
  discounts: "Discounts",
  reviews: "Reviews",
  "size-guides": "Size Guides",
  inventory: "Inventory",
  audience: "Audience",
  campaigns: "Campaigns",
  automations: "Automations",
  popups: "Popups",
  marketing: "Marketing",
  analytics: "Analytics",
  settings: "Settings",
  "fabric-types": "Fabric Types",
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  // Don't show breadcrumbs on the main admin dashboard page (it only has one segment: "admin")
  if (paths.length <= 1) return null;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const label =
            routeLabels[path] || path.charAt(0).toUpperCase() + path.slice(1);
          const isLast = index === paths.length - 1;

          // Skip "admin" segment if it's the first one, or map it to Dashboard
          if (path === "admin" && index === 0) {
            return (
              <React.Fragment key={path}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/admin">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
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
