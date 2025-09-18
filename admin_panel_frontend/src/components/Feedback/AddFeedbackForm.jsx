// AddFeedbackForm.jsx (updated image part)
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Star, User } from "lucide-react";
import { toast } from "sonner";
import { createOrUpdateFeedback, getFeedback } from "@/services/feedback/feedbackServices";

export function AddFeedbackForm({ open, onOpenChange, onFeedbackCreated, feedbackId }) {
  const { register, handleSubmit, setValue, reset, control } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [imageFile, setImageFile] = useState(null); // ✅ store selected image
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (open && feedbackId) {
      setIsEditing(true);
      const fetchFeedbackData = async () => {
        try {
          const response = await getFeedback(feedbackId);
          if (response?.data?.status) {
            const feedback = response.data.data;
            setValue("CustomerName", feedback.CustomerName);
            setValue("Testimonial", feedback.Testimonial);
            setValue("Status", feedback.Status);
            setRating(feedback.rating);
            setPreviewUrl(feedback.image); // show current image
          }
        } catch (error) {
          toast.error("Failed to fetch testimonial data");
        }
      };
      fetchFeedbackData();
    } else if (open) {
      reset();
      setRating(0);
      setImageFile(null);
      setPreviewUrl(null);
      setIsEditing(false);
    }
  }, [open, feedbackId, setValue, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("feedback_id", feedbackId || "");
      formData.append("CustomerName", data.CustomerName);
      formData.append("Testimonial", data.Testimonial);
      formData.append("Status", data.Status);
      formData.append("rating", rating);
      if (imageFile) formData.append("image", imageFile); // append image

      const response = await createOrUpdateFeedback(formData); // backend must handle FormData
      if (response?.data?.status) {
        toast.success(isEditing ? "Testimonial updated!" : "Testimonial added!");
        onFeedbackCreated();
        onOpenChange(false);
        reset();
        setRating(0);
        setImageFile(null);
        setPreviewUrl(null);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <DialogContent className="max-w-3xl bg-cardBg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Edit customer testimonial details." : "Add a new testimonial."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Details */}
          <div className="space-y-4">
            <Label>Customer Name *</Label>
            <Input {...register("CustomerName", { required: true })} placeholder="Enter customer name" />
          </div>

          {/* Testimonial */}
          <div className="space-y-4">
            <Label>Testimonial *</Label>
            <Textarea {...register("Testimonial", { required: true })} placeholder="Customer testimonial" />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-8 w-8 cursor-pointer ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  onClick={() => setRating(i + 1)}
                />
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              name="Status"
              control={control}
              defaultValue="draft"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
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

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Customer Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }}
            />
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="h-24 w-24 object-cover rounded-md mt-2" />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Processing..." : isEditing ? "Update" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
