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
import React, { useState, useEffect, useCallback } from "react";
import { get_all_roles } from "@/services/roles/roleServices";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";

export function RoleSection({ isExpanded }) {
  const [add_or_update_role, set_add_or_update_role] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchRoles = useCallback(async () => {
    try {
      const payload = {
        search: debouncedSearchTerm,
        limit: itemsPerPage,
        page: currentPage,
      };
      const response = await get_all_roles(payload);
      if (response.data.status) {
        setRoles(response.data.data.roles);
        const pagination_data = response.data.data.pagination;
        setItemsPerPage(pagination_data.itemsPerPage);
        setTotalProducts(pagination_data.totalRoles);
        setCurrentPage(pagination_data.currentPage);
        setTotalPages(pagination_data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, currentPage, itemsPerPage]);

  useEffect(() => {
    setLoading(true);
    fetchRoles();
  }, [fetchRoles]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleEditRole = (roleId) => {
    setCurrentRoleId(roleId);
    set_add_or_update_role(true);
  };

  const handleAddRole = () => {
    setCurrentRoleId(null);
    set_add_or_update_role(true);
  };

  if (loading) {
    return <div className="text-text">Loading roles...</div>;
  }

  return (
    <div className="w-full h-full">
      <SecondaryHeader
        title="Roles"
        searchPlaceholder="Search Roles"
        buttonText="Create New Role"
        tooltipText="Create New Role"
        onButtonClick={handleAddRole}
        onMobileButtonClick={handleAddRole}
        onSearch={handleSearch}
      />
      {totalPages > 0 && (
        <div className="px-1 flex justify-between items-center mt-4">
          <div className="text-sm text-text">
            {totalProducts > 0 && (
              <Badge className="bg-border text-text">
                Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
                {totalProducts} Roles
              </Badge>
            )}
          </div>
        </div>
      )}
      <div className="mx-1 mt-6 rounded-md max-w-[99vw] border border-border overflow-x-auto">
        <Table className="min-w-[800px] lg:min-w-full">
          <TableCaption className="mb-2 text-text">
            A list of available user roles
          </TableCaption>
          <TableHeader className="bg-cardBg">
            <TableRow>
              <TableHead className="w-[200px] text-text">Role Name</TableHead>
              <TableHead className="w-[300px] text-text">Description</TableHead>
              <TableHead className="w-[100px] text-center text-text">Users</TableHead>
              <TableHead className="w-[120px] text-center text-text">
                Permissions
              </TableHead>
              <TableHead className="w-[100px] text-right text-text">Actions</TableHead>
              <TableHead className="w-[150px] text-text">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((roleData) => {
              const { role, permissions } = roleData;
              return (
                <TableRow key={role._id} className="border-border">
                  <TableCell className="font-medium text-text">{role.name}</TableCell>
                  <TableCell className="text-text/70">
                    No description available
                  </TableCell>
                  <TableCell className="text-center text-text">0</TableCell>
                  <TableCell className="text-center text-text">
                    {getPermissionsCount(permissions)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-text hover:text-primary">
                      <SquarePen className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-text">{formatDate(role.updatedAt)}</TableCell>
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
            onPageChange={handlePageChange}
            className="justify-end"
          />
        </div>
      )}
      {add_or_update_role && (
        <AddRoleForm
          open={add_or_update_role}
          onOpenChange={set_add_or_update_role}
          onRoleCreated={fetchRoles}
          roleId={currentRoleId}
        />
      )}
    </div>
  );
}