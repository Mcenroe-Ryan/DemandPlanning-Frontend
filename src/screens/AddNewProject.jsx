import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import CalendarToday from "@mui/icons-material/CalendarToday";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import {
  AppBar,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  Container,
  Divider,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";

const steps = [
  { label: "Get started" },
  { label: "Data Source" },
  { label: "Configure connection" },
  { label: "Entity selection" },
  { label: "Set run schedule" },
];

const dataSources = [
  {
    name: "Spreadsheet",
    image: "https://c.animaapp.com/2RAj5tP5/img/image-5@2x.png",
    imageType: "background",
  },
  {
    name: "Database",
    image: "https://c.animaapp.com/2RAj5tP5/img/brand-logos.svg",
    imageType: "image",
  },
  {
    name: "Oracle NetSuite",
    image: "https://c.animaapp.com/2RAj5tP5/img/brand-logos-1.svg",
    imageType: "image",
  },
  {
    name: "SAP B1",
    image: "https://c.animaapp.com/2RAj5tP5/img/brand-logos-2@2x.png",
    imageType: "image",
  },
  {
    name: "Shopify",
    image: "https://c.animaapp.com/2RAj5tP5/img/brand-logos-3.svg",
    imageType: "image",
  },
];

const entityRows = [
  {
    source: "Historical Sales Demand Entity",
    target: "Historical Demand",
    synchronize: true,
    deleteData: false,
  },
  {
    source: "Demand planning packing list journal entries",
    target: "Historical Demand",
    synchronize: true,
    deleteData: false,
  },
  {
    source: "Distinct products or product variants",
    target: "Product",
    synchronize: true,
    deleteData: false,
  },
  {
    source: "Demand planning warehouses",
    target: "Warehouse Location",
    synchronize: true,
    deleteData: false,
  },
  {
    source: "Demand planning customer accounts",
    target: "Site Location",
    synchronize: true,
    deleteData: false,
  },
  {
    source: "Legal entities",
    target: "Legal Entity",
    synchronize: true,
    deleteData: false,
  },
];

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const AddNewProject = () => {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOwners, setSelectedOwners] = useState([
    { name: "K V Vamshi Das" },
    { name: "Rakshith" },
  ]);
  const [runFrequency, setRunFrequency] = useState("Daily");
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [runTime, setRunTime] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const handleNext = () =>
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const handleWeekdayChange = (day) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const CustomConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.vertical}`]: {
      marginLeft: 14,
      padding: 0,
    },
    [`& .${stepConnectorClasses.line}`]: {
      minHeight: 44,
      borderLeftWidth: 2,
      borderColor: "#cbd5e1",
    },
  }));

  const CustomStepIcon = (props) => {
    const { active, completed, icon } = props;
    return (
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: active || completed ? "#2563eb" : "#fff",
          border: `2px solid ${active || completed ? "#2563eb" : "#94a3b8"}`,
          color: active || completed ? "#fff" : "#2563eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: 12,
          zIndex: 2,
          transition: "background 0.2s, border 0.2s",
        }}
      >
        {icon}
      </div>
    );
  };

  return (
    <Box sx={{ bgcolor: "#eff6ff", minHeight: "100vh", width: "100%" }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#0284c7" }}>
        <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton color="inherit">
              <MenuIcon />
            </IconButton>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                component="img"
                src="https://c.animaapp.com/m9Wmzq2S/img/image-3@2x.png"
                alt="Logo"
                sx={{ width: 40, height: 36 }}
              />
              <Stack>
                <Typography sx={{ fontWeight: 600, color: "white" }}>
                  Demand Planning
                </Typography>
                <Typography sx={{ fontSize: 10, color: "white" }}>
                  Business Planner
                </Typography>
              </Stack>
            </Stack>
            <Breadcrumbs
              separator={
                <ChevronRightIcon fontSize="small" sx={{ color: "white" }} />
              }
              sx={{ ml: 4 }}
            >
              <Typography color="white" variant="subtitle2">
                Dashboard
              </Typography>
              <Typography color="white" variant="subtitle2">
                Add New Project
              </Typography>
              <Typography color="white" variant="subtitle2">
                {steps[stepIndex].label}
              </Typography>
            </Breadcrumbs>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <Avatar
              src="https://c.animaapp.com/m9Wmzq2S/img/ellipse@2x.png"
              sx={{ width: 35, height: 35 }}
            />
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 5, display: "flex" }}>
        {/* Stepper */}
        <Box sx={{ width: 250, minHeight: 400, position: "relative", pt: 2 }}>
          <Stepper
            activeStep={stepIndex}
            orientation="vertical"
            connector={<CustomConnector />}
            sx={{
              background: "transparent",
              pl: 2,
              pt: 2,
              ".MuiStepLabel-label": {
                fontWeight: 400,
                color: "#0f172a",
                fontSize: 16,
              },
              ".Mui-active .MuiStepLabel-label": {
                fontWeight: 600,
                color: "#0f172a",
              },
              ".Mui-completed .MuiStepLabel-label": {
                fontWeight: 600,
                color: "#0f172a",
              },
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel StepIconComponent={CustomStepIcon}>
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        {/* Content */}
        <Box sx={{ flexGrow: 1, pl: 8 }}>
          {stepIndex === 0 && (
            <Stack spacing={3} maxWidth={600}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Get started
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This provider helps you retrieve data from CloudBC Labs and
                operations apps such as Demand Planning supply chain management.
                Retrieved data is accessible in Demand Planning and lets you
                perform demand forecasts and related business processes.
              </Typography>
              <TextField
                placeholder="Project Name"
                fullWidth
                sx={{ bgcolor: "white" }}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <TextField
                placeholder="Enter Description"
                fullWidth
                sx={{ bgcolor: "white" }}
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
              />
              <Paper sx={{ p: 1, display: "flex", gap: 1, bgcolor: "white" }}>
                {selectedOwners.map((owner, index) => (
                  <Chip
                    key={index}
                    label={owner.name}
                    deleteIcon={<CancelIcon />}
                    onDelete={() => {}}
                    sx={{ bgcolor: "#e0e7ff", fontWeight: 500 }}
                  />
                ))}
              </Paper>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ mt: 2, textTransform: "none", bgcolor: "#2563eb" }}
              >
                Next
              </Button>
            </Stack>
          )}

          {stepIndex === 1 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                Data Source
              </Typography>
              <Typography variant="body1">
                Please select your data source
              </Typography>
              <Stack
                direction="row"
                spacing={3}
                justifyContent="center"
                alignItems="flex-start"
                sx={{ py: 3, flexWrap: "nowrap" }}
              >
                {dataSources.map((source, index) => (
                  <Card
                    key={index}
                    sx={{
                      width: 170,
                      height: 199,
                      borderRadius: "5px",
                      overflow: "hidden",
                      border: "1px solid #94a3b8",
                      cursor: "pointer",
                    }}
                    // ADDED: Spreadsheet navigation
                    onClick={() => {
                      if (source.name === "Spreadsheet") {
                        navigate("/spreadsheet");
                      }
                    }}
                  >
                    <CardActionArea sx={{ height: "100%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 2,
                          height: "calc(100% - 40px)",
                          bgcolor: "white",
                        }}
                      >
                        {source.imageType === "background" ? (
                          <Box
                            sx={{
                              width: 57,
                              height: 57,
                              backgroundImage: `url(${source.image})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                        ) : (
                          <CardMedia
                            component="img"
                            image={source.image}
                            alt={source.name}
                            sx={{ width: 60, height: 60, objectFit: "contain" }}
                          />
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 1.25,
                          bgcolor: "#e2e8f0",
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          {source.name}
                        </Typography>
                      </Box>
                    </CardActionArea>
                  </Card>
                ))}
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={handleBack}
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    color: "#1d4ed8",
                    borderColor: "#1d4ed8",
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{ textTransform: "none", bgcolor: "#2563eb" }}
                >
                  Next
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          )}

          {stepIndex === 2 && (
            <Box maxWidth={600}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
                Configure Connection Credentials
              </Typography>
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="body1" fontWeight={600}>
                    Connection URL{" "}
                    <Box component="span" sx={{ color: "error.main" }}>
                      *
                    </Box>
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: 1,
                      bgcolor: "white",
                    }}
                  >
                    <InputBase
                      sx={{ ml: 2, flex: 1 }}
                      placeholder="Enter Database URL"
                      inputProps={{ "aria-label": "database url" }}
                    />
                  </Paper>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Button
                    onClick={handleBack}
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      color: "#1d4ed8",
                      borderColor: "#1d4ed8",
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    sx={{ textTransform: "none", bgcolor: "#2563eb" }}
                  >
                    Next
                  </Button>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}

          {stepIndex === 3 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                Entity Selection
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                Please select which entities you want to import.
              </Typography>
              <TableContainer component={Paper} sx={{ width: "100%" }}>
                <Table>
                  <TableHead sx={{ bgcolor: "action.hover" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Source</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Target</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Synchronize
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Delete Data
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entityRows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.source}</TableCell>
                        <TableCell>{row.target}</TableCell>
                        <TableCell>
                          <Switch checked={row.synchronize} color="primary" />
                        </TableCell>
                        <TableCell>
                          <Switch checked={row.deleteData} color="primary" />
                        </TableCell>
                        <TableCell>
                          <IconButton>
                            <CancelIcon color="error" fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button
                  onClick={handleBack}
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    color: "#1d4ed8",
                    borderColor: "#1d4ed8",
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{ textTransform: "none", bgcolor: "#2563eb" }}
                >
                  Next
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          )}

          {stepIndex === 4 && (
            <Box maxWidth={700}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
                Set run schedule
              </Typography>
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Set run schedule
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Configure when the import profile will run (run date), based
                    on a recurring schedule.
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Run schedule
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value="Recurring"
                      displayEmpty
                      IconComponent={KeyboardArrowDown}
                      sx={{ bgcolor: "white" }}
                      disabled
                    >
                      <MenuItem value="Recurring">Recurring</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Set run date recurrence
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value="Repeat"
                      displayEmpty
                      IconComponent={KeyboardArrowDown}
                      sx={{ bgcolor: "white" }}
                      disabled
                    >
                      <MenuItem value="Repeat">Repeat</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Daily
                  </Typography>
                  <FormGroup row>
                    {weekdays.map((day) => (
                      <FormControlLabel
                        key={day}
                        control={
                          <Checkbox
                            checked={selectedWeekdays.includes(day)}
                            onChange={() => handleWeekdayChange(day)}
                          />
                        }
                        label={day}
                      />
                    ))}
                  </FormGroup>
                </Stack>

                <Stack direction="row" spacing={4}>
                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      At
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={runTime || "12:45 AM"}
                        onChange={(e) => setRunTime(e.target.value)}
                        displayEmpty
                        IconComponent={KeyboardArrowDown}
                        sx={{ bgcolor: "white" }}
                      >
                        <MenuItem value="12:00 AM">12:00 AM</MenuItem>
                        <MenuItem value="12:45 AM">12:45 AM</MenuItem>
                        <MenuItem value="01:00 AM">01:00 AM</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Time zone
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value="(UTC/GMT+05:30 AM) India, Asia, Kolkata"
                        displayEmpty
                        IconComponent={KeyboardArrowDown}
                        sx={{ bgcolor: "white" }}
                        disabled
                      >
                        <MenuItem value="(UTC/GMT+05:30 AM) India, Asia, Kolkata">
                          (UTC/GMT+05:30 AM) India, Asia, Kolkata
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={4}>
                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Start date
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value="Mon, Dec 22 2024"
                        displayEmpty
                        IconComponent={KeyboardArrowDown}
                        sx={{ bgcolor: "white" }}
                        disabled
                      >
                        <MenuItem value="Mon, Dec 22 2024">
                          Mon, Dec 22 2024
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      End date
                    </Typography>
                    <TextField
                      fullWidth
                      value="Select"
                      InputProps={{
                        endAdornment: <CalendarToday fontSize="small" />,
                        readOnly: true,
                      }}
                      sx={{ bgcolor: "white" }}
                    />
                  </Stack>
                </Stack>

                <Typography variant="body1" color="text.secondary">
                  Occurs every{" "}
                  {selectedWeekdays.length > 0
                    ? selectedWeekdays.join(", ")
                    : "Monday"}{" "}
                  at {runTime || "12:00 AM"} starting 22/12/2024 until endlessly
                </Typography>

                <Box>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 3,
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      <Button
                        onClick={handleBack}
                        variant="outlined"
                        sx={{
                          textTransform: "none",
                          color: "#1d4ed8",
                          borderColor: "#1d4ed8",
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => navigate("/dashboard")}
                        variant="contained"
                        sx={{ textTransform: "none", bgcolor: "#2563eb" }}
                      >
                        Finish
                      </Button>
                    </Stack>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate("/dashboard")}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Stack>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};
