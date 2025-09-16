"use client";
import DOMPurify from "dompurify";
import React, { useState, useEffect, useCallback } from "react";
import { SecondaryHeader } from "..";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  SquarePen,
  Trash2,
  Eye,
  Car,
  FileText,
  Info,
  Filter,
  Columns,
  ChevronDown
} from "lucide-react";
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
  DialogFooter
} from "@/components/ui/dialog";
import Image from "next/image";
import { CompanyInvoice } from "../invoices/CompanyInvoice";
import { CarInfoPic } from "./CarInfoPic";
import { CarDetailsDialog } from "./CarDetailsDialog";
import { CarMoreInfoDialog } from "./CarMoreInfoDialog";
import { CrudDetailsHoverCard } from "..";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Column Visibility Component
function ColumnVisibility({ columnVisibility, setColumnVisibility }) {
  const [open, setOpen] = useState(false);

  const columns = [
    { id: "sr", label: "SR", defaultVisible: true },
    { id: "id", label: "ID", defaultVisible: true },
    { id: "name", label: "Name", defaultVisible: true },
    { id: "description", label: "Description", defaultVisible: true },
    { id: "brand", label: "Brand", defaultVisible: true },
    { id: "realPriceBWP", label: "Real Price (BWP)", defaultVisible: true },
    { id: "actualPriceBWP", label: "Actual Price (BWP)", defaultVisible: true },
    { id: "realPriceZMW", label: "Real Price (ZMW)", defaultVisible: true },
    { id: "actualPriceZMW", label: "Actual Price (ZMW)", defaultVisible: true },
    { id: "mainImage", label: "Main Image", defaultVisible: true },
    { id: "otherImages", label: "Other Images", defaultVisible: true },
    { id: "invoice", label: "Invoice", defaultVisible: true },
    { id: "carInfoImg", label: "Car Info Img", defaultVisible: true },
    { id: "carDetails", label: "Car Details", defaultVisible: true },
    { id: "moreInfo", label: "More Info", defaultVisible: true },
    { id: "carStatus", label: "Car Status", defaultVisible: true },
    { id: "websiteState", label: "Website State", defaultVisible: true },
    { id: "history", label: "History", defaultVisible: true },
    { id: "actions", label: "Actions", defaultVisible: true }
  ];

  return (
    <div className="duration-500">
      {/* Header */}
      <div
        className="flex items-center justify-between w-full bg-hoverBg rounded-t-md px-5 py-3 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <Columns className="h-5 w-5" />
          Show columns
        </div>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Collapsible Body */}
      {open && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-tableBg rounded-b-md">
          {columns.map((column) => (
            <div key={column.id} className="flex items-center space-x-2">
              <Switch
                id={column.id}
                checked={columnVisibility[column.id]}
                onCheckedChange={(checked) =>
                  setColumnVisibility({
                    ...columnVisibility,
                    [column.id]: checked
                  })
                }
              />
              <Label htmlFor={column.id}>{column.label}</Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Filters Component
function Filters({ filters, setFilters, applyFilters }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="duration-500">
      {/* Header */}
      <div
        className="flex items-center justify-between w-full bg-hoverBg rounded-t-md px-5 py-3 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-1">
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Collapsible Body */}
      {open && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-tableBg rounded-b-md">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Search by name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              placeholder="Search by brand"
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="unsold">Un Sold</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="websiteState">Website State</Label>
            <Select
              value={filters.websiteState}
              onValueChange={(value) => setFilters({ ...filters, websiteState: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={applyFilters} className="w-full">
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function CarSection({ isExpanded }) {
  const [addOrUpdateCar, setAddOrUpdateCar] = useState(false);
  const [currentCarData, setCurrentCarData] = useState(null);
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
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [moreInfoDialogOpen, setMoreInfoDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState({
    sr: true,
    id: true,
    name: true,
    description: true,
    brand: true,
    realPriceBWP: true,
    actualPriceBWP: true,
    realPriceZMW: true,
    actualPriceZMW: true,
    mainImage: true,
    otherImages: true,
    invoice: true,
    carInfoImg: true,
    carDetails: true,
    moreInfo: true,
    carStatus: true,
    websiteState: true,
    history: true,
    actions: true
  });
  const [filters, setFilters] = useState({
    name: "",
    brand: "",
    status: "all",
    websiteState: "all"
  });
  const router = useRouter();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCars = useCallback(async () => {
    try {
      setIsSearching(isInitial === false);
      const payload = {
        search: debouncedSearchTerm,
        limit: itemsPerPage,
        page: currentPage,
        ...(filters.name && { name: filters.name }),
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.websiteState !== "all" && { website_state: filters.websiteState === "active" })
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
  }, [debouncedSearchTerm, currentPage, itemsPerPage, router, filters]);

  useEffect(() => {
    setLoading(isInitial === true);
    fetchCars();
    setIsInitial(false);
  }, [fetchCars]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchCars();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "symbol"
    }).format(price);
  };

  const handleEditCar = (carId) => {
    const carToEdit = cars.find((car) => car._id === carId);
    setCurrentCarData(carToEdit);
    setAddOrUpdateCar(true);
  };

  const handleAddCar = () => {
    setCurrentCarData(null);
    setAddOrUpdateCar(true);
  };

  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setDetailsDialogOpen(true);
  };

  const handleViewMoreInfo = (car) => {
    setSelectedCar(car);
    setMoreInfoDialogOpen(true);
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
        fetchCars();
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
      <TableCell className="text-center">
        <Skeleton className="h-4 w-20 bg-border mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-8 w-8 bg-border mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-8 w-8 bg-border mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-8 w-8 bg-border mx-auto" />
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

      {/* Show Columns Toggle */}
      <div className="flex justify-between items-center mt-4 px-1">
        <div className="flex items-center gap-4">
          {loading ? (
            <Skeleton className="h-5 w-40 bg-border rounded-md" />
          ) : totalCars > 0 ? (
            <Badge className="bg-hoverBg">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalCars)} of {totalCars} Cars
            </Badge>
          ) : (
            <Badge className="bg-hoverBg">No Cars Found</Badge>
          )}
        </div>

        {/* <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Columns className="h-4 w-4" />
            Show Columns
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div> */}
      </div>

      {/* Column Visibility Section */}
      {/* {showColumns && ( */}
        <div className="mt-4 px-1">
          <ColumnVisibility
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
        </div>
      {/* )} */}

      {/* Filters Section */}
      {/* {showFilters && ( */}
        <div className="mt-4 px-1">
          <Filters filters={filters} setFilters={setFilters} applyFilters={applyFilters} />
        </div>
      {/* )} */}

      <div className="mx-1 mt-6 rounded-md max-w-[94.5vw] border overflow-x-auto bg-tableBg">
        <Table className="min-w-[800px] lg:min-w-full">
          <TableCaption className="mb-2">A list of available cars</TableCaption>
          <TableHeader className="bg-hoverBg">
            <TableRow>
              {columnVisibility.sr && <TableHead className="w-[50px]">SR</TableHead>}
              {columnVisibility.id && <TableHead className="w-[80px]">ID</TableHead>}
              {columnVisibility.name && <TableHead className="min-w-[100px]">Name</TableHead>}
              {columnVisibility.description && (
                <TableHead className="min-w-[250px]">Description</TableHead>
              )}
              {columnVisibility.brand && <TableHead className="min-w-[100px]">Brand</TableHead>}
              {columnVisibility.realPriceBWP && (
                <TableHead className="min-w-[120px] text-center">Real Price (BWP)</TableHead>
              )}
              {columnVisibility.actualPriceBWP && (
                <TableHead className="min-w-[120px] text-center">Actual Price (BWP)</TableHead>
              )}
              {columnVisibility.realPriceZMW && (
                <TableHead className="min-w-[120px] text-center">Real Price (ZMW)</TableHead>
              )}
              {columnVisibility.actualPriceZMW && (
                <TableHead className="min-w-[120px] text-center">Actual Price (ZMW)</TableHead>
              )}
              {columnVisibility.mainImage && (
                <TableHead className="min-w-[150px] text-center">Main Image</TableHead>
              )}
              {columnVisibility.otherImages && (
                <TableHead className="min-w-[250px] text-center">Other Images</TableHead>
              )}
              {columnVisibility.invoice && (
                <TableHead className="min-w-[120px] text-center">Invoice</TableHead>
              )}
              {columnVisibility.carInfoImg && (
                <TableHead className="min-w-[120px] text-center">Car Info Img</TableHead>
              )}
              {columnVisibility.carDetails && (
                <TableHead className="min-w-[120px] text-center">Car Details</TableHead>
              )}
              {columnVisibility.moreInfo && (
                <TableHead className="min-w-[120px] text-center">More Info</TableHead>
              )}
              {columnVisibility.carStatus && (
                <TableHead className="min-w-[120px] text-center">Car Status</TableHead>
              )}
              {columnVisibility.websiteState && (
                <TableHead className="min-w-[150px] text-center">Website State</TableHead>
              )}
              {columnVisibility.history && (
                <TableHead className="min-w-[180px] text-center">History</TableHead>
              )}
              {columnVisibility.actions && (
                <TableHead className="min-w-[120px] text-center">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? skeletonRows
              : cars.map((car, index) => (
                  <TableRow key={car?._id} className="hover:bg-hoverBg/50">
                    {columnVisibility.sr && (
                      <TableCell className="font-medium">{index + 1}</TableCell>
                    )}
                    {columnVisibility.id && <TableCell>{car?.car_index_id}</TableCell>}
                    {columnVisibility.name && <TableCell>{car?.name}</TableCell>}
                    {columnVisibility.description && (
                      <TableCell className="text-muted-foreground">
                        <div
                          className="h-24 overflow-y-auto prose prose-sm"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(car?.description) }}
                        />
                      </TableCell>
                    )}
                    {columnVisibility.brand && (
                      <TableCell className="text-center">{car?.car_company}</TableCell>
                    )}
                    {columnVisibility.realPriceBWP && (
                      <TableCell className="text-center">
                        {formatPrice(car?.real_price_bwp, "BWP")}
                      </TableCell>
                    )}
                    {columnVisibility.actualPriceBWP && (
                      <TableCell className="text-center">
                        {formatPrice(car?.actual_price_bwp, "BWP")}
                      </TableCell>
                    )}
                    {columnVisibility.realPriceZMW && (
                      <TableCell className="text-center">
                        {formatPrice(car?.real_price_zmw, "ZMW")}
                      </TableCell>
                    )}
                    {columnVisibility.actualPriceZMW && (
                      <TableCell className="text-center">
                        {formatPrice(car?.actual_price_zmw, "ZMW")}
                      </TableCell>
                    )}
                    {columnVisibility.mainImage && (
                      <TableCell className="text-center">
                        {car?.main_image ? (
                          <Image
                            src={car.main_image}
                            alt="Main"
                            width={50}
                            height={50}
                            className="mx-auto rounded w-28 h-20"
                          />
                        ) : (
                          "No image"
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.otherImages && (
                      <TableCell className="text-center w-full">
                        {car?.images && car.images.length > 0 ? (
                          <div className="flex overflow-x-auto gap-1">
                            {car.images.map((img, idx) => (
                              <Image
                                key={idx}
                                src={img.image_url}
                                alt={`Other ${idx + 1}`}
                                width={50}
                                height={50}
                                className="rounded w-28 h-20"
                              />
                            ))}
                            {car.images.length > 3 && (
                              <Badge variant="secondary">+{car.images.length - 3}</Badge>
                            )}
                          </div>
                        ) : (
                          "No images"
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.invoice && (
                      <TableCell className="text-center">
                        <CompanyInvoice car={car} />
                      </TableCell>
                    )}
                    {columnVisibility.carInfoImg && (
                      <TableCell className="text-center">
                        <CarInfoPic car={car} />
                      </TableCell>
                    )}
                    {columnVisibility.carDetails && (
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(car)}
                          title="View car details"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                    {columnVisibility.moreInfo && (
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewMoreInfo(car)}
                          title="View more information"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                    {columnVisibility.carStatus && (
                      <TableCell className="text-center">
                        <Badge
                          className={
                            car?.status == "sold"
                              ? "bg-green-100 text-green-700 border border-green-400"
                              : car.status == "unsold"
                              ? "bg-red-100 text-red-700 border border-red-400"
                              : "bg-yellow-50 text-yellow-600 border border-yellow-300"
                          }
                        >
                          {car?.status === "sold"
                            ? "Sold"
                            : car.status == "unsold"
                            ? "Un Sold"
                            : "Pending"}
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.websiteState && (
                      <TableCell className="text-center">
                        <Badge className={car?.website_state ? "bg-green-500" : "bg-red-500"}>
                          {car?.website_state ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.history && (
                      <TableCell>
                        <CrudDetailsHoverCard car={car}>View Details</CrudDetailsHoverCard>
                      </TableCell>
                    )}
                    {columnVisibility.actions && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
                    )}
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
          carData={currentCarData}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the car <strong>{carToDelete?.name}</strong>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Car Details Dialog */}
      <CarDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        car={selectedCar}
      />

      {/* Car More Info Dialog */}
      <CarMoreInfoDialog
        open={moreInfoDialogOpen}
        onOpenChange={setMoreInfoDialogOpen}
        car={selectedCar}
      />
    </div>
  );
}
