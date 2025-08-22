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
import { CustomPagination } from "..";
import { Badge } from "../ui/badge";
import { AddRoleForm } from "./AddRoleForm";
import React,{useState} from "react";

export function RoleSection({ isExpanded }) {
  // Sample data for demonstration
  const [add_or_update_role, set_add_or_update_role] = useState(false);

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

  const totalPages = 30;
  const currentPage = 10;
  const totalProducts = 100;
  const itemsPerPage = 10;

  //functions
  const handle_add_or_update_form=()=>{
    console.log('hoifdhfie')
    set_add_or_update_role(true);
  }
  return (
    <div className="w-full">
      <SecondaryHeader
        title="Roles"
        searchPlaceholder="Search Roles"
        buttonText="Create New Role"
        tooltipText="Create New Role"
        onButtonClick={handle_add_or_update_form}
        onMobileButtonClick={handle_add_or_update_form}
      />
      {totalPages > 0 && (
        <div className="px-1 flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            {totalProducts > 0 && (
              <Badge className="bg-hoverBg">
                Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
                {totalProducts} Roles
              </Badge>
            )}
          </div>
        </div>
      )}
      <div className="mx-1 mt-6 rounded-md max-w-[99vw] border overflow-x-auto">
        <Table className="min-w-[800px] lg:min-w-full">
          <TableCaption className="mb-2">
            A list of available user roles
          </TableCaption>
          <TableHeader className="bg-hoverBg">
            <TableRow>
              <TableHead className="w-[200px]">Role Name</TableHead>
              <TableHead className="w-[300px]">Description</TableHead>
              <TableHead className="w-[100px] text-center">Users</TableHead>
              <TableHead className="w-[120px] text-center">
                Permissions
              </TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
              <TableHead className="w-[150px]">logs</TableHead>
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
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <SquarePen className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>{role.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 0 && (
        <div className=" flex justify-between items-center mt-4">
          {/* <div className="text-sm text-muted-foreground">
            {totalProducts > 0 &&
              `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                currentPage * itemsPerPage,
                totalProducts
              )} of ${totalProducts} products`}
          </div> */}
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={() => {}}
            className="justify-end"
          />
        </div>
      )}
      {add_or_update_role && (
        <AddRoleForm open={add_or_update_role} onOpenChange={set_add_or_update_role} />
      )}
    </div>
  );
}
