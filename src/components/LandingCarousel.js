import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import Carousel from "react-bootstrap/Carousel";

import colors from "../assets/colors";
import Img from "react-image";
import team from "../assets/team.png";
import target from "../assets/target.png";
import chart from "../assets/chart.png";

const TeamIcon = () => <Img src={team} height={60} width={60} />;
const TargetIcon = () => <Img src={target} height={60} width={60} />;
const ChartIcon = () => <Img src={chart} height={60} width={60} />;

export default function LandingCarousel(props) {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="carouselcontainer">
      <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item interval={13800}>
          <div
            style={{
              minHeight: "200px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "15px",
            }}
          >
            <TeamIcon />
          </div>

          <Carousel.Caption>
            <p style={{ color: colors.white }}>
              Record your fitness activities with friends, family, and coworkers
            </p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item interval={13800}>
          <div
            style={{
              minHeight: "200px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "15px",
            }}
          />

          <Carousel.Caption>
            <div>
              <ChartIcon />
              <p style={{ color: colors.white }}>
                Track team activities over time
              </p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item interval={13800}>
          <div
            style={{
              minHeight: "200px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "15px",
            }}
          />

          <Carousel.Caption>
            <div>
              <TargetIcon />
              <p style={{ color: colors.white }}>
                Set goals and encourage team members to increase physical
                wellness
              </p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
