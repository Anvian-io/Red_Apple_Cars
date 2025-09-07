"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import { SquarePen, Trash2, Eye, Download } from "lucide-react";
import { Button } from "../ui/button";
import { CustomPagination } from "..";
import { Badge } from "../ui/badge";
import {
  getAllInvoices,
  deleteInvoice,
} from "@/services/invoice/invoiceServices";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import SearchLoader from "@/components/custom_ui/SearchLoader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function InvoiceSection({ isExpanded }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const router = useRouter();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchInvoices = useCallback(async () => {
    try {
      setIsSearching(isInitial === false);
      const payload = {
        search: debouncedSearchTerm,
        limit: itemsPerPage,
        page: currentPage,
      };
      const response = await getAllInvoices(payload, router);
      if (response.data.status) {
        setInvoices(response.data.data.invoices);
        const pagination_data = response.data.data.pagination;
        setItemsPerPage(pagination_data.itemsPerPage);
        setTotalInvoices(pagination_data.totalInvoices);
        setCurrentPage(pagination_data.currentPage);
        setTotalPages(pagination_data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, currentPage, itemsPerPage, router]);

  useEffect(() => {
    setLoading(isInitial === true);
    fetchInvoices();
    setIsInitial(false);
  }, [fetchInvoices]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewInvoice = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteInvoice(invoiceToDelete._id, router);
      if (response.data.status) {
        toast.success("Invoice deleted successfully");
        fetchInvoices(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to delete invoice");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    } finally {
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    }
  };

  const handleDownloadInvoice = (pdfUrl) => {
    try {
      if (!pdfUrl) {
        toast.error("No PDF available for this invoice");
        return;
      }
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `invoice_${Date.now()}.pdf`; // file name when downloaded
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    }
  };


  const skeletonRows = Array.from({ length: itemsPerPage }, (_, i) => (
    <TableRow key={i}>
      <TableCell>
        <Skeleton className="h-4 w-8 bg-border" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20 bg-border" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32 bg-border" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24 bg-border" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24 bg-border" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20 bg-border" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24 bg-border" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24 bg-border" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20 bg-border" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20 bg-border" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-8 bg-border" />
          <Skeleton className="h-8 w-8 bg-border" />
          <Skeleton className="h-8 w-8 bg-border" />
          <Skeleton className="h-8 w-8 bg-border" />
        </div>
      </TableCell>
    </TableRow>
  ));

  return (
    <div className="w-full h-full">
      {isSearching && <SearchLoader />}
      <SecondaryHeader
        title="Invoices"
        searchPlaceholder="Search Invoices"
        buttonText="Create New Invoice"
        tooltipText="Create New Invoice"
        onButtonClick={() => {
          /* Handle create new invoice */
        }}
        onMobileButtonClick={() => {
          /* Handle create new invoice */
        }}
        onSearch={handleSearch}
      />
      <div className="px-1 flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          {loading ? (
            <Skeleton className="h-5 w-40 bg-border rounded-md" />
          ) : totalInvoices > 0 ? (
            <Badge className="bg-hoverBg">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalInvoices)} of{" "}
              {totalInvoices} Invoices
            </Badge>
          ) : (
            <Badge className="bg-hoverBg">No Invoices Found</Badge>
          )}
        </div>
      </div>

      <div className="mx-1 mt-6 rounded-md max-w-[99vw] border overflow-x-auto bg-tableBg">
        <Table className="min-w-[1200px] lg:min-w-full">
          <TableCaption className="mb-2">
            A list of system invoices
          </TableCaption>
          <TableHeader className="bg-hoverBg">
            <TableRow>
              <TableHead className="w-[50px]">SR</TableHead>
              <TableHead className="w-[100px]">Invoice ID</TableHead>
              <TableHead className="w-[150px]">Customer Name</TableHead>
              <TableHead className="w-[120px]">Car Name</TableHead>
              <TableHead className="w-[120px]">Car Company</TableHead>
              <TableHead className="w-[100px]">Car ID</TableHead>
              <TableHead className="w-[120px]">Created By</TableHead>
              <TableHead className="w-[120px]">Updated By</TableHead>
              <TableHead className="w-[100px]">Created At</TableHead>
              <TableHead className="w-[100px]">Updated At</TableHead>
              <TableHead className="w-[180px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? skeletonRows
              : invoices.map((invoice, index) => (
                  <TableRow key={invoice?._id}>
                    <TableCell>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {invoice?.invoice_index_id}
                    </TableCell>
                    <TableCell>{invoice?.customer_name}</TableCell>
                    <TableCell>{invoice?.car_id?.name}</TableCell>
                    <TableCell>{invoice?.car_id?.car_company}</TableCell>
                    <TableCell>{invoice?.car_id?.car_index_id}</TableCell>
                    <TableCell>{invoice?.created_by?.name}</TableCell>
                    <TableCell>{invoice?.updated_by?.name}</TableCell>
                    <TableCell>{formatDate(invoice?.createdAt)}</TableCell>
                    <TableCell>{formatDate(invoice?.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => {
                            handleViewInvoice(invoice.pdf_url);
                          }}
                          variant="ghost"
                          size="icon"
                          title="View invoice details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {/* <Button
                          onClick={() => {
                          }}
                          variant="ghost"
                          size="icon"
                          title="Edit invoice"
                        > 
                          <SquarePen className="h-4 w-4" />
                        </Button> */}
                        {/* <Button
                          onClick={() => handleDownloadInvoice(invoice.pdf_url)}
                          variant="ghost"
                          size="icon"
                          title="Download invoice"
                        >
                          <Download className="h-4 w-4" />
                        </Button> */}
                        <Button
                          onClick={() => handleDeleteClick(invoice)}
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete invoice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the invoice{" "}
              <strong>{invoiceToDelete?.invoice_index_id}</strong>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
