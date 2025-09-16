"use client";

import React, { useState, useRef } from "react";
import { ImageIcon, Download, FileText, X, Phone, MessageCircle, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "../ui/badge";
import { toPng } from "html-to-image";
import { FaWhatsapp } from "react-icons/fa";

export function CarInfoPic({ car }) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);

  const formatPrice = (price, currency) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "symbol"
    }).format(price);
  };

  const handleDownloadImage = async (imageType = "png") => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "#ffffff",
        quality: 0.95,
        pixelRatio: 2 // Higher resolution
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        // First convert the card to an image
        const dataUrl = await toPng(cardRef.current, {
          backgroundColor: "#ffffff",
          quality: 0.9,
          pixelRatio: 2
        });

        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `${car.name.replace(/\s+/g, "_")}.png`, { type: blob.type });

        // Share the image
        await navigator.share({
          title: `${car.name} - ${car.car_company}`,
          text: `Check out this ${car.name} from RedAppleCars!`,
          files: [file]
        });
      } catch (error) {
        console.error("Error sharing:", error);
        handleDownloadImage(); // Fallback to download if sharing fails
      }
    } else {
      handleDownloadImage(); // Fallback to download if Web Share API not supported
    }
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
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white p-0">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
            <div>
              <DialogTitle className="text-lg">Share Car Details</DialogTitle>
              <DialogDescription>Download or share this car information</DialogDescription>
            </div>
            {/* <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button> */}
          </DialogHeader>

          {/* Card that will be captured for download */}
          <div ref={cardRef} className="bg-white p-4 rounded-lg">
            {/* Header with logo */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold mr-2">
                  <img
                    src="https://res.cloudinary.com/dcg8mpgar/image/upload/v1757176857/Untitled_design__1_-removebg-preview_rpdk9q.png"
                    alt="logo"
                  />
                </div>
                <div>
                  <h2 className="font-bold text-lg">RedAppleCars</h2>
                  <p className="text-xs text-gray-500">Quality Pre-owned Vehicles</p>
                </div>
              </div>
              <Badge className="bg-green-600">Available</Badge>
            </div>

            {/* Main image */}
            <div className="mb-4 rounded-lg overflow-hidden">
              {car.main_image ? (
                <img src={car.main_image} alt={car.name} className="w-full h-60 object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-48 bg-gray-100 rounded-md">
                  <ImageIcon className="h-16 w-16 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No image available</p>
                </div>
              )}
            </div>
            <div className="flex w-24 h-20 gap-1">
              {car?.images?.map((image, index) => (
                <img src={image.image_url} key={index} alt={`otherImage ${index}`} />
              ))}
            </div>

            {/* Car title */}
            <h1 className="text-xl font-bold mb-1">{car.name}</h1>
            <p className="text-gray-600 mb-4">{car.car_company}</p>

            {/* Price highlights */}
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-600">Price in BWP</p>
                  <p className="font-bold text-blue-800">
                    {formatPrice(car.actual_price_bwp, "BWP")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Price in ZMW</p>
                  <p className="font-bold text-blue-800">
                    {formatPrice(car.actual_price_zmw, "ZMW")}
                  </p>
                </div>
              </div>
            </div>

            {/* Key details */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {car.engine && (
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-600">Engine</p>
                  <p className="text-sm font-medium">{car.engine}</p>
                </div>
              )}
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600">Car ID</p>
                <p className="text-sm font-medium">{car.car_index_id}</p>
              </div>
            </div>

            {/* Contact information */}
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <p className="text-sm font-medium text-green-800 mb-2">
                Contact us for more details:
              </p>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm">+267 123 4567</span>
                </div>
                <div className="flex items-center">
                  <FaWhatsapp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm">WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Footer with branding */}
            <div className="text-center text-xs text-gray-500 border-t pt-3">
              RedAppleCars • www.redapplecars.com • {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 p-4 border-t">
            <Button
              onClick={handleShare}
              className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Share className="h-4 w-4" />
              Share via WhatsApp
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={() => handleDownloadImage("png")}
                variant="outline"
                className="flex-1 flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                PNG
              </Button>
              <Button
                onClick={handleDownloadPdf}
                variant="outline"
                className="flex-1 flex items-center gap-1"
              >
                <FileText className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
