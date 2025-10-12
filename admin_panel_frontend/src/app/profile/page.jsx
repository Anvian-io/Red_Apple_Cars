"use client";
import React, { useState, useEffect } from "react";
import { SecondaryHeader } from "@/components";
import { CompanyForm } from "@/components/profile/CompanyForm";
import { BankForm } from "@/components/profile/BankForm";
import { BankList } from "@/components/profile/BankList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getProfile } from "@/services/profile/profileServices";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    company: null,
    banks: []
  });
  const [showBankForm, setShowBankForm] = useState(false);
  const [editingBank, setEditingBank] = useState(null);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await getProfile(router);
      if (response.data.status) {
        setProfileData(response.data.data);
        // localStorage.setItem("companyDetails",response.data.data.company)
        // const active_bank = 
        // localStorage.setItem("bankingDetails", response.data.data.banks);
      } else {
        toast.error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleCompanyUpdated = (company) => {
    setProfileData((prev) => ({
      ...prev,
      company
    }));
  };

  const handleBankUpdated = () => {
    setShowBankForm(false);
    setEditingBank(null);
    fetchProfileData();
  };

  const handleEditBank = (bank) => {
    setEditingBank(bank);
    setShowBankForm(true);
  };

  const handleCancelBankForm = () => {
    setShowBankForm(false);
    setEditingBank(null);
  };

  if (loading) {
    return (
      <div className="w-full h-full">
        {/* <SecondaryHeader title="Profile" /> */}
        <div className="p-6 space-y-6">
          <Skeleton className="h-64 w-full bg-border" />
          <Skeleton className="h-32 w-full bg-border" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* <SecondaryHeader
        title="Profile"
        buttonText="Add Bank Account"
        tooltipText="Add New Bank Account"
        onButtonClick={() => setShowBankForm(true)}
        onMobileButtonClick={() => setShowBankForm(true)}
      /> */}

      <div className="p-6 space-y-6">
        {/* Company Section */}
        <CompanyForm companyData={profileData.company} onCompanyUpdated={handleCompanyUpdated} />

        {/* Banking Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Banking Details</h2>
            {!showBankForm && (
              <Button onClick={() => setShowBankForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Bank Account
              </Button>
            )}
          </div>

          {showBankForm ? (
            <BankForm
              bankData={editingBank}
              onBankUpdated={handleBankUpdated}
              onCancel={handleCancelBankForm}
            />
          ) : (
            <BankList
              banks={profileData.banks}
              onEditBank={handleEditBank}
              onBanksUpdated={fetchProfileData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
