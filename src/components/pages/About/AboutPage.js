import { Typography } from "@material-ui/core";
import React from "react";

export default function About() {
  return (
    <div>
      <Typography>
        Here's a cool about pages with project description and links
      </Typography>
      <Typography>Attributions:</Typography>
      <Typography>
        Photo by
        <a href="https://unsplash.com/@victorfreitas?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
          Victor Freitas
        </a>
        on
        <a href="https://unsplash.com/s/photos/fitness?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
          Unsplash
        </a>
      </Typography>
    </div>
  );
}
