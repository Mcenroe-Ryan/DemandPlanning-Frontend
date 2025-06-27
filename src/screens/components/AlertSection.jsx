import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import ShareOutlined from "@mui/icons-material/ShareOutlined";

export const AlertsSection = () => {
  const timePeriods = [
    { label: "Y", value: "year" },
    { label: "Q", value: "quarter" },
    { label: "M", value: "month" },
    { label: "W", value: "week" },
  ];

  const historicalData = [
    400, 190, 350, 100, 180, 120, 110, 140, 200, 260, 310, 400,
  ];
  const forecastData = [150, 200, 250, 180, 120, 160];

  const categories = [
    "Feb 2024",
    "Mar 2024",
    "Apr 2024",
    "May 2024",
    "Jun 2024",
    "Jul 2024",
    "Aug 2024",
    "Sep 2024",
    "Oct 2024",
    "Nov 2024",
    "Dec 2024",
    "Jan 2025",
    "Feb 2025",
    "Mar 2025",
    "Apr 2025",
    "May 2025",
    "Jun 2025",
    "Jul 2025",
  ];

  const chartOptions = {
    title: { text: undefined },
    chart: {
      type: "line",
      height: 500,
      backgroundColor: "#fafcff",
      spacing: [10, 10, 10, 10],
    },
    xAxis: {
      categories,
      tickmarkPlacement: "on", // Ensures lines start/end at first/last point
      labels: {
        align: "center",
        rotation: 0,
        style: {
          fontSize: "12px",
          color: "#b0b8c1",
          fontWeight: 500,
        },
      },
      lineColor: "#e0e7ef",
      tickColor: "#e0e7ef",
      gridLineWidth: 1,
      gridLineColor: "#e0e7ef",
      gridZIndex: 1,
      // Do NOT set min, max, startOnTick, endOnTick for categories!
    },
    yAxis: {
      title: { text: null },
      gridLineWidth: 1,
      gridLineColor: "#e0e7ef",
      min: 0,
      max: 500,
      tickInterval: 100,
      labels: {
        style: { color: "#b0b8c1", fontWeight: 500 },
      },
    },
    tooltip: {
      shared: true,
      valueSuffix: " units",
    },
    plotOptions: {
      series: {
        marker: { enabled: false },
        lineWidth: 2,
        states: {
          hover: { enabled: true, lineWidth: 3 },
        },
        // This makes sure the line does not extend past first/last point
        // (Default behavior with tickmarkPlacement: 'on')
      },
    },
    series: [
      {
        name: "Historical",
        data: historicalData.concat(Array(forecastData.length).fill(null)),
        color: "#e53935",
        lineWidth: 2,
        dashStyle: "Solid",
      },
      {
        name: "Forecast",
        data: Array(historicalData.length).fill(null).concat(forecastData),
        color: "#e53935",
        lineWidth: 2,
        dashStyle: "Dash",
      },
    ],
    credits: { enabled: false },
    legend: { enabled: false },
  };

  return (
    <Paper
      elevation={0}
      sx={{ width: "100%", border: 1, borderColor: "grey.300" }}
    >
      {/* Controls Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1,
          borderLeft: 1,
          borderRight: 1,
          borderColor: "grey.300",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
          <ToggleButtonGroup value="month" exclusive aria-label="time period">
            {timePeriods.map((period) => (
              <ToggleButton
                key={period.value}
                value={period.value}
                sx={{
                  width: 38,
                  height: 24,
                  border: 1,
                  borderColor: "primary.600",
                  borderRadius: "50px",
                  p: 0,
                  "&.Mui-selected": {
                    bgcolor: "primary.600",
                    color: "white",
                    "&:hover": {
                      bgcolor: "primary.700",
                    },
                  },
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color={period.value === "month" ? "white" : "text.secondary"}
                >
                  {period.label}
                </Typography>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        {/* Right Controls */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: 260,
            justifyContent: "flex-end",
          }}
        >
          <Select
            value="XGBoost"
            size="small"
            displayEmpty
            renderValue={() => "Model - XGBoost"}
            sx={{
              minWidth: 150,
              height: 32,
              fontSize: 14,
              "& .MuiSelect-select": {
                py: 0.5,
                px: 1.5,
              },
            }}
            IconComponent={KeyboardArrowDown}
          >
            <MenuItem value="XGBoost">XGBoost</MenuItem>
            <MenuItem value="RandomForest">Random Forest</MenuItem>
            <MenuItem value="LSTM">LSTM</MenuItem>
          </Select>
          <Button size="small" sx={{ minWidth: 0, p: 0 }}>
            <ShareOutlined fontSize="small" />
          </Button>
          <Button size="small" sx={{ minWidth: 0, p: 0 }}>
            <FileDownloadOutlined fontSize="small" />
          </Button>
        </Box>
      </Box>
      {/* Highcharts Area */}
      <Box sx={{ px: 2, py: 2 }}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Box>
    </Paper>
  );
};
