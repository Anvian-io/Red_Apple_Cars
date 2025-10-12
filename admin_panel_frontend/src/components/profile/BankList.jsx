"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SquarePen, Trash2, Star, StarOff } from "lucide-react";
import { toast } from "sonner";
import { deleteBank, setActiveBank } from "@/services/profile/profileServices";
import { useRouter } from "next/navigation";

export function BankList({ banks, onEditBank, onBanksUpdated }) {
  const router = useRouter();

  const handleSetActive = async (bankId,currency) => {
    const payload={
      id:bankId,
      currency:currency
    }
    try {
      const response = await setActiveBank(payload, router);
      if (response.data.status) {
        toast.success("Active bank account updated successfully");
        onBanksUpdated();
      } else {
        toast.error(response.data.message || "Failed to set active bank");
      }
    } catch (error) {
      console.error("Error setting active bank:", error);
      toast.error("Failed to set active bank");
    }
  };

  const handleDelete = async (bank) => {
    if (!confirm(`Are you sure you want to delete bank account: ${bank.bankName}?`)) {
      return;
    }

    try {
      const response = await deleteBank(bank._id, router);
      if (response.data.status) {
        toast.success("Bank account deleted successfully");
        onBanksUpdated();
      } else {
        toast.error(response.data.message || "Failed to delete bank account");
      }
    } catch (error) {
      console.error("Error deleting bank:", error);
      toast.error("Failed to delete bank account");
    }
  };

  const getCurrencyDisplayName = (currency) => {
    switch (currency) {
      case "bwp":
        return "Pula (BWP)";
      case "zmw":
        return "Zambian Kwacha (ZMW)";
      default:
        return currency;
    }
  };

  if (banks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No bank accounts added yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {banks.map((bank) => (
        <Card key={bank._id} className={bank.isActive ? "border-primary" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{bank.bankName}</CardTitle>
                {bank.isActive && (
                  <Badge className="bg-green-100 text-green-700 border border-green-400">
                    Active
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSetActive(bank._id,bank.currency)}
                  title={bank.isActive ? "Deactivate" : "Set as Active"}
                >
                  {bank.isActive ? (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditBank(bank)}
                  title="Edit bank account"
                >
                  <SquarePen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(bank)}
                  title="Delete bank account"
                  disabled={bank.isActive}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>{bank.accountName}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Account Number:</span>
                <p className="text-muted-foreground">{bank.accountNumber}</p>
              </div>
              <div>
                <span className="font-medium">Branch Code:</span>
                <p className="text-muted-foreground">{bank.branchCode}</p>
              </div>
              <div>
                <span className="font-medium">Currency:</span>
                <p className="text-muted-foreground">{getCurrencyDisplayName(bank.currency)}</p>
              </div>
              {bank.swiftCode && (
                <div>
                  <span className="font-medium">SWIFT Code:</span>
                  <p className="text-muted-foreground">{bank.swiftCode}</p>
                </div>
              )}
              {bank.address && (
                <div className="md:col-span-2 lg:col-span-4">
                  <span className="font-medium">Address:</span>
                  <p className="text-muted-foreground">{bank.address}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
