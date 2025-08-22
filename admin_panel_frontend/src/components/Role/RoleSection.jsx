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
  return (
    <div className="w-full">
      <SecondaryHeader
        title="Roles"
        searchPlaceholder="Search Roles"
        buttonText="Create New Role"
        tooltipText="Create New Role"
      />
      {/* Modified container with proper constraints */}
      <div className="mt-4 border border-border rounded-lg max-w-full">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableCaption>List of your all type of roles.</TableCaption>
            <TableHeader className="bg-hoverBg">
              <TableRow>
                <TableHead className="w-[50px]">SR</TableHead>
                <TableHead className="min-w-[100px]">Name</TableHead>
                <TableHead className="min-w-[100px]">Actions</TableHead>
                <TableHead className="min-w-[100px]">Logs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>
                  <Button>Edit</Button>
                </TableCell>
                <TableCell>Credit Card</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">2</TableCell>
                <TableCell>
                  Administrator with a very long role name that might cause
                  overflow
                </TableCell>
                <TableCell>
                  <Button>Edit</Button>
                </TableCell>
                <TableCell>
                  System logs, application logs, user activity logs
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">3</TableCell>
                <TableCell>Editor</TableCell>
                <TableCell>
                  <Button>Edit</Button>
                </TableCell>
                <TableCell>Content modification logs</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
