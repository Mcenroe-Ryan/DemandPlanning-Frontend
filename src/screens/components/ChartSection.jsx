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
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useAlert } from "./AlertContext"; // Import the context

export const ChartSection = () => {
  const { selectAlert, setLoading } = useAlert(); // Use context instead of props

  const [alertsData, setAlertsData] = useState([]);
  const [rawAlertsData, setRawAlertsData] = useState([]);
  const [loading, setLoadingState] = useState(true);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedAlertId, setSelectedAlertId] = useState(null);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${day} ${month}, ${year} ${time}`;
  };

  // Function to transform API data to component format
  const transformAlertData = (apiData) => {
    return apiData.map((alert) => ({
      id: alert.id,
      date: formatDate(alert.error_start_date),
      message: `${alert.city_name} (${alert.plant_name}) - ${alert.category_name} (${alert.sku_code}) - ${alert.error_label}`,
      checked: false,
      type: alert.error_type,
      style: "normal",
      rawData: alert,
    }));
  };

  // Fetch alerts from API
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoadingState(true);
        const response = await fetch("http://localhost:5000/api/getAllAlerts");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRawAlertsData(data);
        const transformedData = transformAlertData(data);
        setAlertsData(transformedData);

        const initialCheckedState = transformedData.reduce((acc, alert) => {
          acc[alert.id] = alert.checked;
          return acc;
        }, {});
        setCheckedItems(initialCheckedState);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching alerts:", err);
      } finally {
        setLoadingState(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle alert row click/selection - UPDATED TO USE CONTEXT
  const handleAlertClick = async (alert) => {
    setSelectedAlertId(alert.id);
    setLoading(true); // Set loading in context

    const filters = {
      model_name: "XGBoost",
      startDate: alert.rawData.error_start_date,
      endDate: alert.rawData.error_end_date,
      country: alert.rawData.country_name,
      state: alert.rawData.state_name,
      cities: alert.rawData.city_name,
      plants: alert.rawData.plant_name,
      categories: alert.rawData.category_name,
      skus: alert.rawData.sku_code,
      channels: alert.rawData.channel_name,
    };

    try {
      const response = await fetch("http://localhost:5000/api/forecastAlerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const forecastData = await response.json();
      // Update context with both alert and forecast data
      selectAlert({
        selectedAlert: alert.rawData,
        forecastData: forecastData,
      });
    } catch (err) {
      console.error("❌ Error fetching forecast data:", err);
      selectAlert({
        selectedAlert: alert.rawData,
        forecastData: null,
        error: err.message,
      });
    } finally {
      setLoading(false); // Remove loading in context
    }
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          border: 1,
          borderColor: "grey.300",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Loading alerts...
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          border: 1,
          borderColor: "error.main",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <ErrorIcon color="error" sx={{ mr: 1 }} />
        <Typography variant="body2" color="error">
          Error loading alerts: {error}
        </Typography>
      </Paper>
    );
  }

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
            Alerts &amp; Errors ({alertsData.length})
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
          minHeight: alertsData.length === 0 ? 60 : "auto",
        }}
      >
        {alertsData.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              No alerts found
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0} sx={{ width: "100%" }}>
            {alertsData.map((alert) => (
              <Box
                key={alert.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "pointer",
                  backgroundColor:
                    selectedAlertId === alert.id
                      ? "rgba(25, 118, 210, 0.08)"
                      : "transparent",
                  "&:hover": {
                    bgcolor:
                      selectedAlertId === alert.id
                        ? "rgba(25, 118, 210, 0.12)"
                        : "grey.200",
                  },
                  borderRadius: 1,
                  p: 0.5,
                  transition: "background-color 0.2s ease",
                }}
                onClick={() => handleAlertClick(alert)}
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
                      checked={checkedItems[alert.id] || false}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(alert.id);
                      }}
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
                    minWidth: 140,
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
        )}

        <Divider orientation="vertical" sx={{ width: 2.5, height: 144 }} />
      </Box>
    </Paper>
  );
};
