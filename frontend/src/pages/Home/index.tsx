import { useScrollReveal } from '../../hooks/useScrollReveal';
import Hero from '../../components/Hero';
import MarqueeBand from '../../components/MarqueeBand';
import About from '../../components/About';
import Concept from '../../components/Concept';
import Teams from '../../components/Teams';
import FCode from '../../components/FCode';
import Btc from '../../components/Btc';
import ShowcaseNight from '../../components/ShowcaseNight';
import Timeline from '../../components/Timeline';
import Partners from '../../components/Partners';
import Awards from '../../components/Awards';
import Club from '../../components/Club';

const Home = () => {
  useScrollReveal();

  return (
    <>
      <Hero />
      <MarqueeBand />
      <About />
      <Concept />
      <Teams />
      <FCode />
      <Btc />
      <ShowcaseNight />
      <Timeline />
      <Partners />
      <Awards />
      <Club />
    </>
  );
};

export default Home;
