import Lottie, { useLottie } from "lottie-react";
import loading_0 from "../assets/loading_0.json";
import loading_1 from "../assets/loading_1.json";
import loading_2 from "../assets/loading_2.json";
import loading_3 from "../assets/loading_3.json";

const Loading = () => {
  const number = Math.floor(Math.random() * 4);
  let data = 0;
  switch (number) {
    case 0:
      data = loading_0;
      break;
    case 1:
      data = loading_1;
      break;
    case 2:
      data = loading_2;

      break;
    case 3:
      data = loading_3;

      break;
    default:
  }
  const options = {
    animationData: data,
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options);
  return View;
};

export default Loading;
