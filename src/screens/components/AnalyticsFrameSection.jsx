import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const months = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];

const demandChartData = [
  { month: "Apr", FY_2023: 6, FY_2024: 13 },
  { month: "May", FY_2023: -1, FY_2024: 12 },
  { month: "Jun", FY_2023: 5, FY_2024: -5 },
  { month: "Jul", FY_2023: 5, FY_2024: 24 },
  { month: "Aug", FY_2023: 2, FY_2024: -2 },
  { month: "Sep", FY_2023: 1, FY_2024: 16 },
  { month: "Oct", FY_2023: 2, FY_2024: 2 },
  { month: "Nov", FY_2023: 6, FY_2024: 1 },
  { month: "Dec", FY_2023: -1, FY_2024: 8 },
  { month: "Jan", FY_2023: 4, FY_2024: 23 },
  { month: "Feb", FY_2023: 5, FY_2024: -4 },
  { month: "Mar", FY_2023: 0, FY_2024: 0 },
];

const revenueChartData = [
  { month: "Apr", FY_2023: 7, FY_2024: 7 },
  { month: "May", FY_2023: 6, FY_2024: 11 },
  { month: "Jun", FY_2023: 2, FY_2024: 18 },
  { month: "Jul", FY_2023: 10, FY_2024: 16 },
  { month: "Aug", FY_2023: 3, FY_2024: 5 },
  { month: "Sep", FY_2023: 10, FY_2024: 21 },
  { month: "Oct", FY_2023: 4, FY_2024: 18 },
  { month: "Nov", FY_2023: -2, FY_2024: 14 },
  { month: "Dec", FY_2023: -1, FY_2024: 4 },
  { month: "Jan", FY_2023: 9, FY_2024: 11 },
  { month: "Feb", FY_2023: 1, FY_2024: 20 },
  { month: "Mar", FY_2023: 10, FY_2024: 4 },
];

const baselineDemandData = [
  7120, 7089, 8209, 7933, 8315, 10271, 11051, 6989, 7088, 7454, 7666, 8192,
];
const demandComparisonData = [
  {
    label: "FY 2022 vs FY 2023 (%)",
    values: [6, -1, 5, 5, 2, 1, 2, 6, -1, 4, 5, 0],
    colors: [
      "#e8f5e9",
      "#ffebee",
      "#e8f5e9",
      "#e8f5e9",
      "#ffebee",
      "#ffebee",
      "#ffebee",
      "#e8f5e9",
      "#ffebee",
      "#e8f5e9",
      "#e8f5e9",
      "#ffffff",
    ],
  },
  {
    label: "FY 2023 vs FY 2024 (%)",
    values: [13, 12, -5, 24, -2, 16, 2, 1, 8, 23, -4, 0],
    colors: [
      "#a5d6a7",
      "#a5d6a7",
      "#ef9a9a",
      "#66bb6a",
      "#ef9a9a",
      "#81c784",
      "#ffebee",
      "#ffebee",
      "#a5d6a7",
      "#66bb6a",
      "#ef9a9a",
      "#ffffff",
    ],
  },
];
const baselineRevenueData = [
  4.1, 4.1, 4.5, 4.4, 4.9, 5.5, 6.1, 4, 4.1, 4.2, 4.3, 4.5,
];
const revenueComparisonData = [
  {
    label: "FY 2022 vs FY 2023 (%)",
    values: [7, 6, 2, 10, 3, 10, 4, -2, -1, 9, 1, 10],
    colors: [
      "#fff8e1",
      "#ffebee",
      "#ffebee",
      "#e8f5e9",
      "#ffebee",
      "#e8f5e9",
      "#ffebee",
      "#ef9a9a",
      "#ef9a9a",
      "#e8f5e9",
      "#ffebee",
      "#e8f5e9",
    ],
  },
  {
    label: "FY 2023 vs FY 2024 (%)",
    values: [7, 11, 18, 16, 5, 21, 18, 14, 4, 11, 20, 4],
    colors: [
      "#fff8e1",
      "#e8f5e9",
      "#a5d6a7",
      "#a5d6a7",
      "#ffebee",
      "#66bb6a",
      "#81c784",
      "#a5d6a7",
      "#ffebee",
      "#e8f5e9",
      "#66bb6a",
      "#ffebee",
    ],
  },
];

const getValueColor = (value) => {
  const colorMap = {
    "-5": "#FA4545",
    "-4": "#F67F7F",
    "-2": "#FAABAB",
    "-1": "#FECACA",
    0: "#FFFFFF",
    1: "#DCFCE7",
    2: "#DCFCE7",
    3: "#DCFCE7",
    4: "#BBFCD1",
    5: "#BBFCD1",
    6: "#BBFCD1",
    7: "#8FF6B2",
    8: "#8FF6B2",
    9: "#8FF6B2",
    10: "#65F696",
    11: "#65F696",
    12: "#65F696",
    13: "#37F879",
    14: "#37F879",
    16: "#3BE274",
    18: "#3BE274",
    20: "#1AD45A",
    21: "#1AD45A",
    23: "#1EC858",
    24: "#1EC858",
  };

  return colorMap[value.toString()] || "#FFFFFF";
};

const cellBorderStyle = {
  borderTop: "0px",
  borderRight: "0px",
  borderBottom: "1px solid #D2D2D3",
  borderLeft: "1px solid #D2D2D3",
};

const baselineCellBorderStyle = {
  borderTop: "1px solid #F0F0F0",
  borderRight: "0px",
  borderBottom: "1px solid #D2D2D3",
  borderLeft: "1px solid #D2D2D3",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 1.5,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" fontWeight={600}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={index} variant="body2" sx={{ color: entry.color }}>
            {`${entry.dataKey === "FY_2023" ? "FY 2023" : "FY 2024"}: ${
              entry.value
            }%`}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

export const AnalyticsFrameSection = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#E2E8F0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          width: "100%",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              height: "500px",
              p: "15px",
              borderTop: 0,
              borderRight: "1px solid #CBD5E1",
              borderBottom: "1px solid #CBD5E1",
              borderLeft: "1px solid #CBD5E1",
              boxSizing: "border-box",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={800}
              color="text.secondary"
              gutterBottom
            >
              Demand
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  bgcolor: "primary.50",
                  borderColor: "grey.300",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  gap: 1,
                }}
                startIcon={
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      bgcolor: "#4caf50",
                      borderRadius: 1,
                    }}
                  />
                }
              >
                FY 2023
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  bgcolor: "primary.50",
                  borderColor: "grey.300",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  gap: 1,
                }}
                startIcon={
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      bgcolor: "#42a5f5",
                      borderRadius: 1,
                    }}
                  />
                }
              >
                FY 2024
              </Button>
            </Stack>
            <Box sx={{ width: "100%", height: 420 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={demandChartData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e0e0e0"
                    horizontal={true}
                    vertical={true}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#666" }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    height={25}
                  />
                  <YAxis
                    domain={[-15, 25]}
                    tick={{ fontSize: 12, fill: "#666" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                    width={35}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="linear"
                    dataKey="FY_2023"
                    stroke="#4caf50"
                    strokeWidth={2}
                    dot={{ fill: "#4caf50", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#4caf50", strokeWidth: 2 }}
                  />
                  <Line
                    type="linear"
                    dataKey="FY_2024"
                    stroke="#42a5f5"
                    strokeWidth={2}
                    dot={{ fill: "#42a5f5", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#42a5f5", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              height: "500px",
              p: "15px",
              borderTop: 0,
              borderRight: "1px solid #CBD5E1",
              borderBottom: "1px solid #CBD5E1",
              borderLeft: "1px solid #CBD5E1",
              boxSizing: "border-box",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={800}
              color="text.secondary"
              gutterBottom
            >
              Revenue
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  bgcolor: "primary.50",
                  borderColor: "grey.300",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  gap: 1,
                }}
                startIcon={
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      bgcolor: "#4caf50",
                      borderRadius: 1,
                    }}
                  />
                }
              >
                FY 2023
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  bgcolor: "primary.50",
                  borderColor: "grey.300",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  gap: 1,
                }}
                startIcon={
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      bgcolor: "#42a5f5",
                      borderRadius: 1,
                    }}
                  />
                }
              >
                FY 2024
              </Button>
            </Stack>
            <Box sx={{ width: "100%", height: 420 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueChartData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e0e0e0"
                    horizontal={true}
                    vertical={true}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#666" }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    height={25}
                  />
                  <YAxis
                    domain={[-15, 25]}
                    tick={{ fontSize: 12, fill: "#666" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                    width={35}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="linear"
                    dataKey="FY_2023"
                    stroke="#4caf50"
                    strokeWidth={2}
                    dot={{ fill: "#4caf50", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#4caf50", strokeWidth: 2 }}
                  />
                  <Line
                    type="linear"
                    dataKey="FY_2024"
                    stroke="#42a5f5"
                    strokeWidth={2}
                    dot={{ fill: "#42a5f5", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#42a5f5", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          maxHeight: 400,
          overflowY: "auto",
          border: 1,
          borderColor: "grey.300",
          borderRadius: 0,
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  width: 207,
                  bgcolor: "#E2E8F0",
                  ...cellBorderStyle,
                }}
              />
              <TableCell
                sx={{
                  width: 207,
                  bgcolor: "#E2E8F0",
                  ...cellBorderStyle,
                }}
              />
              {months.map((month, index) => (
                <TableCell
                  key={index}
                  align="right"
                  sx={{
                    bgcolor: "#E2E8F0",
                    ...cellBorderStyle,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "100%",
                      letterSpacing: "0.1px",
                      textAlign: "right",
                      color: "#475569",
                    }}
                  >
                    {month}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell
                sx={{
                  bgcolor: "grey.100",
                  ...baselineCellBorderStyle,
                }}
              />
              <TableCell
                sx={{
                  bgcolor: "grey.100",
                  ...baselineCellBorderStyle,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Baseline FY 2022
                </Typography>
              </TableCell>
              {baselineDemandData.map((value, index) => (
                <TableCell
                  key={index}
                  align="right"
                  sx={{
                    ...baselineCellBorderStyle,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.secondary"
                  >
                    {value}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell
                sx={{
                  bgcolor: "grey.100",
                  ...cellBorderStyle,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Demand
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  bgcolor: "grey.100",
                  ...cellBorderStyle,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {demandComparisonData[0].label}
                </Typography>
              </TableCell>
              {demandComparisonData[0].values.map((value, index) => (
                <TableCell
                  key={index}
                  align="right"
                  sx={{
                    bgcolor: getValueColor(value),
                    ...cellBorderStyle,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.secondary"
                  >
                    {value}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell
                sx={{
                  bgcolor: "grey.100",
                  ...cellBorderStyle,
                }}
              />
              <TableCell
                sx={{
                  bgcolor: "grey.100",
                  ...cellBorderStyle,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {demandComparisonData[1].label}
                </Typography>
              </TableCell>
              {demandComparisonData[1].values.map((value, index) => (
                <TableCell
                  key={index}
                  align="right"
                  sx={{
                    bgcolor: getValueColor(value),
                    ...cellBorderStyle,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color={value < 0 ? "text.primary" : "text.secondary"}
                  >
                    {value}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell
                colSpan={14}
                sx={{ borderTop: 1, borderColor: "grey.100", p: 0, height: 36 }}
              />
            </TableRow>

            <TableRow>
              <TableCell
                sx={{
                  bgcolor: "grey.100",
                  ...baselineCellBorderStyle,
                }}
              />
              <TableCell
                sx={{
                  bgcolor: "grey.100",
                  ...baselineCellBorderStyle,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Baseline FY 2022
                </Typography>
              </TableCell>
              {baselineRevenueData.map((value, index) => (
                <TableCell
                  key={index}
                  align="right"
                  sx={{
                    ...baselineCellBorderStyle,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.secondary"
                  >
                    {value}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell
                sx={{
                  bgcolor: "grey.100",
                  ...cellBorderStyle,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Revenue
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  bgcolor: "grey.100",
                  ...cellBorderStyle,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {revenueComparisonData[0].label}
                </Typography>
              </TableCell>
              {revenueComparisonData[0].values.map((value, index) => (
                <TableCell
                  key={index}
                  align="right"
                  sx={{
                    bgcolor: getValueColor(value),
                    ...cellBorderStyle,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color={value < 0 ? "text.primary" : "text.secondary"}
                  >
                    {value}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell
                sx={{
                  bgcolor: "grey.100",
                  ...cellBorderStyle,
                }}
              />
              <TableCell
                sx={{
                  bgcolor: "grey.100",
                  ...cellBorderStyle,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {revenueComparisonData[1].label}
                </Typography>
              </TableCell>
              {revenueComparisonData[1].values.map((value, index) => (
                <TableCell
                  key={index}
                  align="right"
                  sx={{
                    bgcolor: getValueColor(value),
                    ...cellBorderStyle,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color={value < 0 ? "text.primary" : "text.secondary"}
                  >
                    {value}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
