import FeaturedEquipments from "@/components/FeaturedEquipments/FeaturedEquipments";
import Gallery from "@/components/Gallery/Gallery";
import HeroSection from "@/components/HeroSection/HeroSection";
import NewsLetter from "@/components/NewLetter/NewLetter";
import PageSearch from "@/components/PageSearch/PageSearch";
import { getFeaturedEquipments } from "@/libs/apis";


const Home = async () => {
  const featuredEquipments = await getFeaturedEquipments();

  return (
    <>
  <HeroSection />
  <PageSearch />
  <FeaturedEquipments featuredEquipments={featuredEquipments} />
  <Gallery />
  <NewsLetter/>
  </>
  );
};

export default Home;