import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Checkbox,
  Button,
  Menu,
  Popover,
  Avatar,
} from "@mui/material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import ShareIcon from "@mui/icons-material/Share";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CheckIcon from "@mui/icons-material/Check";
import LockIcon from "@mui/icons-material/Lock";
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

// FIXED: Month mapping to avoid Date.parse issues
const MONTH_MAP = {
  "JAN": 0, "FEB": 1, "MAR": 2, "APR": 3,
  "MAY": 4, "JUN": 5, "JUL": 6, "AUG": 7,
  "SEP": 8, "OCT": 9, "NOV": 10, "DEC": 11
};

function buildMonthLabelsBetween(startDate, endDate) {
  const months = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setDate(1);
  end.setDate(1);

  while (start <= end) {
    const label = start.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    months.push(label);
    start.setMonth(start.getMonth() + 1);
  }
  return months;
}

// FIXED: Helper to get YYYY-MM-01 from "Apr 25" using explicit month mapping
function getMonthDate(label) {
  const [mon, yr] = label.split(" ");
  const yearNum = 2000 + parseInt(yr, 10);
  
  // FIXED: Use explicit month mapping instead of unreliable Date.parse
  const monthIdx = MONTH_MAP[mon.toUpperCase()];
  
  if (monthIdx === undefined) {
    console.error(`Invalid month abbreviation: ${mon}`);
    return null;
  }
  
  return `${yearNum}-${(monthIdx + 1).toString().padStart(2, "0")}-01`;
}

// FIXED: Helper to convert API date (month-end) back to month label consistently
function dateToMonthLabel(dateStr) {
  if (!dateStr) return null;
  
  const date = new Date(dateStr);
  // Always use the month/year from the date, regardless of whether it's month-start or month-end
  return date.toLocaleString("default", {
    month: "short",
    year: "2-digit",
  });
}

// --- Helper to format numbers by country ---
function formatNumberByCountry(value, country) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "-" ||
    isNaN(Number(value))
  ) {
    return value;
  }
  if (
    Array.isArray(country) &&
    country.includes("India") &&
    country.includes("USA")
  ) {
    return Number(value).toLocaleString("en-US");
  }
  if (
    (Array.isArray(country) &&
      country.length === 1 &&
      country[0] === "India") ||
    country === "India"
  ) {
    return Number(value).toLocaleString("en-IN");
  }
  if (
    (Array.isArray(country) && country.length === 1 && country[0] === "USA") ||
    country === "USA"
  ) {
    return Number(value).toLocaleString("en-US");
  }
  return Number(value).toLocaleString();
}

// FIXED: Helper to determine if a month is locked (<= current month) using explicit mapping
function isMonthLocked(monthLabel) {
  const [mon, yr] = monthLabel.split(" ");
  
  const monthIdx = MONTH_MAP[mon.toUpperCase()];
  if (monthIdx === undefined) {
    console.error(`Invalid month abbreviation in isMonthLocked: ${mon}`);
    return false;
  }
  
  const yearNum = 2000 + parseInt(yr, 10);
  const now = new Date();
  
  return (
    yearNum < now.getFullYear() ||
    (yearNum === now.getFullYear() && monthIdx <= now.getMonth())
  );
}

// --- Lock Comment Popover ---
function LockCommentPopover({ open, anchorEl, onClose }) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{ style: { minWidth: 270, padding: 16 } }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: 8,
          }}
        >
          <Avatar
            src="https://randomuser.me/api/portraits/men/32.jpg"
            sx={{ width: 28, height: 28 }}
          />
          <div style={{ textAlign: "right", flexGrow: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Supreeth P</div>
            <div style={{ fontSize: 12, color: "#888" }}>4 days ago</div>
          </div>
        </div>
        <div style={{ fontSize: 14, marginBottom: 8 }}>
          Edited The correct option is B. 24.
          <br />
          Demand of Company B<br />
          Demand of Company
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar
            src="https://randomuser.me/api/portraits/men/32.jpg"
            sx={{ width: 28, height: 28 }}
          />
          <input
            style={{
              width: "100%",
              fontSize: 13,
              padding: "6px 8px",
              borderRadius: 6,
              border: "1px solid #ddd",
              marginTop: 4,
            }}
            placeholder="Reply"
            disabled
          />
        </div>
      </div>
    </Popover>
  );
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
  const [anchorEl, setAnchorEl] = useState(null);

  // For editing consensus cells
  const [editingCell, setEditingCell] = useState({ month: null, row: null });
  const [editValue, setEditValue] = useState("");
  const [updatingCell, setUpdatingCell] = useState({ month: null, row: null });

  // For lock comment popup
  const [lockComment, setLockComment] = useState({
    open: false,
    anchor: null,
  });

  const months = useMemo(() => {
    return buildMonthLabelsBetween(startDate, endDate);
  }, [startDate, endDate]);

  // FIXED: futureMonthSet calculation using explicit month mapping
  const futureMonthSet = useMemo(() => {
    const today = new Date();
    const currentMonthKey = today.getFullYear() * 12 + today.getMonth();
    const set = new Set();
    
    months.forEach((label) => {
      const [mon, yr] = label.split(" ");
      const monthIdx = MONTH_MAP[mon.toUpperCase()];
      
      if (monthIdx !== undefined) {
        const yearNum = 2000 + parseInt(yr, 10);
        const key = yearNum * 12 + monthIdx;
        if (key > currentMonthKey) {
          set.add(label);
        }
      }
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

  // FIXED: Fetch data function with improved data mapping and consistent month ordering
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
        console.log("Raw API response:", raw); // DEBUG: Log raw response
        
        const ds = {};
        
        // Use consistent month label generation
        const months = buildMonthLabelsBetween(startDate, endDate);
        
        // Initialize data structure with consistent month order
        months.forEach((m) => {
          ds[m] = {};
          [...CORE_ROWS, ...OPTIONAL_ROWS].forEach((row) => {
            ds[m][row] = "-";
          });
        });

        // FIXED: Improved data mapping with debugging
        raw.forEach((item) => {
          const dateStr = item.month_name || item.item_date || item.forecast_month;
          if (!dateStr) return;
          
          // FIXED: Use the new consistent date-to-label converter
          const label = dateToMonthLabel(dateStr);
          console.log(`Mapping API date '${dateStr}' to label '${label}'`); // DEBUG
          
          if (!ds[label]) {
            console.warn(`No column found for label '${label}'`); // DEBUG
            return;
          }
          
          Object.entries(keyMap).forEach(([rowLabel, jsonKey]) => {
            const val = item[jsonKey];
            if (val !== undefined && val !== null && val !== "NULL") {
              ds[label][rowLabel] = val === "" ? "-" : val;
              if (rowLabel === "Consensus" && val !== "-") {
                console.log(`Mapped consensus value ${val} to column ${label}`); // DEBUG
              }
            }
          });
        });
        
        console.log("Final data structure:", ds); // DEBUG: Log final structure
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

  const [actualLatestMonth, setActualLatestMonth] = useState(null);

  useEffect(() => {
    if (!data) return;
    const months = Object.keys(data).sort((a, b) => {
      const aDate = new Date(getMonthDate(a));
      const bDate = new Date(getMonthDate(b));
      return bDate - aDate;
    });
    const latestMonth = months[0] || null;
    setActualLatestMonth(latestMonth);
  }, [data]);

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
                  const locked = isConsensusRow && isMonthLocked(m);
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
                      onClick={(e) => {
                        if (
                          isConsensusRow &&
                          locked &&
                          value &&
                          value !== "-"
                        ) {
                          setLockComment({
                            open: true,
                            anchor: e.currentTarget,
                          });
                        }
                        if (
                          isConsensusRow &&
                          !locked &&
                          !isEditing &&
                          !isUpdating
                        ) {
                          setEditingCell({ month: m, row: label });
                          setEditValue(value === "-" ? "" : value);
                        }
                      }}
                    >
                      {isConsensusRow && locked ? (
                        <span
                          style={{
                            color: "#aaa",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <LockIcon style={{ fontSize: 16 }} />
                          {value === undefined || value === null
                            ? "-"
                            : formatNumberByCountry(value, selectedCountry)}
                        </span>
                      ) : isConsensusRow && isEditing ? (
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
                            console.log(`Updating consensus for column: ${m}`); // DEBUG
                            const targetDate = getMonthDate(m);
                            console.log(`getMonthDate('${m}') returns: ${targetDate}`); // DEBUG
                            
                            setUpdatingCell({ month: m, row: label });
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
                              target_month: targetDate,
                            };
                            
                            console.log("Sending payload:", payload); // DEBUG
                            
                            try {
                              await updateConsensusForecastAPI(payload);
                              setEditingCell({ month: null, row: null });
                              setUpdatingCell({ month: null, row: null });
                              
                              // Add small delay to ensure backend update is complete
                              setTimeout(() => {
                                console.log("Refetching data after update..."); // DEBUG
                                fetchForecastData();
                              }, 100);
                            } catch (err) {
                              console.error("Update failed:", err); // DEBUG
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
                          {value === undefined || value === null
                            ? "-"
                            : formatNumberByCountry(value, selectedCountry)}
                        </span>
                      ) : value === undefined || value === null ? (
                        "-"
                      ) : (
                        formatNumberByCountry(value, selectedCountry)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      
      <LockCommentPopover
        open={lockComment.open}
        anchorEl={lockComment.anchor}
        onClose={() => setLockComment({ ...lockComment, open: false })}
      />
      {data && <ForecastChart months={months} data={data} />}
    </>
  );
}
