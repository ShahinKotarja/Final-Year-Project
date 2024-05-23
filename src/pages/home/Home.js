import React from "react";
import styles from "./Home.module.scss";
import {
  AdShowcase,
  AdInfo,
  HomeCategories,
  HomeRecommendations,
  AdShowcase2,
  AdShowcase3,
} from "../../components/index";

const Home = () => {
  return (
    <section className={`${styles.homeMainContainer}`}>
      <AdShowcase />
      <AdInfo />
      <HomeCategories />
      <HomeRecommendations />
      <AdShowcase2 />
      <AdShowcase3 />
    </section>
  );
};

export default Home;
