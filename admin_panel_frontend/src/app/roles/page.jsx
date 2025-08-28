"use client";
import { RoleSection } from "@/components";
export default function Role({ isExpanded }) {
  return (
    <div
    className="overflow-auto w-full "
    >
      <RoleSection isExpanded={isExpanded} />
    </div>
  );
}
