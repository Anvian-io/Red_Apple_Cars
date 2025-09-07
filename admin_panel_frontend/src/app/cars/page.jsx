"use client";

import { CarSection } from "@/components/cars/CarsSection";
import { Navbar } from "@/components/Navbar/Navbar";


export default function CarsPage({ isExpanded }) {
  return (
    <div className="overflow-auto w-full">
      <Navbar>
        <CarSection isExpanded={isExpanded} />
      </Navbar>
    </div>
  );
}


//   return (
//     <div className="p-6">
//       <CarSection isExpanded={true} />
//     </div>
//   );
// }

// import { RoleSection,Navbar } from "@/components";
// export default function Role({ isExpanded }) {
//   return (
//     <div
//     className="overflow-auto w-full "
//     >
//       <Navbar>
//       <RoleSection isExpanded={isExpanded} />
//       </Navbar>
//     </div>
//   );
// }