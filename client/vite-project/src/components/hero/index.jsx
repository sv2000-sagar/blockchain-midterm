import React from "react";
import hero from "../../assets/hero.jpg";

const Hero = () => {
  return (
    <div className="py-8 border-10 border-white">
      <img
        className="rounded-lg m-auto "
        width={"50%"}
        // width={"100%"}
        // height={"20%"}
        layout="responsive"
        src={hero}
      />
    </div>
  );
};

export default Hero;
