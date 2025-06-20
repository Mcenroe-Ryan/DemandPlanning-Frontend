import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Checkbox,
  Button,
  Menu,
} from "@mui/material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import ShareIcon from "@mui/icons-material/Share";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CheckIcon from "@mui/icons-material/Check";
import OptionalParamsMenu from "./OptionalParamsMenu";
import ForecastChart from "./ForecastChart";

// --- Helper function for consensus update API ---
async function updateConsensusForecastAPI(payload) {
  const response = await fetch("http://localhost:5000/api/forecast/consensus", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update consensus forecast");
  }
  return response.json();
}

const CORE_ROWS = [
  "Actual",
  "Baseline Forecast",
  "ML Forecast",
  "Consensus",
  "Revenue Forecast (₹ in lakhs)",
];
const FORECAST_ROWS = [
  "Baseline Forecast",
  "ML Forecast",
  "Consensus",
  "Revenue Forecast (₹ in lakhs)",
];
const OPTIONAL_ROWS = [
  "Sales",
  "Promotion/Marketing",
  "Inventory Level %",
  "Stock out days",
  "On Hand",
];

function buildRollingMonths() {
  const months = [];
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
  for (let i = 0; i < 12; i += 1) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const label = d.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    months.push(label);
  }
  return months;
}

// Helper to get YYYY-MM-01 from "Apr 25"
function getMonthDate(label) {
  const [mon, yr] = label.split(" ");
  const yearNum = 2000 + parseInt(yr, 10);
  const monthIdx = new Date(Date.parse(mon + " 1, 20" + yr)).getMonth() + 1;
  return `${yearNum}-${monthIdx.toString().padStart(2, "0")}-01`;
}

export default function ForecastTable({
  selectedCountry,
  selectedState,
  selectedCities,
  selectedPlants,
  selectedCategories,
  selectedSKUs,
  selectedChannels,
  startDate,
  endDate,
}) {
  const [period, setPeriod] = useState("M");
  const periodOptions = ["M", "W"];
  const [showForecast, setShowForecast] = useState(true);
  const [optionalRows, setOptionalRows] = useState([]);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // For Add New menu anchor
  const [anchorEl, setAnchorEl] = useState(null);

  // For editing consensus cells
  const [editingCell, setEditingCell] = useState({ month: null, row: null });
  const [editValue, setEditValue] = useState("");
  const [updatingCell, setUpdatingCell] = useState({ month: null, row: null });

  const months = useMemo(() => buildRollingMonths(), []);
  const futureMonthSet = useMemo(() => {
    const today = new Date();
    const currentMonthKey = today.getFullYear() * 12 + today.getMonth();
    const set = new Set();
    months.forEach((label) => {
      const [mon, yr] = label.split(" ");
      const monthIdx = new Date(Date.parse(mon + " 1, 20" + yr)).getMonth();
      const yearNum = 2000 + parseInt(yr, 10);
      const key = yearNum * 12 + monthIdx;
      if (key > currentMonthKey) set.add(label);
    });
    return set;
  }, [months]);

  const keyMap = {
    Actual: "actual_units",
    "Baseline Forecast": "baseline_forecast",
    "ML Forecast": "ml_forecast",
    Consensus: "consensus_forecast",
    "Revenue Forecast (₹ in lakhs)": "revenue_forecast_lakhs",
    Sales: "sales_units",
    "Promotion/Marketing": "promotion_marketing",
    "Inventory Level %": "inventory_level_pct",
    "Stock out days": "stock_out_days",
    "On Hand": "on_hand_units",
  };

  // Fetch data function (refactored for reuse)
  const fetchForecastData = () => {
    setIsLoading(true);
    fetch("http://localhost:5000/api/forecast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
        country: selectedCountry,
        state: selectedState,
        cities: selectedCities,
        plants: selectedPlants,
        categories: selectedCategories,
        skus: selectedSKUs,
        channels: selectedChannels,
      }),
    })
      .then((res) => res.json())
      .then((raw) => {
        const ds = {};
        // Dynamically compute month names between startDate and endDate
        const monthSet = new Set();
        const start = new Date(startDate);
        const end = new Date(endDate);
        while (start <= end) {
          const label = start.toLocaleString("default", {
            month: "short",
            year: "2-digit",
          });
          monthSet.add(label);
          start.setMonth(start.getMonth() + 1);
        }
        Array.from(monthSet).forEach((m) => {
          ds[m] = {};
          [...CORE_ROWS, ...OPTIONAL_ROWS].forEach((row) => {
            ds[m][row] = "-";
          });
        });
        raw.forEach((item) => {
          const dateStr =
            item.month_name || item.item_date || item.forecast_month;
          if (!dateStr) return;
          const date = new Date(dateStr);
          const label = date.toLocaleString("default", {
            month: "short",
            year: "2-digit",
          });
          if (!ds[label]) return;
          Object.entries(keyMap).forEach(([rowLabel, jsonKey]) => {
            const val = item[jsonKey];
            if (val !== undefined && val !== null && val !== "NULL") {
              ds[label][rowLabel] = val === "" ? "-" : val;
            }
          });
        });
        setData(ds);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setData({});
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchForecastData();
    // eslint-disable-next-line
  }, [
    startDate,
    endDate,
    selectedCountry,
    selectedState,
    selectedCities,
    selectedPlants,
    selectedCategories,
    selectedSKUs,
    selectedChannels,
  ]);

  const baseRows = [...CORE_ROWS, ...optionalRows];
  const allRows = showForecast
    ? baseRows
    : baseRows.filter((r) => !FORECAST_ROWS.includes(r));

  // Add New menu handlers
  const handleAddRowsClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      {/* Header Bar */}
      <Box
        mt={0}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2.5}
        py={0.5}
        bgcolor="background.paper"
        borderRight={1}
        borderBottom={1}
        borderLeft={1}
        borderColor="action.disabled"
      >
        <Stack direction="row" spacing={5} alignItems="center">
          {/* Period selector */}
          <Stack direction="row" spacing={1}>
            {periodOptions.map((label) => (
              <Button
                key={label}
                variant={period === label ? "contained" : "outlined"}
                color={period === label ? "primary" : "inherit"}
                onClick={() => setPeriod(label)}
                sx={{
                  minWidth: 36,
                  height: 28,
                  borderRadius: 1.5,
                  px: 1.5,
                  fontWeight: 600,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  boxShadow: "none",
                  textTransform: "none",
                }}
              >
                {label}
                {period === label && (
                  <CheckIcon sx={{ fontSize: 16, ml: 0.5 }} />
                )}
              </Button>
            ))}
            <Checkbox
              icon={
                <CheckBoxIcon
                  sx={{ width: 16, height: 16, color: "text.secondary" }}
                />
              }
              checkedIcon={
                <CheckBoxIcon
                  sx={{ width: 16, height: 16, color: "primary.main" }}
                />
              }
              checked={showForecast}
              onChange={(e) => setShowForecast(e.target.checked)}
              sx={{ p: 0.5, ml: 2 }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 400, fontSize: 14, ml: 0.5 }}
            >
              Forecast
            </Typography>
          </Stack>
        </Stack>
        {/* Right-side action buttons */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton size="small" onClick={handleAddRowsClick}>
            <AddBoxOutlinedIcon
              sx={{ width: 20, height: 20, color: "text.secondary" }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            PaperProps={{
              style: { minWidth: 200 },
            }}
          >
            <OptionalParamsMenu
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              selected={optionalRows}
              onChange={setOptionalRows}
            />
          </Menu>
          <IconButton size="small">
            <SwapVertIcon
              sx={{ width: 20, height: 20, color: "text.secondary" }}
            />
          </IconButton>
          <IconButton size="small">
            <ShareIcon
              sx={{ width: 20, height: 20, color: "text.secondary" }}
            />
          </IconButton>
          <IconButton size="small">
            <DownloadIcon
              sx={{ width: 20, height: 20, color: "text.secondary" }}
            />
          </IconButton>
          <IconButton size="small">
            <OpenInFullIcon
              sx={{ width: 20, height: 20, color: "text.secondary" }}
            />
          </IconButton>
        </Stack>
      </Box>
      {/* Table */}
      <Box
        sx={{
          p: 3,
          bgcolor: "common.white",
          borderRadius: 2,
          boxShadow: 1,
          border: "1px solid",
          borderColor: "grey.200",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            minWidth: 900,
            fontFamily: "inherit",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  position: "sticky",
                  left: 0,
                  background: "#f7fafd",
                  zIndex: 2,
                  fontWeight: 700,
                  fontSize: 13,
                  textTransform: "uppercase",
                  padding: "8px 16px",
                  borderRight: "1px solid #e0e7ef",
                  borderBottom: "2px solid #e0e7ef",
                  color: "#3c4257",
                  minWidth: 140,
                }}
              ></th>
              {months.map((m) => (
                <th
                  key={m}
                  style={{
                    background: "#f7fafd",
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    padding: "8px 12px",
                    borderBottom: "2px solid #e0e7ef",
                    color: "#3c4257",
                    minWidth: 90,
                    ...(futureMonthSet.has(m) && { background: "#e9f0f7" }),
                  }}
                >
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allRows.map((label, idx) => (
              <tr
                key={label}
                style={{
                  background: idx % 2 === 1 ? "#f7fafd" : "#fff",
                }}
              >
                <td
                  style={{
                    position: "sticky",
                    left: 0,
                    background: "#fff",
                    zIndex: 1,
                    fontWeight: 600,
                    fontSize: 14,
                    padding: "8px 16px",
                    borderRight: "1px solid #e0e7ef",
                    borderBottom: "1px solid #e0e7ef",
                    color: "#222a36",
                    minWidth: 140,
                  }}
                >
                  {label}
                </td>
                {months.map((m) => {
                  const value = data?.[m]?.[label];
                  const isConsensusRow = label === "Consensus";
                  const isEditing =
                    editingCell.month === m && editingCell.row === label;
                  const isUpdating =
                    updatingCell.month === m && updatingCell.row === label;
                  return (
                    <td
                      key={m}
                      style={{
                        background: futureMonthSet.has(m)
                          ? "#e9f0f7"
                          : undefined,
                        padding: "8px 12px",
                        borderBottom: "1px solid #e0e7ef",
                        fontSize: 14,
                        color: "#222a36",
                        minWidth: 90,
                        cursor: isConsensusRow ? "pointer" : "default",
                      }}
                      onClick={() => {
                        if (isConsensusRow && !isEditing && !isUpdating) {
                          setEditingCell({ month: m, row: label });
                          setEditValue(value === "-" ? "" : value);
                        }
                      }}
                    >
                      {isConsensusRow && isEditing ? (
                        <input
                          type="number"
                          value={editValue}
                          style={{
                            width: "70px",
                            fontSize: 14,
                            padding: "2px 4px",
                            border: "1px solid #aaa",
                            borderRadius: 4,
                          }}
                          autoFocus
                          disabled={isUpdating}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={async () => {
                            setUpdatingCell({ month: m, row: label });

                            // Always send arrays for all filters
                            const payload = {
                              country_name: Array.isArray(selectedCountry)
                                ? selectedCountry
                                : [selectedCountry],
                              state_name: Array.isArray(selectedState)
                                ? selectedState
                                : [selectedState],
                              city_name: Array.isArray(selectedCities)
                                ? selectedCities
                                : [selectedCities],
                              plant_name: Array.isArray(selectedPlants)
                                ? selectedPlants
                                : [selectedPlants],
                              category_name: Array.isArray(selectedCategories)
                                ? selectedCategories
                                : [selectedCategories],
                              sku_code: Array.isArray(selectedSKUs)
                                ? selectedSKUs
                                : [selectedSKUs],
                              channel_name: Array.isArray(selectedChannels)
                                ? selectedChannels
                                : [selectedChannels],
                              start_date: startDate,
                              end_date: endDate,
                              consensus_forecast: editValue,
                            };

                            console.log("Consensus update payload:", payload);

                            try {
                              const apiResponse =
                                await updateConsensusForecastAPI(payload);
                              console.log(
                                "Consensus update API response:",
                                apiResponse
                              );
                              setEditingCell({ month: null, row: null });
                              setUpdatingCell({ month: null, row: null });
                              fetchForecastData(); // Refresh table after update
                            } catch (err) {
                              console.error("Consensus update API error:", err);
                              alert("Failed to update consensus forecast");
                              setEditingCell({ month: null, row: null });
                              setUpdatingCell({ month: null, row: null });
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.target.blur();
                            } else if (e.key === "Escape") {
                              setEditingCell({ month: null, row: null });
                            }
                          }}
                        />
                      ) : isConsensusRow ? (
                        <span style={{ color: "#1976d2", fontWeight: 500 }}>
                          {value === undefined || value === null ? "-" : value}
                        </span>
                      ) : value === undefined || value === null ? (
                        "-"
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      {data && <ForecastChart months={months} data={data} />}
    </>
  );
}
