"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createOrUpdateCar } from "@/services/cars/carsServices";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RichTextEditor } from "..";
import Image from "next/image";
import { X, Upload, Plus } from "lucide-react";

export function AddCarForm({ open, onOpenChange, onCarCreated, carData }) {
  const methods = useForm({
    defaultValues: {
      name: "",
      description: "",
      car_company: "",
      real_price_bwp: 0,
      actual_price_bwp: 0,
      real_price_zmw: 0,
      actual_price_zmw: 0,
      status: "unsold",
      website_state: true,
      // Remove main_image and images from form state - we'll handle them separately
      details: {
        year: "",
        engine_type: "",
        engine_size: "",
        transmission: "",
        color: "",
        fuel: "",
        mileage: "",
        drive: "",
        option: "",
        location: "",
        condition: "",
        duty: "",
        stock_no: ""
      },
      moreInfo: {
        Tp: "",
        cost: "",
        duty: "",
        t_cost: "",
        exr: "",
        k_price: "",
        sold_price: "",
        discount: "",
        profit: "",
        comm: "",
        net_profit: "",
        sold_date: "",
        sold_by: "",
        customer_name: "",
        customer_address: "",
        customer_phone_no: ""
      }
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch
  } = methods;

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("car");
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const router = useRouter();

  const status = watch("status");
  const websiteState = watch("website_state");

  useEffect(() => {
    if (open && carData) {
      setIsEditing(true);
      // Set form values from the passed carData
      setValue("name", carData.name || "");
      setValue("description", carData.description || "");
      setValue("car_company", carData.car_company || "");
      setValue("real_price_bwp", carData.real_price_bwp || 0);
      setValue("actual_price_bwp", carData.actual_price_bwp || 0);
      setValue("real_price_zmw", carData.real_price_zmw || 0);
      setValue("actual_price_zmw", carData.actual_price_zmw || 0);
      setValue("status", carData.status || "unsold");
      setValue("website_state", carData.website_state || true);

      // Set images if they exist
      if (carData.main_image) {
        setMainImagePreview(carData.main_image);
      }

      if (carData.images && carData.images.length > 0) {
        setExistingImages(carData.images);
      }

      // Set details if they exist
      if (carData.details) {
        Object.keys(carData.details).forEach((key) => {
          setValue(`details.${key}`, carData.details[key] || "");
        });
      }

      // Set moreInfo if it exists
      if (carData.moreInfo) {
        Object.keys(carData.moreInfo).forEach((key) => {
          setValue(`moreInfo.${key}`, carData.moreInfo[key] || "");
        });
      }
    } else if (open) {
      // Reset for new car creation
      reset({
        name: "",
        description: "",
        car_company: "",
        real_price_bwp: 0,
        actual_price_bwp: 0,
        real_price_zmw: 0,
        actual_price_zmw: 0,
        status: "unsold",
        website_state: true,
        details: {
          year: "",
          engine_type: "",
          engine_size: "",
          transmission: "",
          color: "",
          fuel: "",
          mileage: "",
          drive: "",
          option: "",
          location: "",
          condition: "",
          duty: "",
          stock_no: ""
        },
        moreInfo: {
          Tp: "",
          cost: "",
          duty: "",
          t_cost: "",
          exr: "",
          k_price: "",
          sold_price: "",
          discount: "",
          profit: "",
          comm: "",
          net_profit: "",
          sold_date: "",
          sold_by: "",
          customer_name: "",
          customer_address: "",
          customer_phone_no: ""
        }
      });
      setMainImageFile(null);
      setMainImagePreview(null);
      setAdditionalImageFiles([]);
      setAdditionalImagePreviews([]);
      setExistingImages([]);
      setIsEditing(false);
      setActiveTab("car");
    }
  }, [open, carData, setValue, reset]);

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMainImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = [...additionalImageFiles];
      const newPreviews = [...additionalImagePreviews];

      files.forEach((file) => {
        newFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          setAdditionalImagePreviews([...newPreviews]);
        };
        reader.readAsDataURL(file);
      });

      setAdditionalImageFiles(newFiles);
    }
  };

  const removeAdditionalImage = (index) => {
    const newFiles = [...additionalImageFiles];
    const newPreviews = [...additionalImagePreviews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setAdditionalImageFiles(newFiles);
    setAdditionalImagePreviews(newPreviews);
  };

  const removeExistingImage = (index) => {
    const newImages = [...existingImages];
    newImages.splice(index, 1);
    setExistingImages(newImages);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Create FormData object
      const formData = new FormData();

      // Append all non-file fields
      if (carData?._id) {
        formData.append("car_id", carData._id);
      }

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("car_company", data.car_company);
      formData.append("real_price_bwp", data.real_price_bwp);
      formData.append("actual_price_bwp", data.actual_price_bwp);
      formData.append("real_price_zmw", data.real_price_zmw);
      formData.append("actual_price_zmw", data.actual_price_zmw);
      formData.append("status", data.status === (true || false) ? "unsold" : data.status);
      formData.append("website_state", data.website_state);

      // Append details
      Object.keys(data.details).forEach((key) => {
        formData.append(key, data.details[key]);
      });

      // Append moreInfo
      Object.keys(data.moreInfo).forEach((key) => {
        // Handle special case for duty field in moreInfo to avoid conflict with details.duty
        if (key === "duty") {
          formData.append("duty_more", data.moreInfo[key]);
        } else {
          formData.append(key, data.moreInfo[key]);
        }
      });

      // Append main image if selected
      if (mainImageFile) {
        formData.append("main_image", mainImageFile);
      }

      // Append additional images
      additionalImageFiles.forEach((file) => {
        formData.append("other_images", file);
      });

      // Call the API with FormData
      const response = await createOrUpdateCar(formData, router);

      if (response && response.data && response.data.status) {
        toast.success(isEditing ? "Car updated successfully!" : "Car added successfully!");
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
    setMainImageFile(null);
    setMainImagePreview(null);
    setAdditionalImageFiles([]);
    setAdditionalImagePreviews([]);
    setExistingImages([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-text sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-cardBg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Car" : "Add New Car"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the car information below."
              : "Fill in the details to add a new car to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="car">Car Information</TabsTrigger>
              <TabsTrigger value="details">Car Details</TabsTrigger>
              <TabsTrigger value="moreInfo">More Information</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TabsContent value="car" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Car Name</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="name"
                      {...register("name", { required: "Car name is required" })}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="car_company">Brand/Company</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="car_company"
                      {...register("car_company", {
                        required: "Car company is required"
                      })}
                    />
                    {errors.car_company && (
                      <p className="text-sm text-red-500">{errors.car_company.message}</p>
                    )}
                  </div>
                </div>

                <RichTextEditor name="description" label="Description" />

                {/* Main Image Upload */}
                <div className="space-y-2">
                  <Label>Main Image</Label>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="main_image"
                      className="flex flex-col items-center justify-center w-56 h-40 border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-accent/10 transition-colors"
                    >
                      {mainImagePreview ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={mainImagePreview}
                            alt="Main car image"
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Upload</span>
                        </div>
                      )}
                      <input
                        id="main_image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleMainImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Additional Images Upload */}
                <div className="space-y-2">
                  <Label>Additional Images</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Existing images */}
                    {existingImages.map((image, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <div className="w-full h-32 relative rounded-md overflow-hidden">
                          <Image
                            src={image.image_url || image}
                            alt={`Existing image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeExistingImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {/* New image previews */}
                    {additionalImagePreviews.map((preview, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <div className="w-full h-32 relative rounded-md overflow-hidden">
                          <Image
                            src={preview}
                            alt={`Additional image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeAdditionalImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <label
                      htmlFor="images"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center p-4">
                        <Plus className="w-8 h-8 mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Add Image</span>
                      </div>
                      <input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleAdditionalImagesUpload}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="real_price_bwp">Real Price (Botswana)</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="real_price_bwp"
                      type="number"
                      {...register("real_price_bwp", {
                        required: "Real price is required",
                        min: { value: 0, message: "Price must be positive" }
                      })}
                    />
                    {errors.real_price_bwp && (
                      <p className="text-sm text-red-500">{errors.real_price_bwp.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="actual_price_bwp">Actual Price (Botswana)</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="actual_price_bwp"
                      type="number"
                      {...register("actual_price_bwp", {
                        required: "Actual price is required",
                        min: { value: 0, message: "Price must be positive" }
                      })}
                    />
                    {errors.actual_price_bwp && (
                      <p className="text-sm text-red-500">{errors.actual_price_bwp.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="real_price_zmw">Real Price (Zambia)</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="real_price_zmw"
                      type="number"
                      {...register("real_price_zmw", {
                        required: "Real price is required",
                        min: { value: 0, message: "Price must be positive" }
                      })}
                    />
                    {errors.real_price_zmw && (
                      <p className="text-sm text-red-500">{errors.real_price_zmw.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="actual_price_zmw">Actual Price (Zambia)</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="actual_price_zmw"
                      type="number"
                      {...register("actual_price_zmw", {
                        required: "Actual price is required",
                        min: { value: 0, message: "Price must be positive" }
                      })}
                    />
                    {errors.actual_price_zmw && (
                      <p className="text-sm text-red-500">{errors.actual_price_zmw.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <p>Car Status</p>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          disabled
                          className="border rounded p-1 bg-gray-100 cursor-not-allowed"
                        >
                          <option value="unsold">Unsold</option>
                          <option value="sold">Sold</option>
                          <option value="pending">Pending</option>
                        </select>
                      )}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Controller
                      name="website_state"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="website_state"
                        />
                      )}
                    />
                    <Label htmlFor="website_state">
                      Website: {websiteState ? "Visible" : "Hidden"}
                    </Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="year"
                      {...register("details.year")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="engine_type">Engine Type</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="engine_type"
                      {...register("details.engine_type")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="engine_size">Engine Size</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="engine_size"
                      {...register("details.engine_size")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="transmission"
                      {...register("details.transmission")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="color"
                      {...register("details.color")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuel">Fuel</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="fuel"
                      {...register("details.fuel")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="mileage"
                      {...register("details.mileage")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="drive">Drive</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="drive"
                      {...register("details.drive")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="option">Option</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="option"
                      {...register("details.option")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="location"
                      {...register("details.location")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="condition"
                      {...register("details.condition")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duty">Duty</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="duty"
                      {...register("details.duty")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock_no">Stock No</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="stock_no"
                      {...register("details.stock_no")}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="moreInfo" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="Tp">TP</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="Tp"
                      {...register("moreInfo.Tp")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="cost"
                      {...register("moreInfo.cost")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duty">Duty</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="duty"
                      {...register("moreInfo.duty")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="t_cost">Total Cost</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="t_cost"
                      {...register("moreInfo.t_cost")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exr">Exchange Rate</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="exr"
                      {...register("moreInfo.exr")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="k_price">K Price</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="k_price"
                      {...register("moreInfo.k_price")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sold_price">Sold Price</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="sold_price"
                      {...register("moreInfo.sold_price")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="discount"
                      {...register("moreInfo.discount")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profit">Profit</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="profit"
                      {...register("moreInfo.profit")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comm">Commission</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="comm"
                      {...register("moreInfo.comm")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="net_profit">Net Profit</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="net_profit"
                      {...register("moreInfo.net_profit")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sold_date">Sold Date</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="sold_date"
                      type="date"
                      {...register("moreInfo.sold_date")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sold_by">Sold By</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="sold_by"
                      {...register("moreInfo.sold_by")}
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="customer_name">Customer Name</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="customer_name"
                      {...register("moreInfo.customer_name")}
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="customer_address">Customer Address</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="customer_address"
                      {...register("moreInfo.customer_address")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer_phone_no">Customer Phone</Label>
                    <Input
                      className="border-border focus:outline-none focus:ring-0 focus:border-border"
                      id="customer_phone_no"
                      {...register("moreInfo.customer_phone_no")}
                    />
                  </div>
                </div>
              </TabsContent>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : isEditing ? "Update Car" : "Add Car"}
                </Button>
              </div>
            </form>
          </Tabs>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
