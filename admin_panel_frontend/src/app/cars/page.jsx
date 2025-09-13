"use client";

import { CarSection } from "@/components/cars/CarsSection";

export default function CarsPage({ isExpanded }) {
  return (
    <div className="">
      <CarSection isExpanded={isExpanded} />
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
