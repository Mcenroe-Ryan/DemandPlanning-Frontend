import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  Container,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Dashboard from "./Dashboard";
import { AddNewProject } from "./AddNewProject";
import { DemandProjectMonth } from "./DemandPlanning";
import Layout from "./components/Layout";
import { ImportProfilesData } from "./ImportProfile";
import { AddNewProjectSpreadsheet } from "./AddProjectSpreadsheet";
import PermissionConsentDialog from "./components/SSO";

const Login = () => {
  const navigate = useNavigate();
  const [consentOpen, setConsentOpen] = useState(false);

  const loginData = {
    title: "Enter Into Play Ground",
    description:
      "All your Demand Forecast, Supply, Sales, Finance, Inventory, and Promotion in one place.",
    copyright: "© Copyright Cloud BC Labs. All Rights Reserved",
  };

  const handleSsoSignIn = () => setConsentOpen(true);
  const handleConsentAccept = () => {
    setConsentOpen(false);
    navigate("/dashboard");
  };
  const handleConsentCancel = () => setConsentOpen(false);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        background:
          "linear-gradient(72deg, rgba(14,66,164,1) 0%, rgba(103,156,255,1) 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box
        component="img"
        src="https://c.animaapp.com/VbjHLlVw/img/image-1.png"
        alt="Cloud Top Left"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 600,
          height: 450,
          objectFit: "cover",
        }}
      />
      <Box
        component="img"
        src="https://c.animaapp.com/VbjHLlVw/img/image-2@2x.png"
        alt="Cloud Bottom Right"
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 313,
          height: 313,
          objectFit: "cover",
        }}
      />

      <Paper
        elevation={4}
        sx={{
          width: 1107,
          height: 626,
          borderRadius: 3,
          backgroundColor: "rgba(204, 192, 192, 0.1)",
          backdropFilter: "blur(17.5px)",
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: 411,
            height: 552,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            m: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack alignItems="center" spacing={2} sx={{ width: 363 }}>
            <Box
              component="img"
              src="https://c.animaapp.com/VbjHLlVw/img/background@2x.png"
              alt="Login Illustration"
              sx={{ width: 267, height: 251 }}
            />
            <Typography
              variant="h6"
              fontWeight={800}
              color="#FFFFFF"
              textAlign="center"
            >
              {loginData.title}
            </Typography>
            <Typography variant="body2" color="#FFFFFF" textAlign="center">
              {loginData.description}
            </Typography>
          </Stack>
        </Paper>

        <Box
          sx={{
            flex: 1,
            pr: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "translateY(-32px)", 
          }}
        >
          <Stack spacing={3} sx={{ width: 360, maxWidth: "90%" }}>
            <Typography variant="h6" fontWeight={600} color="#FFFFFF">
              Signin
            </Typography>

            <Stack spacing={1.5}>
              <Typography variant="body1" fontWeight={600} color="#FFFFFF">
                Account Number
              </Typography>
              <TextField
                fullWidth
                placeholder="Ex. 0000 9999 XXXX"
                variant="outlined"
                size="small"
                sx={{ backgroundColor: "#FFFFFF", borderRadius: 1 }}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="body1" fontWeight={600} color="#FFFFFF">
                Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="**********"
                variant="outlined"
                size="small"
                sx={{ backgroundColor: "#FFFFFF", borderRadius: 1 }}
              />
            </Stack>

            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "primary.main",
                borderRadius: 1,
                py: 1.5,
                textTransform: "none",
              }}
              onClick={() => navigate("/dashboard")}
            >
              Sign in
            </Button>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                flex={1}
                height={1}
                sx={{ bgcolor: "rgba(255,255,255,0.5)" }}
              />
              <Typography variant="caption" color="#FFFFFF">
                Or
              </Typography>
              <Box
                flex={1}
                height={1}
                sx={{ bgcolor: "rgba(255,255,255,0.5)" }}
              />
            </Stack>

            <Button
              variant="contained"
              fullWidth
              sx={{ borderRadius: 1, py: 1.5, textTransform: "none" }}
              onClick={handleSsoSignIn}
            >
              Sign in with SSO
            </Button>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Link
                href="#"
                underline="always"
                color="#FFFFFF"
                variant="caption"
              >
                Forgot your password?
              </Link>
              <Link
                component="button"
                underline="always"
                color="#FFFFFF"
                variant="caption"
                onClick={() => navigate("/signup")}
              >
                Signup now
              </Link>
            </Box>
          </Stack>
        </Box>
      </Paper>

      <PermissionConsentDialog
        open={consentOpen}
        appName="SSO for Demand Planning"
        onAccept={handleConsentAccept}
        onCancel={handleConsentCancel}
      />
    </Box>
  );
};

const LoginSignUp = () => {
  const navigate = useNavigate();
  const [consentOpen, setConsentOpen] = useState(false);

  const industryTypes = [
    "Manufacturing",
    "Retail",
    "Technology",
    "Healthcare",
    "Finance",
  ];

  const handleSsoSignUp = () => setConsentOpen(true);
  const handleConsentAccept = () => {
    setConsentOpen(false);
    navigate("/verify");
  };
  const handleConsentCancel = () => setConsentOpen(false);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        background:
          "linear-gradient(72deg, rgba(14,66,164,1) 0%, rgba(103,156,255,1) 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src="https://c.animaapp.com/Xt0WpHb0/img/image-1.png"
        alt="Cloud top left"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 600,
          height: 450,
          objectFit: "cover",
          zIndex: 1,
        }}
      />
      <Box
        component="img"
        src="https://c.animaapp.com/Xt0WpHb0/img/image-2@2x.png"
        alt="Cloud bottom right"
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 313,
          height: 313,
          objectFit: "cover",
          zIndex: 1,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        <Paper
          elevation={4}
          sx={{
            width: 1107,
            height: 626,
            mx: "auto",
            display: "flex",
            borderRadius: 2,
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: 411,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255, 255, 255, 0.5)",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Box sx={{ width: 285, height: 200, position: "relative" }}>
              <Box
                component="img"
                src="https://c.animaapp.com/Xt0WpHb0/img/background@2x.png"
                alt="Signup Illustration"
                sx={{
                  width: 221,
                  height: 179,
                  position: "absolute",
                  top: 13,
                  left: 32,
                }}
              />
            </Box>
            <Typography
              variant="h6"
              fontWeight={800}
              color="#FFFFFF"
              textAlign="center"
              mt={3}
            >
              Get Start Now
            </Typography>
            <Typography
              variant="body2"
              color="#FFFFFF"
              textAlign="center"
              mt={1}
            >
              All your Demand Forecast, Supply, Sales, Finance, Inventory, and
              Promotion in one place.
            </Typography>
          </Paper>

          <Box sx={{ flex: 1, p: 5 }}>
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight={600} color="#FFFFFF">
                Signup
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="First Name"
                    placeholder="First Name"
                    fullWidth
                    size="small"
                    sx={{ bgcolor: "#FFFFFF", borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Last Name"
                    placeholder="Last Name"
                    fullWidth
                    size="small"
                    sx={{ bgcolor: "#FFFFFF", borderRadius: 1 }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Mobile Number"
                    placeholder="Mobile Number"
                    fullWidth
                    size="small"
                    sx={{ bgcolor: "#FFFFFF", borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Email Address"
                    placeholder="Email Address"
                    fullWidth
                    size="small"
                    sx={{ bgcolor: "#FFFFFF", borderRadius: 1 }}
                  />
                </Grid>
              </Grid>

              <TextField
                label="Company Name"
                placeholder="Enter company name"
                fullWidth
                size="small"
                sx={{ bgcolor: "#FFFFFF", borderRadius: 1 }}
              />

              <Select
                displayEmpty
                defaultValue=""
                fullWidth
                size="small"
                IconComponent={KeyboardArrowDownIcon}
                sx={{ bgcolor: "#FFFFFF", borderRadius: 1 }}
                renderValue={(selected) =>
                  selected ? (
                    selected
                  ) : (
                    <Typography color="text.secondary">
                      Select Industry Type
                    </Typography>
                  )
                }
              >
                {industryTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>

              <Button
                variant="contained"
                fullWidth
                sx={{ py: 1.5, textTransform: "none", borderRadius: 1 }}
                onClick={() => navigate("/verify")}
              >
                Sign up
              </Button>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  flex={1}
                  height={1}
                  sx={{ bgcolor: "rgba(255,255,255,0.5)" }}
                />
                <Typography variant="caption" color="#FFFFFF">
                  Or
                </Typography>
                <Box
                  flex={1}
                  height={1}
                  sx={{ bgcolor: "rgba(255,255,255,0.5)" }}
                />
              </Stack>

              <Button
                variant="contained"
                fullWidth
                sx={{ py: 1.5, textTransform: "none", borderRadius: 1 }}
                onClick={handleSsoSignUp}
              >
                Sign up with SSO
              </Button>

              <Typography variant="caption" color="#FFFFFF" textAlign="center">
                Already have an account?{" "}
                <Link href="/" underline="always" color="#FFFFFF">
                  Sign in
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>

        <Typography
          variant="caption"
          color="#FFFFFF"
          sx={{
            position: "absolute",
            bottom: -28,
            width: "100%",
            textAlign: "center",
          }}
        >
          © Copyright Cloud BC Labs. All Rights Reserved
        </Typography>
      </Container>

      <PermissionConsentDialog
        open={consentOpen}
        appName="SSO for Demand Planning"
        onAccept={handleConsentAccept}
        onCancel={handleConsentCancel}
      />
    </Box>
  );
};
const LoginVerify = () => {
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const next = [...otpValues];
      next[index] = value.replace(/\D/g, ""); 
      setOtpValues(next);

      if (value && index < otpValues.length - 1) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleVerify = () => {
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        background:
          "linear-gradient(72deg, rgba(14,66,164,1) 0%, rgba(103,156,255,1) 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", top: 0, left: 0 }}>
        <img
          src="https://c.animaapp.com/VnOr3e3w/img/image-1.png"
          alt="Cloud"
          style={{ width: 600, height: 450, objectFit: "cover" }}
        />
      </Box>
      <Box sx={{ position: "absolute", bottom: 0, right: 0 }}>
        <img
          src="https://c.animaapp.com/VnOr3e3w/img/image-2@2x.png"
          alt="Cloud"
          style={{ width: 313, height: 313, objectFit: "cover" }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box
          sx={{
            width: "100%",
            height: 626,
            backgroundColor: "rgba(204, 192, 192, 0.1)",
            borderRadius: 2,
            backdropFilter: "blur(17.5px)",
            display: "flex",
            justifyContent: "space-between",
            padding: 4,
          }}
        >
          <Box
            sx={{
              width: 411,
              height: 552,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 3,
            }}
          >
            <Box sx={{ width: 217, height: 173, position: "relative", mb: 3 }}>
              <img
                src="https://c.animaapp.com/VnOr3e3w/img/background@2x.png"
                alt="Verification"
                style={{
                  width: 206,
                  height: 163,
                  position: "absolute",
                  top: 4,
                  left: 6,
                }}
              />
            </Box>
            <Stack spacing={2} alignItems="center" width="100%">
              <Typography
                variant="h6"
                fontWeight={800}
                color="#FFFFFF"
                textAlign="center"
              >
                Verify Your Identity
              </Typography>
              <Typography variant="body2" color="#FFFFFF" textAlign="center">
                We've just sent a text message with your security code on the
                number +91 ********26
              </Typography>
            </Stack>
          </Box>

          <Box
            sx={{
              width: 409,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 2,
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight={800} color="#FFFFFF">
                Verify Your Identity
              </Typography>
              <Typography variant="body2" color="#FFFFFF">
                We've just sent a text message with your security code on the
                number +91 ********26
              </Typography>

              <Stack direction="row" spacing={2} width="200px">
                {otpValues.map((val, idx) => (
                  <TextField
                    key={idx}
                    id={`otp-input-${idx}`}
                    value={val}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    variant="outlined"
                    inputProps={{
                      maxLength: 1,
                      inputMode: "numeric",
                      style: { textAlign: "center", padding: 8 },
                    }}
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                        height: 38,
                      },
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleVerify();
                    }}
                  />
                ))}
              </Stack>

              <Button
                variant="contained"
                sx={{ textTransform: "none", borderRadius: 1, py: 1.2 }}
                onClick={handleVerify}
              >
                Verify
              </Button>

              <Link
                component="button"
                variant="body2"
                underline="always"
                color="#FFFFFF"
                sx={{ fontSize: 12 }}
                onClick={() => setOtpValues(["", "", "", ""])}
              >
                Resend OTP
              </Link>
            </Stack>
          </Box>
        </Box>

        <Typography
          variant="caption"
          color="#FFFFFF"
          sx={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            textAlign: "center",
          }}
        >
          © Copyright Cloud BC Labs. All Rights Reserved
        </Typography>
      </Container>
    </Box>
  );
};

const AuthPages = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<LoginSignUp />} />
        <Route path="/verify" element={<LoginVerify />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addNewProject" element={<AddNewProject />} />
        <Route path="/demand" element={<DemandProjectMonth />} />
        <Route path="/import-load-data" element={<ImportProfilesData />} />
        <Route path="/spreadsheet" element={<AddNewProjectSpreadsheet />} />
      </Routes>
    </Layout>
  </Router>
);

export default AuthPages;
