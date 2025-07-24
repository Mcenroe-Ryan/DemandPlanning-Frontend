import React, { useEffect, useState } from "react";
import Add from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
  Alert,
  Skeleton,
  ButtonBase,
  Paper,
  CircularProgress,
} from "@mui/material";

/* ─────── CONSTANTS ─────── */
const API_BASE_URL = import.meta.env.VITE_API_URL;

const metrics = [
  { id: "MAPE", label: "MAPE" },
  { id: "WMAPE", label: "WMAPE" },
  { id: "FVAvsStats", label: "FVA vs Stats" },
  { id: "FVAvsConsensus", label: "FVA vs Consensus" }
];

/* ─────── HELPERS ─────── */
const transformModelData = (rows = []) =>
  [...rows]
    .sort((a, b) => Number(b.accuracy) - Number(a.accuracy))
    .map((r, i) => ({
      id: r.id,
      name: r.name,
      accuracy: `${Number(r.accuracy).toFixed(2)}%`,
      isRecommended: i === 0,
      metrics: {
        MAPE: Number(r.mape).toFixed(2),
        WMAPE: Number(r.wmape).toFixed(2),
        FVAvsStats: `${Number(r.fva_stats).toFixed(2)}%`,
        FVAvsConsensus: `${Number(r.fva_consensus).toFixed(2)}%`,
      },
      raw: {
        mape: Number(r.mape),
        wmape: Number(r.wmape),
        fvaStats: Number(r.fva_stats),
        fvaConsensus: Number(r.fva_consensus),
      },
    }));

const transformFeatureData = (apiData) => {
  return apiData.map(item => ({
    name: item.feature_name,
    impact: Number(item.impact)
  }));
};

/* ─────── EXPLAINABILITY FRAME ─────── */
function ExplainFrame({ modelName, modelId, onClose }) {
  const [featuresData, setFeaturesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatureData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/getDsModelFeaturesData?model_id=${modelId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const modelFeatures = data
          .filter(item => item.model_id === modelId)
          .map(item => ({
            name: item.feature_name,
            impact: Number(item.impact)
          }))
          .sort((a, b) => b.impact - a.impact);
        
        setFeaturesData(modelFeatures);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching feature data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (modelId) {
      fetchFeatureData();
    }
  }, [modelId]);

  const maxImpact = Math.max(...featuresData.map(f => f.impact), 1);

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        width: 871,
        height: 328,
        padding: '20px',
        borderRadius: '10px',
        bgcolor: "background.paper",
        boxShadow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <Typography 
        variant="h6" 
        fontWeight={600} 
        sx={{ 
          mb: 3, 
          textAlign: 'center',
          fontSize: '16px',
          color: 'text.primary'
        }}
      >
        Explainability – {modelName}
      </Typography>

      {isLoading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexGrow: 1 
        }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Loading feature data...
          </Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 1 }}>
          Failed to load feature data: {error}
        </Alert>
      ) : (
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Y-axis label */}
          <Typography
            variant="body2"
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'rotate(-90deg) translateY(-50%)',
              transformOrigin: 'center',
              color: "text.secondary",
              fontWeight: 500,
              fontSize: '12px',
              zIndex: 1,
            }}
          >
            Feature
          </Typography>

          {/* Chart Area */}
          <Box sx={{ 
            ml: 4,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            py: 2
          }}>
            {featuresData.map((feature, index) => (
              <Box
                key={feature.name}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '40px',
                  mb: index < featuresData.length - 1 ? 1 : 0
                }}
              >
                {/* Feature Name */}
                <Typography
                  variant="body2"
                  sx={{
                    width: 200,
                    textAlign: 'right',
                    color: "text.secondary",
                    fontSize: '12px',
                    pr: 2,
                    flexShrink: 0,
                  }}
                >
                  {feature.name}
                </Typography>

                {/* Bar Container */}
                <Box sx={{ 
                  flexGrow: 1, 
                  height: 32,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  position: 'relative',
                  mr: 2
                }}>
                  {/* Actual Bar */}
                  <Box
                    sx={{
                      height: '100%',
                      width: `${(feature.impact / maxImpact) * 100}%`,
                      bgcolor: "#1976d2",
                      borderRadius: 1,
                      transition: 'width 0.3s ease-in-out',
                    }}
                  />
                </Box>

                {/* Impact Value */}
                <Typography
                  variant="body2"
                  sx={{ 
                    color: "text.secondary",
                    minWidth: '30px',
                    fontSize: '12px',
                    textAlign: 'right',
                  }}
                >
                  {Math.round(feature.impact)}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* X-axis label */}
          <Typography
            variant="body2"
            sx={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              color: "text.secondary",
              fontWeight: 500,
              fontSize: '12px',
            }}
          >
            Impact
          </Typography>
        </Box>
      )}

      <Typography
        variant="caption"
        textAlign="center"
        sx={{
          cursor: "pointer",
          color: "text.secondary",
          mt: 2,
          fontSize: '11px',
        }}
        onClick={onClose}
      >
        Click anywhere to close
      </Typography>
    </Paper>
  );
}

/* ─────── MAIN COMPONENT ─────── */
export default function ModelComparisonSection() {
  const [modelData, setModelData] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/getDsModelData`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((raw) => setModelData(transformModelData(raw)))
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  const handleExplainabilityClick = (model) => {
    setSelectedModel({ id: model.id, name: model.name });
  };

  if (isLoading)
    return <Skeleton variant="rectangular" width="100%" height={260} />;
  if (error)
    return <Alert severity="error">Failed to load – {String(error)}</Alert>;
  if (!modelData.length)
    return <Alert severity="info">No model data available.</Alert>;

  return (
    <Box sx={{ p: 2, fontFamily: `"Poppins", sans-serif !important` }}>
      <Stack direction="row" spacing={0.5}>
        {/* METRICS COLUMN */}
        <Box>
          <Box
            sx={{ height: 126, p: 2, display: "flex", alignItems: "flex-end" }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Metric
            </Typography>
          </Box>
          {metrics.map((m, idx) => (
            <Box
              key={m.id}
              sx={{
                width: 215,
                height: 44,
                px: "15px",
                py: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                borderBottom: "1px solid",
                borderColor: "divider",
                borderTopLeftRadius: idx === 0 ? "10px" : 0,
                bgcolor: "background.paper",
              }}
            >
              <Typography fontWeight={600}>{m.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* MODEL CARDS */}
        <Stack direction="row" spacing={0.5}>
          {modelData.map((model) => (
            <Card
              key={model.name}
              sx={{
                width: 215,
                height: 338,
                borderTop: `15px solid ${
                  model.isRecommended ? "#1976d2" : "#e0e0e0"
                }`,
                borderBottom: "5px solid #e0e0e0",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
              }}
              variant="outlined"
            >
              <CardContent
                sx={{
                  padding: "0 !important",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* HEADER */}
                <Box
                  sx={{
                    width: 215,
                    height: 107,
                    px: 1.25,
                    py: 1.875,
                    gap: "4px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography color="primary">{model.name}</Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {model.accuracy}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Accuracy
                  </Typography>
                </Box>

                {/* METRICS */}
                {metrics.map((m) => {
                  const isFVA = m.id.includes("FVA");
                  const raw = isFVA
                    ? model.raw[
                        m.id === "FVAvsStats" ? "fvaStats" : "fvaConsensus"
                      ]
                    : null;
                  const showIcon = isFVA && raw !== 0;
                  const positive = raw > 0;

                  return (
                    <Box
                      key={m.id}
                      sx={{
                        width: 215,
                        height: 44,
                        px: "15px",
                        py: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: showIcon ? "space-between" : "center",
                        gap: "10px",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography fontWeight={500}>
                        {model.metrics[m.id]}
                      </Typography>
                      {showIcon &&
                        (positive ? (
                          <TrendingUpIcon fontSize="small" color="success" />
                        ) : (
                          <TrendingDownIcon fontSize="small" color="error" />
                        ))}
                    </Box>
                  );
                })}

                {/* EXPLAINABILITY BUTTON */}
                <ButtonBase
                  sx={{
                    width: 215,
                    height: 41,
                    px: "15px",
                    py: "10px",
                    gap: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: model.isRecommended
                      ? "primary.main"
                      : "action.disabled",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                  onClick={() => handleExplainabilityClick(model)}
                >
                  <Typography
                    variant="body2"
                    color={
                      model.isRecommended ? "background.paper" : "text.primary"
                    }
                  >
                    Explainability
                  </Typography>
                </ButtonBase>
              </CardContent>
            </Card>
          ))}

          {/* ADD MODEL CARD */}
          <Card
            variant="outlined"
            sx={{
              width: 215,
              height: 324,
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              bgcolor: "action.disabled",
              border: "2px dashed",
              borderColor: "text.disabled",
            }}
          >
            <Stack alignItems="center" spacing={0.5}>
              <Add sx={{ fontSize: 36 }} color="action" />
              <Typography variant="body2" color="text.secondary">
                Add Model
              </Typography>
            </Stack>

            <FormControl fullWidth size="small">
              <Select
                defaultValue=""
                displayEmpty
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

      {/* EXPLAINABILITY OVERLAY */}
      {selectedModel && (
        <ExplainFrame
          modelName={selectedModel.name}
          modelId={selectedModel.id}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </Box>
  );
}
