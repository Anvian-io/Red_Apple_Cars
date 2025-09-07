// Feedback page (page.jsx)
"use client";
import {  Navbar } from "@/components";
import  {FeedbackSection} from "@/components/Feedback/FeedbackSection";
export default function Role({ isExpanded }) {
  return (
    <div
    className="overflow-auto w-full "
    >
      {/* <Navbar> */}
        <FeedbackSection isExpanded={isExpanded} />
      {/* </Navbar> */}
    </div>
  );
}
