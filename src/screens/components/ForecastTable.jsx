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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
  Snackbar,
} from "@mui/material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import ShareIcon from "@mui/icons-material/Share";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import LockIcon from "@mui/icons-material/Lock";
import OptionalParamsMenu from "./OptionalParamsMenu";
import ForecastChart from "./ForecastChart";

// const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = `http://localhost:5000/api`;

async function updateConsensusForecastAPI(payload) {
  const response = await fetch(`${API_BASE_URL}/forecast/consensus`, {
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

// Month mapping to avoid Date.parse issues
const MONTH_MAP = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
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

function getMonthDate(label) {
  const [mon, yr] = label.split(" ");
  const yearNum = 2000 + parseInt(yr, 10);
  const monthIdx = MONTH_MAP[mon.toUpperCase()];
  if (monthIdx === undefined) return null;
  return `${yearNum}-${(monthIdx + 1).toString().padStart(2, "0")}-01`;
}

function dateToMonthLabel(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleString("default", {
    month: "short",
    year: "2-digit",
  });
}

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

function isMonthLocked(monthLabel) {
  const [mon, yr] = monthLabel.split(" ");
  const monthIdx = MONTH_MAP[mon.toUpperCase()];
  if (monthIdx === undefined) return false;
  const yearNum = 2000 + parseInt(yr, 10);
  const now = new Date();
  return (
    yearNum < now.getFullYear() ||
    (yearNum === now.getFullYear() && monthIdx <= now.getMonth())
  );
}

// --- Red Triangle Icon Component ---
const RedTriangleIcon = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        borderLeft: "8px solid transparent",
        borderTop: "8px solid #f44336",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
};

// --- Confirmation Dialog Component ---
function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm Approval",
  message = "Are you sure you want to approve the consensus? Once approved, this action cannot be undone.",
  editedDetails = null,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth={false}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: "auto",
          width: 360,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pb: 1,
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            bgcolor: "#ff9800",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          ⚠
        </Box>
        {title}
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <DialogContentText sx={{ mb: 2, color: "text.primary", fontSize: 14 }}>
          {message}
        </DialogContentText>

        {editedDetails && (
          <Box
            sx={{
              bgcolor: "#f5f5f5",
              p: 2,
              borderRadius: 1,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Edited Details
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "white",
                p: 1,
                borderRadius: 1,
                border: "1px solid #ddd",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Months
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {editedDetails.month}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {editedDetails.value}
                </Typography>
                <IconButton
                  size="small"
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#f44336",
                    color: "white",
                    "&:hover": { bgcolor: "#d32f2f" },
                  }}
                  onClick={onClose}
                >
                  ✕
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#ccc",
            color: "#666",
            "&:hover": {
              borderColor: "#999",
              bgcolor: "#f5f5f5",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            bgcolor: "#4caf50",
            "&:hover": { bgcolor: "#45a049" },
          }}
        >
          Confirm Approval
        </Button>
      </DialogActions>
    </Dialog>
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
            <div style={{ fontSize: 14, color: "#888" }}>4 days ago</div>
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
              fontSize: 14,
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
  modelName,
  setModelName,
  models,
  loadingModels,
  avgMapeData,
  canEditConsensus,
  setCanEditConsensus,
  openConsensusPopup,
  setOpenConsensusPopup,
  highlightTrigger, // ✅ IMPORTANT: Add this prop
}) {
  const [period, setPeriod] = useState("M");
  const periodOptions = ["M", "W"];
  const [showForecast, setShowForecast] = useState(true);
  const [optionalRows, setOptionalRows] = useState([]);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const [avgMape, setAvgMape] = useState(null);

  // For editing consensus cells
  const [editingCell, setEditingCell] = useState({ month: null, row: null });
  const [editValue, setEditValue] = useState("");
  const [updatingCell, setUpdatingCell] = useState({ month: null, row: null });

  // For tracking edited cells with triangle indicator
  const [editedCells, setEditedCells] = useState(new Set());

  // For lock comment popup
  const [lockComment, setLockComment] = useState({
    open: false,
    anchor: null,
  });

  // Add confirmation dialog state
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    month: null,
    row: null,
    value: null,
    pendingPayload: null,
  });

  // Add new state for error handling
  const [errorSnackbar, setErrorSnackbar] = useState({
    open: false,
    message: "",
  });

  // ✅ NEW: Add state for highlighting editable cells
  const [highlightEditableCells, setHighlightEditableCells] = useState(false);

  const months = useMemo(() => {
    if (
      typeof startDate === "string" &&
      typeof endDate === "string" &&
      startDate.length > 0 &&
      endDate.length > 0
    ) {
      return buildMonthLabelsBetween(startDate, endDate);
    }
    const today = new Date();
    today.setDate(1);
    const start = new Date(today);
    start.setMonth(start.getMonth() - 5);
    const end = new Date(today);
    end.setMonth(end.getMonth() + 5);
    return buildMonthLabelsBetween(
      start.toISOString().slice(0, 10),
      end.toISOString().slice(0, 10)
    );
  }, [startDate, endDate]);

  const firstFutureMonth = useMemo(() => {
    const today = new Date();
    const currentKey = today.getFullYear() * 12 + today.getMonth();
    const sortedMonths = months.filter((label) => {
      const [mon, yr] = label.split(" ");
      const monthIdx = MONTH_MAP[mon.toUpperCase()];
      const yearNum = 2000 + parseInt(yr, 10);
      const key = yearNum * 12 + monthIdx;
      return key > currentKey;
    });
    return sortedMonths[0] || null;
  }, [months]);

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

  // Add filtered months based on showForecast checkbox
  const visibleMonths = useMemo(() => {
    if (showForecast) {
      return months; // Show all months when forecast is enabled
    } else {
      // Show only past and current months when forecast is disabled
      const today = new Date();
      const currentMonthKey = today.getFullYear() * 12 + today.getMonth();
      
      return months.filter((label) => {
        const [mon, yr] = label.split(" ");
        const monthIdx = MONTH_MAP[mon.toUpperCase()];
        
        if (monthIdx !== undefined) {
          const yearNum = 2000 + parseInt(yr, 10);
          const key = yearNum * 12 + monthIdx;
          return key <= currentMonthKey; // Only show past and current months
        }
        return false;
      });
    }
  }, [months, showForecast]);

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

  // Add validation function for single SKU selection
  const validateSingleSKUSelection = () => {
    if (!selectedSKUs || selectedSKUs.length === 0) {
      setErrorSnackbar({
        open: true,
        message: "Please select at least one SKU to edit consensus.",
      });
      return false;
    }
    
    if (selectedSKUs.length > 1) {
      setErrorSnackbar({
        open: true,
        message: "Consensus editing is only allowed for single SKU selection. Please select only one SKU.",
      });
      return false;
    }
    
    return true;
  };

  // Handle error snackbar close
  const handleErrorSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorSnackbar({ open: false, message: "" });
  };

  // ✅ NEW: Add useEffect to handle highlight trigger
  useEffect(() => {
    if (highlightTrigger && canEditConsensus) {
      // Validate SKU selection before highlighting
      if (validateSingleSKUSelection()) {
        setHighlightEditableCells(true);
        
        // Auto-hide highlight after 5 seconds
        const timer = setTimeout(() => {
          setHighlightEditableCells(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    } else {
      setHighlightEditableCells(false);
    }
  }, [highlightTrigger, canEditConsensus]);

  // ✅ NEW: Reset highlight when canEditConsensus becomes false
  useEffect(() => {
    if (!canEditConsensus) {
      setHighlightEditableCells(false);
    }
  }, [canEditConsensus]);

  // Fetch data function with improved data mapping and consistent month ordering
  const fetchForecastData = () => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/forecast`, {
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
        model_name: modelName,
      }),
    })
      .then((res) => res.json())
      .then((raw) => {
        if (!raw || raw.length === 0) {
          setData({});
          setAvgMape(null);
          return;
        }
        // Extract avgMape data from raw, adjust according to actual API response shape
        if (raw.length) {
          const mapeValues = raw
            .map((item) => Number(item.avg_mape))
            .filter((val) => !isNaN(val));
          const avgMape = mapeValues.length
            ? mapeValues.reduce((a, b) => a + b, 0) / mapeValues.length
            : null;
          setAvgMape(avgMape);
        } else {
          setAvgMape(null);
        }
        const ds = {};
        const months = buildMonthLabelsBetween(startDate, endDate);

        months.forEach((m) => {
          ds[m] = {};
          [...CORE_ROWS, ...OPTIONAL_ROWS].forEach((row) => {
            ds[m][row] = "-";
          });
        });

        raw.forEach((item) => {
          const label = dateToMonthLabel(item.month_name);
          if (!ds[label]) return;
          Object.entries(keyMap).forEach(([rowLabel, jsonKey]) => {
            const val = item[jsonKey];
            if (val !== undefined && val !== null && val !== "NULL") {
              ds[label][rowLabel] = val === "" || val === 0 ? "-" : val;
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

  const [actualLatestMonth, setActualLatestMonth] = useState(null);

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
    modelName,
  ]);

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

  // Initialize edited cells from data (if your API provides edit flags)
  useEffect(() => {
    if (data) {
      const editedCellsFromData = new Set();
      setEditedCells(editedCellsFromData);
    }
  }, [data, months]);

  // Keep all rows, don't filter based on showForecast
  const baseRows = [...CORE_ROWS, ...optionalRows];
  const allRows = baseRows; // Show all rows regardless of showForecast

  // Add New menu handlers
  const handleAddRowsClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleConfirmationClose = () => {
    setConfirmationDialog({
      open: false,
      month: null,
      row: null,
      value: null,
      pendingPayload: null,
    });
    setEditingCell({ month: null, row: null });
    setEditValue("");
    setCanEditConsensus(false);
  };

  const handleConfirmationSubmit = async () => {
    const { pendingPayload, month, row } = confirmationDialog;
    if (!pendingPayload) return;

    setUpdatingCell({ month, row });

    try {
      await updateConsensusForecastAPI(pendingPayload);

      // Add the edited cell to the tracking set
      setEditedCells((prev) => new Set([...prev, `${month}-${row}`]));

      setConfirmationDialog({
        open: false,
        month: null,
        row: null,
        value: null,
        pendingPayload: null,
      });
      setEditingCell({ month: null, row: null });
      setUpdatingCell({ month: null, row: null });
      setEditValue("");

      setTimeout(() => {
        fetchForecastData();
      }, 100);
    } catch (err) {
      alert("Failed to update consensus forecast");
      setConfirmationDialog({
        open: false,
        month: null,
        row: null,
        value: null,
        pendingPayload: null,
      });
      setEditingCell({ month: null, row: null });
      setUpdatingCell({ month: null, row: null });
    } finally {
      setCanEditConsensus(false);
    }
  };

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
                variant="outlined"
                onClick={() => setPeriod(label)}
                sx={{
                  width: 44,
                  height: 22,
                  px: 0,
                  minWidth: 0,
                  minHeight: 0,
                  borderRadius: "50px",
                  fontWeight: 600,
                  fontSize: "13px",
                  lineHeight: "16px",
                  color: period === label ? "#fff" : "#2563EB",
                  backgroundColor: period === label ? "#2563EB" : "#fff",
                  border: "1px solid #2563EB",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: period === label ? "#1e4fc1" : "#f5faff",
                  },
                }}
              >
                {label}
              </Button>
            ))}
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ ml: 2 }}
            >
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
                sx={{ p: 0 }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 400, fontSize: 14, userSelect: "none" }}
              >
                Forecast
              </Typography>
            </Stack>
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
          pt: 0,
          bgcolor: "common.white",
          padding: 0,
          borderRadius: 0,
          boxShadow: 1,
          border: "1px solid",
          borderColor: "grey.200",
          overflowX: "auto",
          fontFamily: "'Poppins', sans-serif !important",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            minWidth: 900,
            fontFamily: "'Poppins', sans-serif !important",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  position: "sticky",
                  left: 0,
                  background: "#DEE2E6",
                  zIndex: 2,
                  fontWeight: 700,
                  fontSize: 14,
                  textAlign: "left",
                  padding: "8px 16px",
                  borderRight: "1px solid #e0e7ef",
                  borderBottom: "2px solid #e0e7ef",
                  color: "#3c4257",
                  minWidth: 240,
                }}
              ></th>
              {visibleMonths.map((m) => (
                <th
                  key={m}
                  style={{
                    background: "#DEE2E6",
                    fontWeight: 700,
                    fontSize: 14,
                    textAlign: "right",
                    padding: "8px 12px",
                    borderBottom: "2px solid #e0e7ef",
                    color: "#3c4257",
                    minWidth: 90,
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
                    background: "#F1F5F9",
                    zIndex: 1,
                    fontWeight: label === "Consensus" ? 700 : 500,
                    fontSize: 14,
                    textAlign: "left",
                    padding: "8px 16px",
                    borderRight: "1px solid #e0e7ef",
                    borderBottom: "1px solid #e0e7ef",
                    color: "#3c4257",
                    minWidth: 140,
                  }}
                >
                  {label}
                </td>
                {visibleMonths.map((m) => {
                  const value = data?.[m]?.[label];
                  const isConsensusRow = label === "Consensus";
                  const isEditing =
                    editingCell.month === m && editingCell.row === label;
                  const isUpdating =
                    updatingCell.month === m && updatingCell.row === label;
                  const locked = isConsensusRow && isMonthLocked(m);

const isAllowedMonth = new Date(getMonthDate(m)).getTime() === new Date(getMonthDate(firstFutureMonth)).getTime();
                  
                  // ✅ NEW: Add highlighting logic for editable cells
                  const isEditableCell = isConsensusRow && isAllowedMonth && !locked;
     const shouldHighlight = canEditConsensus && isEditableCell;


                  const displayValue =
                    value === undefined || value === null
                      ? "-"
                      : formatNumberByCountry(value, selectedCountry);

                  return (
                    <td
                      key={m}
                      style={{
                        background: isEditing
                          ? "#ffffff"
                          : shouldHighlight
                          ? "#efeddaff" // ✅ Bright yellow for highlighted editable cell
                          : futureMonthSet.has(m)
                          ? "#e9f0f7"
                          : undefined,
                        boxShadow: isEditing
                          ? "0 0 0 2px #2563EB, 0 2px 8px rgba(37, 99, 235, 0.15)"
                          : shouldHighlight
                          ? "0 0 0 3px #f3f1efff, 0 4px 16px rgba(255, 152, 0, 0.5)" // ✅ Orange border for highlighted cell
                          : undefined,
                        padding: "8px 12px",
                        borderBottom: "1px solid #e0e7ef",
                        textAlign: "right",
                        fontSize: 14,
                        color: "#222a36",
                        minWidth: 90,
                        cursor: isConsensusRow ? "pointer" : "default",
                        position: "relative",
                        zIndex: isEditing ? 10 : shouldHighlight ? 5 : "auto", // ✅ Higher z-index for highlighted cells
                        transition: "all 0.3s ease-in-out", // ✅ Smooth transition for highlighting
                      }}
                      onClick={(e) => {
                        if (
                          isConsensusRow &&
                          canEditConsensus &&
                          !locked &&
                          !isEditing &&
                          !isUpdating &&
                          isAllowedMonth
                        ) {
                          // Add SKU validation before allowing edit
                          if (validateSingleSKUSelection()) {
                            setEditingCell({ month: m, row: label });
                            setEditValue(value === "-" ? "" : value);
                            setHighlightEditableCells(false); // ✅ Hide highlight when editing starts
                          }
                        } else if (
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
                      }}
                    >
                      {/* Red triangle indicator for consensus cells */}
                      {label === "Consensus" && value !== "-" && (
                        <RedTriangleIcon visible={true} />
                      )}

                      {/* ✅ NEW: Visual indicator for highlighted editable cells */}
                      {shouldHighlight && (
                        <>
                          <Box
                            sx={{
                              position: "absolute",
                              top: 4,
                              left: 4,
                              width: 12,
                              height: 12,
                              backgroundColor: "#ff9800",
                              borderRadius: "50%",
                              animation: "pulse 1s infinite",
                              "@keyframes pulse": {
                                "0%": { 
                                  opacity: 1,
                                  transform: "scale(1)"
                                },
                                "50%": { 
                                  opacity: 0.5,
                                  transform: "scale(1.3)"
                                },
                                "100%": { 
                                  opacity: 1,
                                  transform: "scale(1)"
                                },
                              },
                            }}
                          />
                        </>
                      )}

                      {isConsensusRow ? (
                        locked ? (
                          <span
                            style={{
                              color: "#aaa",
                              display: "flex",
                              alignItems: "center",
                              textAlign: "right",
                              justifyContent: "end",
                              gap: 4,
                            }}
                          >
                            <LockIcon style={{ fontSize: 14 }} />
                            {displayValue}
                          </span>
                        ) : isEditing && isAllowedMonth ? (
                          <input
                            type="number"
                            value={editValue}
                            style={{
                              width: "70px",
                              fontSize: 14,
                              padding: "2px 4px",
                              border: "1px solid #2563EB",
                              borderRadius: 4,
                              background: "#fff",
                              outline: "none",
                            }}
                            autoFocus
                            disabled={isUpdating}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={async () => {
                              const targetDate = getMonthDate(m);
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
                                model_name: modelName,
                              };

                              setConfirmationDialog({
                                open: true,
                                month: m,
                                row: label,
                                value: editValue,
                                pendingPayload: payload,
                              });
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.target.blur();
                              } else if (e.key === "Escape") {
                                setEditingCell({ month: null, row: null });
                              }
                            }}
                          />
                        ) : isAllowedMonth ? (
                          <span style={{ color: "#1976d2", fontWeight: 500 }}>
                            {displayValue}
                          </span>
                        ) : (
                          "-"
                        )
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

      {/* Error Snackbar */}
      <Snackbar
        open={errorSnackbar.open}
        autoHideDuration={4000}
        onClose={handleErrorSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleErrorSnackbarClose} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorSnackbar.message}
        </Alert>
      </Snackbar>

      <LockCommentPopover
        open={lockComment.open}
        anchorEl={lockComment.anchor}
        onClose={() => setLockComment({ ...lockComment, open: false })}
      />

      {data && (
        <ForecastChart
          months={visibleMonths}
          data={data}
          modelName={modelName}
          setModelName={setModelName}
          models={models}
          loadingModels={loadingModels}
          avgMapeData={avgMape}
        />
      )}

      <ConfirmationDialog
        open={confirmationDialog.open}
        onClose={handleConfirmationClose}
        onConfirm={handleConfirmationSubmit}
        title="Confirm Approval"
        message="Are you sure you want to approve the consensus? Once approved, this action cannot be undone."
        editedDetails={{
          month: confirmationDialog.month,
          value: confirmationDialog.value,
        }}
      />
    </>
  );
}
