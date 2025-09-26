import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
} from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";

const steps = [
  { label: "Get started" },
  { label: "Data Source" },
  { label: "Upload File" },
  { label: "Entity selection" },
];

const entityData = [
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
];

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

export const AddNewProjectSpreadsheet = () => {
  const [currentStep, setCurrentStep] = useState(2); 
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const handleBack = () => {
    if (currentStep === 2) {
      navigate("/addNewProject?step=1");
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderUploadFile = () => (
    <Stack sx={{ flex: 1, minHeight: "60vh" }} alignItems="flex-start">
      <Typography
        variant="subtitle1"
        fontWeight={600}
        color="text.primary"
        gutterBottom
        sx={{ mb: 2 }}
      >
        Upload File
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          mt: 2,
          p: 7,
          width: 533,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed rgba(0, 0, 0, 0.25)",
          borderRadius: "10px",
          bgcolor: "white",
        }}
      >
        <Box sx={{ width: 48, height: 48, mb: 3 }}>
          <Box
            component="img"
            src="https://c.animaapp.com/a1Nmbe0T/img/group@2x.png"
            alt="Upload icon"
            sx={{ width: 46, height: 38, mt: 0.5 }}
          />
        </Box>
        <Stack spacing={3} alignItems="center">
          <Stack spacing={1} alignItems="center">
            <Typography variant="body2">
              Select a file or drag and drop here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              .csv, .xlsx file size no more than 10MB
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            sx={{
              bgcolor: "#fbfdfe",
              border: "1px solid rgba(15, 145, 210, 0.7)",
              color: "#0F91D1",
              borderRadius: "5px",
              px: 4,
              py: 1.25,
            }}
          >
            Select file
          </Button>
        </Stack>
      </Paper>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ my: 4, width: "100%" }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ width: 269 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{
              flex: 1,
              color: "#0F91D2",
              borderColor: "#0F91D2",
              fontWeight: 600,
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              flex: 1,
              bgcolor: "#2563EB",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#1E40AF",
              },
            }}
          >
            Next
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
    </Stack>
  );

  const renderEntitySelection = () => (
    <Box sx={{ flex: 1 }}>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="600" color="text.primary">
          Entity Selection
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please select which entities you want to import.
        </Typography>
      </Stack>
      <TableContainer component={Paper} sx={{ mb: 6 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#e2e8f0" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>
                Source
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569", width: 298 }}>
                Target
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569", width: 146 }}>
                Synchronize
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569", width: 150 }}>
                Delete data
              </TableCell>
              <TableCell sx={{ width: 70 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entityData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.source}</TableCell>
                <TableCell>{row.target}</TableCell>
                <TableCell>
                  <Switch checked={row.synchronize} />
                </TableCell>
                <TableCell>
                  <Switch checked={row.deleteData} />
                </TableCell>
                <TableCell>
                  <IconButton>
                    <Box
                      component="img"
                      src="https://c.animaapp.com/DNg3cNtE/img/x-circle-2.svg"
                      alt="Delete"
                      sx={{ width: 20, height: 20 }}
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ mb: 3 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ width: 269 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{
              flex: 1,
              color: "#2563EB",
              borderColor: "#1D4ED8",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#1E40AF",
                color: "#1E40AF",
              },
            }}
          >
            Back
          </Button>

          <Button
            variant="contained"
            sx={{
              flex: 1,
              bgcolor: "#2563eb",
              fontWeight: 600,
            }}
            onClick={() => navigate("/dashboard")}
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
  );

  return (
    <Box sx={{ bgcolor: "#eff6ff", minHeight: "100vh", width: "100vw" }}>
      <AppBar position="static" sx={{ bgcolor: "#0F91D2", height: 56 }}>
        <Toolbar
          sx={{
            minHeight: 56,
            px: 3,
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton color="inherit" edge="start" sx={{ p: 0 }}>
              <MenuIcon />
            </IconButton>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box
                component="img"
                src="https://c.animaapp.com/a1Nmbe0T/img/image-3@2x.png"
                alt="Logo"
                sx={{ width: 40, height: 35.69 }}
              />
              <Stack>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "white", lineHeight: "16px" }}
                >
                  Demand Planning
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "white", fontSize: 10 }}
                >
                  Business Planner
                </Typography>
              </Stack>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ pl: 4 }}
            >
              <Typography variant="body2" color="white">
                Dashboard
              </Typography>
              <ChevronRightIcon fontSize="small" sx={{ color: "white" }} />
              <Typography variant="body2" color="white">
                Add New Project
              </Typography>
              <ChevronRightIcon fontSize="small" sx={{ color: "white" }} />
              <Typography variant="body2" color="white">
                Spreadsheet
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton color="inherit">
              <SearchIcon fontSize="small" />
            </IconButton>
            <IconButton color="inherit">
              <NotificationsIcon fontSize="small" />
            </IconButton>
            <Avatar
              src="https://c.animaapp.com/a1Nmbe0T/img/ellipse@2x.png"
              sx={{ width: 35, height: 35 }}
            />
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ px: 6, pt: 4 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          color="text.primary"
          sx={{ mb: 4 }}
        >
          Add New Project
        </Typography>
        <Box
          sx={{ display: "flex", alignItems: "flex-start", minHeight: "70vh" }}
        >
          <Box sx={{ width: 250, minHeight: 400, position: "relative", pt: 2 }}>
            <Stepper
              activeStep={currentStep}
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
          <Box sx={{ flex: 1, pl: 8 }}>
            {currentStep === 2 && renderUploadFile()}
            {currentStep === 3 && renderEntitySelection()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
