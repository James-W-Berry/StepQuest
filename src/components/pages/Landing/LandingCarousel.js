import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../App.css";
import Carousel from "react-bootstrap/Carousel";
import colors from "../../../assets/colors";
import Img from "react-image";
import team from "../../../assets/team.png";
import target from "../../../assets/target.png";
import chart from "../../../assets/chart.png";
import { makeStyles } from "@material-ui/core/styles";

const TeamIcon = () => <Img src={team} height={80} />;
const TargetIcon = () => <Img src={target} height={80} width={80} />;
const ChartIcon = () => <Img src={chart} height={80} width={80} />;

const useStyles = makeStyles((theme) => ({
  carouselcontainer: {
    backgroundColor: "#66cc3380",
    borderRadius: "20px",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.25)",
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
    [theme.breakpoints.up("md")]: {
      width: "50%",
    },
  },
}));

export default function LandingCarousel(props) {
  const classes = useStyles();
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <div className={classes.carouselcontainer}>
      <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item interval={13800}>
          <div
            style={{
              minHeight: "220px",
              height: "25%",
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
              minHeight: "220px",
              height: "25%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "15px",
            }}
          >
            <ChartIcon />
          </div>

          <Carousel.Caption>
            <div>
              <p style={{ color: colors.white }}>
                Track top performers and popular activities
              </p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item interval={13800}>
          <div
            style={{
              minHeight: "220px",
              height: "25%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "15px",
            }}
          >
            <TargetIcon />
          </div>

          <Carousel.Caption>
            <div>
              <p style={{ color: colors.white }}>
                Achieve physical wellness through team encouragement
              </p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
