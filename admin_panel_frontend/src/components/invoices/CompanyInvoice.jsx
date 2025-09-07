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
import { createAndDownloadInvoice } from "@/services/invoice/invoiceServices";
import { useRouter } from "next/navigation";
import { File } from "lucide-react";


export function CompanyInvoice() {
  const router = useRouter();

  const handle_generate_invoice = async () => {
    console.log("wewewrewrew");
    try {
      const payload = {
        company: {
          name: "Red Apple Cars",
          regNumber: "2019/475390/07",
          vatNumber: "4190288680",
        },
        invoice: {
          date: "2025-06-23",
          documentNumber: "166810710",
          reference: "A80503080",
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
          carId:"68bd6331a4ab7c5b68df10eb",
          chassisNo: "A80503080",
          makeModel: "HONDA FIT",
          borderPost: "KFN",
          country: "GE6-1079193",
          color: "Blue",
          engineNo: "L13A 4088336",
          doors: "5",
          condition: "Used",
          engineCapacity: "2008",
          seats: "5",
          fuelType: "Petrol",
          grossMass: "-",
          carrierDetails: "Automatic",
        },
        price: {
          vehiclePrice: "1200",
          transport: "200",
          total: "1400",
        },
      };
      const response = await createAndDownloadInvoice(payload,router);
      console.log(response, "iouiuioere");
      if (response.data) {
      } else {
        console.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error:", error);
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
          {/* <DialogTitle className="text-center">Car Invoice</DialogTitle> */}
        </DialogHeader>
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
                <h1 className={`text-6xl text-red-600 ${lobster.className}`}>
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
              <p className="font-bold">Bond Store: Value Marketing (PTY) LTD</p>
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
                <h2 className="font-bold min-w-fit">Beneciary Account name:</h2>
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
                <h2 className="min-w-fit font-bold">Beneciary address:</h2>
                <p>
                  Unit 6, No 56 Shepstone Place, Westville 3630, South Africa
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
                  <td className="text-center p-2">GE6-1079193</td>
                  <td className="text-center p-2">HONDA FIT</td>
                  <td className="text-center p-2">KFN</td>
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
                  <td className="text-center p-2">2008</td>
                  <td className="text-center p-2">Blue</td>
                  <td className="text-center p-2">L13A 4088336</td>
                  <td className="text-center p-2">5</td>
                  <td className="text-center p-2">Used</td>
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
                  <td className="text-center p-2">Automatic</td>
                  <td className="text-center p-2">5</td>
                  <td className="text-center p-2">Petrol</td>
                  <td className="text-center p-2">-</td>
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
                If paying in ZAR Rates of Exchange will have to be obtained on
                the day of effecting transaction. Kindly talk to our team to
                obtain an exchange rate.
              </li>
              <li>All bank transaction fees must be paid by the purchaser</li>
              <li>
                Cash deposits done to a South African bank will attract a
                further 2.5% cash deposit fee.
              </li>
              <li>
                Credit card payments will have attract a further 2% transaction
                fee
              </li>
              <li>
                Should you pay and decide to cancel your order you will be
                charged PULA 200 as cancellation fee.
              </li>
              <li>
                The Pictures and Information given are to the best of our
              ability in the event they don&apos;t match the product in the
                exact manner UFS Africa cannot be held liable.
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
              If you have any questions or queries, please contact UFS AFRICA on
              details below...
            </p>
            <p className="font-semibold">UFS Africa (Pty) Ltd</p>
            <p>Address: Old International Airport, Isipingo, Durban 4133</p>
            <p>
              Email: accounts@ufsauto.com Web: www.ufsauto.com Phone: +27 84 786
              5492
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={handle_generate_invoice}>Generate Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
