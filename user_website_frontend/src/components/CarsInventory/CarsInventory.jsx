"use client";
import PremiumCarsSlider from "./PremiumCarsSlider";
import DriveTypeSlider from "./DriveTypeSlider";
import BrandGrid from "./BrandGrid";
import { getAllCars } from "@/services/cars/carServices";
import { useEffect, useState } from "react";

export default function CarsInventory() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driveTypes, setDriveTypes] = useState([]);
   useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await getAllCars({});
        console.log("API Response for cars:", response);
        
        if (response.data && response.data.status) {
          // Map API data to frontend format
          const mappedCars = response.data.data.map(car => ({
            id: car._id,
            name: car.name,
            price: `$${car.real_price_bwp.toLocaleString()}`,
            numericPrice: car.real_price_bwp, // Add numeric price for filtering
            year: car.details.year,
            mileage: car.details.mileage,
            fuel: car.details.fuel,
            seats: 5,
            driveType: car.details.drive,
            image: car.main_image,
            description: car.description,
            car_company: car.car_company
          }));
          setCars(mappedCars);
          
          // Extract unique drive types from API response
          const uniqueDriveTypes = [...new Set(response.data.data.map(car => car.details.drive))];
          setDriveTypes(uniqueDriveTypes);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const brands = [
    { name: "Maruti Suzuki", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/maruti.jpg" },
    { name: "Hyundai", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/hyundai.jpg" },
    { name: "Tata", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/tata.jpg" },
    { name: "Honda", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/honda.jpg" },
    { name: "Renault", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/renault.jpg" },
    { name: "Kia", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/kia.jpg" },
    { name: "Mahindra", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/mahindra.jpg" },
    { name: "MG Motors", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/mg.jpg" },
    { name: "Volkswagen", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/volkswagen.jpg" },
    { name: "Toyota", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/toyota.jpg" },
    { name: "Skoda", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/skoda.jpg" },
    { name: "Mercedes", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/mercedes-benz.jpg" },
  ];
  
  

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading cars...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-background text-text">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-heading">
          PREMIUM CARS
        </h2>
        <p className="text-muted-foreground mt-2">
          Luxury You Deserve, Performance You Crave
        </p>
      </div>

      <PremiumCarsSlider cars={cars} />

      <div className="text-center mt-16">
        <h2 className="text-xl md:text-2xl font-bold text-heading">
          OUR COMPLETE INVENTORY
        </h2>
        <p className="text-muted-foreground mt-2">
          Every Car. Every Style. Your Perfect Match Awaits.
        </p>
      </div>

      <DriveTypeSlider allCars={cars} driveTypes={driveTypes} />
      <BrandGrid brands={brands} />
    </div>
  );
}