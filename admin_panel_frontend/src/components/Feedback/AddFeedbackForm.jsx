// AddFeedbackForm.jsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Star, User } from "lucide-react";
import { toast } from "sonner";
import { createOrUpdateFeedback, getFeedback } from "@/services/feedback/feedbackServices";

export function AddFeedbackForm({ open, onOpenChange, onFeedbackCreated, feedbackId }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control
  } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (open && feedbackId) {
      setIsEditing(true);
      // Fetch feedback data for editing
      const fetchFeedbackData = async () => {
        try {
          const response = await getFeedback(feedbackId);
          if (response && response.data && response.data.status) {
            const feedback = response.data.data;
            setValue("CustomerName", feedback.CustomerName);
            setValue("Testimonial", feedback.Testimonial);
            setValue("Status", feedback.Status);
            setRating(feedback.rating);
          } else {
            toast.error("Failed to fetch testimonial data");
          }
        } catch (error) {
          console.error("Error fetching feedback:", error);
          toast.error("Failed to fetch testimonial data");
        }
      };
      
      fetchFeedbackData();
    } else if (open) {
      // Reset for new feedback creation
      reset();
      setRating(0);
      setIsEditing(false);
    }
  }, [open, feedbackId, setValue, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = {
        feedback_id: feedbackId || null,
        CustomerName: data.CustomerName,
        Testimonial: data.Testimonial,
        rating: rating,
        Status: data.Status
      };

      const response = await createOrUpdateFeedback(formData);
      
      if (response && response.data && response.data.status) {
        toast.success(
          isEditing ? "Testimonial updated successfully!" : "Testimonial added successfully!"
        );
        if (onFeedbackCreated) {
          onFeedbackCreated();
        }
        onOpenChange(false);
        reset();
        setRating(0);
      } else {
        toast.error(response?.data?.message || "Failed to save testimonial");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset();
    setRating(0);
  };

  const handleRatingClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <DialogContent className="max-w-3xl bg-cardBg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-text">
            {isEditing ? "Edit Testimonial" : "Add New Testimonial"}
          </DialogTitle>
          <DialogDescription className="text-text">
            {isEditing
              ? "Edit the customer testimonial details."
              : "Add a new customer testimonial."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User className="h-5 w-5" /> Customer Details
            </h3>
            
            <div className="space-y-2">
              <Label className="text-text" htmlFor="CustomerName">
                Customer Name *
              </Label>
              <Input
                id="CustomerName"
                {...register("CustomerName", { required: "Customer name is required" })}
                placeholder="Enter customer name"
                className="text-text bg-cardBg border-border"
              />
              {errors.CustomerName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.CustomerName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-text" htmlFor="Testimonial">
                Testimonial *
              </Label>
              <Textarea
                id="Testimonial"
                {...register("Testimonial", { required: "Testimonial is required" })}
                placeholder="What did the customer say about their experience?"
                className="text-text bg-cardBg border-border min-h-[100px]"
              />
              {errors.Testimonial && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Testimonial.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-text">Rating *</Label>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-8 w-8 cursor-pointer ${
                      i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => handleRatingClick(i)}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({rating}/5)
                </span>
              </div>
              <input type="hidden" {...register("rating", { value: rating })} />
            </div>

            <div className="space-y-2">
              <Label className="text-text" htmlFor="status">
                Status
              </Label>
              <Controller
                name="Status"
                control={control}
                defaultValue="draft"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="text-text bg-cardBg border-border">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
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
                ? "Update Testimonial"
                : "Add Testimonial"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}