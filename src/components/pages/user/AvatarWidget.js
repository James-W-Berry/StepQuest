import React, { useState } from "react";
import Avatar, { Piece } from "avataaars";
import {
  ButtonBase,
  Dialog,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { withStyles, useTheme } from "@material-ui/core/styles";
import colors from "../../../assets/colors";
import { Close } from "@material-ui/icons";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  topTypeOptions,
  facialHairTypeOptions,
  accessoriesTypeOptions,
  mouthTypeOptions,
  noseTypeOptions,
  eyeTypeOptions,
  eyeBrowTypeOptions,
  clotheTypeOptions,
  clotheColorTypeOptions,
} from "./AvatarOptions";

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: colors.stepitup_blue,
  },
});

export default function AvatarWidget(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [avatarCreatorVisible, setAvatarCreatorVisible] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState({
    avatarStyle: "Circle",
    topType: "ShortHairShortCurly",
    accessoriesType: "Blank",
    hairColor: "BrownDark",
    facialHairType: "BeardLight",
    clotheType: "Hoodie",
    clotheColor: "Black",
    eyeType: "Happy",
    noseType: "Default",
    eyeBrowType: "Default",
    mouthType: "Smile",
    skinColor: "Light",
  });

  const openAvatarCreator = () => {
    setAvatarCreatorVisible(true);
  };

  const handleAvatarCreatorClose = () => {
    setAvatarCreatorVisible(false);
  };

  const handleOptionChange = (option, event) => {
    setAvatarOptions({ ...avatarOptions, [option]: event.target.value });
  };

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography style={{ color: "#f7f7f5" }} variant="h6">
          {children}
        </Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleAvatarCreatorClose}
          >
            <Close />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  return (
    <div>
      <Typography>Customize Your Avatar</Typography>
      <ButtonBase onClick={openAvatarCreator}>
        <Avatar
          style={{ width: "175px", height: "175px" }}
          avatarStyle="Circle"
          topType="ShortHairShortCurly"
          accessoriesType="Blank"
          hairColor="BrownDark"
          facialHairType="BeardLight"
          clotheType="Hoodie"
          clotheColor="Black"
          eyeType="Happy"
          eyeBrowType="Default"
          mouthType="Smile"
          skinColor="Light"
        />
      </ButtonBase>

      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        onClose={handleAvatarCreatorClose}
        aria-labelledby="customized-dialog-title"
        open={avatarCreatorVisible}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.almostBlack,
          }}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={handleAvatarCreatorClose}
          >
            Customize Your Avatar
          </DialogTitle>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <Avatar
            style={{ width: "175px", height: "175px", margin: "10px" }}
            avatarStyle={avatarOptions.avatarStyle}
            topType={avatarOptions.topType}
            accessoriesType={avatarOptions.accessoriesType}
            hairColor={avatarOptions.hairColor}
            facialHairType={avatarOptions.facialHairType}
            clotheType={avatarOptions.clotheType}
            clotheColor={avatarOptions.clotheColor}
            eyeType={avatarOptions.eyeType}
            eyebrowType={avatarOptions.eyebrowType}
            mouthType={avatarOptions.mouthType}
            skinColor={avatarOptions.skinColor}
          />
          <InputLabel style={{ marginTop: "20px" }} id="top-type-select-label">
            Head
          </InputLabel>
          <Select
            labelId="top-type-label"
            id="top-type"
            value={avatarOptions.topType}
            onChange={(event) => handleOptionChange("topType", event)}
          >
            {Object.entries(topTypeOptions).map((option) => {
              return (
                <MenuItem key={option[0]} value={option[0]}>
                  {option[1]}
                </MenuItem>
              );
            })}
          </Select>
          <InputLabel
            style={{ marginTop: "20px" }}
            id="facial-hair-select-label"
          >
            Facial Hair
          </InputLabel>
          <Select
            labelId="facial-hair-label"
            id="facial-hair"
            value={avatarOptions.facialHairType}
            onChange={(event) => handleOptionChange("facialHairType", event)}
          >
            {Object.entries(facialHairTypeOptions).map((option) => {
              return (
                <MenuItem key={option[0]} value={option[0]}>
                  {option[1]}
                </MenuItem>
              );
            })}
          </Select>
          <InputLabel
            style={{ marginTop: "20px" }}
            id="accessories-select-label"
          >
            Accessories
          </InputLabel>
          <Select
            labelId="accessories-label"
            id="accessories"
            value={avatarOptions.accessoriesType}
            onChange={(event) => handleOptionChange("accessoriesType", event)}
          >
            {Object.entries(accessoriesTypeOptions).map((option) => {
              return (
                <MenuItem key={option[0]} value={option[0]}>
                  {option[1]}
                </MenuItem>
              );
            })}
          </Select>

          <InputLabel style={{ marginTop: "20px" }} id="mouth-select-label">
            Mouth
          </InputLabel>
          <Select
            labelId="mouth-label"
            id="mouth"
            value={avatarOptions.mouthType}
            onChange={(event) => handleOptionChange("mouthType", event)}
          >
            {Object.entries(mouthTypeOptions).map((option) => {
              return (
                <MenuItem key={option[0]} value={option[0]}>
                  {option[1]}
                </MenuItem>
              );
            })}
          </Select>

          <InputLabel style={{ marginTop: "20px" }} id="nose-select-label">
            Nose
          </InputLabel>
          <Select
            labelId="nose-label"
            id="nose"
            value={avatarOptions.noseType}
            onChange={(event) => handleOptionChange("noseType", event)}
          >
            {Object.entries(noseTypeOptions).map((option) => {
              return (
                <MenuItem key={option[0]} value={option[0]}>
                  {option[1]}
                </MenuItem>
              );
            })}
          </Select>

          <InputLabel style={{ marginTop: "20px" }} id="eye-select-label">
            Eyes
          </InputLabel>
          <Select
            labelId="eye-label"
            id="eye"
            value={avatarOptions.eyeType}
            onChange={(event) => handleOptionChange("eyeType", event)}
          >
            {Object.entries(eyeTypeOptions).map((option) => {
              return (
                <MenuItem key={option[0]} value={option[0]}>
                  {option[1]}
                </MenuItem>
              );
            })}
          </Select>

          <InputLabel style={{ marginTop: "20px" }} id="eyebrow-select-label">
            Eye Brows
          </InputLabel>
          <Select
            labelId="eyebrow-label"
            id="eye"
            value={avatarOptions.eyeBrowType}
            onChange={(event) => handleOptionChange("eyeBrowType", event)}
          >
            {Object.entries(eyeBrowTypeOptions).map((option) => {
              return (
                <MenuItem key={option[0]} value={option[0]}>
                  {option[1]}
                </MenuItem>
              );
            })}
          </Select>

          <InputLabel style={{ marginTop: "20px" }} id="clothes-select-label">
            Clothes
          </InputLabel>
          <Select
            labelId="clothes-label"
            id="clothes"
            value={avatarOptions.clotheType}
            onChange={(event) => handleOptionChange("clotheType", event)}
          >
            {Object.entries(clotheTypeOptions).map((option) => {
              return (
                <MenuItem key={option[0]} value={option[0]}>
                  {option[1]}
                </MenuItem>
              );
            })}
          </Select>

          <InputLabel
            style={{ marginTop: "20px" }}
            id="clothes-color-select-label"
          >
            Clothes Color
          </InputLabel>
          <Select
            labelId="clothes-color-label"
            id="clothes-color"
            value={avatarOptions.clotheColor}
            onChange={(event) => handleOptionChange("clotheColor", event)}
          >
            {Object.entries(clotheColorTypeOptions).map((option) => {
              return (
                <MenuItem key={option[0]} value={option[0]}>
                  {option[1]}
                </MenuItem>
              );
            })}
          </Select>
        </div>
      </Dialog>
    </div>
  );
}
