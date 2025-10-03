"use client";

import { BreadcrumbSteps } from "@/components/ui/breadcrumb-steps";

interface ClientBreadcrumbProps {
  currentIndex: number;
  total: number;
  answered: boolean[];
}

export function ClientBreadcrumb({
  currentIndex,
  total,
  answered,
}: ClientBreadcrumbProps) {
  return (
    <BreadcrumbSteps total={total} current={currentIndex} answered={answered} />
  );
}
