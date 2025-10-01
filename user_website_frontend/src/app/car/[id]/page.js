"use client";
import { getAllCars, getCar } from '@/services/cars/carServices';
import React from 'react'
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react'
import Image from 'next/image';

const CarPage = () => {
    const [basicCarDetails, setBasicCarDetails] = useState(null);
    const [advanceCarDetails, setAdvanceCarDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [galleryImages, setGalleryImages] = useState([]);
    const params = useParams();
    
    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                const response = await getCar(params.id);
                console.log("API car:", response);
                if (response.data && response.data.status) {
                    const car = response.data.data.car;         // main car info
                    const carDetails = response.data.data.carDetails; // technical details
                    
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
                    
                    const mileageStr = carDetails.mileage || "0";
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
                    
                    // Simulate gallery images (in a real app, this would come from API)
                    setGalleryImages([
                        car.main_image,
                        "/car-interior.jpg",
                        "/car-engine.jpg",
                        "/car-side.jpg",
                        "/car-rear.jpg"
                    ]);
                }
            } catch (error) {
                console.error("error fetching cars: ", error);
            } finally {
                setLoading(false);
            }
        };
        
        if (params?.id) {
            fetchCars();
        }
    }, [params?.id]);

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
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Car Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400">The car you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-text transition-colors duration-300">
        
           

            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                    <a href="#" className="hover:text-hover-text">Home</a> / 
                    <a href="#" className="hover:text-hover-text"> Inventory</a> / 
                    <span className="text-text"> {basicCarDetails.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Images */}
                    <div>
                        <div className="bg-card-bg rounded-xl overflow-hidden shadow-lg mb-4">
                            <div className="relative h-80 md:h-96">
                                <Image 
                                    src={galleryImages[activeImage]} 
                                    alt={basicCarDetails.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-2">
                            {galleryImages.map((img, index) => (
                                <div 
                                    key={index} 
                                    className={`relative h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${activeImage === index ? 'border-primary' : 'border-transparent'}`}
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

                    {/* Right Column - Details */}
                    <div>
                        <div className="bg-card-bg rounded-xl p-6 shadow-lg mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-heading mb-2">{basicCarDetails.name}</h1>
                                    <div className="flex items-center space-x-2 text-text">
                                        <span>{basicCarDetails.car_company}</span>
                                        <span>•</span>
                                        <span>{advanceCarDetails.year}</span>
                                        <span>•</span>
                                        <span>{advanceCarDetails.condition}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">{basicCarDetails.sale_price}</div>
                                    <div className="text-sm text-gray-500 line-through">{basicCarDetails.real_price}</div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-text">{basicCarDetails.description || "This premium vehicle offers exceptional performance, comfort, and style. With its advanced features and meticulous maintenance history, it represents an excellent value for discerning buyers."}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-secondary-bg rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Year</div>
                                        <div className="font-medium">{advanceCarDetails.year}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-secondary-bg rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Mileage</div>
                                        <div className="font-medium">{advanceCarDetails.mileage} miles</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-secondary-bg rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Fuel Type</div>
                                        <div className="font-medium">{advanceCarDetails.fuel}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-secondary-bg rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Transmission</div>
                                        <div className="font-medium">{advanceCarDetails.transmission}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button className="flex-1 bg-button-bg text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                                    Schedule Test Drive
                                </button>
                                <button className="flex-1 bg-secondary-bg text-primary py-3 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900 transition-colors">
                                    Make an Offer
                                </button>
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="bg-card-bg rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-heading mb-4">Specifications</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-text">Engine Size</span>
                                    <span className="font-medium">{advanceCarDetails.engine_size}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-text">Engine Type</span>
                                    <span className="font-medium">{advanceCarDetails.engine_type}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-text">Drive Type</span>
                                    <span className="font-medium">{advanceCarDetails.driveType}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-text">Seats</span>
                                    <span className="font-medium">{advanceCarDetails.seats}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-text">Color</span>
                                    <span className="font-medium">{advanceCarDetails.color}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-text">Location</span>
                                    <span className="font-medium">{advanceCarDetails.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-heading mb-6">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            "Premium Sound System",
                            "Leather Seats",
                            "Navigation System",
                            "Bluetooth Connectivity",
                            "Backup Camera",
                            "Sunroof/Moonroof",
                            "Heated Seats",
                            "Alloy Wheels"
                        ].map((feature, index) => (
                            <div key={index} className="bg-card-bg p-4 rounded-lg shadow-sm border border-border flex items-center">
                                <div className="w-8 h-8 bg-secondary-bg rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <span className="text-text">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mt-12 bg-card-bg rounded-xl p-6 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-bold text-heading mb-4">Contact Seller</h2>
                            <p className="text-text mb-6">Interested in this vehicle? Contact us for more information or to schedule a test drive.</p>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-secondary-bg rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Phone</div>
                                        <div className="font-medium">(555) 123-4567</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-secondary-bg rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Email</div>
                                        <div className="font-medium">info@cardealer.com</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-secondary-bg rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Location</div>
                                        <div className="font-medium">{advanceCarDetails.location}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-text mb-1">Name</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        className="w-full px-4 py-2 bg-input-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-input-text-bg"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-text mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        className="w-full px-4 py-2 bg-input-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-input-text-bg"
                                        placeholder="Your email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-text mb-1">Phone</label>
                                    <input 
                                        type="tel" 
                                        id="phone" 
                                        className="w-full px-4 py-2 bg-input-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-input-text-bg"
                                        placeholder="Your phone number"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-text mb-1">Message</label>
                                    <textarea 
                                        id="message" 
                                        rows="3"
                                        className="w-full px-4 py-2 bg-input-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-input-text-bg"
                                        placeholder="Your message"
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-button-bg text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

           
        </div>
    );
}

export default CarPage;