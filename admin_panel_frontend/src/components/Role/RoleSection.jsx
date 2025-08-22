"use client";
import { SecondaryHeader } from "..";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SquarePen } from "lucide-react";
import { Button } from "../ui/button";

export function RoleSection({ isExpanded }) {
  // Sample data for demonstration
  const roles = [
    {
      id: 1,
      name: "Administrator",
      description: "Full system access with all permissions",
      users: 5,
      permissions: 28,
      lastUpdated: "2023-10-15",
    },
    {
      id: 2,
      name: "Editor",
      description: "Can create and edit content but not manage users",
      users: 12,
      permissions: 15,
      lastUpdated: "2023-11-02",
    },
    {
      id: 3,
      name: "Viewer",
      description: "Read-only access to content",
      users: 24,
      permissions: 8,
      lastUpdated: "2023-09-20",
    },
    {
      id: 4,
      name: "Moderator",
      description: "Can manage user content and comments",
      users: 7,
      permissions: 12,
      lastUpdated: "2023-10-28",
    },
  ];

  return (
    <div className="w-full">
      <SecondaryHeader
        title="Roles"
        searchPlaceholder="Search Roles"
        buttonText="Create New Role"
        tooltipText="Create New Role"
      />

      <div className="mt-6 rounded-md border overflow-x-auto">
        <Table className="min-w-[800px] lg:min-w-full">
          <TableCaption>A list of available user roles</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Role Name</TableHead>
              <TableHead className="w-[300px]">Description</TableHead>
              <TableHead className="w-[100px] text-center">Users</TableHead>
              <TableHead className="w-[120px] text-center">
                Permissions
              </TableHead>
              <TableHead className="w-[150px]">Last Updated</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {role.description}
                </TableCell>
                <TableCell className="text-center">{role.users}</TableCell>
                <TableCell className="text-center">
                  {role.permissions}
                </TableCell>
                <TableCell>{role.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <SquarePen className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
