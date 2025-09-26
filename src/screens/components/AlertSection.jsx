// React and Highcharts dependencies
import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// MUI components for UI elements
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

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const AlertsSection = () => {
  const { selectedAlertData, isLoading } = useAlert();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("month");
  const [selectedModel, setSelectedModel] = useState("");
  const [hcOptions, setHcOptions] = useState(null);

  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState(null);

  useEffect(() => {
    setModelsLoading(true);
    fetch(`${API_BASE_URL}/models`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch models");
        return res.json();
      })
      .then((data) => {
        setModels(data);
        if (data.length > 0) setSelectedModel(data[0].model_name);
        setModelsLoading(false);
      })
      .catch((err) => {
        setModelsError(err.message);
        setModelsLoading(false);
      });
  }, []);

  const transformForecastData = (forecastData) => {
    if (!forecastData) return null;
    const arr = Array.isArray(forecastData) ? forecastData : [forecastData];
    if (arr.length === 0) return null;

    const categories = arr.map((item) => {
      const raw = item.sales_week_start;
      const date = new Date(raw.length === 7 ? `${raw}-01` : raw);
      return isNaN(date.getTime())
        ? raw
        : date.toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          });
    });

    const actualUnits = arr.map((item) => parseFloat(item.actual_units) || 0);
    const mlForecast = arr.map((item) => parseFloat(item.ml_forecast) || 0);

    return { categories, actualUnits, mlForecast };
  };

  const getDefaultOptions = () => ({
    title: { text: null },
    chart: {
      type: "line",
      height: 500,
      backgroundColor: "#fafcff",
      spacing: [10, 10, 10, 10],
    },
    xAxis: {
      categories: ["Feb 2024"],
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
    plotOptions: {
      series: {
        marker: { enabled: false },
        lineWidth: 2,
      },
    },
    series: [
      {
        name: "Historical",
        data: [400].concat(Array(1).fill(null)),
        color: "#e53935",
        dashStyle: "Solid",
      },
      {
        name: "Forecast",
        data: Array(1).fill(null).concat([160]),
        color: "#e53935",
        dashStyle: "Dash",
      },
    ],
    credits: { enabled: false },
    legend: { enabled: false },
  });

  useEffect(() => {
    if (!selectedAlertData || !selectedAlertData.forecastData) {
      setHcOptions(getDefaultOptions());
      return;
    }

    const { forecastData, selectedAlert } = selectedAlertData;
    const transformedData = transformForecastData(forecastData);

    if (!transformedData) {
      setHcOptions(getDefaultOptions());
      return;
    }

    const plotBands = selectedAlert
      ? [
          {
            from: transformedData.categories.findIndex((cat) => {
              const alertStartMonth = new Date(
                selectedAlert.error_start_date
              ).toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
              });
              return cat === alertStartMonth;
            }),
            to:
              transformedData.categories.findIndex((cat) => {
                const alertEndMonth = new Date(
                  selectedAlert.error_end_date
                ).toLocaleDateString("en-US", {
                  month: "short",
                  year: "2-digit",
                });
                return cat === alertEndMonth;
              }) + 1,
            color:
              selectedAlert.error_type === "error"
                ? "rgba(255, 68, 68, 0.3)"
                : "rgba(255, 165, 0, 0.3)",
            label: {
              text: selectedAlert.error_label,
              style: {
                color:
                  selectedAlert.error_type === "error" ? "#ff0000" : "#ff8800",
                fontWeight: "bold",
              },
            },
          },
        ]
      : [];

    const validPlotBands = plotBands.filter(
      (band) => band.from !== -1 && band.to !== 0
    );

    const { categories, actualUnits, mlForecast } = transformedData;
    const maxVal = Math.max(...actualUnits, ...mlForecast);
    const yMax = Math.ceil((maxVal * 1.2) / 100) * 100 || 500;

    const newOptions = {
      title: { text: null },
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
        plotBands: validPlotBands,
      },
      yAxis: {
        title: { text: null },
        gridLineWidth: 1,
        gridLineColor: "#e0e7ef",
        min: 0,
        max: yMax,
        tickInterval: Math.ceil(yMax / 5 / 100) * 100,
        labels: { style: { color: "#b0b8c1" } },
      },
      tooltip: {
        shared: true,
        valueSuffix: " units",
        formatter: function () {
          return this.points.reduce(
            (result, point) =>
              `${result}<span style="color:${point.color}">${
                point.series.name
              }</span>: <b>${point.y.toLocaleString()}</b> units<br/>`,
            `<b>${this.x}</b><br/>`
          );
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
          color: "#e53935",
          dashStyle: "Solid",
        },
        {
          name: "ML Forecast",
          data: mlForecast,
          color: "#e53935",
          dashStyle: "Dash",
        },
      ],
      credits: { enabled: false },
      legend: { enabled: false },
    };

    setHcOptions(newOptions);
  }, [selectedAlertData]);

  const handleTimePeriodChange = (event, newValue) => {
    if (newValue !== null) setSelectedTimePeriod(newValue);
  };
  const handleModelChange = (event) => setSelectedModel(event.target.value);

  const hasChartArea = !isLoading;

  return (
    <Paper>
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
        </ToggleButtonGroup>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {modelsLoading ? (
            <CircularProgress size={20} />
          ) : modelsError ? (
            <Alert severity="error" sx={{ m: 0 }}>
              {modelsError}
            </Alert>
          ) : (
            <Select
              value={selectedModel}
              onChange={handleModelChange}
              size="small"
              displayEmpty
              renderValue={() =>
                selectedModel ? `Model - ${selectedModel}` : "Select Model"
              }
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
              {models.map((model) => (
                <MenuItem key={model.model_id} value={model.model_name}>
                  {model.model_name}
                </MenuItem>
              ))}
            </Select>
          )}
          <Button size="small" sx={{ minWidth: 0, p: 0 }}>
            <ShareOutlined fontSize="small" />
          </Button>
          <Button size="small" sx={{ minWidth: 0, p: 0 }}>
            <FileDownloadOutlined fontSize="small" />
          </Button>
        </Box>
      </Box>

      {selectedAlertData && selectedAlertData.error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {selectedAlertData.error}
        </Alert>
      )}

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

      {hasChartArea && hcOptions && (
        <Box sx={{ px: 2, py: 2 }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={hcOptions}
            allowChartUpdate={true}
            updateArgs={[true]}
          />
        </Box>
      )}
    </Paper>
  );
};
