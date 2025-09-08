"use client";
import { SecondaryHeader } from ".."
import React, { useState } from "react";
import { Trash, Download } from "lucide-react";


import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  {
    Sr: 1,
    id: "INV-2025-001",
    Name: "Premium Service Invoice",
    CarId: "CAR-4567",
    InvoiceStatus: "Fixed",
    PaymentType: "Offline",
    Actions: "",
    Download: "invoice_2025_001.pdf",
    Info: "Annual maintenance package",
    CustomerName: "Rahul Sharma",
    CreatedAt: "2025-09-06 10:45 AM",
    CreatedBy: "Admin",
    UpdatedAt: "2025-09-06 12:15 PM",
    UpdatedBy: "Manager",
  },
  {
    Sr: 2,
    id: "INV-2025-002",
    Name: "Repair Invoice",
    CarId: "CAR-1234",
    InvoiceStatus: "Unfixed",
    PaymentType: "Online",
    Actions: "",
    Download: "invoice_2025_002.pdf",
    Info: "Engine repair and oil change",
    CustomerName: "Priya Verma",
    CreatedAt: "2025-09-05 03:20 PM",
    CreatedBy: "Technician",
    UpdatedAt: "2025-09-05 04:00 PM",
    UpdatedBy: "Admin",
  },
  {
    Sr: 3,
    id: "INV-2025-003",
    Name: "Spare Parts Invoice",
    CarId: "CAR-7890",
    InvoiceStatus: "Unfixed",
    PaymentType: "Offline",
    Actions: "",
    Download: "invoice_2025_003.pdf",
    Info: "Brake pads and filters",
    CustomerName: "Amit Singh",
    CreatedAt: "2025-09-04 11:00 AM",
    CreatedBy: "Manager",
    UpdatedAt: "2025-09-04 01:30 PM",
    UpdatedBy: "Admin",
  },
  {
    Sr: 4,
    id: "INV-2025-004",
    Name: "Insurance Claim Invoice",
    CarId: "CAR-2468",
    InvoiceStatus: "Fixed",
    PaymentType: "Online",
    Actions: "",
    Download: "invoice_2025_004.pdf",
    Info: "Accident repair claim",
    CustomerName: "Sneha Kapoor",
    CreatedAt: "2025-09-03 09:15 AM",
    CreatedBy: "Admin",
    UpdatedAt: "2025-09-03 10:00 AM",
    UpdatedBy: "Supervisor",
  },
  {
    Sr: 5,
    id: "INV-2025-005",
    Name: "General Checkup Invoice",
    CarId: "CAR-1357",
    InvoiceStatus: "Fixed",
    PaymentType: "Online",
    Actions: "",
    Download: "invoice_2025_005.pdf",
    Info: "Routine inspection and service",
    CustomerName: "Karan Mehta",
    CreatedAt: "2025-09-02 05:45 PM",
    CreatedBy: "Technician",
    UpdatedAt: "2025-09-02 06:30 PM",
    UpdatedBy: "Admin",
  },
];

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
                  <TableHead className="w-[60px]">Sr</TableHead>
                  <TableHead className="w-[200px]">id</TableHead>
                  <TableHead className="w-[250px]">Name </TableHead>
                  <TableHead className="w-[150px]"> Car id</TableHead>
                  <TableHead className="w-[60px]">Invoice Status</TableHead>
                  <TableHead className="w-[180px]">Payment Type</TableHead>
                  <TableHead className="w-[130px] text-center">Actions</TableHead>
                  <TableHead className="w-[130px] text-center">Download</TableHead>
                  <TableHead className="w-[250px]">info </TableHead>
                  <TableHead className="w-[150px]">Customer Name</TableHead>
                  <TableHead className="w-[200px]">Created at</TableHead>
                  <TableHead className="w-[200px]">Created By</TableHead>
                  <TableHead className="w-[250px]">Updated at</TableHead>
                  <TableHead className="w-[150px]">Updated by</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>

                {invoices.map((row) => (
                <TableRow key={row.id}>
                    <TableCell>{row.Sr}</TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.Name}</TableCell>
                    <TableCell>{row.CarId}</TableCell>
                    <TableCell>{row.InvoiceStatus}</TableCell>
                    <TableCell>{row.PaymentType}</TableCell>
                    <TableCell className="text-center">
                        <button>
                            <Trash size={18}/>
                        </button>
                    </TableCell>
                    <TableCell  className="text-center">
                        <button>
                            <Download size={18} />
                        </button>
                    </TableCell>
                    <TableCell>{row.Info}</TableCell>
                    <TableCell>{row.CustomerName}</TableCell>
                    <TableCell>{row.CreatedAt}</TableCell>
                    <TableCell>{row.CreatedBy}</TableCell>
                    <TableCell>{row.UpdatedAt}</TableCell>
                    <TableCell>{row.UpdatedBy}</TableCell>
                </TableRow>
                ))}

              </TableBody>
            </Table>
            </div>
        </div>
    )
}