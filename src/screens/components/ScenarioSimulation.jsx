import React, { useMemo, useState } from "react";
import {
  Box,
  Stack,
  Button,
  Chip,
  Typography,
  Card,
  CardContent,
  Divider,
  Slider,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  LabelList,
  ResponsiveContainer,
  Cell,
} from "recharts";

const card = {
  backgroundColor: "#fff",
  borderRadius: 8,
  border: "1px solid #E5E7EB",
  boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
};

const kGreen = "#16a34a";
const kBlue = "#3b82f6";

const PANELS = [
  {
    id: "bhuj",
    name: "Bhuj",
    sliderMin: 500,
    sliderMax: 5036,
    qty: 2456,
    stats: { distance: 197, excess: 7112, inv: 10668, demand: 4949, eta: 4 },
    wf: [
      { name: "Projected\nRevenue", v: 4 },
      { name: "Additional\nRevenue", v: 2.5 },
      { name: "Logistic\nCost", v: -1 },
      { name: "Labor\nCost", v: -0.5 },
      { name: "Transaction\nCost", v: -0.5 },
    ],
    totals: { revenue: "₹4L", profit: "₹2L" },
    highlight: true,
  },
  {
    id: "ahm",
    name: "Ahmedabad",
    sliderMin: 500,
    sliderMax: 5011,
    qty: 0,
    stats: { distance: 263, excess: 7891, inv: 11836, demand: 5036, eta: 6 },
    wf: [
      { name: "Projected\nRevenue", v: 4 },
      { name: "Additional\nRevenue", v: 2.5 },
      { name: "Logistic\nCost", v: -2 },
      { name: "Labor\nCost", v: -0.5 },
      { name: "Transaction\nCost", v: -0.5 },
    ],
    totals: { revenue: "₹4L", profit: "₹1L" },
  },
  {
    id: "bhv",
    name: "Bhavnagar",
    sliderMin: 500,
    sliderMax: 2065,
    qty: 0,
    stats: { distance: 317, excess: 8943, inv: 13414, demand: 5140, eta: 8 },
    wf: [
      { name: "Projected\nRevenue", v: 4 },
      { name: "Additional\nRevenue", v: 2.5 },
      { name: "Logistic\nCost", v: -1.2 },
      { name: "Labor\nCost", v: -0.3 },
      { name: "Transaction\nCost", v: -0.5 },
    ],
    totals: { revenue: "₹4L", profit: "₹3K" },
  },
];

const buildWaterfall = (steps) => {
  let run = steps[0].v;
  const out = [
    { name: steps[0].name, base: 0, delta: Math.abs(steps[0].v), raw: steps[0].v },
  ];
  for (let i = 1; i < steps.length; i += 1) {
    const next = run + steps[i].v;
    const base = Math.min(run, next);
    out.push({ name: steps[i].name, base, delta: Math.abs(steps[i].v), raw: steps[i].v });
    run = next;
  }
  out.push({ name: "Simulated\nRevenue", base: 0, delta: Math.abs(run), raw: run, total: true });
  return out;
};
const barFill = (d) => (d.total ? "#93c5fd" : d.raw >= 0 ? "#86efac" : "#fca5a5");

function StatRow({ label, value, suffix }) {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.75 }}>
      <Typography sx={{ fontSize: 13, color: "#334155" }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, color: "#111827", fontWeight: 600 }}>
        {value}{" "}
        {suffix ? <Typography component="span" sx={{ color: "#64748b" }}>{suffix}</Typography> : null}
      </Typography>
    </Stack>
  );
}

const TwoLineTick = ({ x, y, payload }) => {
  const raw = String(payload?.value ?? "").replace(/\s*\n\s*/g, " ").trim();
  const parts = raw.split(/\s+/);
  const first = parts[0] ?? "";
  const second = parts[1] ?? "";
  const size = 9;
  const lineGap = 10;

  return (
    <text x={x} y={y} textAnchor="middle" fill="#475569" fontSize={size}>
      <tspan x={x} dy="0">
        {first}
      </tspan>
      {second && <tspan x={x} dy={lineGap}>{second}</tspan>}
    </text>
  );
};

function LocationPanel({ panel }) {
  const [qty, setQty] = useState(panel.qty);
  const wfData = useMemo(() => buildWaterfall(panel.wf), [panel.wf]);

  return (
    <Card
      sx={{
        ...card,
        flex: {
          xs: "1 1 100%",
          sm: "1 1 calc(50% - 10px)",
          lg: "1 1 calc(33.333% - 10px)",
        },
        minWidth: 0, 
        borderColor: panel.highlight ? kBlue : "#E5E7EB",
        boxShadow: panel.highlight ? `0 0 0 3px rgba(59,130,246,.15)` : undefined,
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        <Box
          sx={{
            mb: 1,
            px: 1.25,
            py: 0.75,
            borderRadius: 12,
            bgcolor: "#e7f0ff",
            border: "1px solid #cfe1ff",
            textAlign: "center",
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          {panel.name}
        </Box>

        <Box sx={{ px: 0.5, mb: 1.25 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.25 }}>
            <Typography sx={{ fontSize: 11, color: "#64748b" }}>{panel.sliderMin}</Typography>
            <Typography sx={{ fontSize: 11, color: "#64748b" }}>{panel.sliderMax}</Typography>
          </Stack>
          <Slider
            size="small"
            value={Math.min(qty, panel.sliderMax)}
            min={panel.sliderMin}
            max={panel.sliderMax}
            onChange={(_, v) => {
              const val = Array.isArray(v) ? v[0] : v;
              setQty(Number(val));
            }}
            sx={{
              "& .MuiSlider-thumb": { width: 12, height: 12 },
              "& .MuiSlider-rail": { opacity: 1, bgcolor: "#E5E7EB" },
            }}
          />
          <TextField
            size="small"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value) || 0)}
            fullWidth
            sx={{
              mt: 0.75,
              "& .MuiOutlinedInput-input": { py: 0.6, fontSize: 13 },
            }}
          />
        </Box>

        <Divider />
        <Box sx={{ py: 1 }}>
          <StatRow label="Distance" value={panel.stats.distance} suffix="(km)" />
          <StatRow label="Excess Qty" value={panel.stats.excess} />
          <StatRow label="Inventory Level" value={panel.stats.inv} />
          <StatRow label="Next Week Demand" value={panel.stats.demand} />
          <StatRow label="ETA" value={panel.stats.eta} />
        </Box>

        <Box sx={{ height: 260, pt: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={wfData} margin={{ bottom: 10 }}>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis
                dataKey="name"
                tick={<TwoLineTick />}
                height={26}
                tickMargin={4}
                interval={0}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 7]}
                tick={{ fontSize: 10, fill: "#475569" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
                label={{
                  value: "₹ (Lakhs)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 8,
                  fill: "#64748b",
                  fontSize: 10,
                }}
              />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Bar dataKey="base" stackId="wf" fill="transparent" isAnimationActive={false} />
              <Bar dataKey="delta" stackId="wf" isAnimationActive={false}>
                {wfData.map((d, i) => (
                  <Cell key={i} fill={barFill(d)} />
                ))}
                <LabelList
                  dataKey="raw"
                  position="top"
                  formatter={(v) => `${v > 0 ? "+" : ""}${v}L`}
                  style={{ fontSize: 10, fill: "#111827", fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.25 }}>
          <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>
            Revenue:{" "}
            <Typography component="span" sx={{ fontWeight: 800 }}>
              {panel.totals.revenue}
            </Typography>
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              color: panel.highlight ? kGreen : "#eab308",
              fontSize: 14,
            }}
          >
            Profit:{" "}
            <Typography component="span" sx={{ fontWeight: 800 }}>
              {panel.totals.profit}
            </Typography>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function NewRecommendationScreen({ onBack }) {
  const [chips, setChips] = useState(["Locations", "Bhuj", "Ahmedabad", "Bhavnagar"]);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("md"));

  const handleBack = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  return (
    <Box sx={{ bgcolor: "#E2E8F0", minHeight: "100vh", p: 12 / 12 }}>
      <Box sx={{ maxWidth: 1800, mx: "auto", position: "relative" }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ flex: 1 }}>
            {chips.map((c, i) => (
              <Chip
                key={`${c}-${i}`}
                label={c}
                onDelete={i > 0 ? () => setChips(chips.filter((_, idx) => idx !== i)) : undefined}
                sx={{
                  bgcolor: "#f1f5f9",
                  border: "1px solid #E2E8F0",
                  height: 28,
                  "& .MuiChip-label": { px: 1, fontSize: 13 },
                }}
              />
            ))}
          </Stack>
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: "none", borderRadius: 2, px: 2, ml: 1 }}
            onClick={handleBack}
          >
            Back
          </Button>
        </Stack>

        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 38,
            width: { xs: "100%", lg: "33.333%" },
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: "#2563eb",
              fontSize: 20,
              background: "#E2E8F0",
              px: 2,
              py: 0.5,
              borderRadius: 12,
              boxShadow: "0 2px 4px rgba(59,130,246,0.05)",
            }}
          >
            Recommended
          </Typography>
        </Box>

        <Stack
          direction={isSm ? "column" : "row"}
          spacing={1.25}
          alignItems="stretch"
          sx={{ mt: 6, flexWrap: "wrap" }}
        >
          {PANELS.map((p) => (
            <LocationPanel key={p.id} panel={p} />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
