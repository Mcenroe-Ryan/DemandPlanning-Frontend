import React, { useEffect, useState, useMemo } from "react";
import Add from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";

import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Alert,
  Skeleton,
  ButtonBase,
  Paper,
  CircularProgress,
  IconButton,
  Checkbox,
  Button,
  Popper,
  ClickAwayListener,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
} from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const metrics = [
  { id: "MAPE", label: "MAPE" },
  { id: "WMAPE", label: "WMAPE" },
  { id: "FVAvsStats", label: "FVA vs Stats" },
  { id: "FVAvsConsensus", label: "FVA vs Consensus" },
];

const transformModelData = (rows) =>
  rows
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

function GraphUpArrowIcon({ positive }) {
  return (
    <i
      className="bi bi-graph-up-arrow"
      style={{
        fontSize: 14,
        color: positive ? "#2e7d32" : "#d32f2f", 
        display: "inline-block",
        lineHeight: 1,
      }}
    />
  );
}

function AddModelDropdown({ selected = [], onChange }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/models`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => {
        setModels(data);
        if (onChange && data.length > 0) {
          const allModelIds = data.map((m) => m.id);
          onChange(allModelIds);
        }
      })
      .catch(() => setModels([]))
      .finally(() => setLoading(false));
  }, [onChange]);

  const filteredModels = useMemo(() => {
    if (!searchTerm) return models;
    return models.filter((m) =>
      m.model_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [models, searchTerm]);

  if (loading)
    return (
      <Typography sx={{ px: 2, py: 2, fontSize: 12 }}>
        Loading models…
      </Typography>
    );
  if (!models.length)
    return (
      <Typography sx={{ px: 2, py: 2, fontSize: 12 }}>
        No models found.
      </Typography>
    );

  return (
    <Box>
      <Box sx={{ p: 0.5, borderBottom: "1px solid #e0e0e0" }}>
        <TextField
          size="small"
          placeholder="Search models…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            sx: { fontSize: 13, height: 32, minHeight: 30 },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#e0e0e0",
              },
              "&:hover fieldset": {
                borderColor: "#1976d2",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1976d2",
              },
              fontSize: 13,
              height: 32,
              minHeight: 30,
              py: 0,
            },
          }}
        />
      </Box>
      <List dense sx={{ maxHeight: 140, overflow: "auto", py: 0 }}>
        {filteredModels.length === 0 ? (
          <ListItem>
            <ListItemText
              primary="No models match your search"
              primaryTypographyProps={{ fontSize: 12, color: "text.secondary" }}
            />
          </ListItem>
        ) : (
          filteredModels.map((m) => (
            <ListItem
              key={m.id}
              component={ButtonBase}
              onClick={() => {
                if (!onChange) return;
                const checked = selected.includes(m.id);
                onChange(
                  checked
                    ? selected.filter((id) => id !== m.id)
                    : [...selected, m.id]
                );
              }}
              sx={{ py: 0.5, minHeight: 28 }}
            >
              <ListItemIcon sx={{ minWidth: 30 }}>
                <Checkbox
                  checked={selected.includes(m.id)}
                  tabIndex={-1}
                  disableRipple
                  size="small"
                  sx={{ p: 0.25 }}
                />
              </ListItemIcon>
              <ListItemText
                primary={m.model_name}
                primaryTypographyProps={{ fontSize: 13 }}
              />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
}
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
      <Typography
        sx={{
          fontFamily: "Poppins",
          fontWeight: 500,
          fontStyle: "normal",
          fontSize: "14px",
          lineHeight: "100%",
          letterSpacing: "0.4px",
          color: "#334155",
          width: "851px",
          height: "21px",
          textAlign: "left",
          mb: 3,
        }}
      >
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
        <Stack direction="row" sx={{ flexGrow: 1, position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 16,
            }}
          >
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
                transform: "rotate(-90deg)",
                whiteSpace: "nowrap",
              }}
            >
              Feature
            </Typography>
          </Box>

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
              bottom: -12,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Impact
          </Typography>
        </Stack>
      )}
    </Paper>
  );
}

export default function ModelComparisonSection() {
  const [rows, setRows] = useState([]);
  const [loadErr, setLoadErr] = useState(null);
  const [busy, setBusy] = useState(true);
  const [explain, setExplain] = useState(null);
  const [popup, setPopup] = useState(null);
  const [selectedModels, setSelectedModels] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownClose = () => {
    setDropdownOpen(false);
    setAnchorEl(null);
  };

  if (busy) return <Skeleton variant="rectangular" width="100%" height={260} />;
  if (loadErr)
    return <Alert severity="error">Failed to load – {String(loadErr)}</Alert>;
  if (!rows.length)
    return <Alert severity="info">No model data available.</Alert>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#E2E8F0",
        p: 2,
        pt: 6,
        fontFamily: `"Poppins", sans-serif !important`,
      }}
    >
      <Stack direction="row" spacing={0.5}>
        <Box>
          <Box
            sx={{
              height: 122,
              p: 2,
              display: "flex",
              alignItems: "flex-end",
              position: "relative",
            }}
          >
            <Typography variant="subtitle2" sx={{ color: "#64748B" }}>
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
              <Box key={model.id} sx={{ position: "relative" }}>
                {isFirstCard && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -30,
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 10,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "100%",
                        letterSpacing: "0.15px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        width: 185,
                        height: 21,
                        color: "#3764A9",
                        bgcolor: "transparent",
                        p: 0,
                      }}
                    >
                      Recommended
                    </Typography>
                  </Box>
                )}

                <Card
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
                              <GraphUpArrowIcon positive={positive} />
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
                        gap: 1, 
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
                      <i 
                        className="bi bi-eye" 
                        style={{ 
                          fontSize: 14, 
                          color: shouldBeBlue ? "#fff" : "#475569" 
                        }} 
                      />
                      <Typography
                        variant="body2"
                        color={shouldBeBlue ? "#fff" : "text.primary"}
                      >
                        Explainability
                      </Typography>
                    </ButtonBase>
                  </CardContent>
                </Card>
              </Box>
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

            <Button
              variant="outlined"
              onClick={handleDropdownClick}
              endIcon={<ExpandMoreIcon />}
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                borderColor: "#94A3B8",
                color: "#334155",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#1976d2",
                  bgcolor: "background.paper",
                },
              }}
            >
              Select Models
            </Button>
            <Popper
              open={dropdownOpen}
              anchorEl={anchorEl}
              placement="bottom-start"
              transition
              style={{ zIndex: 1300 }}
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={200}>
                  <Paper
                    sx={{
                      minWidth: 170,
                      maxWidth: 210,
                      maxHeight: 220,
                      overflow: "hidden",
                      mt: 0.5,
                      boxShadow: 3,
                    }}
                  >
                    <ClickAwayListener onClickAway={handleDropdownClose}>
                      <Box>
                        <AddModelDropdown
                          selected={selectedModels}
                          onChange={setSelectedModels}
                        />
                      </Box>
                    </ClickAwayListener>
                  </Paper>
                </Fade>
              )}
            </Popper>
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
