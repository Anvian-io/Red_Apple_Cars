// app/page.js
import AboutUs from "@/components/AboutUs/AboutUs";
import CarsInventory from "@/components/CarsInventory/CarsInventory";
import Contact from "@/components/Contact/Contact";
import Displayer from "@/components/Displayer/Displayer"
import Feedback from "@/components/Feedback/Feedback";
import Footer from "@/components/Footer/Footer";
import OurServices from "@/components/OurService/OurService";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Displayer />
      <CarsInventory/>
      <OurServices/>
      <AboutUs/>
      <Feedback/>
      <Contact/>
      <Footer/>
    </div>
  );
}