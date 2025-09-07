"use client";
import { SecondaryHeader } from ".."
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function InvoiceSection () {
    const [loading, setLoading] = useState(true);
    
    return(
         <div className="w-full h-full">
              <SecondaryHeader
                title="Invoices"
                searchPlaceholder="Seach Invoices"
                buttonText="Create New Invoices"
                tooltipText="Create New Invoices"
                // onButtonClick={handleAddUser}
                // onMobileButtonClick={handleAddUser}
                // onSearch={handleSearch}
              />
              
              <div className="mx-1 mt-6 rounded-md max-w-[99vw] border overflow-x-auto bg-tableBg">
            <Table className="min-w-[800px] lg:min-w-full">
              <TableCaption className="mb-2">
                A list of system users
              </TableCaption>
              <TableHeader className="bg-hoverBg">
                <TableRow>
                  <TableHead className="w-[60px]">Image</TableHead>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead className="w-[250px]">Email</TableHead>
                  <TableHead className="w-[150px]">Role</TableHead>
                  <TableHead className="w-[120px] text-right">
                    Actions
                  </TableHead>
                  <TableHead className="w-[150px]">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {loading
                  ? skeletonRows
                  : 
                  users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role?.name}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              onClick={() => handleEditUser(user._id)}
                              variant="ghost"
                              size="icon"
                            >
                              <SquarePen className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteUser(user._id)}
                              variant="ghost"
                              size="icon"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(user.updatedAt)}</TableCell>
                      </TableRow>
                    )) }*/
                }
              </TableBody>
            </Table>
            </div>
        </div>
    )
}