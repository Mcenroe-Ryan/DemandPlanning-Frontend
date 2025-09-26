import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Stack,
  Checkbox,
  Button,
  Link,
  Divider,
} from "@mui/material";

const MicrosoftLogo = () => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1px",
        width: 16,
        height: 16,
      }}
    >
      <Box sx={{ backgroundColor: "#f25022", width: 7, height: 7 }} />
      <Box sx={{ backgroundColor: "#7fba00", width: 7, height: 7 }} />
      <Box sx={{ backgroundColor: "#00a4ef", width: 7, height: 7 }} />
      <Box sx={{ backgroundColor: "#ffb900", width: 7, height: 7 }} />
    </Box>
  </Box>
);

export default function PermissionConsentDialog({
  open = true,
  appName = "SSO for Demand Planning",
  onAccept = () => {},
  onCancel = () => {},
}) {
  const [orgConsent, setOrgConsent] = useState(false);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          width: 460,
          maxWidth: 460,
          borderRadius: 0,
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Box sx={{ px: 4, pt: 3, pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <MicrosoftLogo />
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#323130" }}>
            Microsoft
          </Typography>
        </Box>
        <Divider />

        <DialogContent sx={{ px: 0, pt: 3, pb: 1 }}>
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  fontSize: 24,
                  color: "#323130",
                  mb: 0.5,
                  lineHeight: 1.2,
                }}
              >
                Permissions requested
              </Typography>
              <Typography sx={{ color: "#605e5c", fontSize: 15 }}>
                {appName}
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 400,
                  mb: 1.5,
                  color: "#323130",
                  fontSize: 15,
                }}
              >
                This app would like to:
              </Typography>

              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      mt: 0.5,
                      color: "#323130",
                      minWidth: "6px",
                    }}
                  >
                    ▼
                  </Typography>
                  <Typography
                    sx={{ fontSize: 15, color: "#323130", lineHeight: 1.4 }}
                  >
                    Maintain access to data you have given it access to
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      mt: 0.5,
                      color: "#323130",
                      minWidth: "6px",
                    }}
                  >
                    ▼
                  </Typography>
                  <Typography
                    sx={{ fontSize: 15, color: "#323130", lineHeight: 1.4 }}
                  >
                    Sign you in and read your profile
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mt: 1 }}>
              <Checkbox
                size="small"
                checked={orgConsent}
                onChange={(e) => setOrgConsent(e.target.checked)}
                sx={{
                  mt: -0.5,
                  "& .MuiSvgIcon-root": { fontSize: 18 },
                }}
              />
              <Typography sx={{ fontSize: 15, color: "#323130", mt: 0.3 }}>
                Consent on behalf of your organization
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: "#605e5c",
                fontSize: 13,
                lineHeight: 1.4,
                mt: 2,
              }}
            >
              Accepting these permissions means that you allow this app to use
              your data as specified in their terms of service and privacy
              statement.{" "}
              <Typography
                component="span"
                sx={{ fontWeight: 600, color: "#323130", fontSize: 13 }}
              >
                The publisher has not provided links to their terms for you to
                review.
              </Typography>{" "}
              You can change these permissions at{" "}
              <Link
                href="https://myapps.microsoft.com"
                target="_blank"
                rel="noreferrer"
                sx={{ color: "#0078d4", textDecoration: "none" }}
              >
                https://myapps.microsoft.com
              </Link>.{" "}
              <Link
                component="button"
                sx={{
                  color: "#0078d4",
                  textDecoration: "none",
                  fontSize: 13,
                  p: 0,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                Show details
              </Link>
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 0, pt: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              minWidth: 80,
              textTransform: "none",
              borderColor: "#8a8886",
              color: "#323130",
              "&:hover": {
                borderColor: "#323130",
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => onAccept({ orgConsent })}
            sx={{
              minWidth: 80,
              textTransform: "none",
              backgroundColor: "#0078d4",
              "&:hover": {
                backgroundColor: "#106ebe",
              },
            }}
          >
            Accept
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
