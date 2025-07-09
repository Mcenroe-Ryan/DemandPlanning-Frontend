import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import { useAlert } from "./AlertContext";

export const AlertsSection = () => {
  const { selectedAlertData, isLoading } = useAlert();

  const [selectedTimePeriod, setSelectedTimePeriod] = useState("month");
  const [selectedModel, setSelectedModel] = useState("XGBoost");
  const [chartData, setChartData] = useState(null);
  const [chartKey, setChartKey] = useState(0);

  // Styled time period toggle buttons
  const timePeriods = [
    { label: "M", value: "month" },
    { label: "W", value: "week" },
  ];

  const transformForecastData = (forecastData) => {
    if (!forecastData) return null;
    const arr = Array.isArray(forecastData) ? forecastData : [forecastData];
    if (arr.length === 0) return null;

    const categories = arr.map((item) => {
      const raw = item.month_name; // e.g., "2024-01" or "January 2024"
      const date = new Date(raw.length === 7 ? `${raw}-01` : raw); // try parsing
      return isNaN(date.getTime())
        ? raw
        : date.toLocaleDateString("en-US", {
            month: "short", // Jan
            year: "2-digit", // 24
          });
    });

    const actualUnits = arr.map((item) => parseFloat(item.actual_units) || 0);
    const mlForecast = arr.map((item) => parseFloat(item.ml_forecast) || 0);

    return { categories, actualUnits, mlForecast };
  };

  useEffect(() => {
    if (selectedAlertData && selectedAlertData.forecastData) {
      const transformed = transformForecastData(selectedAlertData.forecastData);
      setChartData(transformed);
      setChartKey((prev) => prev + 1);
    } else {
      setChartData(null);
    }
  }, [selectedAlertData]);

  const handleTimePeriodChange = (event, newValue) => {
    if (newValue !== null) setSelectedTimePeriod(newValue);
  };
  const handleModelChange = (event) => setSelectedModel(event.target.value);

  const defaultHistoricalData = [
    400, 190, 350, 100, 180, 120, 110, 140, 200, 260, 310, 400,
  ];
  const defaultForecastData = [150, 200, 250, 180, 120, 160];
  const defaultCategories = [
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

  const redColor = "#e53935";

  const getChartOptions = () => {
    const hasData =
      chartData && chartData.categories && chartData.categories.length > 0;
    if (!hasData) {
      return {
        title: { text: undefined },
        chart: {
          type: "line",
          height: 500,
          backgroundColor: "#fafcff",
          spacing: [10, 10, 10, 10],
        },
        xAxis: {
          categories: defaultCategories,
          tickmarkPlacement: "on",
          labels: {
            align: "center",
            style: { fontSize: "12px", color: "#b0b8c1" },
          },
          lineColor: "#e0e7ef",
          tickColor: "#e0e7ef",
          gridLineWidth: 1,
          gridLineColor: "#e0e7ef",
        },
        yAxis: {
          title: { text: null },
          gridLineWidth: 1,
          gridLineColor: "#e0e7ef",
          min: 0,
          max: 500,
          tickInterval: 100,
          labels: { style: { color: "#b0b8c1" } },
        },
        tooltip: { shared: true, valueSuffix: " units" },
        plotOptions: { series: { marker: { enabled: false }, lineWidth: 2 } },
        series: [
          {
            name: "Historical",
            data: defaultHistoricalData.concat(
              Array(defaultForecastData.length).fill(null)
            ),
            color: redColor,
            dashStyle: "Solid",
          },
          {
            name: "Forecast",
            data: Array(defaultHistoricalData.length)
              .fill(null)
              .concat(defaultForecastData),
            color: redColor,
            dashStyle: "Dash",
          },
        ],
        credits: { enabled: false },
        legend: { enabled: false },
      };
    }
    const { categories, actualUnits, mlForecast } = chartData;
    const maxVal = Math.max(...actualUnits, ...mlForecast);
    const yMax = Math.ceil((maxVal * 1.2) / 100) * 100;
    return {
      title: { text: undefined },
      chart: {
        type: "line",
        height: 500,
        backgroundColor: "#fafcff",
        spacing: [10, 10, 10, 10],
      },
      xAxis: {
        categories,
        tickmarkPlacement: "on",
        labels: {
          align: "center",
          style: { fontSize: "12px", color: "#b0b8c1" },
        },
        lineColor: "#e0e7ef",
        tickColor: "#e0e7ef",
        gridLineWidth: 1,
        gridLineColor: "#e0e7ef",
      },
      yAxis: {
        title: { text: null },
        gridLineWidth: 1,
        gridLineColor: "#e0e7ef",
        min: 0,
        max: yMax || 500,
        tickInterval: Math.ceil((yMax || 500) / 5 / 100) * 100,
        labels: { style: { color: "#b0b8c1" } },
      },
      tooltip: {
        shared: true,
        valueSuffix: " units",
        formatter: function () {
          let txt = `<b>${this.x}</b><br/>`;
          this.points.forEach((p) => {
            txt += `<span style="color:${p.color}">${
              p.series.name
            }</span>: <b>${p.y.toLocaleString()}</b> units<br/>`;
          });
          return txt;
        },
      },
      plotOptions: {
        series: {
          marker: { enabled: false },
          lineWidth: 2,
        },
      },
      series: [
        {
          name: "Actual Units",
          data: actualUnits,
          color: redColor,
          dashStyle: "Solid",
        },
        {
          name: "ML Forecast",
          data: mlForecast,
          color: redColor,
          dashStyle: "Dash",
        },
      ],
      credits: { enabled: false },
      legend: { enabled: false },
    };
  };

  const hasChartArea = !isLoading;

  return (
    <Paper>
      {/* Controls */}
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
        <ToggleButtonGroup
          value={selectedTimePeriod}
          exclusive
          onChange={handleTimePeriodChange}
          sx={{
            "& .MuiToggleButton-root": {
              width: 44,
              height: 22,
              border: "1px solid #2563EB",
              borderRadius: "50px",
              p: 0,
              fontWeight: 600,
              fontSize: "13px",
              lineHeight: "16px",
              minHeight: 0,
              minWidth: 0,
              color: "#2563EB",
              backgroundColor: "white",
              "&.Mui-selected": {
                backgroundColor: "#2563EB",
                color: "white",
                "&:hover": {
                  backgroundColor: "#1e4fc1",
                },
              },
              "&:not(:last-of-type)": {
                marginRight: 1,
              },
            },
          }}
        >
          {timePeriods.map((period) => (
            <ToggleButton key={period.value} value={period.value}>
              {period.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Select
            value={selectedModel}
            onChange={handleModelChange}
            size="small"
            displayEmpty
            renderValue={() => `Model - ${selectedModel}`}
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
      {/* Info / Error */}
      {selectedAlertData && selectedAlertData.error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {selectedAlertData.error}
        </Alert>
      )}
      {/* Loading */}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 500,
          }}
        >
          <CircularProgress size={24} />
          <Typography sx={{ ml: 2 }}>Loading forecast data...</Typography>
        </Box>
      )}
      {/* Chart */}
      {hasChartArea && (
        <Box sx={{ px: 2, py: 2 }}>
          <HighchartsReact
            key={chartKey}
            highcharts={Highcharts}
            options={getChartOptions()}
            allowChartUpdate
            updateArgs={[true, true, true]}
          />
        </Box>
      )}
    </Paper>
  );
};
