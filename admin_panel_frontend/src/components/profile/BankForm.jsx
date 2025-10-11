"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { SquarePen, Plus } from "lucide-react";
import { toast } from "sonner";
import { createOrUpdateBank } from "@/services/profile/profileServices";
import { useRouter } from "next/navigation";

export function BankForm({ bankData, onBankUpdated, onCancel }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    branchCode: "",
    swiftCode: "",
    address: "",
    isActive: false
  });

  useEffect(() => {
    if (bankData) {
      setFormData({
        bankName: bankData.bankName || "",
        accountName: bankData.accountName || "",
        accountNumber: bankData.accountNumber || "",
        branchCode: bankData.branchCode || "",
        swiftCode: bankData.swiftCode || "",
        address: bankData.address || "",
        isActive: bankData.isActive || false
      });
    }
  }, [bankData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        ...(bankData && { bankId: bankData._id })
      };

      const response = await createOrUpdateBank(payload, router);

      if (response.data.status) {
        toast.success(
          bankData ? "Bank account updated successfully" : "Bank account created successfully"
        );
        onBankUpdated(response.data.data.bank);
      } else {
        toast.error(response.data.message || "Failed to save bank account");
      }
    } catch (error) {
      console.error("Error saving bank account:", error);
      toast.error("Failed to save bank account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {bankData ? <SquarePen className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {bankData ? "Edit Bank Account" : "Add New Bank Account"}
        </CardTitle>
        <CardDescription>
          {bankData
            ? "Update your bank account details"
            : "Add a new bank account for your company"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                placeholder="Enter bank name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name *</Label>
              <Input
                id="accountName"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
                placeholder="Enter account name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="Enter account number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchCode">Branch Code *</Label>
              <Input
                id="branchCode"
                name="branchCode"
                value={formData.branchCode}
                onChange={handleInputChange}
                placeholder="Enter branch code"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="swiftCode">SWIFT Code</Label>
              <Input
                id="swiftCode"
                name="swiftCode"
                value={formData.swiftCode}
                onChange={handleInputChange}
                placeholder="Enter SWIFT code"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Bank Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter bank address"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isActive">Set as active bank account</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : bankData ? "Update Bank Account" : "Add Bank Account"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
