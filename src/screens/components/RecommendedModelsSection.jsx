import Add from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
  List,
  ListItem,
  Paper,
  TextField,
  Button,
  IconButton,
  ClickAwayListener,
  CircularProgress,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const modelData = [
  {
    name: "XGBoost",
    accuracy: "73.18%",
    isRecommended: true,
    metrics: {
      MAPE: "31.5",
      WMAPE: "42.5",
      FVAvsStats: "5%",
      FVAvsConsensus: "5%",
    },
  },
  {
    name: "LightGBM",
    accuracy: "68.72%",
    isRecommended: false,
    metrics: {
      MAPE: "38.4",
      WMAPE: "63.4",
      FVAvsStats: "15%",
      FVAvsConsensus: "8%",
    },
  },
  {
    name: "ARIMA",
    accuracy: "64.77%",
    isRecommended: false,
    metrics: {
      MAPE: "46.12",
      WMAPE: "78.12",
      FVAvsStats: "-10%",
      FVAvsConsensus: "10%",
    },
  },
];

const metrics = [
  { id: "MAPE", label: "MAPE" },
  { id: "WMAPE", label: "WMAPE" },
  { id: "FVAvsStats", label: "FVA vs Stats" },
  { id: "FVAvsConsensus", label: "FVA vs Consensus" },
];

export default function ModelComparisonSection() {
  return (
    <Box sx={{ p: 2, display: "flex", width: "100%" }}>
      <Stack direction="row" spacing={0.5}>
        {/* Metrics column */}
        <Box>
          <Box
            sx={{ height: 103, p: 2, display: "flex", alignItems: "flex-end" }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Metric
            </Typography>
          </Box>
          {metrics.map((metric) => (
            <Box
              key={metric.id}
              sx={{
                p: 2,
                bgcolor: "background.paper",
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                fontWeight="medium"
                color="text.primary"
              >
                {metric.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Model cards */}
        <Stack direction="row" spacing={0.5}>
          {modelData.map((model, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{
                width: 230,
                borderTop: 6,
                borderTopColor: model.isRecommended
                  ? "primary.main"
                  : "action.disabled",
                borderBottom: 2,
                borderBottomColor: model.isRecommended
                  ? "primary.main"
                  : "action.disabled",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <CardContent
                sx={{
                  p: 0,
                  "&:last-child": { pb: 0 },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="body1"
                    color="primary"
                    textAlign="center"
                  >
                    {model.name}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="medium"
                    color="text.primary"
                    textAlign="center"
                  >
                    {model.accuracy}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Accuracy
                  </Typography>
                </Box>
                {metrics.map((metric) => (
                  <Box
                    key={metric.id}
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: metric.id.includes("FVA")
                        ? "space-between"
                        : "center",
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      color="text.primary"
                    >
                      {model.metrics[metric.id]}
                    </Typography>
                    {metric.id.includes("FVA") && (
                      <TrendingUpIcon fontSize="small" color="action" />
                    )}
                  </Box>
                ))}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: model.isRecommended
                      ? "primary.main"
                      : "action.disabled",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    textAlign="center"
                    color={
                      model.isRecommended ? "background.paper" : "text.primary"
                    }
                  >
                    Explainability
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}

          {/* Add Model card */}
          <Card
            variant="outlined"
            sx={{
              width: 217,
              height: 326,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
              gap: 4,
              bgcolor: "action.disabled",
              border: "2px dashed",
              borderColor: "text.disabled",
              borderRadius: 1,
            }}
          >
            <Stack direction="column" alignItems="center" spacing={0.5}>
              <Add sx={{ fontSize: 35 }} color="action" />
              <Typography variant="body2" color="text.secondary">
                Add Model
              </Typography>
            </Stack>
            <FormControl fullWidth variant="outlined" size="small">
              <Select
                displayEmpty
                value=""
                renderValue={() => "Select Model"}
                sx={{
                  bgcolor: "background.paper",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "action.disabled",
                  },
                }}
              >
                <MenuItem disabled value="">
                  <Typography color="text.secondary">Select Model</Typography>
                </MenuItem>
                <MenuItem value="random-forest">Random Forest</MenuItem>
                <MenuItem value="neural-network">Neural Network</MenuItem>
                <MenuItem value="svm">SVM</MenuItem>
              </Select>
            </FormControl>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
}
