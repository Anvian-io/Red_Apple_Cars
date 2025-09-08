"use client";

import React, { useState } from "react";
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
import { Badge } from "../ui/badge";
import { AddCarForm } from "./AddCarForm";
import { getAllCars,deleteCar } from "@/services/cars/carsServices";

export function CarSection() {
  const [addOrUpdateCar, setAddOrUpdateCar] = useState(false);
  const [currentCarId, setCurrentCarId] = useState(null);

  const cars = []; // 🔹 empty for now (frontend only)

  const handleAddCar = () => {
    setCurrentCarId(null);
    setAddOrUpdateCar(true);
  };

  const handleEditCar = (carId) => {
    setCurrentCarId(carId);
    setAddOrUpdateCar(true);
  };

  return (
    <div className="w-full h-full">
      {/* 🔹 Header */}
      <SecondaryHeader
        title="Cars"
        searchPlaceholder="Search Cars"
        buttonText="Add New Car"
        tooltipText="Add New Car"
        onButtonClick={handleAddCar}
        onMobileButtonClick={handleAddCar}
        onSearch={() => {}}
      />

      {/* 🔹 Badge */}
      <div className="px-1 flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          {cars.length > 0 ? (
            <Badge className="bg-hoverBg">Showing {cars.length} Cars</Badge>
          ) : (
            <Badge className="bg-hoverBg">No Cars Found</Badge>
          )}
        </div>
      </div>

      {/* 🔹 Table */}
      <div className="mx-1 mt-6 rounded-md max-w-[99vw] border overflow-x-auto bg-tableBg">
        <Table className="min-w-[800px] lg:min-w-full">
          <TableHeader className="bg-hoverBg">
            <TableRow>
              <TableHead className="w-[200px]">Car Name</TableHead>
              <TableHead className="w-[300px]">Model</TableHead>
              <TableHead className="w-[100px] text-center">Year</TableHead>
              <TableHead className="w-[120px] text-center">Price</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
              <TableHead className="w-[150px]">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.map((car) => (
              <TableRow key={car?._id}>
                <TableCell className="font-medium">{car?.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {car?.model ?? "No model"}
                </TableCell>
                <TableCell className="text-center">{car?.year}</TableCell>
                <TableCell className="text-center">{car?.price}</TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => handleEditCar(car._id)}
                    variant="ghost"
                    size="icon"
                  >
                    <SquarePen className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>{car?.updatedAt ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption className="mb-2">A list of available cars</TableCaption>
        </Table>
      </div>

      {/* 🔹 Add/Edit Form */}
      {addOrUpdateCar && (
        <AddCarForm
          open={addOrUpdateCar}
          onOpenChange={setAddOrUpdateCar}
          onCarCreated={() => {}}
          carId={currentCarId}
        />
      )}
    </div>
  );
}
