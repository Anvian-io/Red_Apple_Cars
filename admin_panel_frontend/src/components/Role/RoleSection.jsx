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
import React, { useState, useEffect } from "react";
import { get_all_roles } from "@/services/roles/roleServices";

export function RoleSection({ isExpanded }) {
  const [add_or_update_role, set_add_or_update_role] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static pagination data (replace with actual API data when available)
  const totalPages = 30;
  const currentPage = 10;
  const totalProducts = 100;
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await get_all_roles();
        if (response.data.status) {
          setRoles(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Calculate permissions count for each role
  const getPermissionsCount = (permissions) => {
    return permissions.reduce((count, permission) => {
      return (
        count +
        (permission.read ? 1 : 0) +
        (permission.edit ? 1 : 0) +
        (permission.delete ? 1 : 0) +
        (permission.download ? 1 : 0)
      );
    }, 0);
  };

  // Format date to display only date part
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handle_add_or_update_form = () => {
    set_add_or_update_role(true);
  };

  if (loading) {
    return <div>Loading roles...</div>;
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
              <TableHead className="w-[150px]">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((roleData) => {
              const { role, permissions } = roleData;
              return (
                <TableRow key={role._id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {/* Description not in API - keeping static */}
                    No description available
                  </TableCell>
                  <TableCell className="text-center">
                    {/* Users count not in API - keeping static */}0
                  </TableCell>
                  <TableCell className="text-center">
                    {getPermissionsCount(permissions)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <SquarePen className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{formatDate(role.updatedAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {totalPages > 0 && (
        <div className="flex justify-between items-center mt-4">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={() => {}}
            className="justify-end"
          />
        </div>
      )}
      {add_or_update_role && (
        <AddRoleForm
          open={add_or_update_role}
          onOpenChange={set_add_or_update_role}
        />
      )}
    </div>
  );
}
