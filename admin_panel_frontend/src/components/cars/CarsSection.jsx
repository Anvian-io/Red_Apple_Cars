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
import { SquarePen, Trash2, Eye, Car, File } from "lucide-react";
import { Button } from "../ui/button";
import { CustomPagination } from "..";
import { Badge } from "../ui/badge";
import { AddCarForm } from "./AddCarForm";
import { getAllCars, deleteCar } from "@/services/cars/carsServices";
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
import Image from "next/image";
import { CompanyInvoice } from "../invoices/CompanyInvoice";

export function CarSection({ isExpanded }) {
  const [addOrUpdateCar, setAddOrUpdateCar] = useState(false);
  const [currentCarId, setCurrentCarId] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [carToView, setCarToView] = useState(null);
  const router = useRouter();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCars = useCallback(async () => {
    try {
      setIsSearching(isInitial === false);
      const payload = {
        search: debouncedSearchTerm,
        limit: itemsPerPage,
        page: currentPage,
      };
      const response = await getAllCars(payload, router);
      if (response.data.status) {
        setCars(response.data.data.cars);
        const pagination_data = response.data.data.pagination;
        setItemsPerPage(pagination_data.itemsPerPage);
        setTotalCars(pagination_data.totalCars);
        setCurrentPage(pagination_data.currentPage);
        setTotalPages(pagination_data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error("Failed to fetch cars");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, currentPage, itemsPerPage, router]);

  useEffect(() => {
    setLoading(isInitial === true);
    fetchCars();
    setIsInitial(false);
  }, [fetchCars]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleEditCar = (carId) => {
    setCurrentCarId(carId);
    setAddOrUpdateCar(true);
  };

  const handleAddCar = () => {
    setCurrentCarId(null);
    setAddOrUpdateCar(true);
  };

  const handleViewCar = (car) => {
    setCarToView(car);
    setViewDialogOpen(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (car) => {
    setCarToDelete(car);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteCar(carToDelete._id, router);
      if (response.data.status) {
        toast.success("Car deleted successfully");
        fetchCars(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to delete car");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error("Failed to delete car");
    } finally {
      setDeleteDialogOpen(false);
      setCarToDelete(null);
    }
  };

  const skeletonRows = Array.from({ length: itemsPerPage }, (_, i) => (
    <TableRow key={i}>
      <TableCell>
        <Skeleton className="h-4 w-32 bg-border" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-48 bg-border" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32 bg-border" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-20 bg-border mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-20 bg-border mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-20 bg-border mx-auto" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-8 bg-border" />
          <Skeleton className="h-8 w-8 bg-border" />
          <Skeleton className="h-8 w-8 bg-border" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24 bg-border" />
      </TableCell>
    </TableRow>
  ));

  return (
    <div className="w-full h-full">
      {isSearching && <SearchLoader />}
      <SecondaryHeader
        title="Cars"
        searchPlaceholder="Search Cars"
        buttonText="Add New Car"
        tooltipText="Add New Car"
        onButtonClick={handleAddCar}
        onMobileButtonClick={handleAddCar}
        onSearch={handleSearch}
      />
      <div className="px-1 flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          {loading ? (
            <Skeleton className="h-5 w-40 bg-border rounded-md" />
          ) : totalCars > 0 ? (
            <Badge className="bg-hoverBg">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalCars)} of {totalCars}{" "}
              Cars
            </Badge>
          ) : (
            <Badge className="bg-hoverBg">No Cars Found</Badge>
          )}
        </div>
      </div>

      <div className="mx-1 mt-6 rounded-md max-w-[99vw] border overflow-x-auto bg-tableBg">
        <Table className="min-w-[800px] lg:min-w-full">
          <TableCaption className="mb-2">A list of available cars</TableCaption>
          <TableHeader className="bg-hoverBg">
            <TableRow>
              <TableHead className="w-[150px]">Car Name</TableHead>
              <TableHead className="w-[200px]">Company</TableHead>
              <TableHead className="w-[250px]">Description</TableHead>
              <TableHead className="w-[120px] text-center">
                Real Price
              </TableHead>
              <TableHead className="w-[120px] text-center">
                Actual Price
              </TableHead>
              <TableHead className="w-[120px] text-center">
                Invoice
              </TableHead>
              <TableHead className="w-[100px] text-center">Status</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
              <TableHead className="w-[150px]">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? skeletonRows
              : cars.map((car) => (
                  <TableRow key={car?._id}>
                    <TableCell className="font-medium">{car?.name}</TableCell>
                    <TableCell>{car?.car_company}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {car?.description?.length > 50
                        ? `${car.description.substring(0, 50)}...`
                        : car?.description || "No description"}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatPrice(car?.real_price)}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatPrice(car?.actual_price)}
                    </TableCell>
                    <TableCell className="text-center">
                      <CompanyInvoice/>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={car?.status ? "bg-green-500" : "bg-red-500"}
                      >
                        {car?.status ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleViewCar(car)}
                          variant="ghost"
                          size="icon"
                          title="View car details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleEditCar(car._id)}
                          variant="ghost"
                          size="icon"
                          title="Edit car"
                        >
                          <SquarePen className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(car)}
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete car"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(car?.updatedAt)}</TableCell>
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
      {addOrUpdateCar && (
        <AddCarForm
          open={addOrUpdateCar}
          onOpenChange={setAddOrUpdateCar}
          onCarCreated={fetchCars}
          carId={currentCarId}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the car{" "}
              <strong>{carToDelete?.name}</strong>? This action cannot be
              undone.
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

      {/* View Car Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Car Details</DialogTitle>
            <DialogDescription>
              Detailed information about {carToView?.name}
            </DialogDescription>
          </DialogHeader>
          {carToView && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                {carToView.main_image ? (
                  <Image
                    src={carToView.main_image}
                    alt={carToView.name}
                    width={300}
                    height={200}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-64 h-40 bg-muted rounded-md">
                    <Car className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <h3 className="text-xl font-bold mt-4">{carToView.name}</h3>
                <p className="text-muted-foreground">{carToView.car_company}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {carToView.description || "No description available"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h4 className="font-semibold">Real Price</h4>
                    <p className="text-sm">
                      {formatPrice(carToView.real_price)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Actual Price</h4>
                    <p className="text-sm">
                      {formatPrice(carToView.actual_price)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h4 className="font-semibold">Status</h4>
                    <Badge
                      className={
                        carToView.status ? "bg-green-500" : "bg-red-500"
                      }
                    >
                      {carToView.status ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold">Website State</h4>
                    <Badge
                      className={
                        carToView.website_state ? "bg-green-500" : "bg-red-500"
                      }
                    >
                      {carToView.website_state ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Car ID</h4>
                  <p className="text-sm font-mono">{carToView.car_index_id}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Last Updated</h4>
                  <p className="text-sm">{formatDate(carToView.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
