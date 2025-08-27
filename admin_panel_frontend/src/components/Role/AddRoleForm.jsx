"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { navItems } from "@/lib/routes_variables";
import { save_role } from "@/services/roles/roleServices";
import { toast } from "sonner";
export function AddRoleForm({ open, onOpenChange }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (open) {
      const initialPermissions = navItems.map((item) => ({
        id: item.id,
        page: item.label,
        read: false,
        edit: false,
        delete: false,
        download: false,
      }));
      setPermissions(initialPermissions);
    }
  }, [open]);

  const handlePermissionToggle = (id, permissionType) => {
    setPermissions(
      permissions.map((permission) =>
        permission.id === id
          ? { ...permission, [permissionType]: !permission[permissionType] }
          : permission
      )
    );
  };

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        role_name: data.roleName,
        permissions: permissions.map((p) => {
          return {
            page: p.id,
            read: p.read,
            edit: p.edit,
            delete: p.delete,
            download: p.download,
          };
        }),
      };
      // console.log(formattedData)
      const response = await save_role(formattedData);
      console.log(response);
      toast.success("Role saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to save role.");
    } finally {
      onOpenChange(false);
      reset();
      setPermissions([]);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset(); // Reset form fields
  };

  return (
    <Dialog
      className=""
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <DialogContent className="max-w-3xl bg-cardBg">
        <DialogHeader>
          <DialogTitle className="text-text">Add New Role</DialogTitle>
          <DialogDescription className="text-text">
            Create a new role and set permissions for different pages.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label className={"text-text"} htmlFor="role-name ">
              Role Name
            </Label>
            <Input
              id="role-name"
              {...register("roleName", {
                required: "Role name is required",
                minLength: {
                  value: 3,
                  message: "Role name must be at least 3 characters",
                },
              })}
              placeholder="Enter role name"
              className="text-text bg-cardBg border-border"
            />
            {errors.roleName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roleName.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text">Permissions</h3>

            <div className="rounded-md border">
              <Table className="text-text">
                <TableHeader className="bg-hoverBg">
                  <TableRow>
                    <TableHead className="w-[200px]">Page Name</TableHead>
                    <TableHead>Read</TableHead>
                    <TableHead>Edit</TableHead>
                    <TableHead>Delete</TableHead>
                    <TableHead>Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">
                        {permission.page}
                      </TableCell>
                      {["read", "edit", "delete", "download"].map((action) => (
                        <TableCell key={action}>
                          <Switch
                            checked={permission[action]}
                            onCheckedChange={() =>
                              handlePermissionToggle(permission.id, action)
                            }
                            className="bg-bgSwitch"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              className="text-text"
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button className="text-text" type="submit">
              Save Role
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
