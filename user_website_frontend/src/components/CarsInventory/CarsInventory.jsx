"use client";
import PremiumCarsSlider from "./PremiumCarsSlider";
import BodyTypeSlider from "./BodyTypeSlider";
import BrandGrid from "./BrandGrid";

export default function CarsInventory() {
  const premiumCars = [
    {
      id: 1,
      name: "Range Rover",
      price: "$94,900",
      year: 2024,
      mileage: "12,000 mi",
      fuel: "Gasoline",
      seats: 4,
      bodyType: "Luxury SUV",
      image: "https://i.pinimg.com/736x/83/c2/3d/83c23d1a2994813f77fb5cda491ff52e.jpg",
    },
    {
      id: 2,
      name: "BMW X5",
      price: "$65,200",
      year: 2023,
      mileage: "8,500 mi",
      fuel: "Hybrid",
      seats: 5,
      bodyType: "Luxury SUV",
      image: "https://i.pinimg.com/736x/8c/7d/d6/8c7dd6126fcf0a7240677dcfc2b11f64.jpg",
    },
    {
      id: 3,
      name: "Audi Q7",
      price: "$59,900",
      year: 2023,
      mileage: "10,200 mi",
      fuel: "Diesel",
      seats: 7,
      bodyType: "Luxury SUV",
      image: "https://i.pinimg.com/736x/0e/23/a0/0e23a0853760d96421bfaabe319e6592.jpg",
    },
    {
      id: 4,
      name: "Mercedes GLE",
      price: "$78,500",
      year: 2024,
      mileage: "5,000 mi",
      fuel: "Gasoline",
      seats: 5,
      bodyType: "Luxury SUV",
      image: "https://i.pinimg.com/originals/e1/51/14/e15114c9be9102ebd98b15054a1d353d.jpg",
    },
    {
      id: 5,
      name: "Porsche Cayenne",
      price: "$85,000",
      year: 2023,
      mileage: "7,200 mi",
      fuel: "Gasoline",
      seats: 5,
      bodyType: "Luxury SUV",
      image: "https://i.pinimg.com/originals/b0/08/72/b00872b392869d6e31f724721d09af8e.jpg",
    },
    {
      id: 6,
      name: "Mahindra Scorpio",
      price: "$58,300",
      year: 2024,
      mileage: "3,500 mi",
      fuel: "Hybrid",
      seats: 5,
      bodyType: "SUV",
      image: "https://feeds.abplive.com/onecms/images/uploaded-images/2022/10/10/a4c9c99167ff7a8af37cbb7dd8e325c4166538799003125_original.jpg",
    },
    {
      id: 7,
      name: "Honda Civic",
      price: "$28,300",
      year: 2023,
      mileage: "12,500 mi",
      fuel: "Gasoline",
      seats: 5,
      bodyType: "Sedan",
      image: "https://i.pinimg.com/736x/b4/80/e3/b480e3e7f7e488d7afe0f7b5e45a3bec.jpg",
    },
    {
      id: 8,
      name: "Toyota Corolla",
      price: "$25,200",
      year: 2023,
      mileage: "15,000 mi",
      fuel: "Hybrid",
      seats: 5,
      bodyType: "Sedan",
      image: "https://s-media-cache-ak0.pinimg.com/originals/de/22/54/de2254e24780ec765e01e93234cb9992.jpg",
    },
    {
      id: 9,
      name: "Maruti Swift",
      price: "$15,500",
      year: 2023,
      mileage: "8,000 mi",
      fuel: "Gasoline",
      seats: 5,
      bodyType: "Hatchback",
      image: "https://wallpaperaccess.com/full/9105341.jpg",
    },
  ];

  const brands = [
    { name: "Maruti Suzuki", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/maruti.jpg" },
    { name: "Hyundai", logo: "	https://stimg.cardekho.com/pwa/img/brandLogo_168x84/hyundai.jpg" },
    { name: "Tata", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/tata.jpg" },
    { name: "Honda", logo: "	https://stimg.cardekho.com/pwa/img/brandLogo_168x84/honda.jpg" },
    { name: "Renault", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/renault.jpg" },
    { name: "Kia", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/kia.jpg" },
    { name: "Mahindra", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/mahindra.jpg" },
    { name: "MG Motors", logo: "	https://stimg.cardekho.com/pwa/img/brandLogo_168x84/mg.jpg" },
    { name: "Volkswagen", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/volkswagen.jpg" },
    { name: "Toyota", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/toyota.jpg" },
    { name: "Skoda", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/skoda.jpg" },
    { name: "Mercedes", logo: "https://stimg.cardekho.com/pwa/img/brandLogo_168x84/mercedes-benz.jpg" },
  ];
  
  const bodyTypes = ["Hatchback", "Sedan", "SUV", "Luxury SUV", "Luxury Sedan"];

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

      <PremiumCarsSlider cars={premiumCars} />

      <div className="text-center mt-16">
        <h2 className="text-xl md:text-2xl font-bold text-heading">
          OUR COMPLETE INVENTORY
        </h2>
        <p className="text-muted-foreground mt-2">
          Every Car. Every Style. Your Perfect Match Awaits.
        </p>
      </div>

      <BodyTypeSlider allCars={premiumCars} bodyTypes={bodyTypes} />
      <BrandGrid brands={brands} />
    </div>
  );
}