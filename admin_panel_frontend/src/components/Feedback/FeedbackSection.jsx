// FeedbackSection.jsx
"use client";
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
import { getAllFeedback, deleteFeedback } from "@/services/feedback/feedbackServices";
import { SquarePen, Trash2, User, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { CustomPagination } from "..";
import { Badge } from "../ui/badge";
import { AddFeedbackForm } from "./AddFeedbackForm";
import React, { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import SearchLoader from "@/components/custom_ui/SearchLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { CrudDetailsHoverCard } from "..";


export function FeedbackSection({ isExpanded }) {
  const [add_or_update_feedback, set_add_or_update_feedback] = useState(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchFeedbacks = useCallback(async () => {
    try {
      setIsSearching(isInitial === false);

      const response = await getAllFeedback({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm
      });

      console.log("API Response:", response);

      if (response && response.data && response.data.status) {
        // The feedbacks are in response.data.data
        setFeedbacks(response.data.data);
        setTotalFeedbacks(response.data.data.length);
        setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
      } else {
        // Fallback to empty array if API fails
        setFeedbacks([]);
        setTotalFeedbacks(0);
        setTotalPages(0);
        toast.error("Failed to fetch testimonials");
      }

      setLoading(false);
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      // Fallback to empty array
      setFeedbacks([]);
      setTotalFeedbacks(0);
      setTotalPages(0);
      setLoading(false);
      setIsSearching(false);
      toast.error("Failed to fetch testimonials");
    }
  }, [debouncedSearchTerm, currentPage, itemsPerPage, isInitial]);

  useEffect(() => {
    setLoading(isInitial === true);
    fetchFeedbacks();
    setIsInitial(false);
  }, [fetchFeedbacks]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEditFeedback = (feedbackId) => {
    setCurrentFeedbackId(feedbackId);
    set_add_or_update_feedback(true);
  };

  const handleAddFeedback = () => {
    setCurrentFeedbackId(null);
    set_add_or_update_feedback(true);
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      const response = await deleteFeedback(feedbackId);
      if (response && response.data && response.data.status) {
        toast.success("Testimonial deleted successfully");
        fetchFeedbacks(); // Refresh the list
      } else {
        toast.error("Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete testimonial");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
      </div>
    );
  };

  const skeletonRows = Array.from({ length: itemsPerPage }, (_, i) => (
    <TableRow key={i}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full bg-border" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-border" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-48 bg-border" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20 bg-border" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-24 bg-border" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24 bg-border" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
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
        title="Customer Testimonials"
        searchPlaceholder="Search testimonials..."
        buttonText="Add New Testimonial"
        tooltipText="Add New Testimonial"
        onButtonClick={handleAddFeedback}
        onMobileButtonClick={handleAddFeedback}
        onSearch={handleSearch}
      />
      <div className="px-1 flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          {loading ? (
            <Skeleton className="h-5 w-40 bg-border rounded-md" />
          ) : totalFeedbacks > 0 ? (
            <Badge className="bg-hoverBg">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalFeedbacks)} of{" "}
              {totalFeedbacks} Testimonials
            </Badge>
          ) : (
            <Badge className="bg-hoverBg">No Testimonials Found</Badge>
          )}
        </div>
      </div>

      <div className="mx-1 mt-6 rounded-md max-w-[99vw] border overflow-x-auto bg-tableBg">
        <Table className="min-w-[1000px] lg:min-w-full">
          <TableCaption className="mb-2">
            A list of customer testimonials
          </TableCaption>
          <TableHeader className="bg-hoverBg">
            <TableRow>
              <TableHead className="w-[120px]">Image</TableHead>
              <TableHead className="w-[200px]">Customer</TableHead>
              <TableHead className="w-[300px]">Testimonial</TableHead>
              <TableHead className="w-[120px]">Rating</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[150px]">History</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? skeletonRows
              : feedbacks.map((feedback) => (
                <TableRow key={feedback._id}>
                  <TableCell>
                    {feedback.image ? (
                      <Avatar className="h-28 w-28 rounded-none">
                        <AvatarImage src={feedback.image} alt={feedback.CustomerName} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {feedback.CustomerName}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="max-w-xs">
                    <div className="line-clamp-2">{feedback.Testimonial}</div>
                  </TableCell>
                  <TableCell>{renderRating(feedback.rating)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        feedback.Status === "published"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }
                    >
                      {feedback.Status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <CrudDetailsHoverCard car={feedback}/>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => handleEditFeedback(feedback._id)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <SquarePen className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteFeedback(feedback._id)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
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
      {add_or_update_feedback && (
        <AddFeedbackForm
          open={add_or_update_feedback}
          onOpenChange={set_add_or_update_feedback}
          onFeedbackCreated={fetchFeedbacks}
          feedbackId={currentFeedbackId}
        />
      )}
    </div>
  );
}