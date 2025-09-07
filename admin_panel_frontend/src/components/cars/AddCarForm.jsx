"use client";

import React from "react";
import { useForm } from "react-hook-form";
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

export function AddCarForm({ open, onOpenChange, onCarCreated, carId }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const isEditing = !!carId;

  const onSubmit = (data) => {
    console.log("Car data submitted:", data);
    if (onCarCreated) onCarCreated(data);
    onOpenChange(false);
    reset();
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <DialogContent className="max-w-lg bg-cardBg">
        <DialogHeader>
          <DialogTitle className="text-text">
            {isEditing ? "Edit Car" : "Add New Car"}
          </DialogTitle>
          <DialogDescription className="text-text">
            {isEditing
              ? "Update the car details below."
              : "Fill out the details to add a new car."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label className="text-text" htmlFor="carName">
              Car Name
            </Label>
            <Input
              id="carName"
              {...register("name", { required: "Car name is required" })}
              placeholder="Enter car name"
              className="text-text bg-cardBg border-border"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label className="text-text" htmlFor="model">
              Model
            </Label>
            <Input
              id="model"
              {...register("model")}
              placeholder="Enter car model"
              className="text-text bg-cardBg border-border"
            />
          </div>

          <div>
            <Label className="text-text" htmlFor="year">
              Year
            </Label>
            <Input
              id="year"
              type="number"
              {...register("year")}
              placeholder="Enter year"
              className="text-text bg-cardBg border-border"
            />
          </div>

          <div>
            <Label className="text-text" htmlFor="price">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              {...register("price")}
              placeholder="Enter price"
              className="text-text bg-cardBg border-border"
            />
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
              {isEditing ? "Update Car" : "Save Car"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
