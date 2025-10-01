"use client";
import { getAllCars } from "@/services/cars/carServices";
import React, { useEffect, useState } from "react";
import Link from "next/link";
const Page = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [driveTypes, setDriveTypes] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [locationTypes, setLocationTypes] = useState([]);
    const [transmissionTypes, setTransmissionTypes] = useState([]);
    const [conditionTypes, setConditionTypes] = useState([]);

    const [selectedDrive, setSelectedDrive] = useState("");
    const [selectedFuel, setSelectedFuel] = useState("");
    const [selectedTransmission, setSelectedTransmission] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("");

    const [minMileage, setMinMileage] = useState(0);
    const [maxMileage, setMaxMileage] = useState(100000);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await getAllCars({});
                console.log("API Response for cars:", response);
                if (response.data && response.data.status) {

                    const mappedCars = response.data.data.map((car) => {
                        const mileageStr = car.details.mileage || "0";
                        const numericMileage = parseFloat(mileageStr);
                        return {
                            id: car._id,
                            name: car.name,
                            price: `$${car.real_price_bwp.toLocaleString()}`,
                            numericPrice: car.real_price_bwp,
                            year: car.details.year,
                            mileage: car.details.mileage,
                            numericMileage,
                            fuel: car.details.fuel,
                            seats: 5,
                            driveType: car.details.drive,
                            image: car.main_image,
                            description: car.description,
                            car_company: car.car_company,
                            transmission: car.details.transmission,
                            condition: car.details.condition,
                            location: car.details.location,
                        }
                    });
                    setCars(mappedCars);
                    setFilteredCars(mappedCars);

                    setDriveTypes([...new Set(response.data.data.map((car) => car.details.drive))]);
                    setFuelTypes([...new Set(response.data.data.map((car) => car.details.fuel))]);
                    setLocationTypes([...new Set(response.data.data.map((car) => car.details.location))]);
                    setTransmissionTypes([...new Set(response.data.data.map((car) => car.details.transmission))]);
                    setConditionTypes([...new Set(response.data.data.map((car) => car.details.condition))]);
                }
            } catch (error) {
                console.error("error fetching cars: ", error);
            }
        };
        fetchCars();
    }, []);

    // Filtering logic
    useEffect(() => {
        let updatedCars = [...cars];

        if (selectedDrive) {
            updatedCars = updatedCars.filter((car) => car.driveType === selectedDrive);
        }
        if (selectedFuel) {
            updatedCars = updatedCars.filter((car) => car.fuel === selectedFuel);
        }
        if (selectedTransmission) {
            updatedCars = updatedCars.filter((car) => car.transmission === selectedTransmission);
        }
        if (selectedCondition) {
            updatedCars = updatedCars.filter((car) => car.condition === selectedCondition);
        }

        updatedCars = updatedCars.filter(
            (car) => car.numericMileage >= minMileage && car.numericMileage <= maxMileage
        );

        setFilteredCars(updatedCars);
    }, [selectedDrive, selectedFuel, selectedTransmission, selectedCondition, minMileage, maxMileage, cars]);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)] flex">
            {/* Sidebar */}
            <aside className="w-1/4 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] p-4">
                <h2 className="text-lg font-semibold text-[var(--heading)] mb-4">Filters</h2>

                {/* Mileage filter */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Mileage Range</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={minMileage}
                            onChange={(e) => setMinMileage(Number(e.target.value))}
                            className="w-20 p-1 rounded border border-[var(--border)] bg-[var(--input-bg)] text-[var(--input-text-bg)]"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            value={maxMileage}
                            onChange={(e) => setMaxMileage(Number(e.target.value))}
                            className="w-20 p-1 rounded border border-[var(--border)] bg-[var(--input-bg)] text-[var(--input-text-bg)]"
                        />
                    </div>
                </div>

                {/* Dropdown filters */}
                {[
                    { label: "Drive Type", options: driveTypes, state: selectedDrive, setter: setSelectedDrive },
                    { label: "Fuel Type", options: fuelTypes, state: selectedFuel, setter: setSelectedFuel },
                    { label: "Transmission", options: transmissionTypes, state: selectedTransmission, setter: setSelectedTransmission },
                    { label: "Condition", options: conditionTypes, state: selectedCondition, setter: setSelectedCondition },
                ].map(({ label, options, state, setter }) => (
                    <div key={label} className="mb-4">
                        <label className="block text-sm font-medium mb-1">{label}</label>
                        <select
                            value={state}
                            onChange={(e) => setter(e.target.value)}
                            className="w-full p-2 rounded border border-[var(--border)] bg-[var(--input-bg)] text-[var(--input-text-bg)]"
                        >
                            <option value="">All</option>
                            {options.map((opt, i) => (
                                <option key={i} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </aside>

            {/* Car grid */}
            <main className="flex-1 p-6">
                <h2 className="text-2xl font-bold text-[var(--header)] mb-6">
                    Available Cars ({filteredCars.length})
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredCars.length > 0 ? (
                        filteredCars.map((car) => (
                            <div
                                key={car.id}
                                className="bg-[var(--card-bg)] shadow-md rounded-2xl p-4 border border-[var(--border)] hover:shadow-lg transition"
                            >
                                <img
                                    src={car.image}
                                    alt={car.name}
                                    className="w-full h-40 object-cover rounded-xl mb-3"
                                />
                                <h3 className="text-lg font-semibold text-[var(--card-text)]">{car.name}</h3>
                                <p className="text-sm text-[var(--text)]">{car.car_company}</p>
                                <p className="text-[var(--primary)] font-bold mt-2">{car.price}</p>
                                <p className="text-xs text-[var(--text)] mt-1">
                                    {car.year} • {car.mileage} km • {car.fuel}
                                </p>
                                <Link
                                    href={`/car/${car.id}`}
                                    className="mt-3 block text-center bg-[var(--button-bg)] text-white font-medium py-2 px-4 rounded-lg hover:bg-[var(--hover-text)] transition"
                                >
                                    View Details
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-[var(--text)]">No cars match your filters.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Page;
