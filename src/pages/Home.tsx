import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import Spacing from '../components/spacing';
import MensNewArrivals from '../components/MensNewArrivals';
import WomensNewArrivals from '../components/WomensNewArrivals';
import ArvonPhilosophy from '../components/ArvonPhilosophy';
import EditorialLookbook from '../components/EditorialLookbook';
import FeaturedPieces from '../components/FeaturedPieces';
import ExperienceArvon from '../components/ExperienceArvon';
import ArvonMobileApp from '../components/ArvonMobileApp';
import TrustedVoices from '../components/TrustedVoices';
import ArvonExperience from '../components/ArvonExperience';
import StayUpdated from '../components/StayUpdated';

const Home = () => {
  return (
    <>
      <Hero />
      <Spacing className="h-[60px] md:h-[100px]" />
      <StatsBar />
      <Spacing className="h-[60px] md:h-[100px]" />
      <MensNewArrivals />
      <Spacing className="h-[60px] md:h-[100px]" />
      <WomensNewArrivals />
      <Spacing className="h-[60px] md:h-[100px]" />
      <ArvonPhilosophy />
      <EditorialLookbook />
      <Spacing className="h-[60px] md:h-[100px]" />
      <FeaturedPieces />
      <Spacing className="h-[60px] md:h-[100px]" />
      <ExperienceArvon />
      <Spacing className="h-[60px] md:h-[100px]" />
      <ArvonMobileApp />
      <Spacing className="h-[60px] md:h-[100px]" />
      <ArvonExperience />
      <Spacing className="h-[60px] md:h-[100px]" />
      <TrustedVoices />
      <Spacing className="h-[60px] md:h-[100px]" />
      <StayUpdated />
      <Spacing className="h-[60px] md:h-[100px]" />
    </>
  );
};

export default Home;