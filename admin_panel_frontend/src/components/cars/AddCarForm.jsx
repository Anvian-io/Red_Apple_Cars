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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { getCar, createOrUpdateCar } from "@/services/cars/carsServices";
import { useRouter } from "next/navigation";

export function AddCarForm({ open, onOpenChange, onCarCreated, carId }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch,
  } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const status = watch("status");
  const websiteState = watch("website_state");

  useEffect(() => {
    if (open && carId) {
      setIsEditing(true);
      // Fetch car data for editing
      const fetchCarData = async () => {
        try {
          const response = await getCar(carId, router);
          if (response && response.data && response.data.status) {
            const car = response.data.data.car;
            setValue("name", car.name);
            setValue("description", car.description);
            setValue("car_company", car.car_company);
            setValue("real_price", car.real_price);
            setValue("actual_price", car.actual_price);
            setValue("status", car.status);
            setValue("website_state", car.website_state);
          } else {
            toast.error("Failed to fetch car data");
          }
        } catch (error) {
          console.error("Error fetching car:", error);
          toast.error("Failed to fetch car data");
        }
      };

      fetchCarData();
    } else if (open) {
      // Reset for new car creation
      reset({
        name: "",
        description: "",
        car_company: "",
        real_price: 0,
        actual_price: 0,
        status: true,
        website_state: true,
      });
      setIsEditing(false);
    }
  }, [open, carId, setValue, reset, router]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = {
        car_id: carId || null,
        name: data.name,
        description: data.description,
        car_company: data.car_company,
        real_price: data.real_price,
        actual_price: data.actual_price,
        status: data.status,
        website_state: data.website_state,
      };

      const response = await createOrUpdateCar(formData, router);

      if (response && response.data && response.data.status) {
        toast.success(
          isEditing ? "Car updated successfully!" : "Car added successfully!"
        );
        if (onCarCreated) {
          onCarCreated();
        }
        onOpenChange(false);
        reset();
      } else {
        toast.error(response?.data?.message || "Failed to save car");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save car");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <DialogContent className="max-w-2xl bg-cardBg max-h-[90vh] overflow-y-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-text" htmlFor="name">
                Car Name *
              </Label>
              <Input
                id="name"
                {...register("name", { required: "Car name is required" })}
                placeholder="Enter car name"
                className="text-text bg-cardBg border-border"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-text" htmlFor="car_company">
                Car Company *
              </Label>
              <Input
                id="car_company"
                {...register("car_company", {
                  required: "Car company is required",
                })}
                placeholder="Enter car company"
                className="text-text bg-cardBg border-border"
              />
              {errors.car_company && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.car_company.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-text" htmlFor="description">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter car description"
              className="text-text bg-cardBg border-border min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-text" htmlFor="real_price">
                Real Price *
              </Label>
              <Input
                id="real_price"
                type="number"
                step="0.01"
                {...register("real_price", {
                  required: "Real price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
                placeholder="Enter real price"
                className="text-text bg-cardBg border-border"
              />
              {errors.real_price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.real_price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-text" htmlFor="actual_price">
                Actual Price *
              </Label>
              <Input
                id="actual_price"
                type="number"
                step="0.01"
                {...register("actual_price", {
                  required: "Actual price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
                placeholder="Enter actual price"
                className="text-text bg-cardBg border-border"
              />
              {errors.actual_price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.actual_price.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={status}
                onCheckedChange={(checked) => setValue("status", checked)}
              />
              <Label htmlFor="status" className="text-text">
                Active Status
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="website_state"
                checked={websiteState}
                onCheckedChange={(checked) =>
                  setValue("website_state", checked)
                }
              />
              <Label htmlFor="website_state" className="text-text">
                Visible on Website
              </Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              className="text-text"
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button className="text-text" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Processing..."
                : isEditing
                ? "Update Car"
                : "Add Car"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
