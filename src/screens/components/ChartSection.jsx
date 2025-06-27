import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  Checkbox,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export const ChartSection = () => {
  // Alert data for mapping
  const alertsData = [
    {
      id: 1,
      date: "22 Jan, 2025 12:34PM",
      message:
        "Hyderabad (HYD543) - Sweet Mixes (C5240200A) - Downward forecast detected.",
      checked: false,
      type: "error",
      style: "normal",
    },
    {
      id: 2,
      date: "22 Jan, 2025 12:34PM",
      message:
        "Bangalore (BANG182) - Masala (V0010150) - Flat line forecast detected.",
      checked: false,
      type: "error",
      style: "underline",
    },
    {
      id: 3,
      date: "22 Jan, 2025 12:34PM",
      message:
        "Pune (BANG182) - Masala (V0010150) - Baseline Forecast is consistently underperforming in Q4.",
      checked: true,
      type: "error",
      style: "lineThrough",
    },
    {
      id: 4,
      date: "22 Jan, 2025 12:34PM",
      message: "some warning message",
      checked: false,
      type: "warning",
      style: "normal",
    },
  ];

  const [checkedItems, setCheckedItems] = useState(
    alertsData.reduce((acc, alert) => {
      acc[alert.id] = alert.checked;
      return acc;
    }, {})
  );

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        border: 1,
        borderColor: "grey.300",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1.25,
          py: 0.5,
          borderBottom: 1,
          borderColor: "grey.300",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <InfoIcon sx={{ width: 13, height: 13 }} />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            Alerts &amp; Errors
          </Typography>
        </Box>
        <KeyboardArrowDownIcon sx={{ width: 16, height: 16 }} />
      </Box>

      {/* Alerts Container */}
      <Box
        sx={{
          bgcolor: "grey.100",
          p: 1.25,
          display: "flex",
          gap: 1.5,
          borderLeft: 1,
          borderRight: 1,
          borderBottom: 1,
          borderColor: "grey.300",
          boxShadow: "inset 2px 1px 4px rgba(0,0,0,0.2)",
        }}
      >
        <Stack spacing={0} sx={{ width: "100%" }}>
          {alertsData.map((alert) => (
            <Box
              key={alert.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ p: 1 }}>
                  <Checkbox
                    checked={checkedItems[alert.id]}
                    onChange={() => handleCheckboxChange(alert.id)}
                    size="small"
                    sx={{
                      p: 0,
                      width: 16,
                      height: 16,
                    }}
                  />
                </Box>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                {alert.date}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.25,
                  py: 0.5,
                }}
              >
                {alert.type === "error" ? (
                  <ErrorIcon
                    sx={{ width: 13, height: 13, color: "error.main" }}
                  />
                ) : (
                  <WarningIcon
                    sx={{ width: 13, height: 13, color: "warning.main" }}
                  />
                )}

                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    textDecoration:
                      alert.style === "underline"
                        ? "underline"
                        : alert.style === "lineThrough"
                        ? "line-through"
                        : "none",
                  }}
                >
                  {alert.message}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>

        {/* Scrollbar */}
        <Divider orientation="vertical" sx={{ width: 2.5, height: 144 }} />
      </Box>
    </Paper>
  );
};
