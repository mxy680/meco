"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface DefaultBreadcrumbProps {
  items: string[];
}

export function DefaultBreadcrumb({ items }: DefaultBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={item + '-' + idx}>
              {isLast ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{item}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">{item}</BreadcrumbLink>
                </BreadcrumbItem>
              )}
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
