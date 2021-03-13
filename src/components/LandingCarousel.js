import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import Carousel from "react-bootstrap/Carousel";
import { Typography, Divider, Dialog } from "@material-ui/core";

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
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item interval={13800}>
        <div
          style={{
            height: "175px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "15px",
          }}
        >
          <TeamIcon />
        </div>

        <Carousel.Caption>
          <p style={{ color: colors.almostBlack }}>
            Tools to record your fitness activities with friends, family, and
            coworkers
          </p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item interval={13800}>
        <div
          style={{
            height: "175px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "15px",
          }}
        />

        <Carousel.Caption>
          <div>
            <ChartIcon />
            <p style={{ color: colors.almostBlack }}>
              Track organization, team, and individual activities over time
            </p>
          </div>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item interval={13800}>
        <div
          style={{
            height: "175px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "15px",
          }}
        />

        <Carousel.Caption>
          <div>
            <TargetIcon />
            <p style={{ color: colors.almostBlack }}>
              Set goals and encourage team members to increase physical wellness
              together
            </p>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
