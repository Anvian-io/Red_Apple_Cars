"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SquarePen, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { updateCompany } from "@/services/profile/profileServices";
import { useRouter } from "next/navigation";
import { checkPermission } from "@/helper/commonHelper";

export function CompanyForm({ companyData, onCompanyUpdated }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    regNumber: "",
    vatNumber: "",
    address: "",
    phoneNumber: "",
    whatsappNumber: "",
    instagramUrl: "",
    facebookUrl: "",
    twitterUrl: ""
  });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    if (companyData) {
      setFormData({
        name: companyData.name || "",
        regNumber: companyData.regNumber || "",
        vatNumber: companyData.vatNumber || "",
        address: companyData.address || "",
        phoneNumber: companyData.phoneNumber || "",
        whatsappNumber: companyData.whatsappNumber || "",
        instagramUrl: companyData.instagramUrl || "",
        facebookUrl: companyData.facebookUrl || "",
        twitterUrl: companyData.twitterUrl || ""
      });
      setLogoPreview(companyData.logo || "");
    }
  }, [companyData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!checkPermission("profile", "edit")) {
        toast.error("You don't have permission to modify company details");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    if (!checkPermission("profile", "edit")) {
      toast.error("You don't have permission to modify company details");
      return;
    }
    setLogo(null);
    setLogoPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkPermission("profile", "edit")) {
      toast.error("You don't have permission to modify company details");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("regNumber", formData.regNumber);
      submitData.append("vatNumber", formData.vatNumber);
      submitData.append("address", formData.address);
      submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("whatsappNumber", formData.whatsappNumber);
      submitData.append("instagramUrl", formData.instagramUrl);
      submitData.append("facebookUrl", formData.facebookUrl);
      submitData.append("twitterUrl", formData.twitterUrl);

      if (logo) {
        submitData.append("logo", logo);
      }

      const response = await updateCompany(submitData, router);

      if (response.data.status) {
        toast.success("Company details updated successfully");
        onCompanyUpdated(response.data.data.company);
      } else {
        toast.error(response.data.message || "Failed to update company details");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SquarePen className="h-5 w-5" />
          Company Information
        </CardTitle>
        <CardDescription>Update your company details and logo</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-4">
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative">
                  <Image
                    src={logoPreview}
                    alt="Company Logo"
                    width={100}
                    height={100}
                    className="rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={removeLogo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: 500x500px, max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="regNumber">Registration Number *</Label>
              <Input
                id="regNumber"
                name="regNumber"
                value={formData.regNumber}
                onChange={handleInputChange}
                placeholder="Enter registration number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vatNumber">VAT Number</Label>
              <Input
                id="vatNumber"
                name="vatNumber"
                value={formData.vatNumber}
                onChange={handleInputChange}
                placeholder="Enter VAT number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                placeholder="Enter WhatsApp number"
              />
            </div>
          </div>

          {/* Address Field - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter company address"
            />
          </div>

          {/* Social Media URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                value={formData.instagramUrl}
                onChange={handleInputChange}
                placeholder="https://instagram.com/yourcompany"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                value={formData.facebookUrl}
                onChange={handleInputChange}
                placeholder="https://facebook.com/yourcompany"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterUrl">Twitter URL</Label>
              <Input
                id="twitterUrl"
                name="twitterUrl"
                type="url"
                value={formData.twitterUrl}
                onChange={handleInputChange}
                placeholder="https://twitter.com/yourcompany"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? "Updating..." : "Update Company Details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
