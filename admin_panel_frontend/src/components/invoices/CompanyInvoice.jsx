"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { lobster } from "@/lib/fonts";
import {
  createAndDownloadInvoice,
  update_invoice_car_details
} from "@/services/invoice/invoiceServices";
import { useRouter } from "next/navigation";
import { File } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

function ModifyDetails({ carDetails, invoiceDetails, onSave, onClose }) {
  const [status, setStatus] = useState(carDetails.status || "pending");
  const [invoiceStatus, setInvoiceStatus] = useState(invoiceDetails.status || "pending");
  const [paymentStatus, setPaymentStatus] = useState(invoiceDetails.payment_status || "pending");
  const [paymentType, setPaymentType] = useState(invoiceDetails.payment_type || "online");

  const handleSave = () => {
    onSave({
      carId: carDetails.carId,
      invoiceId: invoiceDetails.invoiceId,
      invoice_index_id: invoiceDetails.invoice_index_id,
      status,
      invoiceStatus,
      paymentStatus,
      payment_type: paymentType
    });
  };

  return (
    <div className="bg-white text-black p-6 rounded-lg mt-4">
      <h2 className="text-xl font-bold mb-4">Update Invoice and Car Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Car Information</h3>
          <p>
            <strong>Car ID:</strong> {carDetails.carId}
          </p>
          <p>
            <strong>Car Name:</strong> {carDetails.carName}
          </p>
          <p>
            <strong>Company:</strong> {carDetails.company}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Invoice Information</h3>
          <p>
            <strong>Customer Name:</strong> {invoiceDetails.customerName}
          </p>
          <p>
            <strong>Invoice ID:</strong> {invoiceDetails.invoice_index_id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Car Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="sold">Sold</option>
            <option value="pending">Pending</option>
            <option value="unsold">Unsold</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Invoice Status</label>
          <select
            value={invoiceStatus}
            onChange={(e) => setInvoiceStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refund">Refund</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payment Type</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}

export function CompanyInvoice({ car, customerData }) {
  const router = useRouter();
  const [showModifyDetails, setShowModifyDetails] = useState(false);
  const [generatedInvoiceData, setGeneratedInvoiceData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [bankingDetails, setBankingDetails] = useState(null);

  // Load company and banking details from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCompany = localStorage.getItem("companyDetails");
      const storedBanking = localStorage.getItem("bankingDetails");

      if (storedCompany) {
        setCompanyDetails(JSON.parse(storedCompany));
      }
      if (storedBanking) {
        setBankingDetails(JSON.parse(storedBanking));
      }
    }
  }, []);

  const handle_generate_invoice = async () => {
    try {
      // Default company details if not in localStorage
      const defaultCompany = {
        name: "Red Apple Cars",
        regNumber: "2019/475390/07",
        vatNumber: "4190288680"
      };

      // Default banking details if not in localStorage
      const defaultBanking = {
        bankName: "Bidvest Bank",
        accountName: "Red Apple Cars (Pty) Ltd",
        accountNumber: "31400008206",
        branchCode: "462-005",
        swiftCode: "BIDBZAJJ",
        address: "Unit 6, No 56 Shepstone Place, Westville 3630, South Africa"
      };

      // Default customer data if not provided
      const defaultCustomer = {
        name: "Dream drive motor",
        number: "988738379",
        bondStore: "Value Marketing (PTY) LTD",
        address: "Gaborone, Botswana."
      };

      const payload = {
        company: companyDetails || defaultCompany,
        invoice: {
          date: new Date().toISOString().split("T")[0],
          documentNumber: Math.floor(100000000 + Math.random() * 900000000).toString(),
          reference:
            car?.details?.stock_no ||
            car?.chassis_number ||
            "REF" + Math.floor(100000 + Math.random() * 900000)
        },
        customer: customerData || defaultCustomer,
        banking: bankingDetails || defaultBanking,
        vehicle: {
          carId: car?._id || car?.car_index_id || "N/A",
          chassisNo: car?.chassis_number || car?.details?.stock_no || "N/A",
          makeModel: car?.name || "N/A",
          borderPost: "KFN", // You might want to make this dynamic too
          country: "GE6-1079193", // You might want to make this dynamic too
          color: car?.details?.color || "N/A",
          engineNo: car?.engine_number || car?.details?.engine_type || "N/A",
          doors: car?.details?.doors || "5",
          condition: car?.details?.condition || "Used",
          engineCapacity: car?.details?.engine_size || "N/A",
          seats: car?.details?.seats || "5",
          fuelType: car?.details?.fuel || "Petrol",
          grossMass: car?.details?.grossMass || "-",
          carrierDetails: car?.details?.transmission || "Automatic"
        },
        price: {
          vehiclePrice: car?.actual_price_bwp || car?.real_price_bwp || "0",
          transport: "200", // You might want to make this dynamic
          total: (parseInt(car?.actual_price_bwp || car?.real_price_bwp || 0) + 200).toString()
        }
      };

      const response = await createAndDownloadInvoice(payload, router);

      if (response.data) {
        setGeneratedInvoiceData({
          invoiceId: response.data.data.invoiceId,
          invoice_index_id: response.data.data.invoice_index_id,
          customerName: payload.customer.name,
          status: "pending",
          payment_status: "pending",
          payment_type: "online"
        });
        setShowModifyDetails(true);
        toast.success("Invoice generated successfully");
      } else {
        console.error("Failed to generate PDF");
        toast.error("Failed to generate invoice");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error generating invoice");
    }
  };

  const handleSaveDetails = async (data) => {
    try {
      const response = await update_invoice_car_details(data, router);

      if (response.data) {
        toast.success("Details updated successfully");
        setShowModifyDetails(false);
        setIsDialogOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update details");
      }
    } catch (error) {
      console.error("Error updating details:", error);
      toast.error("Error updating details");
    }
  };

  const handleDialogOpenChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setShowModifyDetails(false);
      setGeneratedInvoiceData(null);
    }
  };

  // Helper function to get current date in required format
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return parseInt(price || 0).toLocaleString();
  };

  // Calculate total price
  const calculateTotal = () => {
    const vehiclePrice = parseInt(car?.actual_price_bwp || car?.real_price_bwp || 0);
    const transport = 200; // You can make this dynamic
    return vehiclePrice + transport;
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild onClick={() => setIsDialogOpen(true)}>
        <div className="flex justify-center cursor-pointer">
          <File size={20} />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Car Invoice</DialogTitle>
        </DialogHeader>

        {!showModifyDetails ? (
          <>
            <div className="bg-white text-black p-6 rounded-lg">
              {/* Logo and Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="h-[150px] mr-2">
                    <img src="/logo.png" alt="Company Logo" className="h-full mb-2" />
                  </div>
                  <div className="ml-2">
                    <h1 className={`text-6xl text-red-600 ${lobster.className}`}>
                      {companyDetails?.name || "Red Apple Cars"}
                    </h1>
                    <p className="text-2xl mt-2">Car Payment Invoice</p>
                  </div>
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold">TAX INVOICE</h1>
                  <p>Company Reg # {companyDetails?.regNumber || "2019/475390/07"}</p>
                  <p>VAT Reg # {companyDetails?.vatNumber || "4190288680"}</p>
                  <p>Invoice Date {getCurrentDate()}</p>
                  <p>
                    Document Number {Math.floor(100000000 + Math.random() * 900000000).toString()}
                  </p>
                  <p>Reference {car?.details?.stock_no || car?.chassis_number || "N/A"}</p>
                </div>
              </div>

              <div className="bg-red-500 h-1 my-2"></div>
              <div className="flex justify-between border border-b border-gray-400/40 my-4 w-full">
                <div className="w-[40%] m-2">
                  <h2 className="font-bold text-lg">Customer Details</h2>
                  <div className="flex items-center">
                    <h2 className="font-bold">Customer:</h2>
                    <p>{customerData?.name || "Dream drive motor"}</p>
                  </div>
                  <div className="flex items-center">
                    <h2 className="font-bold">Customer Number: </h2>
                    <p>{customerData?.number || "988738379"}</p>
                  </div>
                  <p className="font-bold">
                    Bond Store: {customerData?.bondStore || "Value Marketing (PTY) LTD"}
                  </p>
                  <p>{customerData?.address || "Gaborone, Botswana."}</p>
                </div>

                <div className="border-r border-gray-400/40"></div>

                <div className="w-[45%] m-2">
                  <h2 className="font-bold text-lg">Banking Details - PULA ACCOUNT</h2>
                  <div className="flex items-center">
                    <h2 className="font-bold min-w-fit">Bank name: </h2>
                    <p>{bankingDetails?.bankName || "Bidvest Bank"}</p>
                  </div>
                  <div className="flex items-center">
                    <h2 className="font-bold min-w-fit">Beneficiary Account name:</h2>
                    <p>{bankingDetails?.accountName || "Red Apple Cars (Pty) Ltd"}</p>
                  </div>
                  <div className="flex">
                    <h2 className="min-w-fit font-bold">Account Number:</h2>
                    <p>{bankingDetails?.accountNumber || "31400008206"}</p>
                  </div>
                  <div className="flex">
                    <h2 className="min-w-fit font-bold">Branch Code:</h2>
                    <p>{bankingDetails?.branchCode || "462-005"}</p>
                  </div>
                  <div className="flex">
                    <h2 className="min-w-fit font-bold"> SWIFT Code:</h2>
                    <p>{bankingDetails?.swiftCode || "BIDBZAJJ"}</p>
                  </div>
                  <div className="flex">
                    <h2 className="min-w-fit font-bold">Beneficiary address:</h2>
                    <p>
                      {bankingDetails?.address ||
                        "Unit 6, No 56 Shepstone Place, Westville 3630, South Africa"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Details Tables */}
              <div className="my-2">
                <table className="w-full border-collapse border border-gray-400/40 mb-4">
                  <thead>
                    <tr className="bg-red-100">
                      <th className="p-2">Chassis No</th>
                      <th className="p-2">Make Model</th>
                      <th className="p-2">Border Post</th>
                      <th className="p-2">Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center p-2">
                        {car?.chassis_number || car?.details?.stock_no || "N/A"}
                      </td>
                      <td className="text-center p-2">{car?.name || "N/A"}</td>
                      <td className="text-center p-2">KFN</td>
                      <td className="text-center p-2">GE6-1079193</td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full border-collapse border border-gray-400/40 mb-4">
                  <thead>
                    <tr className="bg-red-100">
                      <th className="p-2">Colour</th>
                      <th className="p-2">Engine No</th>
                      <th className="p-2">Doors</th>
                      <th className="p-2">Condition</th>
                      <th className="p-2">Engine Capacity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border border-gray-400/40">
                      <td className="text-center p-2">{car?.details?.color || "N/A"}</td>
                      <td className="text-center p-2">
                        {car?.engine_number || car?.details?.engine_type || "N/A"}
                      </td>
                      <td className="text-center p-2">{car?.details?.doors || "5"}</td>
                      <td className="text-center p-2">{car?.details?.condition || "Used"}</td>
                      <td className="text-center p-2">{car?.details?.engine_size || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>
                <table className="w-full border-collapse border border-gray-400/40 mb-4">
                  <thead>
                    <tr className="bg-red-100">
                      <th className="p-2">Seats</th>
                      <th className="p-2">Fuel Type</th>
                      <th className="p-2">Gross Mass</th>
                      <th className="p-2">Carrier Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center p-2">{car?.details?.seats || "5"}</td>
                      <td className="text-center p-2">{car?.details?.fuel || "Petrol"}</td>
                      <td className="text-center p-2">-</td>
                      <td className="text-center p-2">
                        {car?.details?.transmission || "Automatic"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Price Table */}
              <div className="my-6">
                <h2 className="font-bold text-lg mb-2">Vehicle Price</h2>
                <table className="w-full border-collapse border border-gray-400/40">
                  <tbody>
                    <tr>
                      <td className="border border-gray-400/40 p-2 font-semibold">Vehicle Price</td>
                      <td className="border border-gray-400/40 p-2 text-right">
                        P {formatPrice(car?.actual_price_bwp || car?.real_price_bwp)}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400/40 p-2 font-semibold">Transport</td>
                      <td className="border border-gray-400/40 p-2 text-right">P 200</td>
                    </tr>
                    <tr className="bg-red-100">
                      <td className="border border-gray-400/40 p-2 font-bold">Total</td>
                      <td className="border border-gray-400/40 p-2 text-right font-bold">
                        P {formatPrice(calculateTotal())}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-red-500 h-[2px] my-2"></div>

              {/* Payment Instructions */}
              <div className="my-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="font-semibold">
                  The Reference number should be mentioned as reference on bank slip/TT or EFT in
                  order to ensure there are no delays in allocation your payment.
                </p>
              </div>

              {/* Terms & Conditions */}
              <div className="my-6">
                <h2 className="font-bold text-lg mb-2">Terms & Conditions</h2>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    All cars sold &quot;AS IS&quot; and Does not include any warranty or Guarantee
                  </li>
                  <li>
                    If paying in ZAR Rates of Exchange will have to be obtained on the day of
                    effecting transaction. Kindly talk to our team to obtain an exchange rate.
                  </li>
                  <li>All bank transaction fees must be paid by the purchaser</li>
                  <li>
                    Cash deposits done to a South African bank will attract a further 2.5% cash
                    deposit fee.
                  </li>
                  <li>Credit card payments will have attract a further 2% transaction fee</li>
                  <li>
                    Should you pay and decide to cancel your order you will be charged PULA 200 as
                    cancellation fee.
                  </li>
                  <li>
                    The Pictures and Information given are to the best of our ability in the event
                    they don&apos;t match the product in the exact manner UFS Africa cannot be held
                    liable.
                  </li>
                  <li>
                    In the event of hijack or an accident where the vehicle is written off, invoice
                    value would be the maximum value to be claimed under insurance.
                  </li>
                </ol>
              </div>

              {/* Contact Information */}
              <div className="my-6 p-4 bg-gray-100 rounded">
                <p className="font-semibold mb-2">
                  If you have any questions or queries, please contact UFS AFRICA on details
                  below...
                </p>
                <p className="font-semibold">UFS Africa (Pty) Ltd</p>
                <p>Address: Old International Airport, Isipingo, Durban 4133</p>
                <p>Email: accounts@ufsauto.com Web: www.ufsauto.com Phone: +27 84 786 5492</p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={handle_generate_invoice}>Generate Invoice</Button>
            </DialogFooter>
          </>
        ) : (
          <ModifyDetails
            carDetails={{
              carId: car?.car_index_id || car?._id,
              carName: car?.name,
              company: car?.car_company,
              status: car?.status || "unsold"
            }}
            invoiceDetails={generatedInvoiceData}
            onSave={handleSaveDetails}
            onClose={() => setShowModifyDetails(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
