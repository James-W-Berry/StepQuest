import React, { useState } from "react";
import {
  Button,
  Grid,
  IconButton,
  Snackbar,
  Typography,
} from "@material-ui/core";
import colors from "../../../assets/colors";
import { joinChallengeBatch } from "../../../api/userApi";

import CloseIcon from "@material-ui/icons/Close";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SettingsIcon from "@material-ui/icons/Settings";

export default function SettingsAccordion(props) {
  const {
    userId,
    challengeDetails,
    setDisplayConfirmDelete,
    setDisplayConfirmLeave,
    setDisplayAddAdmin,
  } = props;

  const [displayToast, setDisplayToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        id="actions"
        style={{ display: "flex" }}
      >
        <SettingsIcon />
        <Typography className={"section-body"} style={{ marginLeft: "10px" }}>
          Settings
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {challengeDetails.data.admin.includes(userId) &&
          challengeDetails.data.participants.includes(userId) ? (
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography className="section-body">
                Leave this challenge
              </Typography>
              <Button
                style={{
                  backgroundColor: "red",
                  margin: "0px 20px 0px 0px",
                  color: colors.white,
                }}
                onClick={() => setDisplayConfirmLeave(true)}
              >
                Leave
              </Button>
            </Grid>
          ) : (
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography className="section-body">
                Join this challenge
              </Typography>

              <Button
                style={{
                  backgroundColor: "red",
                  margin: "0px 20px 0px 0px",
                  color: colors.white,
                }}
                onClick={() =>
                  joinChallengeBatch().then((response) => {
                    if (response.success) {
                      setToastMessage(
                        `Successfully joined ${challengeDetails.data.title}`
                      );
                      setDisplayToast(true);
                    } else {
                      setToastMessage(response.message);
                      setDisplayToast(true);
                    }
                  })
                }
              >
                Join
              </Button>
            </Grid>
          )}
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography className="section-body">
              Add another admin to this challenge{" "}
            </Typography>

            <Button
              style={{
                backgroundColor: "red",
                margin: "0px 20px 0px 0px",
                color: colors.white,
              }}
              onClick={() => setDisplayAddAdmin(true)}
            >
              Add Admin
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography className="section-body" style={{ textAlign: "start" }}>
              Delete this challenge. This will end the challenge for all
              participants.
            </Typography>

            <Button
              style={{
                backgroundColor: "red",
                margin: "0px 20px 0px 0px",

                color: colors.white,
              }}
              onClick={() => setDisplayConfirmDelete(true)}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </AccordionDetails>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={displayToast}
        autoHideDuration={5000}
        onClose={() => setDisplayToast(false)}
        message={toastMessage}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setDisplayToast(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </Accordion>
  );
}
