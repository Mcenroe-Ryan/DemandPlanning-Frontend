//new version for scrollable
import React, { useState, useMemo, useEffect, useRef } from "react";
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
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Z_INDEX_LAYERS = {
  TABLE_CELL: 1,
  STICKY_COLUMN: 3,
  STICKY_HEADER: 4,
  STICKY_HEADER_COLUMN: 5,
  CELL_INDICATORS: 6,
  HIGHLIGHTED_CELL: 7,
  EDITING_CELL: 10,
};

let _consensusInFlightKey = null;
let _consensusInFlightPromise = null;
let _lastUpdateTimestamp = 0;

function makeDedupeKey(payload) {
  const keyObj = {
    sku_code: payload?.sku_code,
    target_month: payload?.target_month,
    model_name: payload?.model_name,
    country: payload?.country_name,
    state: payload?.state_name,
    city: payload?.city_name,
    plant: payload?.plant_name,
    category: payload?.category_name,
    channel: payload?.channel_name,
    consensus_forecast: payload?.consensus_forecast,
  };
  return JSON.stringify(keyObj);
}

async function updateConsensusForecastAPI(payload) {
  const now = Date.now();
  const key = makeDedupeKey(payload);

  if (now - _lastUpdateTimestamp < 2000) {
    throw new Error("Update too soon - please wait");
  }

  if (_consensusInFlightKey === key && _consensusInFlightPromise) {
    return _consensusInFlightPromise;
  }

  _lastUpdateTimestamp = now;
  _consensusInFlightKey = key;

  _consensusInFlightPromise = fetch(`${API_BASE_URL}/forecast/consensus`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update consensus forecast");
      }
      return res.json();
    })
    .finally(() => {
      setTimeout(() => {
        _consensusInFlightKey = null;
        _consensusInFlightPromise = null;
      }, 3000);
    });

  return _consensusInFlightPromise;
}

function getRevenueForecastLabel(selectedCountry) {
  if (
    (Array.isArray(selectedCountry) && selectedCountry.includes("USA")) ||
    selectedCountry === "USA"
  ) {
    return "Revenue Forecast ($ in K)";
  }
  return "Revenue Forecast (₹ in lakhs)";
}

const FORECAST_ROWS = ["Baseline Forecast", "ML Forecast", "Consensus"];
const OPTIONAL_ROWS = [
  "Sales",
  "Promotion / Marketing",
  "Inventory Level",
  "Stock out days",
  "On Hand",
];

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
  if (!label || typeof label !== "string") return null;
  const parts = label.split(" ");
  if (parts.length !== 2) return null;
  const [mon, yr] = parts;
  const yearNum = 2000 + parseInt(yr, 10);
  const monthIdx = MONTH_MAP[mon.toUpperCase()];
  if (isNaN(yearNum) || monthIdx === undefined) return null;
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
  if (Array.isArray(country) && country.includes("India") && country.includes("USA")) {
    return Number(value).toLocaleString("en-US");
  }
  if (
    (Array.isArray(country) && country.length === 1 && country[0] === "India") ||
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

function monthDiffFromCurrent(label) {
  if (!label) return null;
  const [mon, yr] = label.split(" ");
  const monthIdx = MONTH_MAP[mon.toUpperCase()];
  if (monthIdx === undefined) return null;
  const yearNum = 2000 + parseInt(yr, 10);
  const now = new Date();
  return (yearNum - now.getFullYear()) * 12 + (monthIdx - now.getMonth());
}

function getConsensusNoteForLockedCell(label) {
  const diff = monthDiffFromCurrent(label);
  if (diff === 0) {
    return "Consensus reached on festive season uplift assumption of +20% for Sept–Oct, based on last 3 years' trend and marketing campaign details.";
  }
  if (diff === -1) {
    return "Aligned with sales and marketing on promotional uplift for Q3. Adjusted forecast upward by 8%.";
  }
  if (diff === -2) {
    return "Reduced forecast by 5% due to confirmed order cancellations from key accounts.";
  }
  if (diff <= -3) {
    return "Incorporated distributor feedback—demand spike expected in Tier 2 cities; revised forecast accordingly.";
  }
  return "";
}

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
        zIndex: Z_INDEX_LAYERS.CELL_INDICATORS,
        pointerEvents: "none",
      }}
    />
  );
};

function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm Approval",
  message = "Are you sure you want to approve the consensus? Once approved, this action cannot be undone.",
  editedDetails = null,
  confirming = false,
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
                Period
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
          disabled={confirming}
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
          disabled={confirming}
        >
          {confirming ? "Saving..." : "Confirm Approval"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function LockCommentPopover({ open, anchorEl, onClose, message }) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        sx: {
          width: 240,
          height: 180,
          borderRadius: 2,
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          p: 1,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>
          Comment
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <IconButton size="small" sx={{ p: 0.25 }}>
            <MoreHorizRoundedIcon sx={{ fontSize: 16, color: "#64748B" }} />
          </IconButton>
          <IconButton size="small" sx={{ p: 0.25 }} onClick={onClose}>
            <CloseRoundedIcon sx={{ fontSize: 16, color: "#64748B" }} />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.75,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src="https://randomuser.me/api/portraits/men/32.jpg"
            sx={{ width: 22, height: 22 }}
          />
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>
            John
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 11, color: "#94A3B8" }}>4 days ago</Typography>
      </Box>

      <Typography
        sx={{
          fontSize: 12,
          lineHeight: 1.35,
          color: "#334155",
          mb: 1,
          flex: 1,
          overflow: "auto",
        }}
      >
        {message || "—"}
      </Typography>

      <Box
        sx={{
          mt: "auto",
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "#F1F5F9",
          borderRadius: 999,
          px: 1,
          py: 0.5,
          border: "1px solid #E2E8F0",
        }}
      >
        <Avatar
          src="https://randomuser.me/api/portraits/men/32.jpg"
          sx={{ width: 18, height: 18 }}
        />
        <input
          disabled
          placeholder="Reply"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 12,
            color: "#64748B",
          }}
        />
        <IconButton
          size="small"
          disabled
          sx={{
            width: 22,
            height: 22,
            bgcolor: "#E2E8F0",
            color: "#64748B",
            borderRadius: "50%",
            p: 0,
          }}
        >
          <ArrowUpwardRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Popover>
  );
}

const getCellZIndex = (isSticky, isHighlighted, isEditing) => {
  if (isEditing) return Z_INDEX_LAYERS.EDITING_CELL;
  if (isHighlighted) return Z_INDEX_LAYERS.HIGHLIGHTED_CELL;
  if (isSticky) return Z_INDEX_LAYERS.STICKY_COLUMN;
  return Z_INDEX_LAYERS.TABLE_CELL;
};

function startOfISOWeek(d0 = new Date()) {
  const d = new Date(d0);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; 
  d.setDate(d.getDate() + diff);
  return d;
}
function weekLabelToDate(label) {
  if (!label || typeof label !== "string") return null;
  const parts = label.split("-W");
  if (parts.length !== 2) return null;
  const year = parseInt(parts[0], 10);
  const week = parseInt(parts[1], 10);
  if (!year || !week) return null;
  const jan4 = new Date(year, 0, 4);
  const wk1Mon = startOfISOWeek(jan4);
  const target = new Date(wk1Mon);
  target.setDate(target.getDate() + (week - 1) * 7);
  return target;
}

function getISOWeekInfo(d0) {
  const d = new Date(Date.UTC(d0.getFullYear(), d0.getMonth(), d0.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const year = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
  return { year, week };
}

function formatISOWeekLabel(d) {
  const { year, week } = getISOWeekInfo(d);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function buildISOWeekLabelsBetween(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return [];
  const start = startOfISOWeek(new Date(startDateStr));
  const end = startOfISOWeek(new Date(endDateStr));

  const out = [];
  const cur = new Date(start);
  while (cur <= end) {
    out.push(formatISOWeekLabel(cur));
    cur.setDate(cur.getDate() + 7);
  }
  return out;
}

function findNearestIndexMonthly(cols) {
  if (!cols?.length) return -1;
  const now = new Date();
  const nowLabel = now.toLocaleString("default", { month: "short", year: "2-digit" });
  let idx = cols.indexOf(nowLabel);
  if (idx !== -1) return idx;

  const nowKey = now.getFullYear() * 12 + now.getMonth();
  let best = { i: 0, d: Infinity };
  for (let i = 0; i < cols.length; i++) {
    const d = getMonthDate(cols[i]);
    if (!d) continue;
    const dt = new Date(d);
    const key = dt.getFullYear() * 12 + dt.getMonth();
    const delta = Math.abs(key - nowKey);
    if (delta < best.d) best = { i, d: delta };
  }
  return best.i;
}

function findNearestIndexWeekly(cols) {
  if (!cols?.length) return -1;
  const nowWeek = formatISOWeekLabel(startOfISOWeek(new Date()));
  let idx = cols.indexOf(nowWeek);
  if (idx !== -1) return idx;

  const nowStart = startOfISOWeek(new Date());
  let best = { i: 0, d: Infinity };
  for (let i = 0; i < cols.length; i++) {
    const d = weekLabelToDate(cols[i]);
    if (!d) continue;
    const delta = Math.abs(d.getTime() - nowStart.getTime());
    if (delta < best.d) best = { i, d: delta };
  }
  return best.i;
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
  highlightTrigger,
}) {
  const REVENUE_LABEL = getRevenueForecastLabel(selectedCountry);

  const CORE_ROWS = useMemo(
    () => ["Actual", "Baseline Forecast", "ML Forecast", "Consensus", REVENUE_LABEL],
    [REVENUE_LABEL]
  );

  const [period, setPeriod] = useState("M");
  const [showForecast, setShowForecast] = useState(true);
  const [optionalRows, setOptionalRows] = useState([]);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [avgMape, setAvgMape] = useState(null);
  const [editingCell, setEditingCell] = useState({ month: null, row: null });
  const [editValue, setEditValue] = useState("");
  const [updatingCell, setUpdatingCell] = useState({ month: null, row: null });
  const [editedCells, setEditedCells] = useState(new Set());
  const [lockComment, setLockComment] = useState({
    open: false,
    anchor: null,
    message: "",
  });
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    month: null,
    row: null,
    value: null,
    pendingPayload: null,
  });
  const [errorSnackbar, setErrorSnackbar] = useState({
    open: false,
    message: "",
  });
  const [highlightEditableCells, setHighlightEditableCells] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);

  const confirmSubmittingRef = useRef(false);
  const blurTimeoutRef = useRef(null);
  const [isPreparingConfirm, setIsPreparingConfirm] = useState(false);
  const [isSubmittingConfirm, setIsSubmittingConfirm] = useState(false);

  const [columns, setColumns] = useState([]);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const defaultMonthlyLabels = useMemo(() => {
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
  }, []);

  const visibleColumns = useMemo(() => {
    if (period === "M") {
      const monthly =
        columns.length > 0
          ? columns
          : startDate && endDate
          ? buildMonthLabelsBetween(startDate, endDate)
          : defaultMonthlyLabels;

      if (showForecast) return monthly;

      const today = new Date();
      const currentMonthKey = today.getFullYear() * 12 + today.getMonth();
      return monthly.filter((label) => {
        const [mon, yr] = label.split(" ");
        const monthIdx = MONTH_MAP[mon.toUpperCase()];
        if (monthIdx !== undefined) {
          const yearNum = 2000 + parseInt(yr, 10);
          const key = yearNum * 12 + monthIdx;
          return key <= currentMonthKey;
        }
        return false;
      });
    }

    if (period === "W") {
      const built =
        columns.length > 0
          ? columns
          : startDate && endDate
          ? buildISOWeekLabelsBetween(startDate, endDate)
          : (() => {
              const now = startOfISOWeek(new Date());
              const from = new Date(now);
              from.setDate(from.getDate() - 6 * 7);
              const to = new Date(now);
              to.setDate(to.getDate() + 6 * 7);
              return buildISOWeekLabelsBetween(
                from.toISOString().slice(0, 10),
                to.toISOString().slice(0, 10)
              );
            })();

      if (showForecast) return built;

      const nowStart = startOfISOWeek(new Date());
      return built.filter((lbl) => {
        const d = weekLabelToDate(lbl);
        return d && d <= nowStart;
      });
    }

    return columns;
  }, [period, columns, showForecast, startDate, endDate, defaultMonthlyLabels]);

  const STICKY_W = 240;
  const COL_W = 110;
  const weeklySelectedRangeActive = period === "W" && Boolean(startDate && endDate);

  const realWidth = STICKY_W + visibleColumns.length * COL_W;
  const fillerCount = Math.max(0, Math.ceil((containerWidth - realWidth) / COL_W));
  const fillerColumns = useMemo(
    () => Array.from({ length: fillerCount }, (_, i) => `__filler_${i + 1}`),
    [fillerCount]
  );

  const tableMinWidth = useMemo(() => {
    const totalCols = visibleColumns.length + fillerCount;
    return STICKY_W + Math.max(totalCols, 1) * COL_W;
  }, [visibleColumns.length, fillerCount]);

  const firstFutureMonth = useMemo(() => {
    if (period !== "M") return null;
    const today = new Date();
    const currentKey = today.getFullYear() * 12 + today.getMonth();
    const sortedMonths = (columns.length ? columns : visibleColumns).filter(
      (label) => {
        const [mon, yr] = label.split(" ");
        const monthIdx = MONTH_MAP[mon.toUpperCase()];
        const yearNum = 2000 + parseInt(yr, 10);
        const key = yearNum * 12 + monthIdx;
        return key > currentKey;
      }
    );
    return sortedMonths[0] || null;
  }, [period, columns, visibleColumns]);

  const futureMonthSet = useMemo(() => {
    if (period !== "M") return new Set();
    const today = new Date();
    const currentMonthKey = today.getFullYear() * 12 + today.getMonth();
    const set = new Set();
    (columns.length ? columns : visibleColumns).forEach((label) => {
      const [mon, yr] = label.split(" ");
      const monthIdx = MONTH_MAP[mon.toUpperCase()];
      if (monthIdx !== undefined) {
        const yearNum = 2000 + parseInt(yr, 10);
        const key = yearNum * 12 + monthIdx;
        if (key > currentMonthKey) set.add(label);
      }
    });
    return set;
  }, [period, columns, visibleColumns]);

  const futureWeekSet = useMemo(() => {
    if (period !== "W") return new Set();
    const nowStart = startOfISOWeek(new Date());
    const set = new Set();
    columns.forEach((lbl) => {
      const d = weekLabelToDate(lbl);
      if (d && d > nowStart) set.add(lbl);
    });
    return set;
  }, [period, columns]);

  const keyMap = {
    Actual: "actual_units",
    "Baseline Forecast": "baseline_forecast",
    "ML Forecast": "ml_forecast",
    Consensus: "consensus_forecast",
    "Revenue Forecast (₹ in lakhs)": "revenue_forecast_lakhs",
    "Revenue Forecast ($ in K)": "revenue_forecast_lakhs",
    Sales: "sales_units",
    "Promotion / Marketing": "promotion_marketing",
    "Inventory Level": "inventory_level_pct",
    "Stock out days": "stock_out_days",
    "On Hand": "on_hand_units",
  };

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
        message:
          "Consensus editing is only allowed for single SKU selection. Please select only one SKU.",
      });
      return false;
    }
    return true;
  };

  const handleErrorSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setErrorSnackbar({ open: false, message: "" });
  };

  useEffect(() => {
    if (highlightTrigger && canEditConsensus && period === "M") {
      if (validateSingleSKUSelection()) {
        setHighlightEditableCells(true);
        const timer = setTimeout(() => {
          setHighlightEditableCells(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    } else {
      setHighlightEditableCells(false);
    }
  }, [highlightTrigger, canEditConsensus, period]);

  useEffect(() => {
    if (!canEditConsensus) setHighlightEditableCells(false);
  }, [canEditConsensus]);

  const fetchForecastData = () => {
    setIsLoading(true);
    const endpoint = period === "W" ? `${API_BASE_URL}/weekly-forecast` : `${API_BASE_URL}/forecast`;

    fetch(endpoint, {
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
          setColumns([]);
          return;
        }

        const mapeValues = raw
          .map((item) => Number(item.avg_mape))
          .filter((val) => !isNaN(val));
        const avgMape = mapeValues.length
          ? mapeValues.reduce((a, b) => a + b, 0) / mapeValues.length
          : null;
        setAvgMape(avgMape);

        const ds = {};
        const allRowsSet = new Set([
          ...CORE_ROWS,
          ...OPTIONAL_ROWS,
          "Revenue Forecast ($ in k)",
          "Revenue Forecast (₹ in lakhs)",
        ]);

        if (period === "M") {
          const labels =
            startDate && endDate
              ? buildMonthLabelsBetween(startDate, endDate)
              : defaultMonthlyLabels;

          labels.forEach((m) => {
            ds[m] = {};
            allRowsSet.forEach((row) => {
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

          setColumns(labels);
        } else {
          const labels =
            startDate && endDate
              ? buildISOWeekLabelsBetween(startDate, endDate)
              : (() => {
                  const now = startOfISOWeek(new Date());
                  const from = new Date(now);
                  from.setDate(from.getDate() - 6 * 7);
                  const to = new Date(now);
                  to.setDate(to.getDate() + 6 * 7);
                  return buildISOWeekLabelsBetween(
                    from.toISOString().slice(0, 10),
                    to.toISOString().slice(0, 10)
                  );
                })();

          labels.forEach((w) => {
            ds[w] = {};
            allRowsSet.forEach((row) => {
              ds[w][row] = "-";
            });
          });

          raw.forEach((item) => {
            const label = item.week_name
              ? String(item.week_name)
              : item.week_start_date
              ? formatISOWeekLabel(new Date(item.week_start_date))
              : null;

            if (!label || !ds[label]) return;

            Object.entries(keyMap).forEach(([rowLabel, jsonKey]) => {
              const val = item[jsonKey];
              if (val !== undefined && val !== null && val !== "NULL") {
                ds[label][rowLabel] = val === "" || val === 0 ? "-" : val;
              }
            });
          });

          setColumns(labels);
        }

        setData(ds);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setData({});
        setColumns([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const [actualLatestMonth, setActualLatestMonth] = useState(null);

  useEffect(() => {
    fetchForecastData();
  }, [
    period,
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
    REVENUE_LABEL,
  ]);

  useEffect(() => {
    if (!data || period !== "M") return;
    const months = Object.keys(data).sort((a, b) => {
      const aDate = new Date(getMonthDate(a));
      const bDate = new Date(getMonthDate(b));
      return bDate - aDate;
    });
    const latestMonth = months[0] || null;
    setActualLatestMonth(latestMonth);
  }, [data, period]);

  useEffect(() => {
    if (data) {
      const editedCellsFromData = new Set();
      setEditedCells(editedCellsFromData);
    }
  }, [data, columns]);

  const reorderRows = () => {
    const result = [];
    for (let row of CORE_ROWS) {
      result.push(row);
      if (row === "ML Forecast") {
        if (optionalRows.includes("Sales")) result.push("Sales");
        if (optionalRows.includes("Promotion / Marketing"))
          result.push("Promotion / Marketing");
      }
    }
    for (let row of optionalRows) {
      if (row !== "Sales" && row !== "Promotion / Marketing") result.push(row);
    }
    return result;
  };

  const allRows = reorderRows();

  const handleAddRowsClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSwapClick = () => {
    setIsSwapped((prev) => !prev);
  };

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
    if (confirmSubmittingRef.current) return;
    confirmSubmittingRef.current = true;

    if (isSubmittingConfirm) {
      confirmSubmittingRef.current = false;
      return;
    }
    setIsSubmittingConfirm(true);

    const { pendingPayload, month, row } = confirmationDialog;
    if (!pendingPayload) {
      setIsSubmittingConfirm(false);
      confirmSubmittingRef.current = false;
      return;
    }

    setUpdatingCell({ month, row });
    try {
      await updateConsensusForecastAPI(pendingPayload);

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
      console.error("Consensus update failed:", err);
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
      setIsSubmittingConfirm(false);
      confirmSubmittingRef.current = false;
      setCanEditConsensus(false);
    }
  };

  const toCSVValue = (val) => {
    if (val === null || val === undefined) return "";
    const s = String(val);
    if (s.includes('"') || s.includes(",") || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const buildCSV = () => {
    if (!data || !visibleColumns?.length || !allRows?.length) return null;

    const header = ["Metric", ...visibleColumns];
    const lines = [header];

    for (const label of allRows) {
      const row = [label];
      for (const c of visibleColumns) {
        const v = data?.[c]?.[label];
        row.push(v === undefined || v === null ? "-" : v);
      }
      lines.push(row);
    }

    return lines.map((r) => r.map(toCSVValue).join(",")).join("\n");
  };

  const handleDownloadTable = () => {
    const csv = buildCSV();
    if (!csv) {
      setErrorSnackbar({
        open: true,
        message: "Nothing to download — no table data available.",
      });
      return;
    }
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const ts = new Date().toISOString().slice(0, 10);
    const mode = period === "W" ? "weekly" : "monthly";
    const a = document.createElement("a");
    a.href = url;
    a.download = `forecast_table_${mode}_${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isWeekly = period === "W";

  const scrollToCurrentPeriod = React.useCallback(() => {
    const viewport = containerRef.current;
    if (!viewport || !visibleColumns?.length) return;

    const index =
      period === "M"
        ? findNearestIndexMonthly(visibleColumns)
        : findNearestIndexWeekly(visibleColumns);

    if (index < 0) return;

    const targetLeft =
      STICKY_W + index * COL_W - Math.max(0, (viewport.clientWidth - COL_W) / 2);

    const left = Math.max(0, Math.min(targetLeft, viewport.scrollWidth));
    viewport.scrollTo({ left, behavior: "smooth" });
  }, [visibleColumns, period, containerRef, /* constants: */ STICKY_W, COL_W]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToCurrentPeriod();
    });
  }, [scrollToCurrentPeriod]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToCurrentPeriod();
    });
  }, [containerWidth, scrollToCurrentPeriod]);

  const renderForecastTable = () => (
    <Box
      ref={containerRef}
      sx={{
        p: 3,
        pt: 0,
        mx: 1,
        bgcolor: "common.white",
        padding: 0,
        borderRadius: 0,
        boxShadow: 1,
        border: "1px solid",
        borderColor: "grey.200",
        overflowX: "auto",
        fontFamily: "'Poppins', sans-serif !important",
        width: "calc(100% - 16px)",
      }}
    >
      <table
        style={{
          width: "auto",
          minWidth: `${tableMinWidth}px`,
          display: "inline-table",
          borderCollapse: "separate",
          borderSpacing: 0,
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
                zIndex: Z_INDEX_LAYERS.STICKY_HEADER_COLUMN,
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
            {visibleColumns.map((m) => (
              <th
                key={m}
                style={{
                  background: "#DEE2E6",
                  zIndex: Z_INDEX_LAYERS.STICKY_HEADER,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  fontStyle: "normal",
                  lineHeight: "100%",
                  letterSpacing: "0.1px",
                  textAlign: "right",
                  verticalAlign: "middle",
                  padding: "8px 12px",
                  borderBottom: "2px solid #e0e7ef",
                  color: "#334155",
                  minWidth: 110,
                }}
              >
                {m}
              </th>
            ))}
            {fillerColumns.map((f) => (
              <th
                key={f}
                style={{
                  background: "#DEE2E6",
                  zIndex: Z_INDEX_LAYERS.STICKY_HEADER,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "100%",
                  textAlign: "right",
                  verticalAlign: "middle",
                  padding: "8px 12px",
                  borderBottom: "2px solid #e0e7ef",
                  color: "#334155",
                  minWidth: 110,
                }}
              />
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
                  zIndex: Z_INDEX_LAYERS.STICKY_COLUMN,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: label === "Consensus" ? 600 : 400,
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0.1px",
                  textAlign: "left",
                  padding: "8px 16px",
                  ...(label === "Sales" || label === "Promotion / Marketing"
                    ? { paddingLeft: "36px" }
                    : {}),
                  borderRight: "1px solid #e0e7ef",
                  borderBottom: "1px solid #e0e7ef",
                  color: "#3c4257",
                  minWidth: 140,
                  verticalAlign: "middle",
                }}
              >
                {label}
              </td>
              {visibleColumns.map((m) => {
                const value = data?.[m]?.[label];
                const isConsensusRow = label === "Consensus";

                const isEditing =
                  !isWeekly && editingCell.month === m && editingCell.row === label;
                const locked = !isWeekly && isConsensusRow && isMonthLocked(m);
                const isAllowedMonth =
                  !isWeekly &&
                  firstFutureMonth &&
                  new Date(getMonthDate(m)).getTime() ===
                    new Date(getMonthDate(firstFutureMonth)).getTime();

                const isEditableCell =
                  !isWeekly && isConsensusRow && isAllowedMonth && !locked;
                const shouldHighlight =
                  !isWeekly && canEditConsensus && isEditableCell;

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
                        ? "rgba(251, 251, 251, 1)"
                        : (!isWeekly && futureMonthSet.has(m)) ||
                          (isWeekly && futureWeekSet.has(m))
                        ? "#e9f0f7"
                        : undefined,
                      boxShadow: isEditing
                        ? "0 0 0 2px #2563EB, 0 2px 8px rgba(37, 99, 235, 0.15)"
                        : shouldHighlight
                        ? "0 0 0 3px #f3f1efff, 0 4px 16px rgba(238, 236, 233, 0.5)"
                        : undefined,
                      padding: "8px 12px",
                      paddingLeft:
                        !isWeekly && isConsensusRow && isAllowedMonth && !locked
                          ? 36
                          : 12,
                      borderBottom: "1px solid #e0e7ef",
                      textAlign: "right",
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#64748B",
                      minWidth: 110,
                      cursor: !isWeekly && isConsensusRow ? "pointer" : "default",
                      position: "relative",
                      zIndex: getCellZIndex(false, shouldHighlight, isEditing),
                      transition: "all 0.3s ease-in-out",
                    }}
                    onClick={(e) => {
                      if (
                        !isWeekly &&
                        isConsensusRow &&
                        canEditConsensus &&
                        !locked &&
                        !isEditing &&
                        isAllowedMonth
                      ) {
                        if (validateSingleSKUSelection()) {
                          setEditingCell({ month: m, row: label });
                          setEditValue(value === "-" ? "" : value);
                        }
                      } else if (!isWeekly && isConsensusRow && locked && value && value !== "-") {
                        setLockComment({
                          open: true,
                          anchor: e.currentTarget,
                          message: getConsensusNoteForLockedCell(m),
                        });
                      }
                    }}
                  >
                    {!isWeekly && label === "Consensus" && value !== "-" && (
                      <RedTriangleIcon />
                    )}

                    {shouldHighlight && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 6,
                          left: 36,
                          width: 12,
                          height: 12,
                          zIndex: Z_INDEX_LAYERS.CELL_INDICATORS,
                          animation: "pulse 1s infinite",
                          "@keyframes pulse": {
                            "0%": { opacity: 1, transform: "scale(1)" },
                            "50%": { opacity: 0.5, transform: "scale(1.3)" },
                            "100%": { opacity: 1, transform: "scale(1)" },
                          },
                        }}
                      />
                    )}

                    {!isWeekly && isConsensusRow && isAllowedMonth && !locked && !isEditing && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!validateSingleSKUSelection()) return;
                          if (!canEditConsensus) setCanEditConsensus(true);
                          setTimeout(() => {
                            setEditingCell({ month: m, row: label });
                            setEditValue(value === "-" ? "" : value);
                          }, 0);
                        }}
                        sx={{
                          position: "absolute",
                          left: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 22,
                          height: 22,
                          zIndex: Z_INDEX_LAYERS.CELL_INDICATORS,
                          bgcolor: "rgba(15,23,42,0.06)",
                          borderRadius: "6px",
                          p: 0,
                          "&:hover": { bgcolor: "rgba(15,23,42,0.12)" },
                        }}
                        aria-label="Edit consensus"
                        title="Edit consensus"
                      >
                        <i className="bi bi-pencil" style={{ fontSize: 14, lineHeight: 1 }} />
                      </IconButton>
                    )}

                    {isConsensusRow ? (
                      !isWeekly && locked ? (
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
                      ) : !isWeekly && isEditing && isAllowedMonth ? (
                        <input
                          type="number"
                          value={editValue}
                          style={{
                            width: "90px",
                            fontSize: 14,
                            padding: "2px 4px",
                            border: "1px solid #2563EB",
                            borderRadius: 4,
                            background: "#fff",
                            outline: "none",
                            zIndex: Z_INDEX_LAYERS.EDITING_CELL,
                          }}
                          autoFocus
                          disabled={updatingCell.month === m && updatingCell.row === label}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            if (newValue !== editValue) {
                              setEditValue(newValue);
                            }
                          }}
                          onBlur={(e) => {
                            if (blurTimeoutRef.current) {
                              clearTimeout(blurTimeoutRef.current);
                              blurTimeoutRef.current = null;
                            }
                            e.preventDefault();
                            e.stopPropagation();

                            if (isPreparingConfirm || isSubmittingConfirm || confirmationDialog.open) {
                              return;
                            }

                            const currentValue = data?.[m]?.[label];
                            const normalizedEditValue =
                              editValue === "" || editValue === null ? null : Number(editValue);
                            const normalizedCurrentValue =
                              currentValue === "-" || currentValue === null ? null : Number(currentValue);

                            if (normalizedEditValue === normalizedCurrentValue) {
                              setEditingCell({ month: null, row: null });
                              return;
                            }

                            blurTimeoutRef.current = setTimeout(() => {
                              setIsPreparingConfirm(true);

                              const targetDate = getMonthDate(m);

                              const payload = {
                                country_name: Array.isArray(selectedCountry)
                                  ? selectedCountry
                                  : [selectedCountry],
                                state_name: Array.isArray(selectedState) ? selectedState : [selectedState],
                                city_name: Array.isArray(selectedCities) ? selectedCities : [selectedCities],
                                plant_name: Array.isArray(selectedPlants) ? selectedPlants : [selectedPlants],
                                category_name: Array.isArray(selectedCategories)
                                  ? selectedCategories
                                  : [selectedCategories],
                                sku_code: Array.isArray(selectedSKUs) ? selectedSKUs : [selectedSKUs],
                                channel_name: Array.isArray(selectedChannels)
                                  ? selectedChannels
                                  : [selectedChannels],
                                start_date: startDate,
                                end_date: endDate,
                                consensus_forecast: normalizedEditValue,
                                target_month: targetDate,
                                model_name: modelName,
                              };

                              setConfirmationDialog({
                                open: true,
                                month: m,
                                row: label,
                                value: normalizedEditValue,
                                pendingPayload: payload,
                              });

                              setTimeout(() => setIsPreparingConfirm(false), 200);
                              blurTimeoutRef.current = null;
                            }, 500);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.target.blur();
                            } else if (e.key === "Escape") {
                              setEditingCell({ month: null, row: null });
                            }
                          }}
                        />
                      ) : !isWeekly && isAllowedMonth ? (
                        <span style={{ color: "#1976d2", fontWeight: 500 }}>{displayValue}</span>
                      ) : (
                        displayValue ?? "-"
                      )
                    ) : value === undefined || value === null ? (
                      "-"
                    ) : (
                      formatNumberByCountry(value, selectedCountry)
                    )}
                  </td>
                );
              })}

              {fillerColumns.map((f) => (
                <td
                  key={f}
                  style={{
                    background: "#e9f0f7",
                    borderBottom: "1px solid #e0e7ef",
                    textAlign: "right",
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#64748B",
                    minWidth: 110,
                    position: "relative",
                    transition: "all 0.3s ease-in-out",
                  }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );

  return (
    <>
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
            {["M", "W"].map((label) => (
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
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ ml: 2 }}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon sx={{ width: 16, height: 16, color: "text.secondary" }} />}
                checkedIcon={<CheckBoxIcon sx={{ width: 16, height: 16, color: "primary.main" }} />}
                checked={showForecast}
                onChange={(e) => setShowForecast(e.target.checked)}
                sx={{ p: 0 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 400, fontSize: 14, userSelect: "none" }}>
                Forecast
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ position: "relative" }}>
            <IconButton size="small" onClick={handleAddRowsClick}>
              <AddBoxOutlinedIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
            </IconButton>

            <OptionalParamsMenu
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              selected={optionalRows}
              onChange={setOptionalRows}
            />
          </Box>

          <IconButton size="small" onClick={handleSwapClick}>
            <SwapVertIcon
              sx={{
                width: 20,
                height: 20,
                color: "text.secondary",
                transform: isSwapped ? "rotate(180deg)" : "none",
                transition: "transform 0.3s ease",
              }}
            />
          </IconButton>

          <IconButton size="small">
            <ShareIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
          </IconButton>

          <IconButton size="small" onClick={handleDownloadTable}>
            <DownloadIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
          </IconButton>
        </Stack>
      </Box>

      {isSwapped ? (
        <>
          {data && (
            <ForecastChart
              months={visibleColumns}
              data={data}
              modelName={modelName}
              setModelName={setModelName}
              models={models}
              loadingModels={loadingModels}
              avgMapeData={avgMape}
              countryName={selectedCountry}
              showForecast={showForecast}
              setErrorSnackbar={setErrorSnackbar}
              isWeekly={period === "W"}
              selectedRangeActive={weeklySelectedRangeActive}
            />
          )}
          {renderForecastTable()}
        </>
      ) : (
        <>
          {renderForecastTable()}
          {data && (
            <ForecastChart
              months={visibleColumns}
              data={data}
              modelName={modelName}
              setModelName={setModelName}
              models={models}
              loadingModels={loadingModels}
              avgMapeData={avgMape}
              countryName={selectedCountry}
              showForecast={showForecast}
              setErrorSnackbar={setErrorSnackbar}
              isWeekly={period === "W"}
              selectedRangeActive={weeklySelectedRangeActive}
            />
          )}
        </>
      )}

      <Snackbar
        open={errorSnackbar.open}
        autoHideDuration={4000}
        onClose={handleErrorSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleErrorSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {errorSnackbar.message}
        </Alert>
      </Snackbar>

      <LockCommentPopover
        open={lockComment.open}
        anchorEl={lockComment.anchor}
        onClose={() => setLockComment({ ...lockComment, open: false })}
        message={lockComment.message}
      />

      <ConfirmationDialog
        open={confirmationDialog.open}
        onClose={handleConfirmationClose}
        onConfirm={handleConfirmationSubmit}
        confirming={isSubmittingConfirm}
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
