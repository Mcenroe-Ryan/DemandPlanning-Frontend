// import React, { useState, useMemo, useCallback, useEffect } from 'react';
// import OptionalParamsMenu from './OptionalParamsMenu';
// import ForecastChart from './ForecastChart';

// /**
//  * ForecastTable component renders the demand forecast table with 6 months past & 6 months future.
//  * It also shows a "+" button that lets the user toggle optional rows via OptionalParamsMenu.
//  *
//  * NOTE: All data cells contain placeholders ("-") – integrate real data via props / API later.
//  */

// // Core rows that always show in the table
// const CORE_ROWS = [
//   'Actual',
//   'Baseline Forecast',
//   'ML Forecast',
//   'Consensus',
//   'Revenue Forecast (₹ in lakhs)',
// ];

// // These correspond 1-to-1 with the options in OptionalParamsMenu
// const FORECAST_ROWS = [
//   'Baseline Forecast',
//   'ML Forecast',
//   'Consensus',
//   'Revenue Forecast (₹ in lakhs)',
// ];

// const OPTIONAL_ROWS = [
//   'Sales',
//   'Promotion/Marketing',
//   'Inventory Level %',
//   'Stock out days',
//   'On Hand',
// ];

// /**
//  * Helper: build an array of month labels (e.g., "Dec 24") spanning 12 months centred on today.
//  * @returns {string[]}  // length = 12
//  */
// function buildRollingMonths() {
//   const months = [];
//   const today = new Date();
//   // Start 6 months before current month
//   const start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
//   for (let i = 0; i < 12; i += 1) {
//     const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
//     const label = d.toLocaleString('default', {
//       month: 'short',
//       year: '2-digit',
//     });
//     months.push(label);
//   }
//   return months;
// }

// export default function ForecastTable() {
//   const [showMenu, setShowMenu] = useState(false);
//   const [optionalRows, setOptionalRows] = useState([]); // array of selected optional rows
//   const [period, setPeriod] = useState('monthly'); // 'weekly' | 'monthly' | 'quarterly' | 'yearly'
//   const [showForecast, setShowForecast] = useState(true);

//   // Build months array once
//   const months = useMemo(() => buildRollingMonths(), []);

//   // Determine which month labels are in the future relative to today
//   const futureMonthSet = useMemo(() => {
//     const today = new Date();
//     const currentMonthKey = today.getFullYear() * 12 + today.getMonth();
//     const set = new Set();
//     months.forEach((label) => {
//       const [mon, yr] = label.split(' ');
//       const monthIdx = new Date(Date.parse(mon + ' 1, 20' + yr)).getMonth();
//       const yearNum = 2000 + parseInt(yr, 10);
//       const key = yearNum * 12 + monthIdx;
//       if (key > currentMonthKey) set.add(label);
//     });
//     return set;
//   }, [months]);

//   const toggleMenu = () => setShowMenu((prev) => !prev);

//   // Close menu callback passed to child
//   const closeMenu = useCallback(() => setShowMenu(false), []);

//   // Combine rows based on Forecast toggle
//   const baseRows = [...CORE_ROWS, ...optionalRows];
//   const allRows = showForecast ? baseRows : baseRows.filter((r) => !FORECAST_ROWS.includes(r));

//   // Dataset state populated from public/data.json
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Build mapping between our row labels and JSON keys
//   const keyMap = {
//     'Actual': 'actual_units',
//     'Baseline Forecast': 'baseline_forecast',
//     'ML Forecast': 'ml_forecast',
//     'Consensus': 'consensus_forecast',
//     'Revenue Forecast (₹ in lakhs)': 'revenue_forecast_lakhs',
//     'Sales': 'sales_units',
//     'Promotion/Marketing': 'promotion_marketing',
//     'Inventory Level %': 'inventory_level_pct',
//     'Stock out days': 'stock_out_days',
//     'On Hand': 'on_hand_units',
//   };

//   // Fetch JSON once on mount
//   useEffect(() => {
//   setIsLoading(true);
//   fetch('http://localhost:5000/api/forecast-test')
//     .then((res) => res.json())
//     .then((raw) => {
//       const ds = {};
//       months.forEach((m) => {
//         ds[m] = {};
//         [...CORE_ROWS, ...OPTIONAL_ROWS].forEach((row) => {
//           ds[m][row] = '-';
//         });
//       });
//       raw.forEach((item) => {
//         const dateStr = item.month_name || item.item_date || item.forecast_month;
//         if (!dateStr) return;
//         const date = new Date(dateStr);
//         if (Number.isNaN(date)) return;
//         const label = date.toLocaleString('default', { month: 'short', year: '2-digit' });
//         if (!ds[label]) return;
//         Object.entries(keyMap).forEach(([rowLabel, jsonKey]) => {
//           const val = item[jsonKey];
//           if (val !== undefined && val !== null && val !== 'NULL') {
//             ds[label][rowLabel] = val === '' ? '-' : val;
//           }
//         });
//       });
//       setData(ds);
//     })
//     .catch((error) => {
//       console.error('Error loading data:', error);
//       setData({});
//     })
//     .finally(() => {
//       setIsLoading(false);
//     });
// }, [months]);

//   return (
//     <>
//       <div className="table-responsive p-3 bg-white border rounded shadow-sm">
//       {/* Action Buttons */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         {/* Left controls */}
//         <div className="d-flex align-items-center gap-2">
//           {/* Period buttons */}
//           <div className="btn-group" role="group" aria-label="View period">
//             {['weekly','monthly','quarterly','yearly'].map((p) => (
//               <button
//                 key={p}
//                 type="button"
//                 className={`btn btn-sm ${period===p ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
//                 onClick={() => setPeriod(p)}
//               >
//                 {p.charAt(0).toUpperCase()}
//               </button>
//             ))}
//           </div>
//           {/* Forecast checkbox */}
//           <div className="form-check ms-2">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               id="chkForecast"
//               checked={showForecast}
//               onChange={(e)=>setShowForecast(e.target.checked)}
//             />
//             <label className="form-check-label" htmlFor="chkForecast">Forecast</label>
//           </div>
//         </div>

//         {/* Right action buttons */}
//         <div className="d-flex justify-content-end gap-2">
//         {/* Left side buttons */}
//         <div className="d-flex gap-2">
//           <button
//             type="button"
//             className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
//             title="Sort"
//             aria-label="Sort data"
//           >
//             <i className="bi bi-arrow-down-up" style={{ fontSize: '0.75rem' }} />
//           </button>
//           <button
//             type="button"
//             className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
//             title="Filter"
//             aria-label="Filter data"
//           >
//             <i className="bi bi-funnel" style={{ fontSize: '0.75rem' }} />
//           </button>
//         </div>

//         {/* + Button */}
//         <button
//           type="button"
//           aria-label="Add optional parameters"
//           aria-expanded={showMenu}
//           onClick={toggleMenu}
//           onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
//           className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
//         >
//           <i className="bi bi-plus-lg" style={{ fontSize: '0.75rem' }} />
//         </button>

//         {/* Right side buttons */}
//         <div className="d-flex gap-2">
//           <button
//             type="button"
//             className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
//             title="Share"
//             aria-label="Share data"
//           >
//             <i className="bi bi-share" style={{ fontSize: '0.75rem' }} />
//           </button>
//           <button
//             type="button"
//             className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
//             title="Download"
//             aria-label="Download data"
//           >
//             <i className="bi bi-download" style={{ fontSize: '0.75rem' }} />
//           </button>
//           <button
//             type="button"
//             className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
//             title="Fullscreen"
//             aria-label="Toggle fullscreen"
//           >
//             <i className="bi bi-arrows-fullscreen" style={{ fontSize: '0.75rem' }} />
//           </button>
//         </div>
//       </div>
//       </div>
//       {/* Dropdown */}
//       <OptionalParamsMenu
//         open={showMenu}
//         onClose={closeMenu}
//         selected={optionalRows}
//         onChange={setOptionalRows}
//       />

//       {/* Scrollable table */}
//       <div className="mt-4">
//         <table className="table table-bordered table-sm text-center align-middle">
//           <thead>
//             <tr>
//               {/* Sticky left column header for row labels */}
//               <th className="sticky left-0 z-10 bg-white py-2 text-left text-xs font-semibold text-gray-600">
//                 {/* empty top-left cell */}
//               </th>
//               {months.map((m) => (
//                 <th
//                   key={m}
//                   className={`fw-semibold text-uppercase small ${futureMonthSet.has(m) ? 'bg-light' : ''}`}
//                 >
//                   {m}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {allRows.map((label, idx) => (
//               <tr key={label} className={idx % 2 ? 'table-light' : ''}>
//                 {/* Row label */}
//                 <td className="sticky left-0 z-10 bg-white px-2 py-1 text-left font-medium">
//                   {label}
//                 </td>
//                 {months.map((m) => {
//                   const value = data?.[m]?.[label];
//                   return (
//                     <td key={m} className={futureMonthSet.has(m) ? 'bg-light-subtle' : ''}>
//                       {value === undefined || value === null ? '-' : value}
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//     {data && <ForecastChart months={months} data={data} />}
//     </>
//   );
// }
// import React, { useState, useMemo, useCallback, useEffect } from "react";
// import {
//   Box,
//   Chip,
//   IconButton,
//   Stack,
//   Typography,
//   Checkbox,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
// import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import DownloadIcon from "@mui/icons-material/Download";
// import OpenInFullIcon from "@mui/icons-material/OpenInFull";
// import ShareIcon from "@mui/icons-material/Share";
// import SwapVertIcon from "@mui/icons-material/SwapVert";
// import OptionalParamsMenu from "./OptionalParamsMenu";
// import ForecastChart from "./ForecastChart";

// const CORE_ROWS = [
//   "Actual",
//   "Baseline Forecast",
//   "ML Forecast",
//   "Consensus",
//   "Revenue Forecast (₹ in lakhs)",
// ];
// const FORECAST_ROWS = [
//   "Baseline Forecast",
//   "ML Forecast",
//   "Consensus",
//   "Revenue Forecast (₹ in lakhs)",
// ];
// const OPTIONAL_ROWS = [
//   "Sales",
//   "Promotion/Marketing",
//   "Inventory Level %",
//   "Stock out days",
//   "On Hand",
// ];

// function buildRollingMonths() {
//   const months = [];
//   const today = new Date();
//   const start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
//   for (let i = 0; i < 12; i += 1) {
//     const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
//     const label = d.toLocaleString("default", {
//       month: "short",
//       year: "2-digit",
//     });
//     months.push(label);
//   }
//   return months;
// }

// export default function ForecastTable() {
//   // State for period chips
//   const [period, setPeriod] = useState("M");
//   const periodOptions = ["Y", "Q", "M", "W"];

//   // State for forecast toggle
//   const [showForecast, setShowForecast] = useState(true);

//   // State for add rows menu
//   const [showMenu, setShowMenu] = useState(false);

//   // State for optional rows
//   const [optionalRows, setOptionalRows] = useState([]);

//   // Table data state
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Months array
//   const months = useMemo(() => buildRollingMonths(), []);

//   // Highlight future months
//   const futureMonthSet = useMemo(() => {
//     const today = new Date();
//     const currentMonthKey = today.getFullYear() * 12 + today.getMonth();
//     const set = new Set();
//     months.forEach((label) => {
//       const [mon, yr] = label.split(" ");
//       const monthIdx = new Date(Date.parse(mon + " 1, 20" + yr)).getMonth();
//       const yearNum = 2000 + parseInt(yr, 10);
//       const key = yearNum * 12 + monthIdx;
//       if (key > currentMonthKey) set.add(label);
//     });
//     return set;
//   }, [months]);

//   // Key mapping
//   const keyMap = {
//     Actual: "actual_units",
//     "Baseline Forecast": "baseline_forecast",
//     "ML Forecast": "ml_forecast",
//     Consensus: "consensus_forecast",
//     "Revenue Forecast (₹ in lakhs)": "revenue_forecast_lakhs",
//     Sales: "sales_units",
//     "Promotion/Marketing": "promotion_marketing",
//     "Inventory Level %": "inventory_level_pct",
//     "Stock out days": "stock_out_days",
//     "On Hand": "on_hand_units",
//   };

//   // Fetch API data
//   useEffect(() => {
//     setIsLoading(true);
//     fetch("http://localhost:5000/api/forecast-test")
//       .then((res) => res.json())
//       .then((raw) => {
//         const ds = {};
//         months.forEach((m) => {
//           ds[m] = {};
//           [...CORE_ROWS, ...OPTIONAL_ROWS].forEach((row) => {
//             ds[m][row] = "-";
//           });
//         });
//         raw.forEach((item) => {
//           const dateStr = item.month_name || item.item_date || item.forecast_month;
//           if (!dateStr) return;
//           const date = new Date(dateStr);
//           if (Number.isNaN(date)) return;
//           const label = date.toLocaleString("default", { month: "short", year: "2-digit" });
//           if (!ds[label]) return;
//           Object.entries(keyMap).forEach(([rowLabel, jsonKey]) => {
//             const val = item[jsonKey];
//             if (val !== undefined && val !== null && val !== "NULL") {
//               ds[label][rowLabel] = val === "" ? "-" : val;
//             }
//           });
//         });
//         setData(ds);
//       })
//       .catch((error) => {
//         console.error("Error loading data:", error);
//         setData({});
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }, [months]);

//   // Combine rows based on toggles
//   const baseRows = [...CORE_ROWS, ...optionalRows];
//   const allRows = showForecast ? baseRows : baseRows.filter((r) => !FORECAST_ROWS.includes(r));

//   // Add rows menu handler
//   const handleAddRowsClick = () => setShowMenu(true);
//   const handleMenuClose = () => setShowMenu(false);

//   return (
//     <>
//       {/* Header Bar */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         px={2.5}
//         py={0.5}
//         bgcolor="background.paper"
//         borderRight={1}
//         borderBottom={1}
//         borderLeft={1}
//         borderColor="action.disabled"
//       >
//         <Stack direction="row" spacing={5} alignItems="center">
//           {/* Period selector */}
//           <Stack direction="row" spacing={2.5}>
//             {periodOptions.map((label) => (
//               <Chip
//                 key={label}
//                 label={label}
//                 variant={period === label ? "filled" : "outlined"}
//                 color={period === label ? "primary" : "default"}
//                 onClick={() => setPeriod(label)}
//                 sx={{
//                   width: 38,
//                   height: 24,
//                   borderRadius: "50px",
//                   borderColor: "primary.main",
//                   "& .MuiChip-label": {
//                     px: 0,
//                     fontWeight: 600,
//                     fontSize: 12,
//                     color: period === label
//                       ? "background.paper"
//                       : "text.secondary",
//                   },
//                 }}
//               />
//             ))}
//           </Stack>
//           {/* Forecast toggle */}
//           <Box display="flex" alignItems="center">
//             <Checkbox
//               icon={<CheckBoxIcon sx={{ width: 16, height: 16, color: "text.secondary" }} />}
//               checkedIcon={<CheckBoxIcon sx={{ width: 16, height: 16, color: "primary.main" }} />}
//               checked={showForecast}
//               onChange={(e) => setShowForecast(e.target.checked)}
//               sx={{ p: 0.5 }}
//             />
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ fontWeight: 400, fontSize: 14, ml: 0.5 }}
//             >
//               Forecast
//             </Typography>
//           </Box>
//         </Stack>
//         {/* Right-side action buttons */}
//         <Stack direction="row" spacing={1.5} alignItems="center">
//           <IconButton size="small" onClick={handleAddRowsClick}>
//             <AddBoxOutlinedIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//           <IconButton size="small">
//             <SwapVertIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//           <IconButton size="small">
//             <ShareIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//           <IconButton size="small">
//             <DownloadIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//           <IconButton size="small">
//             <OpenInFullIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//         </Stack>
//       </Box>

//       {/* Add Rows Menu */}
//       <OptionalParamsMenu
//         open={showMenu}
//         onClose={handleMenuClose}
//         selected={optionalRows}
//         onChange={setOptionalRows}
//       />

//       {/* Table */}
//       <Box className="table-responsive p-3 bg-white border rounded shadow-sm">
//         <div className="mt-4">
//           <table className="table table-bordered table-sm text-center align-middle">
//             <thead>
//               <tr>
//                 <th></th>
//                 {months.map((m) => (
//                   <th
//                     key={m}
//                     className={`fw-semibold text-uppercase small ${
//                       futureMonthSet.has(m) ? "bg-light" : ""
//                     }`}
//                   >
//                     {m}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {allRows.map((label, idx) => (
//                 <tr key={label} className={idx % 2 ? "table-light" : ""}>
//                   <td className="sticky left-0 z-10 bg-white px-2 py-1 text-left font-medium">
//                     {label}
//                   </td>
//                   {months.map((m) => {
//                     const value = data?.[m]?.[label];
//                     return (
//                       <td
//                         key={m}
//                         className={futureMonthSet.has(m) ? "bg-light-subtle" : ""}
//                       >
//                         {value === undefined || value === null ? "-" : value}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Box>
//       {data && <ForecastChart months={months} data={data} />}
//     </>
//   );
// }


// import React, { useState, useMemo, useEffect } from "react";
// import {
//   Box,
//   IconButton,
//   Stack,
//   Typography,
//   Checkbox,
//   Button,
//   Menu,
// } from "@mui/material";
// import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
// import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import DownloadIcon from "@mui/icons-material/Download";
// import OpenInFullIcon from "@mui/icons-material/OpenInFull";
// import ShareIcon from "@mui/icons-material/Share";
// import SwapVertIcon from "@mui/icons-material/SwapVert";
// import CheckIcon from "@mui/icons-material/Check";
// import OptionalParamsMenu from "./OptionalParamsMenu";
// import ForecastChart from "./ForecastChart";

// const CORE_ROWS = [
//   "Actual",
//   "Baseline Forecast",
//   "ML Forecast",
//   "Consensus",
//   "Revenue Forecast (₹ in lakhs)",
// ];
// const FORECAST_ROWS = [
//   "Baseline Forecast",
//   "ML Forecast",
//   "Consensus",
//   "Revenue Forecast (₹ in lakhs)",
// ];
// const OPTIONAL_ROWS = [
//   "Sales",
//   "Promotion/Marketing",
//   "Inventory Level %",
//   "Stock out days",
//   "On Hand",
// ];

// function buildRollingMonths() {
//   const months = [];
//   const today = new Date();
//   const start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
//   for (let i = 0; i < 12; i += 1) {
//     const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
//     const label = d.toLocaleString("default", {
//       month: "short",
//       year: "2-digit",
//     });
//     months.push(label);
//   }
//   return months;
// }

// export default function ForecastTable() {
//   const [period, setPeriod] = useState("M");
//   const periodOptions = ["Y", "Q", "M", "W"];
//   const [showForecast, setShowForecast] = useState(true);
//   const [optionalRows, setOptionalRows] = useState([]);
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // For Add New menu anchor
//   const [anchorEl, setAnchorEl] = useState(null);

//   const months = useMemo(() => buildRollingMonths(), []);
//   const futureMonthSet = useMemo(() => {
//     const today = new Date();
//     const currentMonthKey = today.getFullYear() * 12 + today.getMonth();
//     const set = new Set();
//     months.forEach((label) => {
//       const [mon, yr] = label.split(" ");
//       const monthIdx = new Date(Date.parse(mon + " 1, 20" + yr)).getMonth();
//       const yearNum = 2000 + parseInt(yr, 10);
//       const key = yearNum * 12 + monthIdx;
//       if (key > currentMonthKey) set.add(label);
//     });
//     return set;
//   }, [months]);

//   const keyMap = {
//     Actual: "actual_units",
//     "Baseline Forecast": "baseline_forecast",
//     "ML Forecast": "ml_forecast",
//     Consensus: "consensus_forecast",
//     "Revenue Forecast (₹ in lakhs)": "revenue_forecast_lakhs",
//     Sales: "sales_units",
//     "Promotion/Marketing": "promotion_marketing",
//     "Inventory Level %": "inventory_level_pct",
//     "Stock out days": "stock_out_days",
//     "On Hand": "on_hand_units",
//   };

//   useEffect(() => {
//     setIsLoading(true);
//     fetch("http://localhost:5000/api/forecast-test")
//       .then((res) => res.json())
//       .then((raw) => {
//         const ds = {};
//         months.forEach((m) => {
//           ds[m] = {};
//           [...CORE_ROWS, ...OPTIONAL_ROWS].forEach((row) => {
//             ds[m][row] = "-";
//           });
//         });
//         raw.forEach((item) => {
//           const dateStr = item.month_name || item.item_date || item.forecast_month;
//           if (!dateStr) return;
//           const date = new Date(dateStr);
//           if (Number.isNaN(date)) return;
//           const label = date.toLocaleString("default", { month: "short", year: "2-digit" });
//           if (!ds[label]) return;
//           Object.entries(keyMap).forEach(([rowLabel, jsonKey]) => {
//             const val = item[jsonKey];
//             if (val !== undefined && val !== null && val !== "NULL") {
//               ds[label][rowLabel] = val === "" ? "-" : val;
//             }
//           });
//         });
//         setData(ds);
//       })
//       .catch((error) => {
//         console.error("Error loading data:", error);
//         setData({});
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }, [months]);

//   const baseRows = [...CORE_ROWS, ...optionalRows];
//   const allRows = showForecast ? baseRows : baseRows.filter((r) => !FORECAST_ROWS.includes(r));

//   // Add New menu handlers
//   const handleAddRowsClick = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);

//   return (
//     <>
//       {/* Header Bar */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         px={2.5}
//         py={0.5}
//         bgcolor="background.paper"
//         borderRight={1}
//         borderBottom={1}
//         borderLeft={1}
//         borderColor="action.disabled"
//       >
//         <Stack direction="row" spacing={5} alignItems="center">
//           {/* Period selector */}
//           <Stack direction="row" spacing={1}>
//             {periodOptions.map((label) => (
//               <Button
//                 key={label}
//                 variant={period === label ? "contained" : "outlined"}
//                 color={period === label ? "primary" : "inherit"}
//                 onClick={() => setPeriod(label)}
//                 sx={{
//                   minWidth: 36,
//                   height: 28,
//                   borderRadius: 1.5,
//                   px: 1.5,
//                   fontWeight: 600,
//                   fontSize: 13,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.5,
//                   boxShadow: "none",
//                   textTransform: "none",
//                 }}
//               >
//                 {label}
//                 {period === label && (
//                   <CheckIcon sx={{ fontSize: 16, ml: 0.5 }} />
//                 )}
//               </Button>
//             ))}
//             <Checkbox
//               icon={<CheckBoxIcon sx={{ width: 16, height: 16, color: "text.secondary" }} />}
//               checkedIcon={<CheckBoxIcon sx={{ width: 16, height: 16, color: "primary.main" }} />}
//               checked={showForecast}
//               onChange={(e) => setShowForecast(e.target.checked)}
//               sx={{ p: 0.5, ml: 2 }}
//             />
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ fontWeight: 400, fontSize: 14, ml: 0.5 }}
//             >
//               Forecast
//             </Typography>
//           </Stack>
//         </Stack>
//         {/* Right-side action buttons */}
//         <Stack direction="row" spacing={1.5} alignItems="center">
//           {/* Add New button with right-anchored menu */}
//           <IconButton size="small" onClick={handleAddRowsClick}>
//             <AddBoxOutlinedIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//             anchorOrigin={{
//               vertical: "top",
//               horizontal: "right",
//             }}
//             transformOrigin={{
//               vertical: "top",
//               horizontal: "left",
//             }}
//             // Optional: style the menu or add menu items here
//             PaperProps={{
//               style: { minWidth: 200 },
//             }}
//           >
//             <OptionalParamsMenu
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//               selected={optionalRows}
//               onChange={setOptionalRows}
//             />
//           </Menu>
//           <IconButton size="small">
//             <SwapVertIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//           <IconButton size="small">
//             <ShareIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//           <IconButton size="small">
//             <DownloadIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//           <IconButton size="small">
//             <OpenInFullIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//         </Stack>
//       </Box>

//       {/* Table */}
//       <Box className="table-responsive p-3 bg-white border rounded shadow-sm">
//         <div className="mt-4">
//           <table className="table table-bordered table-sm text-center align-middle">
//             <thead>
//               <tr>
//                 <th></th>
//                 {months.map((m) => (
//                   <th
//                     key={m}
//                     className={`fw-semibold text-uppercase small ${
//                       futureMonthSet.has(m) ? "bg-light" : ""
//                     }`}
//                   >
//                     {m}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {allRows.map((label, idx) => (
//                 <tr key={label} className={idx % 2 ? "table-light" : ""}>
//                   <td className="sticky left-0 z-10 bg-white px-2 py-1 text-left font-medium">
//                     {label}
//                   </td>
//                   {months.map((m) => {
//                     const value = data?.[m]?.[label];
//                     return (
//                       <td
//                         key={m}
//                         className={futureMonthSet.has(m) ? "bg-light-subtle" : ""}
//                       >
//                         {value === undefined || value === null ? "-" : value}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Box>
//       {data && <ForecastChart months={months} data={data} />}
//     </>
//   );
// }
// import React, { useState, useMemo, useEffect } from "react";
// import {
//   Box,
//   IconButton,
//   Stack,
//   Typography,
//   Checkbox,
//   Button,
//   Menu,
// } from "@mui/material";
// import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
// import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import DownloadIcon from "@mui/icons-material/Download";
// import OpenInFullIcon from "@mui/icons-material/OpenInFull";
// import ShareIcon from "@mui/icons-material/Share";
// import SwapVertIcon from "@mui/icons-material/SwapVert";
// import CheckIcon from "@mui/icons-material/Check";
// import OptionalParamsMenu from "./OptionalParamsMenu";
// import ForecastChart from "./ForecastChart";

// const CORE_ROWS = [
//   "Actual",
//   "Baseline Forecast",
//   "ML Forecast",
//   "Consensus",
//   "Revenue Forecast (₹ in lakhs)",
// ];
// const FORECAST_ROWS = [
//   "Baseline Forecast",
//   "ML Forecast",
//   "Consensus",
//   "Revenue Forecast (₹ in lakhs)",
// ];
// const OPTIONAL_ROWS = [
//   "Sales",
//   "Promotion/Marketing",
//   "Inventory Level %",
//   "Stock out days",
//   "On Hand",
// ];

// function buildRollingMonths() {
//   const months = [];
//   const today = new Date();
//   const start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
//   for (let i = 0; i < 12; i += 1) {
//     const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
//     const label = d.toLocaleString("default", {
//       month: "short",
//       year: "2-digit",
//     });
//     months.push(label);
//   }
//   return months;
// }

// export default function ForecastTable() {
//   const [period, setPeriod] = useState("M");
//   const periodOptions = ["Y", "Q", "M", "W"];
//   const [showForecast, setShowForecast] = useState(true);
//   const [optionalRows, setOptionalRows] = useState([]);
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // For Add New menu anchor
//   const [anchorEl, setAnchorEl] = useState(null);

//   const months = useMemo(() => buildRollingMonths(), []);
//   const futureMonthSet = useMemo(() => {
//     const today = new Date();
//     const currentMonthKey = today.getFullYear() * 12 + today.getMonth();
//     const set = new Set();
//     months.forEach((label) => {
//       const [mon, yr] = label.split(" ");
//       const monthIdx = new Date(Date.parse(mon + " 1, 20" + yr)).getMonth();
//       const yearNum = 2000 + parseInt(yr, 10);
//       const key = yearNum * 12 + monthIdx;
//       if (key > currentMonthKey) set.add(label);
//     });
//     return set;
//   }, [months]);

//   const keyMap = {
//     Actual: "actual_units",
//     "Baseline Forecast": "baseline_forecast",
//     "ML Forecast": "ml_forecast",
//     Consensus: "consensus_forecast",
//     "Revenue Forecast (₹ in lakhs)": "revenue_forecast_lakhs",
//     Sales: "sales_units",
//     "Promotion/Marketing": "promotion_marketing",
//     "Inventory Level %": "inventory_level_pct",
//     "Stock out days": "stock_out_days",
//     "On Hand": "on_hand_units",
//   };

//   useEffect(() => {
//     setIsLoading(true);
//     fetch("http://localhost:5000/api/forecast-test")
//       .then((res) => res.json())
//       .then((raw) => {
//         const ds = {};
//         months.forEach((m) => {
//           ds[m] = {};
//           [...CORE_ROWS, ...OPTIONAL_ROWS].forEach((row) => {
//             ds[m][row] = "-";
//           });
//         });
//         raw.forEach((item) => {
//           const dateStr = item.month_name || item.item_date || item.forecast_month;
//           if (!dateStr) return;
//           const date = new Date(dateStr);
//           if (Number.isNaN(date)) return;
//           const label = date.toLocaleString("default", { month: "short", year: "2-digit" });
//           if (!ds[label]) return;
//           Object.entries(keyMap).forEach(([rowLabel, jsonKey]) => {
//             const val = item[jsonKey];
//             if (val !== undefined && val !== null && val !== "NULL") {
//               ds[label][rowLabel] = val === "" ? "-" : val;
//             }
//           });
//         });
//         setData(ds);
//       })
//       .catch((error) => {
//         console.error("Error loading data:", error);
//         setData({});
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }, [months]);

//   const baseRows = [...CORE_ROWS, ...optionalRows];
//   const allRows = showForecast ? baseRows : baseRows.filter((r) => !FORECAST_ROWS.includes(r));

//   // Add New menu handlers
//   const handleAddRowsClick = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);

//   return (
//     <>
//       {/* Header Bar */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         px={2.5}
//         py={0.5}
//         bgcolor="background.paper"
//         borderRight={1}
//         borderBottom={1}
//         borderLeft={1}
//         borderColor="action.disabled"
//       >
//         <Stack direction="row" spacing={5} alignItems="center">
//           {/* Period selector */}
//           <Stack direction="row" spacing={1}>
//             {periodOptions.map((label) => (
//               <Button
//                 key={label}
//                 variant={period === label ? "contained" : "outlined"}
//                 color={period === label ? "primary" : "inherit"}
//                 onClick={() => setPeriod(label)}
//                 sx={{
//                   minWidth: 36,
//                   height: 28,
//                   borderRadius: 1.5,
//                   px: 1.5,
//                   fontWeight: 600,
//                   fontSize: 13,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.5,
//                   boxShadow: "none",
//                   textTransform: "none",
//                 }}
//               >
//                 {label}
//                 {period === label && (
//                   <CheckIcon sx={{ fontSize: 16, ml: 0.5 }} />
//                 )}
//               </Button>
//             ))}
//             <Checkbox
//               icon={<CheckBoxIcon sx={{ width: 16, height: 16, color: "text.secondary" }} />}
//               checkedIcon={<CheckBoxIcon sx={{ width: 16, height: 16, color: "primary.main" }} />}
//               checked={showForecast}
//               onChange={(e) => setShowForecast(e.target.checked)}
//               sx={{ p: 0.5, ml: 2 }}
//             />
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ fontWeight: 400, fontSize: 14, ml: 0.5 }}
//             >
//               Forecast
//             </Typography>
//           </Stack>
//         </Stack>
//         {/* Right-side action buttons */}
//         <Stack direction="row" spacing={1.5} alignItems="center">
//           {/* Add New button with right-anchored menu */}
//           <IconButton size="small" onClick={handleAddRowsClick}>
//             <AddBoxOutlinedIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//             anchorOrigin={{
//               vertical: "top",
//               horizontal: "right",
//             }}
//             transformOrigin={{
//               vertical: "top",
//               horizontal: "left",
//             }}
//             PaperProps={{
//               style: { minWidth: 200 },
//             }}
//           >
//             <OptionalParamsMenu
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//               selected={optionalRows}
//               onChange={setOptionalRows}
//             />
//           </Menu>
//           <IconButton size="small">
//             <SwapVertIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//           <IconButton size="small">
//             <ShareIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//           <IconButton size="small">
//             <DownloadIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//           <IconButton size="small">
//             <OpenInFullIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
//           </IconButton>
//         </Stack>
//       </Box>

//       {/* Table */}
//       <Box
//         sx={{
//           p: 3,
//           bgcolor: "common.white",
//           borderRadius: 2,
//           boxShadow: 1,
//           border: "1px solid",
//           borderColor: "grey.200",
//           overflowX: "auto",
//         }}
//       >
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "separate",
//             borderSpacing: 0,
//             minWidth: 900,
//             fontFamily: "inherit",
//           }}
//         >
//           <thead>
//             <tr>
//               <th
//                 style={{
//                   position: "sticky",
//                   left: 0,
//                   background: "#f7fafd",
//                   zIndex: 2,
//                   fontWeight: 700,
//                   fontSize: 13,
//                   textTransform: "uppercase",
//                   padding: "8px 16px",
//                   borderRight: "1px solid #e0e7ef",
//                   borderBottom: "2px solid #e0e7ef",
//                   color: "#3c4257",
//                   minWidth: 140,
//                 }}
//               ></th>
//               {months.map((m) => (
//                 <th
//                   key={m}
//                   style={{
//                     background: "#f7fafd",
//                     fontWeight: 700,
//                     fontSize: 13,
//                     textTransform: "uppercase",
//                     padding: "8px 12px",
//                     borderBottom: "2px solid #e0e7ef",
//                     color: "#3c4257",
//                     minWidth: 90,
//                     ...(futureMonthSet.has(m) && { background: "#e9f0f7" }),
//                   }}
//                 >
//                   {m}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {allRows.map((label, idx) => (
//               <tr
//                 key={label}
//                 style={{
//                   background: idx % 2 === 1 ? "#f7fafd" : "#fff",
//                 }}
//               >
//                 <td
//                   style={{
//                     position: "sticky",
//                     left: 0,
//                     background: "#fff",
//                     zIndex: 1,
//                     fontWeight: 600,
//                     fontSize: 14,
//                     padding: "8px 16px",
//                     borderRight: "1px solid #e0e7ef",
//                     borderBottom: "1px solid #e0e7ef",
//                     color: "#222a36",
//                     minWidth: 140,
//                   }}
//                 >
//                   {label}
//                 </td>
//                 {months.map((m) => {
//                   const value = data?.[m]?.[label];
//                   return (
//                     <td
//                       key={m}
//                       style={{
//                         background: futureMonthSet.has(m) ? "#e9f0f7" : undefined,
//                         padding: "8px 12px",
//                         borderBottom: "1px solid #e0e7ef",
//                         fontSize: 14,
//                         color: "#222a36",
//                         minWidth: 90,
//                       }}
//                     >
//                       {value === undefined || value === null ? "-" : value}
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </Box>
//       {data && <ForecastChart months={months} data={data} />}
//     </>
//   );
// }
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

export default function ForecastTable({
  selectedCountry,
  selectedState,
  selectedCities,
  selectedPlants,
  selectedCategories,
  selectedSKUs,
  selectedChannels,
}) {
  const [period, setPeriod] = useState("M");
  const periodOptions = ["Y", "Q", "M", "W"];
  const [showForecast, setShowForecast] = useState(true);
  const [optionalRows, setOptionalRows] = useState([]);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // For Add New menu anchor
  const [anchorEl, setAnchorEl] = useState(null);

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

  useEffect(() => {
    // Log incoming props for debugging
    console.log("selectedCountry:", selectedCountry);
    console.log("selectedState:", selectedState);
    console.log("selectedCities:", selectedCities);
    console.log("selectedPlants:", selectedPlants);
    console.log("selectedCategories:", selectedCategories);
    console.log("selectedSKUs:", selectedSKUs);
    console.log("selectedChannels:", selectedChannels);
  }, [
    selectedCountry,
    selectedState,
    selectedCities,
    selectedPlants,
    selectedCategories,
    selectedSKUs,
    selectedChannels,
  ]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch("http://localhost:5000/api/forecast")
  //     .then((res) => res.json())
  //     .then((raw) => {
  //       const ds = {};
  //       months.forEach((m) => {
  //         ds[m] = {};
  //         [...CORE_ROWS, ...OPTIONAL_ROWS].forEach((row) => {
  //           ds[m][row] = "-";
  //         });
  //       });
  //       raw.forEach((item) => {
  //         const dateStr = item.month_name || item.item_date || item.forecast_month;
  //         if (!dateStr) return;
  //         const date = new Date(dateStr);
  //         if (Number.isNaN(date)) return;
  //         const label = date.toLocaleString("default", { month: "short", year: "2-digit" });
  //         if (!ds[label]) return;
  //         Object.entries(keyMap).forEach(([rowLabel, jsonKey]) => {
  //           const val = item[jsonKey];
  //           if (val !== undefined && val !== null && val !== "NULL") {
  //             ds[label][rowLabel] = val === "" ? "-" : val;
  //           }
  //         });
  //       });
  //       setData(ds);
  //     })
  //     .catch((error) => {
  //       console.error("Error loading data:", error);
  //       setData({});
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // }, [months]);
     useEffect(() => {
  setIsLoading(true);
  fetch("http://localhost:5000/api/forecast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
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
        console.log("Raw response from API:", raw);
      const ds = {};
      months.forEach((m) => {
        ds[m] = {};
        [...CORE_ROWS, ...OPTIONAL_ROWS].forEach((row) => {
          ds[m][row] = "-";
        });
      });
      raw.forEach((item) => {
        const dateStr = item.month_name || item.item_date || item.forecast_month;
        if (!dateStr) return;
        const date = new Date(dateStr);
        if (Number.isNaN(date)) return;
        const label = date.toLocaleString("default", { month: "short", year: "2-digit" });
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
}, [
  months,
  selectedCountry,
  selectedState,
  selectedCities,
  selectedPlants,
  selectedCategories,
  selectedSKUs,
  selectedChannels,
]);

  const baseRows = [...CORE_ROWS, ...optionalRows];
  const allRows = showForecast ? baseRows : baseRows.filter((r) => !FORECAST_ROWS.includes(r));

  // Add New menu handlers
  const handleAddRowsClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      {/* Header Bar */}
      <Box
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
              icon={<CheckBoxIcon sx={{ width: 16, height: 16, color: "text.secondary" }} />}
              checkedIcon={<CheckBoxIcon sx={{ width: 16, height: 16, color: "primary.main" }} />}
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
          {/* Add New button with right-anchored menu */}
          <IconButton size="small" onClick={handleAddRowsClick}>
            <AddBoxOutlinedIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
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
            <SwapVertIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
          </IconButton>
          <IconButton size="small">
            <ShareIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
          </IconButton>
          <IconButton size="small">
            <DownloadIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
          </IconButton>
          <IconButton size="small">
            <OpenInFullIcon sx={{ width: 20, height: 20, color: "text.secondary" }} />
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
                  return (
                    <td
                      key={m}
                      style={{
                        background: futureMonthSet.has(m) ? "#e9f0f7" : undefined,
                        padding: "8px 12px",
                        borderBottom: "1px solid #e0e7ef",
                        fontSize: 14,
                        color: "#222a36",
                        minWidth: 90,
                      }}
                    >
                      {value === undefined || value === null ? "-" : value}
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
