import MainLayout from "../components/layout/MainLayout";
import Hero from "../components/home/Hero";
import SocialProof from "../components/home/SocialProof";
import HowToUse from "../components/home/HowToUse";
import OurProduct from "../components/home/OurProduct";
import EcoImpact from "../components/home/EcoImpact";
import CTA from "../components/home/CTA";

const Home = () => {
  return (
    <MainLayout>
      <Hero />
      <SocialProof />
      <HowToUse />
      <OurProduct />
      <EcoImpact />
      <CTA />
    </MainLayout>
  );
};

export default Home;
