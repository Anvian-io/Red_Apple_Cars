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
  DialogTrigger,
} from "@/components/ui/dialog";
import { lobster } from "@/lib/fonts";
import { createAndDownloadInvoice, update_invoice_car_details } from "@/services/invoice/invoiceServices";
import { useRouter } from "next/navigation";
import { File } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function ModifyDetails({ carDetails, invoiceDetails, onSave, onClose }) {
  const [status, setStatus] = useState(carDetails.status || "pending");
  const [invoiceStatus, setInvoiceStatus] = useState(
    invoiceDetails.invoiceStatus || "pending"
  );
  const [paymentStatus, setPaymentStatus] = useState(
    invoiceDetails.paymentStatus || "pending"
  );

  const handleSave = () => {
    onSave({
      carId: carDetails.carId,
      invoiceId: invoiceDetails.invoiceId,
      invoice_index_id: invoiceDetails.invoice_index_id,
      status,
      invoiceStatus,
      paymentStatus,
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
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
          <label className="block text-sm font-medium mb-1">
            Invoice Status
          </label>
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
          <label className="block text-sm font-medium mb-1">
            Payment Status
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="done">Done</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Type
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
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

export function CompanyInvoice({ car }) {
  const router = useRouter();
  const [showModifyDetails, setShowModifyDetails] = useState(false);
  const [generatedInvoiceData, setGeneratedInvoiceData] = useState(null);

  const handle_generate_invoice = async () => {
    try {
      const payload = {
        company: {
          name: "Red Apple Cars",
          regNumber: "2019/475390/07",
          vatNumber: "4190288680",
        },
        invoice: {
          date: new Date().toISOString().split("T")[0],
          documentNumber: Math.floor(
            100000000 + Math.random() * 900000000
          ).toString(),
          reference:
            car?.chassis_number ||
            "REF" + Math.floor(100000 + Math.random() * 900000),
        },
        customer: {
          name: "Dream drive motor",
          number: "988738379",
          bondStore: "Value Marketing (PTY) LTD",
          address: "Gaborone, Botswana.",
        },
        banking: {
          bankName: "Bidvest Bank",
          accountName: "Red Apple Cars (Pty) Ltd",
          accountNumber: "31400008206",
          branchCode: "462-005",
          swiftCode: "BIDBZAJJ",
          address:
            "Unit 6, No 56 Shepstone Place, Westville 3630, South Africa",
        },
        vehicle: {
          carId: car?._id || "68bd6331a4ab7c5b68df10eb",
          chassisNo: car?.chassis_number || "A80503080",
          makeModel: car?.name || "HONDA FIT",
          borderPost: "KFN",
          country: "GE6-1079193",
          color: car?.color || "Blue",
          engineNo: car?.engine_number || "L13A 4088336",
          doors: "5",
          condition: "Used",
          engineCapacity: "2008",
          seats: "5",
          fuelType: "Petrol",
          grossMass: "-",
          carrierDetails: "Automatic",
        },
        price: {
          vehiclePrice: car?.actual_price_bwp || "1200",
          transport: "200",
          total: (parseInt(car?.actual_price_bwp || 1200) + 200).toString(),
        },
      };

      const response = await createAndDownloadInvoice(payload, router);

      if (response.data) {
        // console.log(response.data,"fewoihfio")
        setGeneratedInvoiceData({
          invoiceId: response.data.data.invoiceId,
          invoice_index_id: response.data.data.invoice_index_id,
          customerName: payload.customer.name,
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
      // Call API to update invoice and car details
      const response = await update_invoice_car_details(data, router);

      if (response.data) {
        toast.success("Details updated successfully");
        setShowModifyDetails(false);
      } else {
        toast.error(response.data.message || "Failed to update details");
      }
    } catch (error) {
      console.error("Error updating details:", error);
      toast.error("Error updating details");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
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
                    <img
                      src="/logo.png"
                      alt="Company Logo"
                      className="h-full mb-2"
                    />
                  </div>
                  <div className="ml-2">
                    <h1
                      className={`text-6xl text-red-600 ${lobster.className}`}
                    >
                      Red Apple Cars
                    </h1>

                    <p className="text-2xl mt-2">Car Payment Invoice</p>
                  </div>
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold">TAX INVOICE</h1>
                  <p>Company Reg # 2019/475390/07</p>
                  <p>VAT Reg # 4190288680</p>
                  <p>Invoice Date 2025-06-23</p>
                  <p>Document Number 166810710</p>
                  <p>Reference A80503080</p>
                </div>
              </div>

              <div className="bg-red-500 h-1 my-2"></div>
              <div className="flex justify-between border border-b border-gray-400/40 my-4 w-full">
                <div className="w-[40%] m-2">
                  <h2 className="font-bold text-lg">Customer Details</h2>
                  <div className="flex items-center">
                    <h2 className="font-bold">Customer:</h2>
                    <p> Dream drive motor</p>
                  </div>
                  <div className="flex items-center">
                    <h2 className="font-bold">Customer Number: </h2>
                    <p>988738379</p>
                  </div>
                  <p className="font-bold">
                    Bond Store: Value Marketing (PTY) LTD
                  </p>
                  <p>Gaborone, Botswana.</p>
                </div>

                <div className="border-r border-gray-400/40"></div>

                <div className="w-[45%] m-2">
                  <h2 className="font-bold text-lg">
                    Banking Details - PULA ACCOUNT
                  </h2>
                  <div className="flex items-center">
                    <h2 className="font-bold min-w-fit">Bank name: </h2>
                    <p>Bidvest Bank</p>
                  </div>
                  <div className="flex items-center">
                    <h2 className="font-bold min-w-fit">
                      Beneficiary Account name:
                    </h2>
                    <p> Red Apple Cars (Pty) Ltd</p>
                  </div>
                  <div className="flex">
                    <h2 className="min-w-fit font-bold">Account Number:</h2>
                    <p>31400008206</p>
                  </div>
                  <div className="flex">
                    <h2 className="min-w-fit font-bold">Branch Code:</h2>
                    <p>462-005</p>
                  </div>
                  <div className="flex">
                    <h2 className="min-w-fit font-bold"> SWIFT Code:</h2>
                    <p>BIDBZAJJ</p>
                  </div>
                  <div className="flex">
                    <h2 className="min-w-fit font-bold">
                      Beneficiary address:
                    </h2>
                    <p>
                      Unit 6, No 56 Shepstone Place, Westville 3630, South
                      Africa
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
                      <td className="text-center p-2">A80503080</td>
                      <td className="text-center p-2">HONDA FIT</td>
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
                      <td className="text-center p-2">Blue</td>
                      <td className="text-center p-2">L13A 4088336</td>
                      <td className="text-center p-2">5</td>
                      <td className="text-center p-2">Used</td>
                      <td className="text-center p-2">2008</td>
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
                      <td className="text-center p-2">5</td>
                      <td className="text-center p-2">Petrol</td>
                      <td className="text-center p-2">-</td>
                      <td className="text-center p-2">Automatic</td>
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
                      <td className="border border-gray-400/40 p-2 font-semibold">
                        Vehicle Price
                      </td>
                      <td className="border border-gray-400/40 p-2 text-right">
                        P 1200
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400/40 p-2 font-semibold">
                        Transport
                      </td>
                      <td className="border border-gray-400/40 p-2 text-right">
                        P 200
                      </td>
                    </tr>
                    <tr className="bg-red-100">
                      <td className="border border-gray-400/40 p-2 font-bold">
                        Total
                      </td>
                      <td className="border border-gray-400/40 p-2 text-right font-bold">
                        P 1,400
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-red-500 h-[2px] my-2"></div>

              {/* Payment Instructions */}
              <div className="my-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="font-semibold">
                  The Reference number should be mentioned as reference on bank
                  slip/TT or EFT in order to ensure there are no delays in
                  allocation your payment.
                </p>
              </div>

              {/* Terms & Conditions */}
              <div className="my-6">
                <h2 className="font-bold text-lg mb-2">Terms & Conditions</h2>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    All cars sold &quot;AS IS&quot; and Does not include any
                    warranty or Guarantee
                  </li>
                  <li>
                    If paying in ZAR Rates of Exchange will have to be obtained
                    on the day of effecting transaction. Kindly talk to our team
                    to obtain an exchange rate.
                  </li>
                  <li>
                    All bank transaction fees must be paid by the purchaser
                  </li>
                  <li>
                    Cash deposits done to a South African bank will attract a
                    further 2.5% cash deposit fee.
                  </li>
                  <li>
                    Credit card payments will have attract a further 2%
                    transaction fee
                  </li>
                  <li>
                    Should you pay and decide to cancel your order you will be
                    charged PULA 200 as cancellation fee.
                  </li>
                  <li>
                    The Pictures and Information given are to the best of our
                    ability in the event they don&apos;t match the product in
                    the exact manner UFS Africa cannot be held liable.
                  </li>
                  <li>
                    In the event of hijack or an accident where the vehicle is
                    written off, invoice value would be the maximum value to be
                    claimed under insurance.
                  </li>
                </ol>
              </div>

              {/* Contact Information */}
              <div className="my-6 p-4 bg-gray-100 rounded">
                <p className="font-semibold mb-2">
                  If you have any questions or queries, please contact UFS
                  AFRICA on details below...
                </p>
                <p className="font-semibold">UFS Africa (Pty) Ltd</p>
                <p>Address: Old International Airport, Isipingo, Durban 4133</p>
                <p>
                  Email: accounts@ufsauto.com Web: www.ufsauto.com Phone: +27 84
                  786 5492
                </p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={handle_generate_invoice}>
                Generate Invoice
              </Button>
            </DialogFooter>
          </>
        ) : (
          <ModifyDetails
            carDetails={{
              carId: car?.car_index_id,
              carName: car?.name,
              company: car?.car_company,
              status: car?.status ? "solved" : "pending",
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
