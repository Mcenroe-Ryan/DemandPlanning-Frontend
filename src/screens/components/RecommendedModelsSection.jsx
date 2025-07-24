import React, { useEffect, useState, useMemo } from "react";
import Add from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CloseIcon from "@mui/icons-material/Close";
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
  IconButton,
} from "@mui/material";

/* ─────────────────── CONSTANTS ─────────────────── */
const API_BASE_URL = import.meta.env.VITE_API_URL;

const metrics = [
  { id: "MAPE", label: "MAPE" },
  { id: "WMAPE", label: "WMAPE" },
  { id: "FVAvsStats", label: "FVA vs Stats" },
  { id: "FVAvsConsensus", label: "FVA vs Consensus" },
];

/* ─────────────────── HELPERS ─────────────────── */
const transformModelData = (rows = []) =>
  [...rows]
    .sort((a, b) => Number(b.accuracy) - Number(a.accuracy))
    .map((r) => ({
      id: r.id,
      name: r.name,
      accuracy: `${Number(r.accuracy).toFixed(2)}%`,
      isRecommended: Boolean(r.isRecommended),
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

/* ─────────────────── MINI-CHART POP-UP ─────────────────── */
function FvaVsStatsPopup({ modelId, metricType, onClose }) {
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/getDsModelMetricsData`);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

        const json = await res.json();
        if (!Array.isArray(json))
          throw new Error("Invalid response format – expected an array");

        const metricName =
          metricType === "FVAvsStats" ? "FVA_STATS" : "FVA_CONSENSUS";
        const numericModelId = Number(modelId);

        const filtered = json.filter(
          (d) =>
            Number(d.model_id) === numericModelId &&
            d.metric_name === metricName
        );

        const data = filtered
          .sort((a, b) => Number(a.order_no) - Number(b.order_no))
          .map((d) => parseFloat(d.metric_value));

        if (mounted) setSeries(data);
      } catch (err) {
        console.error(" Mini-chart load error:", err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [modelId, metricType]);

  /* chart sizing */
  const maxVal = useMemo(() => Math.max(...series, 1), [series]);
  const barHeights = useMemo(
    () => series.map((v) => Math.round((v / maxVal) * 89)),
    [series, maxVal]
  );

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <Paper
        elevation={1}
        sx={{
          p: 2.5,
          borderRadius: 2,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} />
        ) : error ? (
          <Alert severity="error" sx={{ p: 1, fontSize: 12 }}>
            {error}
          </Alert>
        ) : series.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        ) : (
          <Box
            sx={{
              position: "relative",
              width: "185px",
              height: 93,
              overflowX: "auto",
              whiteSpace: "nowrap",
              mx: "auto",
            }}
          >
            {barHeights.map((h, i) => (
              <Box
                key={i}
                sx={{
                  display: "inline-block",
                  width: 10,
                  height: Math.max(h, 2),
                  bgcolor: "#679cff",
                  borderRadius: "3px 3px 0 0",
                  m: "0 2px",
                  verticalAlign: "bottom",
                }}
              />
            ))}
          </Box>
        )}
      </Paper>

      {/* close button */}
      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          position: "absolute",
          top: -8,
          right: -8,
          bgcolor: "error.light",
          width: 20,
          height: 20,
          "&:hover": { bgcolor: "error.main" },
        }}
      >
        <CloseIcon sx={{ width: 16, height: 16, color: "white" }} />
      </IconButton>
    </Box>
  );
}

/* ─────────────────── EXPLAIN-FRAME ─────────────────── */
function ExplainFrame({ modelName, modelId, onClose }) {
  const [featuresData, setFeaturesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/getDsModelFeaturesData?model_id=${modelId}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = json
          .filter((d) => d.model_id === modelId)
          .map((d) => ({ name: d.feature_name, impact: Number(d.impact) }))
          .sort((a, b) => b.impact - a.impact);
        if (mounted) setFeaturesData(list);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [modelId]);

  const maxImpact = Math.max(...featuresData.map((f) => f.impact), 1);

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        width: 871,
        height: 328,
        p: 2.5,
        borderRadius: 2,
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
      }}
      onClick={onClose}
    >
      <Typography variant="h6" fontWeight={600} textAlign="left" mb={3}>
        Explainability – {modelName}
      </Typography>

      {isLoading ? (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          flexGrow={1}
          gap={1}
        >
          <CircularProgress size={24} />
          <Typography variant="body2">Loading feature data…</Typography>
        </Stack>
      ) : error ? (
        <Alert severity="error">Failed to load feature data: {error}</Alert>
      ) : (
        <Box sx={{ flexGrow: 1, display: "flex", position: "relative" }}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              lineHeight: "100%",
              letterSpacing: "0.4px",
              textAlign: "center",
              color: "#334155",
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "rotate(-90deg) translateY(-50%)",
              transformOrigin: "center",
            }}
          >
            Feature
          </Typography>

          <Box
            sx={{
              ml: 4,
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              py: 2,
            }}
          >
            {featuresData.map((f, idx) => (
              <Box
                key={f.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: idx < featuresData.length - 1 ? 1 : 0,
                  height: 40,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    width: 200,
                    pr: 2,
                    textAlign: "right",
                    color: "text.secondary",
                    fontSize: 12,
                  }}
                >
                  {f.name}
                </Typography>
                <Box
                  sx={{
                    flexGrow: 1,
                    height: 32,
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                    mr: 2,
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: `${(f.impact / maxImpact) * 100}%`,
                      bgcolor: "#1976d2",
                      borderRadius: 1,
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ minWidth: 30, textAlign: "right" }}
                >
                  {Math.round(f.impact)}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              lineHeight: "100%",
              letterSpacing: "0.4px",
              textAlign: "center",
              color: "#334155",
              position: "absolute",
              bottom: 1,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Impact
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

/* ─────────────────── MAIN SECTION ─────────────────── */
export default function ModelComparisonSection() {
  const [rows, setRows] = useState([]);
  const [loadErr, setLoadErr] = useState(null);
  const [busy, setBusy] = useState(true);
  const [explain, setExplain] = useState(null);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/getDsModelData`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((json) => setRows(transformModelData(json)))
      .catch((err) => setLoadErr(err))
      .finally(() => setBusy(false));
  }, []);

  const openPopup = (metricType, modelId, evt) => {
    evt.stopPropagation();
    setPopup({
      type: metricType,
      modelId,
      pos: { x: evt.clientX, y: evt.clientY },
    });
  };

  if (busy) return <Skeleton variant="rectangular" width="100%" height={260} />;
  if (loadErr)
    return <Alert severity="error">Failed to load – {String(loadErr)}</Alert>;
  if (!rows.length)
    return <Alert severity="info">No model data available.</Alert>;
  return (
    <Box
      sx={{
        minHeight: "100vh", // full viewport height
        bgcolor: "#E2E8F0", // entire page background color
        p: 2,
        fontFamily: `"Poppins", sans-serif !important`,
      }}
    >
      <Stack direction="row" spacing={0.5}>
        <Box>
          <Box
            sx={{ height: 122, p: 2, display: "flex", alignItems: "flex-end" }}
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
                px: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                borderBottom: "1px solid",
                borderColor: "divider",
                borderTopLeftRadius: idx === 0 ? 2 : 0,
                bgcolor: "background.paper",
              }}
            >
              <Typography
                sx={{ fontWeight: 500, fontSize: 16, color: "#475569" }}
              >
                {m.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Stack direction="row" spacing={0.5}>
          {rows.map((model, index) => {
            const isFirstCard = index === 0;
            const shouldBeBlue = isFirstCard || model.isRecommended;

            return (
              <Card
                key={model.id}
                variant="outlined"
                sx={{
                  width: 215,
                  height: 338,
                  borderTop: `15px solid ${
                    shouldBeBlue ? "#1976d2" : "#CBD5E1"
                  }`,
                  borderBottom: "5px solid #CBD5E1",
                  borderRadius: 2.5,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  sx={{ p: 0, display: "flex", flexDirection: "column" }}
                >
                  <Box
                    sx={{
                      width: 215,
                      height: 107,
                      px: 1.25,
                      py: 1.875,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Typography sx={{ color: "#60A5FA", fontSize: 16 }}>
                      {model.name}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 23, fontWeight: 500, color: "#475569" }}
                    >
                      {model.accuracy}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: 500, color: "#94A3B8" }}
                    >
                      Accuracy
                    </Typography>
                  </Box>

                  {metrics.map((m) => {
                    const isFVA = m.id.includes("FVA");
                    const raw =
                      isFVA &&
                      model.raw[
                        m.id === "FVAvsStats" ? "fvaStats" : "fvaConsensus"
                      ];
                    const showIcon = isFVA && raw !== 0;
                    const positive = raw > 0;
                    return (
                      <Box
                        key={m.id}
                        sx={{
                          width: 215,
                          height: 44,
                          px: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: showIcon
                            ? "space-between"
                            : "flex-start",
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 500,
                            color:
                              isFirstCard &&
                              (m.id === "MAPE" || m.id === "WMAPE")
                                ? "#16A34A"
                                : "#475569",
                            textAlign: "left",
                            width: "100%",
                          }}
                        >
                          {model.metrics[m.id]}
                        </Typography>

                        {showIcon && (
                          <IconButton
                            size="small"
                            onClick={(e) => openPopup(m.id, model.id, e)}
                            sx={{ p: 0 }}
                          >
                            {positive ? (
                              <TrendingUpIcon
                                fontSize="small"
                                color="success"
                              />
                            ) : (
                              <TrendingDownIcon
                                fontSize="small"
                                color="error"
                              />
                            )}
                          </IconButton>
                        )}
                      </Box>
                    );
                  })}

                  <ButtonBase
                    sx={{
                      width: 215,
                      height: 41,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: shouldBeBlue ? "#1976d2" : "#CBD5E1",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      "&:hover": {
                        bgcolor: shouldBeBlue ? "#1565c0" : "#cbd5e1",
                      },
                    }}
                    onClick={() =>
                      setExplain({ id: model.id, name: model.name })
                    }
                  >
                    <Typography
                      variant="body2"
                      color={shouldBeBlue ? "#fff" : "text.primary"}
                    >
                      Explainability
                    </Typography>
                  </ButtonBase>
                </CardContent>
              </Card>
            );
          })}

          <Card
            variant="outlined"
            sx={{
              width: 215,
              height: 336,
              p: 2,
              borderRadius: 2,
              borderStyle: "dashed",
              borderColor: "#94A3B8",
              bgcolor: "#CBD5E1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Add sx={{ fontSize: 36 }} color="action" />
            <Typography variant="body2" color="text.secondary">
              Add Model
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                defaultValue=""
                displayEmpty
                sx={{
                  bgcolor: "background.paper",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#94A3B8",
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

      {explain && (
        <ExplainFrame
          modelName={explain.name}
          modelId={explain.id}
          onClose={() => setExplain(null)}
        />
      )}

      {popup && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1300,
            bgcolor: "rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setPopup(null)}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: "absolute",
              left: Math.min(popup.pos.x - 115, window.innerWidth - 250),
              top: Math.min(popup.pos.y - 71, window.innerHeight - 160),
            }}
          >
            <FvaVsStatsPopup
              modelId={popup.modelId}
              metricType={popup.type}
              onClose={() => setPopup(null)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
