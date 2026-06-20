import { HeroSection } from '@/components/HeroSection';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { WhyUs } from '@/components/WhyUs';
import { Testimonials } from '@/components/Testimonials';
import { CallToAction } from '@/components/CallToAction';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <WhyUs />
      <Testimonials />
      <CallToAction />
    </>
  );
}
