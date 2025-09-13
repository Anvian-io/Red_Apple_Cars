"use client";

import React, { useState, useRef } from "react";
import { ImageIcon, Download, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "../ui/badge";
import { toPng } from "html-to-image";

export function CarInfoPic({ car }) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);

  const formatPrice = (price, currency) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
    }).format(price);
  };

  const handleDownloadImage = async (imageType = "png") => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "#ffffff",
        quality: 0.95,
        pixelRatio: 2, // Higher resolution
      });

      const link = document.createElement("a");
      link.download = `${car.name.replace(/\s+/g, "_")}_card.${imageType}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error capturing image:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  const handleDownloadPdf = () => {
    // In a real implementation, this would generate or fetch a PDF
    alert("PDF download functionality would be implemented here");
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        title="View car image and details"
        onClick={() => setOpen(true)}
        className="h-8 w-8"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <DialogTitle>Car Image and Details</DialogTitle>
              <DialogDescription>
                {car.name} - {car.car_company}
              </DialogDescription>
            </div>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </DialogHeader>

          {/* Card that will be captured for download */}
          <div ref={cardRef} className="bg-white p-6 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Section */}
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                {car.main_image ? (
                  <div className="relative w-full h-48 md:h-64 flex items-center justify-center">
                    <img
                      src={car.main_image}
                      alt={car.name}
                      className="rounded-md object-contain max-h-full max-w-full"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-48 bg-muted rounded-md">
                    <ImageIcon className="h-16 w-16 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No image available
                    </p>
                  </div>
                )}
                <h3 className="text-xl font-bold mt-4 text-center">
                  {car.name}
                </h3>
                <p className="text-muted-foreground text-center">
                  {car.car_company}
                </p>
              </div>

              {/* Details Section */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1 text-gray-800">
                    Description
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {car.description || "No description available"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800">
                      Real Price (BWP)
                    </h4>
                    <p className="text-sm font-medium">
                      {formatPrice(car.real_price_bwp, "BWP")}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800">
                      Actual Price (BWP)
                    </h4>
                    <p className="text-sm font-medium">
                      {formatPrice(car.actual_price_bwp, "BWP")}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800">
                      Real Price (ZMW)
                    </h4>
                    <p className="text-sm font-medium">
                      {formatPrice(car.real_price_zmw, "ZMW")}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800">
                      Actual Price (ZMW)
                    </h4>
                    <p className="text-sm font-medium">
                      {formatPrice(car.actual_price_zmw, "ZMW")}
                    </p>
                  </div>
                </div>

                {car.engine && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800">
                      Engine
                    </h4>
                    <p className="text-sm">{car.engine}</p>
                  </div>
                )}

                {/* <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800">
                      Status
                    </h4>
                    <Badge
                      className={
                        car.status === "sold"
                          ? "bg-green-500"
                          : car.status === "unsold"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }
                    >
                      {car.status === "sold"
                        ? "Sold"
                        : car.status === "unsold"
                        ? "Un Sold"
                        : "Pending"}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800">
                      Website State
                    </h4>
                    <Badge
                      className={
                        car.website_state ? "bg-green-500" : "bg-red-500"
                      }
                    >
                      {car.website_state ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div> */}

                <div>
                  <h4 className="font-semibold text-sm text-gray-800">
                    Car ID
                  </h4>
                  <p className="text-sm font-mono">{car.car_index_id}</p>
                </div>
              </div>
            </div>

            {/* Footer with download info */}
            <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
              Downloaded from RedAppleCars • {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Download Options */}
          <div className="flex flex-wrap justify-between gap-2 mt-6 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleDownloadImage("png")}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download as PNG
              </Button>
            </div>
            <Button
              onClick={handleDownloadPdf}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
