import React, { useState } from "react";
import {
  Box,
  Card,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Button,
  Slider,
  FormControl,
  Select,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Paper,
} from "@mui/material";
import {
  TrendingUp,
  MoreVert,
  Search,
  Add,
  HelpOutline,
  KeyboardArrowDown,
  Lock,
  LockOpen,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Sample data for the table
const forecastData = [
  {
    forecastType: "Actual",
    apr24: 7842,
    may24: 8819,
    jun24: "-",
    jul24: "-",
    aug24: "-",
    sep24: "-",
    oct24: "-",
    nov24: "-",
    dec24: "-",
    jan25: "-",
    feb25: "-",
    mar25: "-",
  },
  {
    forecastType: "Baseline Forecast",
    apr24: 7845,
    may24: 8200,
    jun24: 8878,
    jul24: 8900,
    aug24: 8542,
    sep24: 10174,
    oct24: 12240,
    nov24: 12284,
    dec24: 7844,
    jan25: 7750,
    feb25: 8245,
    mar25: 8508,
  },
  {
    forecastType: "ML Forecast",
    apr24: 7812,
    may24: 7700,
    jun24: 9080,
    jul24: 8305,
    aug24: 9118,
    sep24: 11504,
    oct24: 12180,
    nov24: 7480,
    dec24: 7854,
    jan25: 8105,
    feb25: 8545,
    mar25: 8362,
  },
  {
    forecastType: "Consensus",
    apr24: 7850,
    may24: 7850,
    jun24: 7840,
    jul24: 8480,
    aug24: 9550,
    sep24: 11850,
    oct24: 12205,
    nov24: 7150,
    dec24: 8105,
    jan25: 8245,
    feb25: 8845,
    mar25: 8962,
    locked: true,
  },
  {
    forecastType: "Revenue Forecast",
    apr24: 4300,
    may24: 3500,
    jun24: 3300,
    jul24: 518,
    aug24: 13834,
    sep24: 13834,
    oct24: 12284,
    nov24: 6889,
    dec24: 6941,
    jan25: 2748,
    feb25: 5892,
    mar25: 2038,
  },
];

// Updated Chart data to match screenshot patterns
const chartData = [
  { name: "Apr 2024", actual: 7.6, baseline: 8.6, ml: 7.7, consensus: 7.6 },
  { name: "May 2024", actual: null, baseline: 8.4, ml: 7.3, consensus: 7.8 },
  { name: "Jun 2024", actual: null, baseline: 7.7, ml: 8.9, consensus: 8.5 },
  { name: "Jul 2024", actual: null, baseline: 7.6, ml: 8.7, consensus: 8.3 },
  { name: "Aug 2024", actual: null, baseline: 7.8, ml: 8.4, consensus: 9.0 },
  { name: "Sep 2024", actual: null, baseline: 9.1, ml: 9.5, consensus: 9.2 },
  { name: "Oct 2024", actual: null, baseline: 12.2, ml: 11.6, consensus: 12.0 },
  { name: "Nov 2024", actual: null, baseline: 12.3, ml: 11.9, consensus: 12.1 },
  { name: "Dec 2024", actual: null, baseline: 7.8, ml: 7.5, consensus: 8.1 },
  { name: "Jan 2025", actual: null, baseline: 7.8, ml: 8.1, consensus: 8.2 },
];

// Scenario data
const scenarioData = [
  {
    id: 1,
    title: "Sudden Spike in Demand",
    description: "30% increase due to marketing campaign",
    category: "Demand",
    categoryColor: "info",
    impact: "+30%",
    duration: "3 Months",
    selected: true,
  },
  {
    id: 2,
    title: "Sudden Drop in Demand",
    description: "20% drop due to economic slowdown",
    category: "Demand",
    categoryColor: "info",
    impact: "-20%",
    duration: "6 Months",
    selected: false,
  },
  {
    id: 3,
    title: "New Market Expansion",
    description: "Launch in new region with 40% uplift",
    category: "Demand",
    categoryColor: "info",
    impact: "+40%",
    duration: "12 Months",
    selected: false,
  },
  {
    id: 4,
    title: "Supplier Disruption",
    description: "Unfulfilled demand due to raw material shortage",
    category: "Supply",
    categoryColor: "error",
    impact: "-15%",
    duration: "4 Months",
    selected: false,
  },
  {
    id: 5,
    title: "Price Change Impact",
    description: "10% price increase affects demand",
    category: "Price",
    categoryColor: "success",
    impact: "-12%",
    duration: "6 Months",
    selected: false,
  },
  {
    id: 6,
    title: "New Product Introduction",
    description: "25% cannibalization + 35% new demand",
    category: "Product",
    categoryColor: "primary",
    impact: "+10%",
    duration: "9 Months",
    selected: false,
  },
  {
    id: 7,
    title: "Promotions & Discount",
    description: "Flash sale increases demand by 50%",
    category: "Demand",
    categoryColor: "info",
    impact: "+50%",
    duration: "1 Months",
    selected: false,
  },
];

// Left Sidebar Component
const ScenarioSidebar = ({ selectedScenario, onScenarioSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sliderValue, setSliderValue] = useState(30);
  const [timeFrame, setTimeFrame] = useState("3 Months");

  const filteredScenarios = scenarioData.filter(scenario =>
    scenario.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: 280,
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "grey.200",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: "grey.50", borderBottom: 1, borderColor: "grey.200" }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <HelpOutline sx={{ width: 16, height: 16, color: "grey.600" }} />
          <Typography variant="subtitle2" color="grey.700" fontWeight={600} sx={{ fontSize: 12 }}>
            What-If Scenarios?
          </Typography>
        </Stack>
        <Typography variant="caption" color="grey.500" sx={{ fontSize: 10 }}>
          Select a scenario to analyze its impact on demand planning.
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "grey.200" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 0.75,
            bgcolor: "grey.50",
            borderRadius: 1,
            border: 1,
            borderColor: "grey.200",
          }}
        >
          <Search sx={{ width: 14, height: 14, color: "grey.500" }} />
          <TextField
            placeholder="Search scenarios"
            variant="standard"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: 1,
              "& .MuiInput-underline": {
                "&:before": { display: "none" },
                "&:after": { display: "none" },
              },
              "& input": { fontSize: 11, color: "grey.700", p: 0 },
            }}
          />
          <IconButton size="small" sx={{ p: 0.25 }}>
            <Add sx={{ width: 12, height: 12, color: "grey.500" }} />
          </IconButton>
        </Box>
      </Box>

      {/* Scenarios List */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ p: 0 }}>
          {filteredScenarios.map((scenario) => (
            <ListItem key={scenario.id} sx={{ p: 0 }}>
              <ListItemButton
                onClick={() => onScenarioSelect(scenario.id)}
                selected={selectedScenario === scenario.id}
                sx={{
                  p: 1.5,
                  borderBottom: 1,
                  borderColor: "grey.100",
                  "&.Mui-selected": {
                    bgcolor: "primary.50",
                    borderLeft: "3px solid",
                    borderLeftColor: "primary.main",
                  },
                }}
              >
                <Stack spacing={1} sx={{ width: "100%" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack spacing={0.5} sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <TrendingUp sx={{ width: 10, height: 10, color: "grey.600" }} />
                        <Typography
                          variant="body2"
                          color="text.primary"
                          fontWeight={selectedScenario === scenario.id ? 600 : 500}
                          sx={{ fontSize: 11 }}
                        >
                          {scenario.title}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="caption"
                        color="grey.600"
                        sx={{ fontSize: 9, lineHeight: 1.2, ml: 1.5 }}
                      >
                        {scenario.description}
                      </Typography>
                    </Stack>
                    <IconButton size="small" sx={{ p: 0.25 }}>
                      <MoreVert sx={{ width: 12, height: 12, color: "grey.500" }} />
                    </IconButton>
                  </Stack>

                  <Stack direction="row" spacing={0.5} sx={{ ml: 1.5 }}>
                    <Chip
                      label={scenario.category}
                      size="small"
                      color={scenario.categoryColor}
                      variant="outlined"
                      sx={{ fontSize: 8, fontWeight: 600, height: 16, "& .MuiChip-label": { px: 0.5 } }}
                    />
                    <Chip
                      label={scenario.impact}
                      size="small"
                      sx={{
                        fontSize: 8,
                        fontWeight: 600,
                        height: 16,
                        bgcolor: "grey.200",
                        color: "grey.800",
                        "& .MuiChip-label": { px: 0.5 },
                      }}
                    />
                    <Chip
                      label={scenario.duration}
                      size="small"
                      sx={{
                        fontSize: 8,
                        fontWeight: 600,
                        height: 16,
                        bgcolor: "grey.200",
                        color: "grey.800",
                        "& .MuiChip-label": { px: 0.5 },
                      }}
                    />
                  </Stack>
                </Stack>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom Controls */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: "grey.200", bgcolor: "background.paper" }}>
        <Stack spacing={2}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: 11 }}>
            Adjust Impact (%)
          </Typography>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ fontSize: 10 }}>
              {timeFrame}
            </Typography>
            <FormControl size="small">
              <Select
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                IconComponent={KeyboardArrowDown}
                sx={{
                  bgcolor: "grey.100",
                  fontSize: 10,
                  height: 24,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              >
                <MenuItem value="3 Months" sx={{ fontSize: 10 }}>3 Months</MenuItem>
                <MenuItem value="6 Months" sx={{ fontSize: 10 }}>6 Months</MenuItem>
                <MenuItem value="12 Months" sx={{ fontSize: 10 }}>12 Months</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Box>
            <Slider
              value={sliderValue}
              onChange={(e, newValue) => setSliderValue(newValue)}
              min={-50}
              max={100}
              sx={{
                color: "primary.main",
                height: 6,
                "& .MuiSlider-thumb": { height: 16, width: 16 },
              }}
            />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 9 }}>-50%</Typography>
              <Typography variant="caption" color="primary" fontWeight={600} sx={{ fontSize: 9 }}>
                {sliderValue}%
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 9 }}>+100%</Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              fullWidth
              sx={{ py: 0.75, fontSize: 10, textTransform: "none" }}
            >
              Apply Scenario
            </Button>
            <Button
              variant="outlined"
              sx={{ py: 0.75, px: 1.5, fontSize: 10, textTransform: "none" }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

// Data Table Component
const ForecastTable = () => {
  const months = ["Apr 24", "May 24", "Jun 24", "Jul 24", "Aug 24", "Sep 24", "Oct 24", "Nov 24", "Dec 24", "Jan 25", "Feb 25", "Mar 25"];
  
  const getCellColor = (forecastType, value, monthIndex) => {
    if (forecastType === "ML Forecast") {
      // Highlight specific cells as shown in screenshot
      if (monthIndex === 3 && value === 8305) return "#FFE0B2"; // Jul 24 - light orange
      if (monthIndex === 4 && value === 9118) return "#FFCDD2"; // Aug 24 - light red
      if (monthIndex === 5 && value === 11504) return "#FFE0B2"; // Sep 24 - light orange
      if (monthIndex === 6 && value === 12180) return "#FFE0B2"; // Oct 24 - light orange
    }
    return "transparent";
  };

  const getCellContent = (forecastType, value, monthIndex) => {
    if (forecastType === "Consensus" && monthIndex <= 6) {
      return (
        <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="center">
          <Lock sx={{ width: 10, height: 10, color: "grey.500" }} />
          <Typography sx={{ fontSize: 10 }}>{value}</Typography>
        </Stack>
      );
    }
    return value;
  };

  return (
    <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column" }}>
      {/* Table Section */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 100, bgcolor: "grey.100" }}>Location</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 100, bgcolor: "grey.100" }}>Factory</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 140, bgcolor: "grey.100" }}>Category</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 140, bgcolor: "grey.100" }}>Forecast Type</TableCell>
              {months.map((month) => (
                <TableCell key={month} align="center" sx={{ fontSize: 10, fontWeight: 600, minWidth: 80, bgcolor: "grey.100" }}>
                  {month}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {forecastData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {/* Location cell - only show in first row, merge for others */}
                {rowIndex === 0 && (
                  <TableCell 
                    rowSpan={forecastData.length} 
                    sx={{ 
                      fontSize: 11, 
                      fontWeight: 500, 
                      verticalAlign: "top",
                      borderRight: 1,
                      borderColor: "grey.300"
                    }}
                  >
                    Bangalore
                  </TableCell>
                )}
                
                {/* Factory cell - only show in first row, merge for others */}
                {rowIndex === 0 && (
                  <TableCell 
                    rowSpan={forecastData.length} 
                    sx={{ 
                      fontSize: 11, 
                      fontWeight: 500, 
                      verticalAlign: "top",
                      borderRight: 1,
                      borderColor: "grey.300"
                    }}
                  >
                    Bommasandra
                  </TableCell>
                )}

                {/* Category cell - only show in first row, merge for others */}
                {rowIndex === 0 && (
                  <TableCell 
                    rowSpan={forecastData.length} 
                    sx={{ 
                      fontSize: 11, 
                      fontWeight: 500, 
                      verticalAlign: "top",
                      borderRight: 1,
                      borderColor: "grey.300"
                    }}
                  >
                    <Chip 
                      label="Sweet Mixes" 
                      size="small" 
                      color="info" 
                      sx={{ fontSize: 8, height: 16 }} 
                    />
                  </TableCell>
                )}

                {/* Forecast Type cell */}
                <TableCell sx={{ fontSize: 11, fontWeight: 500 }}>
                  {row.forecastType}
                </TableCell>

                {/* Month data cells */}
                <TableCell align="center" sx={{ fontSize: 10, bgcolor: getCellColor(row.forecastType, row.apr24, 0) }}>
                  {getCellContent(row.forecastType, row.apr24, 0)}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 10, bgcolor: getCellColor(row.forecastType, row.may24, 1) }}>
                  {getCellContent(row.forecastType, row.may24, 1)}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 10, bgcolor: getCellColor(row.forecastType, row.jun24, 2) }}>
                  {getCellContent(row.forecastType, row.jun24, 2)}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 10, bgcolor: getCellColor(row.forecastType, row.jul24, 3) }}>
                  {getCellContent(row.forecastType, row.jul24, 3)}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 10, bgcolor: getCellColor(row.forecastType, row.aug24, 4) }}>
                  {getCellContent(row.forecastType, row.aug24, 4)}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 10, bgcolor: getCellColor(row.forecastType, row.sep24, 5) }}>
                  {getCellContent(row.forecastType, row.sep24, 5)}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 10, bgcolor: getCellColor(row.forecastType, row.oct24, 6) }}>
                  {getCellContent(row.forecastType, row.oct24, 6)}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 10, bgcolor: getCellColor(row.forecastType, row.nov24, 7) }}>
                  {getCellContent(row.forecastType, row.nov24, 7)}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 10, bgcolor: getCellColor(row.forecastType, row.dec24, 8) }}>
                  {getCellContent(row.forecastType, row.dec24, 8)}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 10, bgcolor: getCellColor(row.forecastType, row.jan25, 9) }}>
                  {getCellContent(row.forecastType, row.jan25, 9)}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 10, bgcolor: getCellColor(row.forecastType, row.feb25, 10) }}>
                  {getCellContent(row.forecastType, row.feb25, 10)}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 10, bgcolor: getCellColor(row.forecastType, row.mar25, 11) }}>
                  {getCellContent(row.forecastType, row.mar25, 11)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Chart Section - Now in a proper box */}
      <Paper sx={{ p: 2, flex: 1, bgcolor: "background.paper" }}>
        <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 600, mb: 2, color: "text.primary" }}>
          Demand Forecast
        </Typography>
        
        {/* Legend/Filter Chips */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            {/* Colored Legend Chips */}
            <Stack direction="row" spacing={1}>
              <Chip 
                label="● Actual" 
                size="small" 
                sx={{ 
                  bgcolor: "transparent", 
                  color: "#f44336", 
                  fontSize: 11,
                  fontWeight: 600,
                  border: "none",
                  "& .MuiChip-label": { px: 1 }
                }} 
              />
              <Chip 
                label="● Baseline" 
                size="small" 
                sx={{ 
                  bgcolor: "transparent", 
                  color: "#2196f3", 
                  fontSize: 11,
                  fontWeight: 600,
                  border: "none",
                  "& .MuiChip-label": { px: 1 }
                }} 
              />
              <Chip 
                label="● ML" 
                size="small" 
                sx={{ 
                  bgcolor: "transparent", 
                  color: "#ff9800", 
                  fontSize: 11,
                  fontWeight: 600,
                  border: "none",
                  "& .MuiChip-label": { px: 1 }
                }} 
              />
              <Chip 
                label="● Consensus" 
                size="small" 
                sx={{ 
                  bgcolor: "transparent", 
                  color: "#4caf50", 
                  fontSize: 11,
                  fontWeight: 600,
                  border: "none",
                  "& .MuiChip-label": { px: 1 }
                }} 
              />
            </Stack>
            
            {/* Filter Chips */}
            <Stack direction="row" spacing={1}>
              <Chip label="Holidays" variant="outlined" size="small" sx={{ fontSize: 10, height: 24 }} />
              <Chip label="Promotions" variant="outlined" size="small" sx={{ fontSize: 10, height: 24 }} />
              <Chip label="Baseline Forecast" variant="outlined" size="small" sx={{ fontSize: 10, height: 24 }} />
              <Chip label="ML Forecast" variant="outlined" size="small" sx={{ fontSize: 10, height: 24 }} />
              <Chip label="Consensus Forecast" variant="outlined" size="small" sx={{ fontSize: 10, height: 24 }} />
            </Stack>
          </Stack>
        </Box>

        {/* Chart */}
        <Box sx={{ height: 350, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: "#666" }}
                axisLine={{ stroke: "#e0e0e0" }}
                tickLine={{ stroke: "#e0e0e0" }}
              />
              <YAxis 
                label={{ value: 'Units (in thousands)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11, fill: "#666" } }}
                tick={{ fontSize: 11, fill: "#666" }}
                axisLine={{ stroke: "#e0e0e0" }}
                tickLine={{ stroke: "#e0e0e0" }}
                domain={[6, 15]}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#f44336" 
                strokeWidth={2.5} 
                dot={{ r: 4, fill: "#f44336" }}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="#2196f3" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: "#2196f3" }}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="ml" 
                stroke="#ff9800" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: "#ff9800" }}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="consensus" 
                stroke="#4caf50" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: "#4caf50" }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

// Main Dashboard Component
const ScenarioDashboard = () => {
  const [selectedScenario, setSelectedScenario] = useState(1);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#CBD5E1" }}>
      <ScenarioSidebar 
        selectedScenario={selectedScenario}
        onScenarioSelect={setSelectedScenario}
      />
      <ForecastTable />
    </Box>
  );
};

export default ScenarioDashboard;
