import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
  ListItemText,
  List,
  ListItem,
  CircularProgress,
  Dialog,
  Slide,
} from "@mui/material";
import {
  CheckBox,
  ChevronRight as ChevronRightIcon,
  ChatBubbleOutline,
  Download,
  Edit,
  FilterAlt,
  MoreVert,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Share,
  SmartToy,
} from "@mui/icons-material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { format, addMonths, subMonths, parseISO } from "date-fns";
import AddBox from "@mui/icons-material/AddBox";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import OpenInFull from "@mui/icons-material/OpenInFull";
import DateFilter from "./components/DateFilter";
import ModelComparisonSection from "./components/RecommendedModelsSection";
import ForecastTable from "./components/ForecastTable";
import { AlertsSection } from "./components/AlertSection";
import { ChartSection } from "./components/ChartSection";
import Chart from "./components/Messaging";
import ChatBot from "./components/chatbox";

// const apiUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = import.meta.env.VITE_API_URL;

function getSelectedNames(selectedIds, options, optionKey, displayKey) {
  return options
    .filter((opt) => selectedIds.includes(opt[optionKey]))
    .map((opt) => opt[displayKey]);
}

// ... [All the existing component definitions remain unchanged: Listbox, DataRowsMenu, MultiSelectWithCheckboxes] ...

// --- Listbox styled to match your screenshot ---
const Listbox = () => {
  const listItems = [{ id: 1, label: "Product Name" }];
  const [checked, setChecked] = useState([]);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };
  return (
    <Box sx={{ bgcolor: "#fff", px: 0.5, py: 0.5, minWidth: 180 }}>
      <List disablePadding>
        {listItems.map((item) => (
          <ListItem
            key={item.id}
            disableGutters
            onClick={handleToggle(item.id)}
            sx={{
              px: 1.2,
              py: 0.5,
              mb: 0.5,
              borderRadius: 1,
              cursor: "pointer",
              "&:last-child": { mb: 0 },
            }}
          >
            <Checkbox
              checked={checked.indexOf(item.id) !== -1}
              tabIndex={-1}
              disableRipple
              sx={{
                p: 0,
                mr: 1.2,
                width: 22,
                height: 22,
                "& .MuiSvgIcon-root": {
                  fontSize: 20,
                  border: "2px solid #bcd0e5",
                  borderRadius: "4px",
                  color: "#fff",
                  background: "#fff",
                },
                "&.Mui-checked .MuiSvgIcon-root": {
                  color: "#0288d1",
                  background: "#fff",
                  border: "2px solid #0288d1",
                },
              }}
            />
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 17,
                fontWeight: 400,
                color: "#232b3a",
                fontFamily: "Poppins, Helvetica, Arial, sans-serif",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

// --- Plus Button Dropdown Component ---
const DATA_ROW_OPTIONS = [
  { key: "all", label: "All" },
  { key: "sales", label: "Sales" },
  { key: "promotion", label: "Promotion/Marketing" },
  { key: "inventory", label: "Inventory Level %" },
  { key: "stockout", label: "Stock out days" },
  { key: "onhand", label: "On Hand" },
];

function DataRowsMenu({ anchorEl, open, onClose, selected, setSelected }) {
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  const filteredOptions = DATA_ROW_OPTIONS.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const isAllSelected = selected.length === DATA_ROW_OPTIONS.length - 1;

  const handleToggle = (key) => {
    if (key === "all") {
      if (isAllSelected) {
        setSelected([]);
      } else {
        setSelected(
          DATA_ROW_OPTIONS.filter((opt) => opt.key !== "all").map(
            (opt) => opt.key
          )
        );
      }
    } else {
      setSelected((prev) =>
        prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]
      );
    }
  };

  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [open]);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{ style: { width: 260, paddingTop: 0, paddingBottom: 0 } }}
    >
      <Box sx={{ p: 1, pb: 0 }}>
        <TextField
          inputRef={searchInputRef}
          size="small"
          placeholder="Search Data Rows"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </Box>
      {filteredOptions.map((option) => (
        <MenuItem
          key={option.key}
          onClick={() => handleToggle(option.key)}
          dense
        >
          <Checkbox
            checked={
              option.key === "all"
                ? isAllSelected
                : selected.includes(option.key)
            }
            indeterminate={
              option.key === "all" && selected.length > 0 && !isAllSelected
            }
          />
          <ListItemText primary={option.label} />
        </MenuItem>
      ))}
    </Menu>
  );
}

// --- UPDATED MultiSelectWithCheckboxes - Now Generic! ---
function MultiSelectWithCheckboxes({
  label,
  options = [],
  optionKey,
  displayKey, // NEW: What field to display (e.g., "city_name", "plant_name")
  selected,
  setSelected,
  width = 155,
  searchPlaceholder = "",
  loading = false,
  disabled = false,
  onOpen,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  const safeOptions = Array.isArray(options) ? options : [];

  // Generic filtering - uses displayKey if provided, otherwise falls back to optionKey
  const filteredOptions = safeOptions.filter((option) => {
    if (!search) return true;
    const searchField = displayKey ? option[displayKey] : option[optionKey];
    return (
      typeof searchField === "string" &&
      searchField.toLowerCase().includes(search.toLowerCase())
    );
  });

  const isAllSelected =
    safeOptions.length > 0 && selected.length === safeOptions.length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    if (onOpen) onOpen();
  };
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    if (anchorEl && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [anchorEl]);

  const handleSelectAll = () => {
    setSelected(isAllSelected ? [] : safeOptions.map((opt) => opt[optionKey]));
  };

  const handleToggle = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Generic button label - uses displayKey if provided, otherwise optionKey
  const getButtonLabel = () => {
    if (selected.length === 0) return label;
    if (selected.length === 1) {
      const found = safeOptions.find((opt) => opt[optionKey] === selected[0]);
      return found?.[displayKey || optionKey] || label;
    }
    return `${selected.length} selected`;
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpen}
        sx={{
          minWidth: 120, // Ensures consistency
          flexShrink: 0, // Prevent shrinking on overflow
          whiteSpace: "nowrap",
          bgcolor: "common.white",
          justifyContent: "flex-start",
          borderColor: "#bdbdbd",
          textTransform: "none",
          px: 1.5,
          transition: "all 0.2s ease",
        }}
        endIcon={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {selected.length > 0 && (
              <Chip
                label={selected.length}
                size="small"
                color="primary"
                sx={{ mr: 0.5, height: 20 }}
              />
            )}
            <KeyboardArrowDownIcon sx={{ width: 16, height: 16, color: "#757575" }} />
            {/* <FilterAlt sx={{ width: 16, height: 16, color: "#757575" }} /> */}
          </Box>
        }
        disabled={disabled}
      >
        {getButtonLabel()}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ style: { width: 280 } }}
      >
        <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
          <TextField
            inputRef={searchInputRef}
            size="small"
            placeholder={searchPlaceholder || `Search ${label.toLowerCase()}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </Box>
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
          </MenuItem>
        ) : filteredOptions.length > 0 ? (
          [
            <MenuItem onClick={handleSelectAll} key="all">
              <Checkbox
                checked={isAllSelected}
                indeterminate={selected.length > 0 && !isAllSelected}
              />
              <ListItemText primary="All" />
            </MenuItem>,
            ...filteredOptions.map((option) => (
              <MenuItem
                key={option[optionKey]}
                onClick={() => handleToggle(option[optionKey])}
                dense
              >
                <Checkbox checked={selected.includes(option[optionKey])} />
                <ListItemText primary={option[displayKey || optionKey]} />
              </MenuItem>
            )),
          ]
        ) : (
          <MenuItem disabled>
            <ListItemText primary="None" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

// Pivot for chart
const pivotData = (data) => {
  const metrics = [
    { key: "actual", label: "Actual" },
    { key: "baseline_forecast", label: "Baseline Forecast" },
    { key: "ml_forecast", label: "ML Forecast" },
    { key: "consensus", label: "Consensus" },
    { key: "revenue_forecast_lakhs", label: "Revenue Forecast (Lakhs)" },
  ];

  return metrics.map((metric) => ({
    name: metric.label,
    values: data.map((row) => row[metric.key] ?? null),
    suffix: metric.key === "revenue_forecast_lakhs" ? "L" : undefined,
    isConsensus: metric.key === "consensus",
  }));
};
const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const DemandProjectMonth = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    scrollRef.current.classList.add("dragging");
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    scrollRef.current.classList.remove("dragging");
  };

  const handleMouseUp = () => {
    isDown.current = false;
    scrollRef.current.classList.remove("dragging");
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Scroll speed
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // --- Sidebar state ---
  const [showActivities, setShowActivities] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: format(subMonths(new Date("2024-12-01"), 6), "yyyy-MM-dd"),
    endDate: format(addMonths(new Date("2025-12-31"), 6), "yyyy-MM-dd"),
  });

  const [activeTab, setActiveTab] = useState(0);
  const [timePeriod, setTimePeriod] = useState("M");
  const [showForecast, setShowForecast] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [months, setMonths] = useState([]);
  const [filtersData, setFiltersData] = useState({
    countries: [],
    states: [],
    cities: [],
    plants: [],
    categories: [],
    skus: [],
    channels: [],
  });

  const handleOpenActivities = () => setShowActivities(true);
  const handleCloseActivities = () => setShowActivities(false);

  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSKUs, setSelectedSKUs] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);

  // Loading states for each filter
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingPlants, setLoadingPlants] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSkus, setLoadingSkus] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelName, setModelName] = useState("XGBoost");

  // For plus button menu
  const [dataRowsAnchorEl, setDataRowsAnchorEl] = useState(null);
  const [selectedDataRows, setSelectedDataRows] = useState([]);
  // For MoreVert (three dots) filter menu
  const [moreAnchorEl, setMoreAnchorEl] = useState(null);

  // --- Handlers for MoreVert menu ---
  const handleMoreOpen = (event) => setMoreAnchorEl(event.currentTarget);
  const handleMoreClose = () => setMoreAnchorEl(null);

  // Updated chatbox state management
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  const handleOpenChatBot = () => {
    setIsChatBotOpen(true);
  };

  const handleCloseChatBot = () => {
    setIsChatBotOpen(false);
  };

  //model selection
  // Add this useEffect to fetch models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const response = await fetch(`http://localhost:5000/api/models`);
        if (response.ok) {
          const modelsData = await response.json();
          setModels(modelsData);

          // Set default model (first one or XGBoost if available)
          if (modelsData.length > 0) {
            const defaultModel =
              modelsData.find((m) => m.model_name === "XGBoost") ||
              modelsData[0];
            setModelName(defaultModel.model_name);
          }
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, []);

  const tabs = [
    { label: "Demand", count: null },
    { label: "Alerts for Forecast Error", count: 2 },
    { label: "Compare Model", count: null },
    { label: "Analytics", count: null },
    { label: "Scenarios", count: null },
  ];

  const fetchCountries = () => {
    setLoadingCountries(true);
    axios
      // .get(`${API_BASE_URL}/getAllCountries`)
      .get(`http://localhost:5000/api/getAllCountries`)
      .then((res) => {
        setFiltersData((prev) => ({
          ...prev,
          countries: Array.isArray(res.data) ? res.data : [],
        }));
      })
      .catch(() =>
        setFiltersData((prev) => ({
          ...prev,
          countries: [],
        }))
      )
      .finally(() => setLoadingCountries(false));
  };

  useEffect(() => {
    if (!selectedCountry.length) {
      setFiltersData((prev) => ({
        ...prev,
        states: [],
        cities: [],
        plants: [],
        categories: [],
        skus: [],
      }));
      setSelectedState([]);
      setSelectedCities([]);
      setSelectedPlants([]);
      setSelectedCategories([]);
      setSelectedSKUs([]);
      return;
    }
    setLoadingStates(true);
    axios
      .post(`http://localhost:5000/api/states-by-country`, {
        countryIds: selectedCountry,
      })
      .then((res) => {
        setFiltersData((prev) => ({
          ...prev,
          states: Array.isArray(res.data) ? res.data : [],
          cities: [],
          plants: [],
          categories: [],
          skus: [],
        }));
        setSelectedState([]);
        setSelectedCities([]);
        setSelectedPlants([]);
        setSelectedCategories([]);
        setSelectedSKUs([]);
      })
      .catch(() => {
        setFiltersData((prev) => ({
          ...prev,
          states: [],
          cities: [],
          plants: [],
          categories: [],
          skus: [],
        }));
        setSelectedState([]);
        setSelectedCities([]);
        setSelectedPlants([]);
        setSelectedCategories([]);
        setSelectedSKUs([]);
      })
      .finally(() => setLoadingStates(false));
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedState.length) {
      setFiltersData((prev) => ({
        ...prev,
        cities: [],
        plants: [],
        categories: [],
        skus: [],
      }));
      setSelectedCities([]);
      setSelectedPlants([]);
      setSelectedCategories([]);
      setSelectedSKUs([]);
      return;
    }
    setLoadingCities(true);
    axios
      .post(`http://localhost:5000/api/cities-by-states`, {
        stateIds: selectedState,
      })
      .then((res) => {
        setFiltersData((prev) => ({
          ...prev,
          cities: Array.isArray(res.data) ? res.data : [],
          plants: [],
          categories: [],
          skus: [],
        }));
        setSelectedCities([]);
        setSelectedPlants([]);
        setSelectedCategories([]);
        setSelectedSKUs([]);
      })
      .catch(() => {
        setFiltersData((prev) => ({
          ...prev,
          cities: [],
          plants: [],
          categories: [],
          skus: [],
        }));
        setSelectedCities([]);
        setSelectedPlants([]);
        setSelectedCategories([]);
        setSelectedSKUs([]);
      })
      .finally(() => setLoadingCities(false));
  }, [selectedState]);

  // ... cascading effect hooks for plants, categories, skus, channels unchanged ...
  // Fetch plants when cities change (selectedCities is array of IDs)
  useEffect(() => {
    if (!selectedCities.length) {
      setFiltersData((prev) => ({
        ...prev,
        plants: [],
        categories: [],
        skus: [],
      }));
      setSelectedPlants([]);
      setSelectedCategories([]);
      setSelectedSKUs([]);
      return;
    }
    setLoadingPlants(true);
    axios
      .post(`http://localhost:5000/api/plants-by-cities`, {
        cityIds: selectedCities,
      })
      .then((res) => {
        setFiltersData((prev) => ({
          ...prev,
          plants: Array.isArray(res.data) ? res.data : [],
          categories: [],
          skus: [],
        }));
        setSelectedPlants([]);
        setSelectedCategories([]);
        setSelectedSKUs([]);
      })
      .catch(() => {
        setFiltersData((prev) => ({
          ...prev,
          plants: [],
          categories: [],
          skus: [],
        }));
        setSelectedPlants([]);
        setSelectedCategories([]);
        setSelectedSKUs([]);
      })
      .finally(() => setLoadingPlants(false));
  }, [selectedCities]);

  // Fetch categories when plants change (selectedPlants is array of IDs)
  useEffect(() => {
    if (!selectedPlants.length) {
      setFiltersData((prev) => ({
        ...prev,
        categories: [],
        skus: [],
      }));
      setSelectedCategories([]);
      setSelectedSKUs([]);
      return;
    }
    setLoadingCategories(true);

    axios
      .post(`http://localhost:5000/api/categories-by-plants`, {
        plantIds: selectedPlants,
      })
      .then((res) => {
        setFiltersData((prev) => ({
          ...prev,
          categories: Array.isArray(res.data) ? res.data : [],
          skus: [],
        }));
        setSelectedCategories([]);
        setSelectedSKUs([]);
      })
      .catch(() => {
        setFiltersData((prev) => ({
          ...prev,
          categories: [],
          skus: [],
        }));
        setSelectedCategories([]);
        setSelectedSKUs([]);
      })
      .finally(() => setLoadingCategories(false));
  }, [selectedPlants]);

  // Fetch SKUs when categories change (selectedCategories is array of IDs)
  useEffect(() => {
    if (!selectedCategories.length) {
      setFiltersData((prev) => ({
        ...prev,
        skus: [],
      }));
      setSelectedSKUs([]);
      return;
    }
    setLoadingSkus(true);
    axios
      .post(`http://localhost:5000/api/skus-by-categories`, {
        categoryIds: selectedCategories,
      })
      .then((res) => {
        setFiltersData((prev) => ({
          ...prev,
          skus: Array.isArray(res.data) ? res.data : [],
        }));
        setSelectedSKUs([]);
      })
      .catch(() => {
        setFiltersData((prev) => ({
          ...prev,
          skus: [],
        }));
        setSelectedSKUs([]);
      })
      .finally(() => setLoadingSkus(false));
  }, [selectedCategories]);

  useEffect(() => {
    setLoadingChannels(true);
    axios
      .get(`http://localhost:5000/api/getAllChannels`)
      .then((res) => {
        setFiltersData((prev) => ({
          ...prev,
          channels: Array.isArray(res.data) ? res.data : [],
        }));
      })
      .catch(() => setFiltersData((prev) => ({ ...prev, channels: [] })))
      .finally(() => setLoadingChannels(false));
  }, []);

  return (
    <Box>
      {/* AppBar */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "#0288d1",
          borderBottom: 1,
          borderColor: "#78909c",
          boxShadow: 0,
          height: "56px",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton color="inherit">
              <img
                alt="List"
                src="https://c.animaapp.com/Jwk7dHU9/img/list.svg"
                style={{ width: 30, height: 30 }}
              />
            </IconButton>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box sx={{ width: 40, height: 35.69 }}>
                <img
                  alt="Logo"
                  src="https://c.animaapp.com/Jwk7dHU9/img/image-3@2x.png"
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
              <Stack>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "Poppins, Helvetica",
                    fontWeight: 600,
                    color: "#ffffff",
                  }}
                >
                  Demand Planning
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontFamily: "Poppins, Helvetica", color: "#ffffff" }}
                >
                  Business Planner
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" sx={{ p: 2.5 }}>
              {["M Project 1", "Demand"].map((item, idx, arr) => (
                <React.Fragment key={item}>
                  <Typography sx={{ color: "#ffffff", fontSize: "14px" }}>
                    {item}
                  </Typography>
                  {idx < arr.length - 1 && (
                    <ChevronRightIcon
                      sx={{ color: "#ffffff", width: 16, height: 16 }}
                    />
                  )}
                </React.Fragment>
              ))}
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton color="inherit">
              <SearchIcon sx={{ width: 20, height: 20 }} />
            </IconButton>
            <Avatar
              src="https://c.animaapp.com/Jwk7dHU9/img/ellipse@2x.png"
              sx={{ width: 38, height: 36 }}
            />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Action Nav Bar */}
      <Box
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          bgcolor: "#64748B",
          p: 1.25,
          gap: 2,
          overflowX: "auto",
          overflowY: "hidden",
          cursor: "grab",
          userSelect: "none",
          WebkitOverflowScrolling: "touch",
          "&.dragging": {
            cursor: "grabbing",
          },
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <IconButton
          size="small"
          onClick={() => navigate("/dashboard")}
          aria-label="Back to Dashboard"
        >
          <img
            src="https://c.animaapp.com/Jwk7dHU9/img/union.svg"
            alt="Back"
            style={{ width: 20, height: 20 }}
          />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: "grey.500" }} />

        <IconButton size="small">
          <Edit sx={{ width: 20, height: 20, color: "white" }} />
        </IconButton>

        <Box display="flex" alignItems="center" gap={2}>
          {/* Chat Icon with Dot */}
          <Box
            position="relative"
            width={24}
            height={20}
            onClick={handleOpenActivities}
            sx={{ cursor: "pointer" }}
          >
            {/* <ChatBubbleOutline sx={{ width: 20, height: 20 }} /> */}
            <ChatBubbleOutline sx={{ width: 20, height: 20, color: "white" }} />

            <Box
              component="img"
              src="https://c.animaapp.com/Jwk7dHU9/img/ellipse-309--stroke-.svg"
              alt="Indicator"
              sx={{
                position: "absolute",
                width: 12,
                height: 12,
                top: 0,
                left: 12,
                pointerEvents: "none",
              }}
            />
          </Box>

          {/* Updated ChatBot Icon - Replace filter icon with SmartToy */}
          <IconButton
            size="small"
            disableRipple
            sx={{ p: 0 }}
            onClick={handleOpenChatBot}
            aria-label="Open ChatBot"
          >
            <SmartToy
              sx={{
                width: 20,
                height: 20,
                color: "#ffffff",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#e3f2fd",
                  transform: "scale(1.1)",
                },
              }}
            />
          </IconButton>

          {/* Divider */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ bgcolor: "grey.500" }}
          />
        </Box>

        <Stack direction="row" spacing={0.625}>
          <DateFilter onDateChange={(range) => setDateRange(range)} />
          <MultiSelectWithCheckboxes
            label="Country"
            options={filtersData.countries}
            optionKey="country_id"
            displayKey="country_name"
            selected={selectedCountry}
            setSelected={setSelectedCountry}
            searchPlaceholder="Search country"
            loading={loadingCountries}
            onOpen={fetchCountries}
            width={110}
          />
          <MultiSelectWithCheckboxes
            label="State"
            options={filtersData.states}
            optionKey="state_id"
            displayKey="state_name"
            selected={selectedState}
            setSelected={setSelectedState}
            searchPlaceholder="Search state"
            loading={loadingStates}
            disabled={!filtersData.states.length}
            width={110}
          />
          <MultiSelectWithCheckboxes
            label="City"
            options={filtersData.cities}
            optionKey="city_id"
            displayKey="city_name"
            selected={selectedCities}
            setSelected={setSelectedCities}
            searchPlaceholder="Search city"
            loading={loadingCities}
            disabled={!filtersData.cities.length}
            width={110}
          />

          {/* Plant Filter - Select by ID, Display by Name */}
          <MultiSelectWithCheckboxes
            label="Plant"
            options={filtersData.plants}
            optionKey="plant_id"
            displayKey="plant_name"
            selected={selectedPlants}
            setSelected={setSelectedPlants}
            searchPlaceholder="Search plant"
            loading={loadingPlants}
            disabled={!filtersData.plants.length}
            width={110}
          />

          {/* Category Filter - Select by ID, Display by Name */}
          <MultiSelectWithCheckboxes
            label="Category"
            options={filtersData.categories}
            optionKey="category_id"
            displayKey="category_name"
            selected={selectedCategories}
            setSelected={setSelectedCategories}
            searchPlaceholder="Search category"
            loading={loadingCategories}
            disabled={!filtersData.categories.length}
            width={110}
          />

          {/* SKU Filter - Select by ID, Display by Code */}
          <MultiSelectWithCheckboxes
            label="SKU"
            options={filtersData.skus}
            optionKey="sku_id"
            displayKey="sku_code"
            selected={selectedSKUs}
            setSelected={setSelectedSKUs}
            searchPlaceholder="Search SKU"
            loading={loadingSkus}
            disabled={!filtersData.skus.length}
            width={110}
          />

          {/* Channel Filter - Assuming it has channel_id and channel_name/channel_code */}
          <MultiSelectWithCheckboxes
            label="Channel"
            options={filtersData.channels}
            optionKey="channel_id" // Value sent to backend (ID)
            displayKey="channel_name" // Value shown to user (Name)
            selected={selectedChannels}
            setSelected={setSelectedChannels}
            searchPlaceholder="Search channel"
            loading={loadingChannels}
            width={110}
          />

          {/* --- Three dots menu for filters --- */}
          <IconButton size="small" onClick={handleMoreOpen}>
            <MoreVert sx={{ width: 20, height: 20 }} />
          </IconButton>
          <Menu
            anchorEl={moreAnchorEl}
            open={Boolean(moreAnchorEl)}
            onClose={handleMoreClose}
            PaperProps={{
              style: {
                minWidth: 210,
                borderRadius: 8,
                boxShadow:
                  "0px 8px 24px rgba(29, 41, 57, 0.08), 0px 1.5px 4px rgba(0,0,0,0.04)",
                padding: 0,
              },
            }}
            MenuListProps={{
              sx: { p: 0 },
            }}
          >
            <Listbox />
          </Menu>
        </Stack>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{
          borderBottom: 1,
          borderColor: "grey.200",
          bgcolor: "common.white",
          minHeight: 30,
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: "#545454" }}>
                  {tab.label}
                </Typography>
                {tab.count && (
                  <Chip label={tab.count} size="small" color="error" />
                )}
              </Box>
            }
            sx={{ minHeight: 30, px: 2.5, textTransform: "none" }}
          />
        ))}
      </Tabs>

      {/* Toolbar (LEFT: period/forecast, RIGHT: icons) */}
      {activeTab < 2 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 0.5,
            bgcolor: "common.white",
            borderBottom: 1,
            borderColor: "grey.200",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}></Box>
        </Box>
      )}

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {activeTab === 1 ? (
          <Box sx={{ width: "100%", bgcolor: "#f6faff", p: 0, m: 0 }}>
            <AlertsSection />
            <ChartSection />
          </Box>
        ) : activeTab === 2 ? (
          <Box
            sx={{
              width: "100%",
              minHeight: 0,
              bgcolor: "#e9f0f7",
              p: 0,
              m: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ModelComparisonSection />
          </Box>
        ) : (
          <>
            <ForecastTable
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              modelName={modelName}
              setModelName={setModelName}
              models={models}
              loadingModels={loadingModels}
              selectedCountry={getSelectedNames(
                selectedCountry,
                filtersData.countries,
                "country_id",
                "country_name"
              )}
              selectedState={getSelectedNames(
                selectedState,
                filtersData.states,
                "state_id",
                "state_name"
              )}
              selectedCities={getSelectedNames(
                selectedCities,
                filtersData.cities,
                "city_id",
                "city_name"
              )}
              selectedPlants={getSelectedNames(
                selectedPlants,
                filtersData.plants,
                "plant_id",
                "plant_name"
              )}
              selectedCategories={getSelectedNames(
                selectedCategories,
                filtersData.categories,
                "category_id",
                "category_name"
              )}
              selectedSKUs={getSelectedNames(
                selectedSKUs,
                filtersData.skus,
                "sku_id",
                "sku_code"
              )}
              selectedChannels={getSelectedNames(
                selectedChannels,
                filtersData.channels,
                "channel_id",
                "channel_name"
              )}
              // avgMapeData={avgMapeData}
            />
          </>
        )}
      </Box>

      {/* --- Activities Sidebar Overlay --- */}
      {showActivities && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100vh",
            width: 700,
            zIndex: 1400,
            bgcolor: "rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-end",
          }}
          onClick={handleCloseActivities}
        >
          <Box
            sx={{
              height: "100vh",
              boxShadow: 6,
              bgcolor: "grey.400",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Chart onClose={handleCloseActivities} />
          </Box>
        </Box>
      )}
      <Dialog
        open={isChatBotOpen}
        onClose={handleCloseChatBot}
        TransitionComponent={SlideTransition}
        maxWidth={false}
        PaperProps={{
          sx: {
            margin: 0,
            maxWidth: "none",
            maxHeight: "none",
            borderRadius: "10px",
            overflow: "hidden",
            position: "fixed",
            right: 0,
            top: 0,
            height: "100vh",
          },
        }}
        sx={{
          "& .MuiDialog-container": {
            justifyContent: "flex-end",
          },
        }}
      >
        <ChatBot onClose={handleCloseChatBot} />
      </Dialog>
    </Box>
  );
};
