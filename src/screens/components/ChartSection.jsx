// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Button,
//   Checkbox,
//   CircularProgress,
//   Divider,
//   MenuItem,
//   Paper,
//   Select,
//   Stack,
//   ToggleButton,
//   ToggleButtonGroup,
//   Typography,
//   Alert,
// } from "@mui/material";
// import {
//   Error as ErrorIcon,
//   Info as InfoIcon,
//   KeyboardArrowDown as KeyboardArrowDownIcon,
//   Warning as WarningIcon,
//   FileDownloadOutlined,
//   ShareOutlined,
// } from "@mui/icons-material";
// import { useAlert } from "./AlertContext";
// import Highcharts from "highcharts";

// // const API_BASE_URL = import.meta.env.VITE_API_URL;
// const API_BASE_URL = `http://localhost:5000/api`;


// // Chart rendering component
// const ForecastChart = ({ data, selectedAlert }) => {
//   const chartRef = useRef(null);

//   if (!data || data.length === 0) return <p>No forecast data to display.</p>;

//   const actualData = [];
//   const forecastData = [];
//   data.forEach((item) => {
//     const timestamp = new Date(item.filtered_date).getTime();
//     if (item.actual_units !== null)
//       actualData.push([timestamp, item.actual_units]);
//     if (item.ml_forecast !== null)
//       forecastData.push([timestamp, item.ml_forecast]);
//   });

//   const plotBands = selectedAlert
//     ? [
//         {
//           from: new Date(selectedAlert.error_start_date).getTime(),
//           to: new Date(selectedAlert.error_end_date).getTime(),
//           color:
//             selectedAlert.error_type === "error"
//               ? "rgba(255, 68, 68, 0.3)"
//               : "rgba(255, 165, 0, 0.3)",
//         },
//       ]
//     : [];

//   const chartOptions = {
//     chart: {
//       type: "line",
//       height: 565.51,
//       spacingTop: 8,
//       spacingRight: 8,
//       spacingBottom: 8,
//       spacingLeft: 0,
//     },
//     title: { text: null },
//     xAxis: {
//       type: "datetime",
//       gridLineWidth: 1,
//       gridLineColor: "#f0f0f0",
//       plotBands,
//       labels: { style: { fontSize: "11px" } },
//     },
//     yAxis: {
//       gridLineWidth: 1,
//       gridLineColor: "#f0f0f0",
//       title: { text: null },
//       labels: { style: { fontSize: "11px" } },
//     },
//     tooltip: {
//       shared: true,
//       backgroundColor: "#fff",
//       borderColor: "#ccc",
//       borderRadius: 5,
//       style: { fontSize: "11px" },
//     },
//     legend: {
//       enabled: true,
//       verticalAlign: "top",
//       y: 0,
//       itemStyle: { fontSize: "11px" },
//       symbolHeight: 8,
//     },
//     plotOptions: {
//       line: {
//         marker: { enabled: true, radius: 2 },
//         lineWidth: 2,
//       },
//     },
//     series: [
//       {
//         name: "Actual Units",
//         data: actualData,
//         color: "#EF4444",
//         marker: { fillColor: "#EF4444", lineColor: "#fff", lineWidth: 1 },
//         connectNulls: false,
//       },
//       {
//         name: "ML Forecast",
//         data: forecastData,
//         color: "#EF4444",
//         dashStyle: "ShortDash",
//         marker: { fillColor: "#EF4444", lineColor: "#fff", lineWidth: 1 },
//         connectNulls: false,
//       },
//     ],
//     credits: { enabled: false },
//     responsive: {
//       rules: [
//         {
//           condition: {
//             maxWidth: 600,
//           },
//           chartOptions: {
//             legend: {
//               layout: "horizontal",
//               align: "center",
//               verticalAlign: "bottom",
//             },
//           },
//         },
//       ],
//     },
//   };

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = Highcharts.chart(chartRef.current, chartOptions);
//       const resizeListener = () => chart.reflow();
//       window.addEventListener("resize", resizeListener);
//       return () => {
//         chart.destroy();
//         window.removeEventListener("resize", resizeListener);
//       };
//     }
//   }, [data, selectedAlert]);

//   return (
//     <div
//       ref={chartRef}
//       style={{ width: "100%", height: "565.51px", overflowX: "auto" }}
//     />
//   );
// };

// // Main Component
// export const ChartSection = () => {
//   const { selectAlert } = useAlert();

//   const [alertsData, setAlertsData] = useState([]);
//   const [rawAlertsData, setRawAlertsData] = useState([]);
//   const [loading, setLoadingState] = useState(true);
//   const [error, setError] = useState(null);
//   const [checkedItems, setCheckedItems] = useState({});
//   const [selectedAlertId, setSelectedAlertId] = useState(null);
//   const [forecastData, setForecastData] = useState([]);

//   const [selectedTimePeriod, setSelectedTimePeriod] = useState("month");
//   const [selectedModel, setSelectedModel] = useState("");
//   const [models, setModels] = useState([]);
//   const [modelsLoading, setModelsLoading] = useState(true);
//   const [modelsError, setModelsError] = useState(null);

//   const [errorMessage, setErrorMessage] = useState("");

//   const now = () => new Date();
//   const addMonths = (d, m) => new Date(d.getFullYear(), d.getMonth() + m, 1);
//   const iso = (d) => d.toISOString().split("T")[0];
//   const inside = (d, a, b) => d >= a && d <= b;

//   const handleTimePeriodChange = (event, newValue) => {
//     if (newValue !== null) setSelectedTimePeriod(newValue);
//   };

//   const handleModelChange = (event) => setSelectedModel(event.target.value);

//   const fmtViewDate = (dStr) =>
//     new Date(dStr).toLocaleDateString("en-US", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });

//   const trimForecast = (arr) => {
//     if (!Array.isArray(arr)) return [];
//     const current = now();
//     const actualStart = addMonths(current, -6);
//     const forecastEnd = addMonths(current, 6);
//     const forecastStart = addMonths(current, -3);

//     return arr
//       .map((row) => {
//         const d = new Date(
//           row.sales_week_start.length === 7 ? `${row.sales_week_start}-01` : row.sales_week_start
//         );
//         return {
//           ...row,
//           filtered_date: d,
//           actual_units:
//             inside(d, actualStart, current) && +row.actual_units > 0
//               ? +row.actual_units
//               : null,
//           ml_forecast:
//             inside(d, forecastStart, forecastEnd) && +row.ml_forecast > 0
//               ? +row.ml_forecast
//               : null,
//         };
//       })
//       .filter((r) => r.actual_units !== null || r.ml_forecast !== null);
//   };

//   const toAlertRow = (alert) => ({
//     id: alert.id,
//     date: fmtViewDate(alert.error_start_date),
//     message: `${alert.city_name} (${alert.plant_name}) - ${alert.category_name} (${alert.sku_code}) - ${alert.error_label}`,
//     type: alert.error_type,
//     rawData: alert,
//   });

//   const fetchForecastData = async (alert) => {
//     const filters = {
//       model_name: "XGBoost",
//       startDate: iso(addMonths(now(), -6)),
//       endDate: iso(addMonths(now(), 6)),
//       country: alert.country_name,
//       state: alert.state_name,
//       cities: alert.city_name,
//       plants: alert.plant_name,
//       categories: alert.category_name,
//       skus: alert.sku_code,
//       channels: alert.channel_name,
//     };
// console.log("Fetching forecast with filters:", filters);

//     try {
//       const res = await fetch(`${API_BASE_URL}/forecastAlerts`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(filters),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const raw = await res.json();
//           console.log("Forecast API response:", raw);
//       const cleaned = trimForecast(raw);
//       setForecastData(cleaned);
//       selectAlert({ selectedAlert: alert, forecastData: cleaned });
//     } catch (err) {
//           console.error("Forecast API error:", err);
//       setForecastData([]);
//       selectAlert({
//         selectedAlert: alert,
//         forecastData: null,
//         error: err.message,
//       });
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoadingState(true);
//         const res = await fetch(`${API_BASE_URL}/getAllAlerts`);
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const alerts = await res.json();
//         console.log("Alerts API response:", alerts);
//         setRawAlertsData(alerts);
//         const rows = alerts.map(toAlertRow);
//         setAlertsData(rows);
//         setCheckedItems(Object.fromEntries(rows.map((r) => [r.id, false])));
//         if (alerts.length) {
//           const oldest = alerts.reduce((o, c) =>
//             new Date(c.error_start_date) < new Date(o.error_start_date) ? c : o
//           );
//           setSelectedAlertId(oldest.id);
//           setCheckedItems({ [oldest.id]: true });
//           await fetchForecastData(oldest);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoadingState(false);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     setModelsLoading(true);
//     fetch(`${API_BASE_URL}/models`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch models");
//         return res.json();
//       })
//       .then((data) => {
//         setModels(data);
//         if (data.length > 0) setSelectedModel(data[0].model_name);
//         setModelsLoading(false);
//       })
//       .catch((err) => {
//         setModelsError(err.message);
//         setModelsLoading(false);
//       });
//   }, []);

//   const setSingleCheck = (id) =>
//     setCheckedItems(
//       Object.fromEntries(Object.keys(checkedItems).map((k) => [k, k === id]))
//     );

//   const onAlertSelect = async (row) => {
//     setSelectedAlertId(row.id);
//     setSingleCheck(row.id);
//     setErrorMessage(row.message);
//     await fetchForecastData(row.rawData);
//   };

//   if (loading)
//     return (
//       <Paper elevation={0} sx={styles.centerPaper}>
//         <CircularProgress size={20} />
//         <Typography sx={{ ml: 1 }}>Loading alerts…</Typography>
//       </Paper>
//     );

//   if (error)
//     return (
//       <Paper
//         elevation={0}
//         sx={{ ...styles.centerPaper, borderColor: "error.main" }}
//       >
//         <ErrorIcon color="error" sx={{ mr: 1 }} />
//         <Typography color="error">Error: {error}</Typography>
//       </Paper>
//     );

//   const selectedAlert = rawAlertsData.find((a) => a.id === selectedAlertId);

//   return (
//     <Paper
//       elevation={0}
//       sx={{ width: "100%", border: 1, borderColor: "grey.300" }}
//     >
//       {/* Controls */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           px: 1.5,
//           pt: 1.5,
//           pb: 0.5,
//           borderBottom: 1,
//           borderColor: "grey.300",
//           minHeight: 40,
//         }}
//       >
//         <ToggleButtonGroup
//           value={selectedTimePeriod}
//           exclusive
//           onChange={handleTimePeriodChange}
//           sx={{
//             "& .MuiToggleButton-root": {
//               width: 36,
//               height: 20,
//               border: "1px solid #2563EB",
//               borderRadius: "50px",
//               p: 0,
//               fontWeight: 600,
//               fontSize: "12px",
//               lineHeight: "14px",
//               color: "#2563EB",
//               backgroundColor: "white",
//               "&.Mui-selected": {
//                 backgroundColor: "#2563EB",
//                 color: "white",
//               },
//               "&:not(:last-of-type)": {
//                 marginRight: 0.5,
//               },
//             },
//           }}
//         >
//           <ToggleButton value="month">M</ToggleButton>
//           <ToggleButton value="week">W</ToggleButton>
//         </ToggleButtonGroup>

//         {/* Error Message between M/W and Models */}
//         {errorMessage && (
//           <Alert
//             severity="error"
//             onClose={() => setErrorMessage("")}
//             sx={{
//               mx: 2,
//               py: 0,
//               fontSize: 12,
//               minHeight: 28,
//               "& .MuiAlert-message": {
//                 fontSize: 12,
//               },
//               "& .MuiAlert-icon": {
//                 fontSize: 16,
//               },
//             }}
//           >
//             {errorMessage}
//           </Alert>
//         )}

//         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           {modelsLoading ? (
//             <CircularProgress size={18} />
//           ) : modelsError ? (
//             <Typography color="error" sx={{ fontSize: 12 }}>
//               {modelsError}
//             </Typography>
//           ) : (
//             <Select
//               value={selectedModel}
//               onChange={handleModelChange}
//               size="small"
//               displayEmpty
//               renderValue={() =>
//                 selectedModel ? `Model - ${selectedModel}` : "Select Model"
//               }
//               sx={{
//                 minWidth: 110,
//                 height: 28,
//                 fontSize: 13,
//                 "& .MuiSelect-select": {
//                   py: 0.25,
//                   px: 1,
//                 },
//               }}
//               IconComponent={KeyboardArrowDownIcon}
//             >
//               {models.map((model) => (
//                 <MenuItem key={model.model_id} value={model.model_name}>
//                   {model.model_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           )}
//           <Button size="small" sx={{ minWidth: 0, p: 0 }}>
//             <ShareOutlined fontSize="small" />
//           </Button>
//           <Button size="small" sx={{ minWidth: 0, p: 0 }}>
//             <FileDownloadOutlined fontSize="small" />
//           </Button>
//         </Box>
//       </Box>

//       {/* Chart */}
//       <Box sx={{ p: 2, pb: 0 }}>
//         <ForecastChart data={forecastData} selectedAlert={selectedAlert} />
//       </Box>

//       {/* Header */}
//       <Box sx={styles.header}>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//           <InfoIcon sx={{ width: 13, height: 13 }} />
//           <Typography
//             variant="subtitle2"
//             sx={{ fontWeight: 600, color: "text.secondary", fontSize: 14 }}
//           >
//             Alerts &amp; Errors ({alertsData.length})
//           </Typography>
//         </Box>
//         <KeyboardArrowDownIcon sx={{ width: 16, height: 16 }} />
//       </Box>

//       {/* Alert List */}
//       <Box sx={styles.alertList}>
//         {alertsData.length === 0 ? (
//           <Box sx={styles.noAlerts}>
//             <Typography variant="caption" color="text.secondary">
//               No alerts found
//             </Typography>
//           </Box>
//         ) : (
//           <Stack spacing={0} sx={{ width: "100%" }}>
//             {alertsData.map((row) => (
//               <Box
//                 key={row.id}
//                 sx={{
//                   ...styles.row,
//                   bgcolor:
//                     selectedAlertId === row.id
//                       ? "rgba(25,118,210,0.08)"
//                       : "transparent",
//                   "&:hover": {
//                     bgcolor:
//                       selectedAlertId === row.id
//                         ? "rgba(25,118,210,0.12)"
//                         : "grey.200",
//                   },
//                 }}
//                 onClick={() => onAlertSelect(row)}
//               >
//                 <Checkbox
//                   checked={checkedItems[row.id] || false}
//                   size="small"
//                   sx={{ p: 0, width: 16, height: 16, ml: 0.5, mr: 1 }}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     setCheckedItems((prev) => ({
//                       ...prev,
//                       [row.id]: checked,
//                     }));
//                   }}
//                   onClick={(e) => e.stopPropagation()}
//                 />

//                 <Typography
//                   variant="caption"
//                   sx={{
//                     ...styles.dateCol,
//                     textDecoration: checkedItems[row.id]
//                       ? "line-through"
//                       : "none",
//                   }}
//                 >
//                   {row.date}
//                 </Typography>
//                 {row.type === "error" ? (
//                   <ErrorIcon
//                     sx={{
//                       width: 13,
//                       height: 13,
//                       color: "error.main",
//                       mx: 0.5,
//                       filter: checkedItems[row.id] ? "grayscale(100%)" : "none",
//                     }}
//                   />
//                 ) : (
//                   <WarningIcon
//                     sx={{
//                       width: 13,
//                       height: 13,
//                       color: "warning.main",
//                       mx: 0.5,
//                       filter: checkedItems[row.id] ? "grayscale(100%)" : "none",
//                     }}
//                   />
//                 )}
//                 <Typography
//                   variant="caption"
//                   color="text.secondary"
//                   sx={{
//                     textDecoration: checkedItems[row.id]
//                       ? "line-through"
//                       : "none",
//                   }}
//                 >
//                   {row.message}
//                 </Typography>
//               </Box>
//             ))}
//           </Stack>
//         )}
//         <Divider orientation="vertical" sx={{ width: 2, height: "100%" }} />
//       </Box>
//     </Paper>
//   );
// };

// const styles = {
//   centerPaper: {
//     width: "100%",
//     border: 1,
//     borderColor: "grey.300",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     p: 2,
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     px: 1.5,
//     py: 0.5,
//     borderBottom: 1,
//     borderColor: "grey.300",
//     minHeight: 36,
//   },
//   alertList: {
//     bgcolor: "grey.100",
//     display: "flex",
//     gap: 1,
//     borderLeft: 1,
//     borderRight: 1,
//     borderBottom: 1,
//     borderColor: "grey.300",
//     boxShadow: "inset 2px 1px 4px rgba(0,0,0,0.2)",
//     flexDirection: "horizontal",
//     width: "100%",
//     height: "160px",
//     p: "6px",
//   },
//   noAlerts: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//     height: "112px",
//   },
//   row: {
//     display: "flex",
//     alignItems: "center",
//     p: 0.5,
//     borderRadius: 1,
//     cursor: "pointer",
//     transition: "background-color 0.2s ease",
//     minHeight: "36px",
//   },
//   dateCol: {
//     fontWeight: 600,
//     color: "text.secondary",
//     minWidth: 110,
//     mr: 0.5,
//   },
// };


import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Alert,
} from "@mui/material";
import {
  Error as ErrorIcon,
  Info as InfoIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Warning as WarningIcon,
  FileDownloadOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { useAlert } from "./AlertContext";
import Highcharts from "highcharts";

const API_BASE_URL = `http://localhost:5000/api`;

// Chart rendering component
const ForecastChart = ({ data, selectedAlert }) => {
  const chartRef = useRef(null);

  const actualData = [];
  const forecastData = [];
  if (data && data.length > 0) {
    data.forEach((item) => {
      const timestamp = new Date(item.filtered_date).getTime();
      if (item.actual_units !== null)
        actualData.push([timestamp, item.actual_units]);
      if (item.ml_forecast !== null)
        forecastData.push([timestamp, item.ml_forecast]);
    });
  }

  const plotBands = selectedAlert
    ? [
        {
          from: new Date(selectedAlert.error_start_date).getTime(),
          to: new Date(selectedAlert.error_end_date).getTime(),
          color:
            selectedAlert.error_type === "error"
              ? "rgba(255, 68, 68, 0.3)"
              : "rgba(255, 165, 0, 0.3)",
        },
      ]
    : [];

  const chartOptions = {
    chart: {
      type: "line",
      height: 565.51,
      spacingTop: 8,
      spacingRight: 8,
      spacingBottom: 8,
      spacingLeft: 0,
    },
    title: { text: null },
    xAxis: {
      type: "datetime",
      gridLineWidth: 1,
      gridLineColor: "#f0f0f0",
      plotBands,
      labels: { style: { fontSize: "11px" } },
    },
    yAxis: {
      gridLineWidth: 1,
      gridLineColor: "#f0f0f0",
      title: { text: null },
      labels: { style: { fontSize: "11px" } },
    },
    tooltip: {
      shared: true,
      backgroundColor: "#fff",
      borderColor: "#ccc",
      borderRadius: 5,
      style: { fontSize: "11px" },
    },
    legend: {
      enabled: true,
      verticalAlign: "top",
      y: 0,
      itemStyle: { fontSize: "11px" },
      symbolHeight: 8,
    },
    plotOptions: {
      line: {
        marker: { enabled: true, radius: 2 },
        lineWidth: 2,
      },
    },
    series: [
      {
        name: "Actual Units",
        data: actualData,
        color: "#EF4444",
        marker: { fillColor: "#EF4444", lineColor: "#fff", lineWidth: 1 },
        connectNulls: false,
      },
      {
        name: "ML Forecast",
        data: forecastData,
        color: "#EF4444",
        dashStyle: "ShortDash",
        marker: { fillColor: "#EF4444", lineColor: "#fff", lineWidth: 1 },
        connectNulls: false,
      },
    ],
    credits: { enabled: false },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 600,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      const chart = Highcharts.chart(chartRef.current, chartOptions);
      const resizeListener = () => chart.reflow();
      window.addEventListener("resize", resizeListener);
      return () => {
        chart.destroy();
        window.removeEventListener("resize", resizeListener);
      };
    }
  }, [data, selectedAlert]);

  return (
    <>
      {(!data || data.length === 0) ? (
        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "text.secondary", mt: 2 }}
        >
          No forecast data to display.
        </Typography>
      ) : (
        <div
          ref={chartRef}
          style={{ width: "100%", height: "565.51px", overflowX: "auto" }}
        />
      )}
    </>
  );
};

// Main Component
export const ChartSection = () => {
  const { selectAlert } = useAlert();

  const [alertsData, setAlertsData] = useState([]);
  const [rawAlertsData, setRawAlertsData] = useState([]);
  const [loading, setLoadingState] = useState(true);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  const [selectedTimePeriod, setSelectedTimePeriod] = useState("month");
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  const now = () => new Date();
  const addMonths = (d, m) => new Date(d.getFullYear(), d.getMonth() + m, 1);
  const iso = (d) => d.toISOString().split("T")[0];
  const inside = (d, a, b) => d >= a && d <= b;

  const handleTimePeriodChange = (event, newValue) => {
    if (newValue !== null) setSelectedTimePeriod(newValue);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const fmtViewDate = (dStr) =>
    new Date(dStr).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const trimForecast = (arr) => {
    if (!Array.isArray(arr)) return [];
    const current = now();
    const actualStart = addMonths(current, -6);
    const forecastEnd = addMonths(current, 6);
    const forecastStart = addMonths(current, -3);

    return arr
      .map((row) => {
        const d = new Date(
          row.sales_week_start.length === 7
            ? `${row.sales_week_start}-01`
            : row.sales_week_start
        );
        return {
          ...row,
          filtered_date: d,
          actual_units:
            inside(d, actualStart, current) && +row.actual_units > 0
              ? +row.actual_units
              : null,
          ml_forecast:
            inside(d, forecastStart, forecastEnd) && +row.ml_forecast > 0
              ? +row.ml_forecast
              : null,
        };
      })
      .filter((r) => r.actual_units !== null || r.ml_forecast !== null);
  };

  const toAlertRow = (alert) => ({
    id: alert.id,
    date: fmtViewDate(alert.error_start_date),
    message: `${alert.city_name} (${alert.plant_name}) - ${alert.category_name} (${alert.sku_code}) - ${alert.error_label}`,
    type: alert.error_type,
    rawData: alert,
  });

  const fetchForecastData = async (alert) => {
    const filters = {
      model_name: selectedModel,
      startDate: iso(addMonths(now(), -6)),
      endDate: iso(addMonths(now(), 6)),
      country: alert.country_name,
      state: alert.state_name,
      cities: alert.city_name,
      plants: alert.plant_name,
      categories: alert.category_name,
      skus: alert.sku_code,
      channels: alert.channel_name,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/forecastAlerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      const cleaned = trimForecast(raw);
      setForecastData(cleaned);
      selectAlert({ selectedAlert: alert, forecastData: cleaned });
    } catch (err) {
      console.error("Forecast API error:", err);
      setForecastData([]);
      selectAlert({
        selectedAlert: alert,
        forecastData: null,
        error: err.message,
      });
    }
  };

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoadingState(true);
        const res = await fetch(`${API_BASE_URL}/getAllAlerts`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const alerts = await res.json();
        setRawAlertsData(alerts);

        const rows = alerts.map(toAlertRow);
        setAlertsData(rows);
        setCheckedItems(Object.fromEntries(rows.map((r) => [r.id, false])));

        if (alerts.length) {
          const oldest = alerts.reduce((o, c) =>
            new Date(c.error_start_date) < new Date(o.error_start_date)
              ? c
              : o
          );
          setSelectedAlertId(oldest.id);
          setCheckedItems({ [oldest.id]: true });
          await fetchForecastData(oldest);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingState(false);
      }
    };
    loadAlerts();
  }, [selectedModel]);

  useEffect(() => {
    setModelsLoading(true);
    fetch(`${API_BASE_URL}/models`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch models");
        return res.json();
      })
      // .then((data) => {
      //   setModels(data);
      //   if (data.length > 0) setSelectedModel(data[0].model_name);
      //   setModelsLoading(false);
      // })
      .then((data) => {
  setModels(data);
  // Set selected model to "XGBoost" if it exists, else first model
  const xgbModel = data.find(m => m.model_name === "XGBoost");
  if (xgbModel) {
    setSelectedModel("XGBoost");
  } else if (data.length > 0) {
    setSelectedModel(data[0].model_name);
  }
  setModelsLoading(false);
})

      .catch((err) => {
        setModelsError(err.message);
        setModelsLoading(false);
      });
  }, []);

  useEffect(() => {
    const alert = rawAlertsData.find((a) => a.id === selectedAlertId);
    if (alert) {
      fetchForecastData(alert);
    }
  }, [selectedModel, selectedAlertId]);

  const setSingleCheck = (id) =>
    setCheckedItems(
      Object.fromEntries(Object.keys(checkedItems).map((k) => [k, k === id]))
    );

  const onAlertSelect = async (row) => {
    setSelectedAlertId(row.id);
    setSingleCheck(row.id);
    setErrorMessage(row.message);
    await fetchForecastData(row.rawData);
  };

  if (loading)
    return (
      <Paper elevation={0} sx={styles.centerPaper}>
        <CircularProgress size={20} />
        <Typography sx={{ ml: 1 }}>Loading alerts…</Typography>
      </Paper>
    );

  if (error)
    return (
      <Paper
        elevation={0}
        sx={{ ...styles.centerPaper, borderColor: "error.main" }}
      >
        <ErrorIcon color="error" sx={{ mr: 1 }} />
        <Typography color="error">Error: {error}</Typography>
      </Paper>
    );

  const selectedAlert = rawAlertsData.find((a) => a.id === selectedAlertId);

  return (
    <Paper
      elevation={0}
      sx={{ width: "100%", border: 1, borderColor: "grey.300" }}
    >
      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1.5,
          pt: 1.5,
          pb: 0.5,
          borderBottom: 1,
          borderColor: "grey.300",
          minHeight: 40,
        }}
      >
        <ToggleButtonGroup
          value={selectedTimePeriod}
          exclusive
          onChange={handleTimePeriodChange}
          sx={{
            "& .MuiToggleButton-root": {
              width: 36,
              height: 20,
              border: "1px solid #2563EB",
              borderRadius: "50px",
              p: 0,
              fontWeight: 600,
              fontSize: "12px",
              lineHeight: "14px",
              color: "#2563EB",
              backgroundColor: "white",
              "&.Mui-selected": {
                backgroundColor: "#2563EB",
                color: "white",
              },
              "&:not(:last-of-type)": {
                marginRight: 0.5,
              },
            },
          }}
        >
          <ToggleButton value="month">M</ToggleButton>
          <ToggleButton value="week">W</ToggleButton>
        </ToggleButtonGroup>

        {errorMessage && (
          <Alert
            severity="error"
            onClose={() => setErrorMessage("")}
            sx={{
              mx: 2,
              py: 0,
              fontSize: 12,
              minHeight: 28,
              "& .MuiAlert-message": {
                fontSize: 12,
              },
              "& .MuiAlert-icon": {
                fontSize: 16,
              },
            }}
          >
            {errorMessage}
          </Alert>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {modelsLoading ? (
            <CircularProgress size={18} />
          ) : modelsError ? (
            <Typography color="error" sx={{ fontSize: 12 }}>
              {modelsError}
            </Typography>
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
                minWidth: 110,
                height: 28,
                fontSize: 13,
                "& .MuiSelect-select": {
                  py: 0.25,
                  px: 1,
                },
              }}
              IconComponent={KeyboardArrowDownIcon}
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

      {/* Chart */}
      <Box sx={{ p: 2, pb: 0 }}>
        <ForecastChart data={forecastData} selectedAlert={selectedAlert} />
      </Box>

      {/* Header */}
      <Box sx={styles.header}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <InfoIcon sx={{ width: 13, height: 13 }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "text.secondary", fontSize: 14 }}
          >
            Alerts &amp; Errors ({alertsData.length})
          </Typography>
        </Box>
        <KeyboardArrowDownIcon sx={{ width: 16, height: 16 }} />
      </Box>

      {/* Alert List */}
      <Box sx={styles.alertList}>
        {alertsData.length === 0 ? (
          <Box sx={styles.noAlerts}>
            <Typography variant="caption" color="text.secondary">
              No alerts found
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0} sx={{ width: "100%" }}>
            {alertsData.map((row) => (
              <Box
                key={row.id}
                sx={{
                  ...styles.row,
                  bgcolor:
                    selectedAlertId === row.id
                      ? "rgba(25,118,210,0.08)"
                      : "transparent",
                  "&:hover": {
                    bgcolor:
                      selectedAlertId === row.id
                        ? "rgba(25,118,210,0.12)"
                        : "grey.200",
                  },
                }}
                onClick={() => onAlertSelect(row)}
              >
                <Checkbox
                  checked={checkedItems[row.id] || false}
                  size="small"
                  sx={{ p: 0, width: 16, height: 16, ml: 0.5, mr: 1 }}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setCheckedItems((prev) => ({
                      ...prev,
                      [row.id]: checked,
                    }));
                  }}
                  onClick={(e) => e.stopPropagation()}
                />

                <Typography
                  variant="caption"
                  sx={{
                    ...styles.dateCol,
                    textDecoration: checkedItems[row.id]
                      ? "line-through"
                      : "none",
                  }}
                >
                  {row.date}
                </Typography>
                {row.type === "error" ? (
                  <ErrorIcon
                    sx={{
                      width: 13,
                      height: 13,
                      color: "error.main",
                      mx: 0.5,
                      filter: checkedItems[row.id]
                        ? "grayscale(100%)"
                        : "none",
                    }}
                  />
                ) : (
                  <WarningIcon
                    sx={{
                      width: 13,
                      height: 13,
                      color: "warning.main",
                      mx: 0.5,
                      filter: checkedItems[row.id]
                        ? "grayscale(100%)"
                        : "none",
                    }}
                  />
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    textDecoration: checkedItems[row.id]
                      ? "line-through"
                      : "none",
                  }}
                >
                  {row.message}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
        <Divider orientation="vertical" sx={{ width: 2, height: "100%" }} />
      </Box>
    </Paper>
  );
};

const styles = {
  centerPaper: {
    width: "100%",
    border: 1,
    borderColor: "grey.300",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    p: 2,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: 1.5,
    py: 0.5,
    borderBottom: 1,
    borderColor: "grey.300",
    minHeight: 36,
  },
  alertList: {
    bgcolor: "grey.100",
    display: "flex",
    gap: 1,
    borderLeft: 1,
    borderRight: 1,
    borderBottom: 1,
    borderColor: "grey.300",
    boxShadow: "inset 2px 1px 4px rgba(0,0,0,0.2)",
    flexDirection: "horizontal",
    width: "100%",
    height: "160px",
    p: "6px",
  },
  noAlerts: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "112px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    p: 0.5,
    borderRadius: 1,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    minHeight: "36px",
  },
  dateCol: {
    fontWeight: 600,
    color: "text.secondary",
    minWidth: 110,
    mr: 0.5,
  },
};
