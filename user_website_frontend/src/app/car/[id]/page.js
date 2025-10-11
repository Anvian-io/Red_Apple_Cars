'use client';
import { getAllCars, getCar } from '@/services/cars/carServices';
import React from 'react';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const CarPage = () => {
  const [basicCarDetails, setBasicCarDetails] = useState(null);
  const [advanceCarDetails, setAdvanceCarDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await getCar(params.id);
        console.log('API car:', response);
        if (response.data && response.data.status) {
          const car = response.data.data.car;
          const carDetails = response.data.data.carDetails;

          const mappedBasicCarDetails = {
            id: car._id,
            name: car.name,
            real_price: `$${car.actual_price_bwp.toLocaleString()}`,
            numeric_real_Price: car.actual_price_bwp,
            sale_price: `$${car.real_price_bwp.toLocaleString()}`,
            numeric_sale_Price: car.real_price_bwp,
            image: car.main_image,
            description: car.description,
            car_company: car.car_company,
          };

          const mileageStr = carDetails.mileage || '0';
          const numericMileage = parseFloat(mileageStr);
          const mappedAdvanceCarDetails = {
            year: carDetails.year,
            mileage: carDetails.mileage,
            numericMileage,
            fuel: carDetails.fuel,
            seats: 5,
            driveType: carDetails.drive,
            transmission: carDetails.transmission,
            condition: carDetails.condition,
            location: carDetails.location,
            color: carDetails.color,
            engine_size: carDetails.engine_size,
            engine_type: carDetails.engine_type,
          };

          setBasicCarDetails(mappedBasicCarDetails);
          setAdvanceCarDetails(mappedAdvanceCarDetails);

          setGalleryImages([
            car.main_image,
            '/car-interior.jpg',
            '/car-engine.jpg',
            '/car-side.jpg',
            '/car-rear.jpg',
          ]);
        }
      } catch (error) {
        console.error('error fetching cars: ', error);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchCars();
    }
  }, [params?.id]);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Add your wishlist logic here
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: basicCarDetails.name,
        text: `Check out this ${basicCarDetails.name} for ${basicCarDetails.sale_price}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!basicCarDetails || !advanceCarDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Car Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The car you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300">
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        {/* <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <a href="#" className="hover:text-hover-text">
            Home
          </a>{' '}
          /
          <a href="#" className="hover:text-hover-text">
            {' '}
            Inventory
          </a>{' '}
          /<span className="text-text"> {basicCarDetails.name}</span>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images Only (Fixed) */}
          <div className="sticky top-8 self-start">
            <div className="bg-card-bg rounded-xl overflow-hidden shadow-lg mb-4">
              <div className="relative h-80 md:h-96">
                <Image
                  src={galleryImages[activeImage]}
                  alt={basicCarDetails.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {galleryImages.map((img, index) => (
                <div
                  key={index}
                  className={`relative h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                    activeImage === index
                      ? 'border-primary scale-105 shadow-md'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={img}
                    alt={`${basicCarDetails.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - All Details & Specifications */}
          <div>
            <div className="bg-card-bg rounded-xl p-6 shadow-lg mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-heading mb-2">
                    {basicCarDetails.name}
                  </h1>
                  <div className="flex items-center space-x-2 text-text mb-4">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                      {basicCarDetails.car_company}
                    </span>
                    <span>•</span>
                    <span>{advanceCarDetails.year}</span>
                    <span>•</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      {advanceCarDetails.condition}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={handleWishlist}
                    className={`p-3 rounded-full border transition-all duration-200 ${
                      isWishlisted
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'bg-secondary-bg border-border text-text hover:bg-red-50 hover:text-red-500'
                    }`}
                    title="Add to Wishlist"
                  >
                    <svg
                      className="w-5 h-5"
                      fill={isWishlisted ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-full bg-secondary-bg border border-border text-text hover:bg-blue-50 hover:text-blue-500 transition-all duration-200"
                    title="Share"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Price Section */}
              <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {basicCarDetails.real_price}
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      {basicCarDetails.sale_price}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                      Great Deal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Save $
                      {(
                        basicCarDetails.numeric_sale_Price -
                        basicCarDetails.numeric_real_Price
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-text leading-relaxed">
                  {basicCarDetails.description ||
                    'This premium vehicle offers exceptional performance, comfort, and style. With its advanced features and meticulous maintenance history, it represents an excellent value for discerning buyers.'}
                </p>
              </div>

              {/* Key Features Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center p-3 bg-secondary-bg rounded-lg hover:bg-secondary-bg/70 transition-colors">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Year</div>
                    <div className="font-semibold">
                      {advanceCarDetails.year}
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-secondary-bg rounded-lg hover:bg-secondary-bg/70 transition-colors">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Mileage</div>
                    <div className="font-semibold">
                      {advanceCarDetails.mileage} miles
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-secondary-bg rounded-lg hover:bg-secondary-bg/70 transition-colors">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Fuel Type</div>
                    <div className="font-semibold">
                      {advanceCarDetails.fuel}
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-secondary-bg rounded-lg hover:bg-secondary-bg/70 transition-colors">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Transmission</div>
                    <div className="font-semibold">
                      {advanceCarDetails.transmission}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Moved to Right Side */}
              <div className="bg-card-bg rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-heading mb-6 pb-2 border-b border-border">
                  Technical Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b border-border hover:bg-secondary-bg/50 px-2 rounded">
                    <span className="text-text font-medium">Engine Size</span>
                    <span className="font-semibold text-primary">
                      {advanceCarDetails.engine_size}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border hover:bg-secondary-bg/50 px-2 rounded">
                    <span className="text-text font-medium">Engine Type</span>
                    <span className="font-semibold text-primary">
                      {advanceCarDetails.engine_type}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border hover:bg-secondary-bg/50 px-2 rounded">
                    <span className="text-text font-medium">Drive Type</span>
                    <span className="font-semibold text-primary">
                      {advanceCarDetails.driveType}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border hover:bg-secondary-bg/50 px-2 rounded">
                    <span className="text-text font-medium">Seats</span>
                    <span className="font-semibold text-primary">
                      {advanceCarDetails.seats}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border hover:bg-secondary-bg/50 px-2 rounded">
                    <span className="text-text font-medium">Color</span>
                    <span className="font-semibold text-primary">
                      {advanceCarDetails.color}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border hover:bg-secondary-bg/50 px-2 rounded">
                    <span className="text-text font-medium">Location</span>
                    <span className="font-semibold text-primary">
                      {advanceCarDetails.location}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border hover:bg-secondary-bg/50 px-2 rounded">
                    <span className="text-text font-medium">Transmission</span>
                    <span className="font-semibold text-primary">
                      {advanceCarDetails.transmission}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border hover:bg-secondary-bg/50 px-2 rounded">
                    <span className="text-text font-medium">Fuel Type</span>
                    <span className="font-semibold text-primary">
                      {advanceCarDetails.fuel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CarPage;
