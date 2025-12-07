"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import {
  CheckCircle,
  CalendarMonth,
  Insights,
  PlayArrow,
  Flag,
  Bolt,
  Shield,
  Timer,
  Group,
  Sync,
} from "@mui/icons-material";
import NavBar from "./components/NavBar";
import { getAppTheme } from "./theme";

const featureCards = [
  {
    title: "Weekly Planner",
    copy: "Organize your next seven days with due dates and priorities in one glance.",
    href: "/planner",
    icon: <CalendarMonth color="primary" />,
  },
  {
    title: "Insights",
    copy: "See completion rates, category balance, and priority mix to stay on course.",
    href: "/insights",
    icon: <Insights color="primary" />,
  },
  {
    title: "Focus Mode",
    copy: "Pick one task, start a timer, and protect your attention.",
    href: "/focus",
    icon: <PlayArrow color="primary" />,
  },
];

const stats = [
  { label: "Avg. weekly completion", value: "82%" },
  { label: "Tasks organized", value: "24k+" },
  { label: "Focus sessions launched", value: "12k+" },
  { label: "Teams & solopreneurs", value: "5k+" },
];

const pillarList = [
  {
    icon: <Bolt color="primary" />,
    title: "Capture fast",
    copy: "Add tasks with notes, due dates, and priorities in seconds.",
  },
  {
    icon: <CalendarMonth color="primary" />,
    title: "Plan visually",
    copy: "A week board that reveals gaps and balance.",
  },
  {
    icon: <Timer color="primary" />,
    title: "Protect focus",
    copy: "One-task timer keeps attention locked in.",
  },
  {
    icon: <Insights color="primary" />,
    title: "Know your pace",
    copy: "Completion and priority mix show progress.",
  },
  {
    icon: <Shield color="primary" />,
    title: "Stay reliable",
    copy: "Simple, consistent UI that works in light/dark.",
  },
  {
    icon: <Sync color="primary" />,
    title: "Always aligned",
    copy: "Planner, Focus, and Insights share the same data.",
  },
];

const useCases = [
  {
    title: "Personal",
    copy: "Household, errands, workouts, and goals stay visible with overdue alerts.",
  },
  {
    title: "Work",
    copy: "Prioritize deliverables, meetings, and docs with due dates and focus sessions.",
  },
  {
    title: "Side projects",
    copy: "Context notes + due dates + insights keep shipping predictable.",
  },
  {
    title: "Students",
    copy: "Assignments, study blocks, and revision plans inside one weekly board.",
  },
];

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null,
  );
  const theme = useMemo(() => getAppTheme(isDarkMode), [isDarkMode]);

  const sectionPaperSx = {
    backgroundColor: isDarkMode ? "#0f1f1a" : "#ffffff",
    border: "1px solid",
    borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
  };

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem("darkMode", JSON.stringify(next));
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
    if (storedUser) {
      setUser(storedUser);
    }
    const prefersDarkMode = JSON.parse(
      localStorage.getItem("darkMode") || "true",
    );
    setIsDarkMode(prefersDarkMode);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: isDarkMode
            ? "radial-gradient(circle at 20% 20%, #0a3d2c 0, #060f0b 35%, #040907 100%)"
            : "radial-gradient(circle at 12% 18%, #d9f2e5 0, #eef7f2 45%, #f5f8f6 100%)",
          color: isDarkMode ? "#e6f3ec" : "#0d2621",
        }}
      >
        <NavBar
          user={user}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={logout}
        />

        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                Flowlist — organize with intent
              </Typography>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                From idea to done with a calm, guided workspace.
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, mb: 3 }}>
                Capture tasks with context, map your week, and use focus mode to
                finish the right thing first. Insights keep your balance between
                work, personal, and everything between.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  href="/home"
                  variant="contained"
                  size="large"
                  startIcon={<CheckCircle />}
                >
                  Go to tasks
                </Button>
                <Button
                  component={Link}
                  href={user ? "/planner" : "/auth/register"}
                  variant="outlined"
                  size="large"
                >
                  {user ? "Plan my week" : "Create an account"}
                </Button>
              </Stack>
              <Stack direction="row" spacing={1.5} mt={3} flexWrap="wrap">
                <Chip
                  icon={<CalendarMonth color="primary" />}
                  label="Due dates & priorities"
                  variant="outlined"
                />
                <Chip
                  icon={<Flag color="error" />}
                  label="Overdue alerts"
                  variant="outlined"
                />
                <Chip
                  icon={<Insights color="primary" />}
                  label="Completion analytics"
                  variant="outlined"
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: isDarkMode
                    ? "linear-gradient(180deg, #0f1f1a, #12241d)"
                    : "linear-gradient(180deg, #ffffff, #f1f7f4)",
                  border: "1px solid",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(0,0,0,0.08)",
                }}
              >
                <Typography variant="h6" fontWeight={800} gutterBottom>
                  Preview your day
                </Typography>
                <Stack spacing={1.5}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      ...sectionPaperSx,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle1" fontWeight={700}>
                        Complete onboarding deck
                      </Typography>
                      <Chip label="High" color="error" size="small" />
                    </Stack>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Chip size="small" label="Work" variant="outlined" />
                      <Chip
                        size="small"
                        label="Due today"
                        icon={<CalendarMonth />}
                        variant="outlined"
                      />
                    </Stack>
                  </Paper>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      ...sectionPaperSx,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle1" fontWeight={700}>
                        Review finances
                      </Typography>
                      <Chip label="Medium" color="warning" size="small" />
                    </Stack>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Chip size="small" label="Finance" variant="outlined" />
                      <Chip size="small" label="Tomorrow" variant="outlined" />
                    </Stack>
                  </Paper>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 4 }}>
            {featureCards.map((card) => (
              <Grid item xs={12} md={4} key={card.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: "100%",
                    ...sectionPaperSx,
                  }}
                >
                  <Stack spacing={1}>
                    {card.icon}
                    <Typography variant="h6" fontWeight={800}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {card.copy}
                    </Typography>
                    <Button
                      component={Link}
                      href={card.href}
                      variant="text"
                      sx={{ alignSelf: "flex-start" }}
                    >
                      Open
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2} sx={{ mt: 4 }}>
            {stats.map((stat) => (
              <Grid item xs={12} sm={6} md={3} key={stat.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    textAlign: "center",
                    ...sectionPaperSx,
                  }}
                >
                  <Typography variant="h4" fontWeight={800}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, ...sectionPaperSx }}>
                <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                  Why Flowlist
                </Typography>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                  Calm productivity, zero noise
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, mb: 2 }}>
                  Structure your day with one place for capture, planning, focus
                  sessions, and insights. Flowlist keeps priorities visible and
                  removes the guesswork of what to do next.
                </Typography>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle color="success" />
                    <Typography variant="body2">
                      Due dates and priorities surface the right tasks.
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonth color="primary" />
                    <Typography variant="body2">
                      Weekly board shows the whole pipeline at a glance.
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Insights color="primary" />
                    <Typography variant="body2">
                      Analytics keep balance between work, personal, and focus.
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, ...sectionPaperSx }}>
                <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                  Workflow
                </Typography>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                  Capture → Plan → Focus → Review
                </Typography>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label="1" color="primary" sx={{ color: "#ffffff" }} />
                    <Typography variant="body2">
                      Capture tasks with notes, priority, and due date on Home.
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label="2" color="primary" sx={{ color: "#ffffff" }} />
                    <Typography variant="body2">
                      Plan the week in Planner and spot gaps.
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label="3" color="primary" sx={{ color: "#ffffff" }} />
                    <Typography variant="body2">
                      Enter Focus mode to timebox a single task.
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label="4" color="primary" sx={{ color: "#ffffff" }} />
                    <Typography variant="body2">
                      Review Insights to celebrate progress and rebalance.
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, ...sectionPaperSx }}>
                <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                  Pillars
                </Typography>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                  Built to keep you moving
                </Typography>
                <Grid container spacing={2}>
                  {pillarList.map((pillar) => (
                    <Grid item xs={12} sm={6} md={4} key={pillar.title}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          height: "100%",
                          backgroundColor: isDarkMode ? "#14261f" : "#f8fbf9",
                          border: "1px solid",
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(0,0,0,0.04)",
                        }}
                      >
                        <Stack spacing={1}>
                          {pillar.icon}
                          <Typography variant="subtitle1" fontWeight={800}>
                            {pillar.title}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.85 }}>
                            {pillar.copy}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} md={7}>
              <Paper elevation={0} sx={{ p: 3, ...sectionPaperSx }}>
                <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                  Use cases
                </Typography>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                  Flowlist fits your day
                </Typography>
                <Grid container spacing={2}>
                  {useCases.map((use) => (
                    <Grid item xs={12} sm={6} key={use.title}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          height: "100%",
                          backgroundColor: isDarkMode ? "#14261f" : "#f8fbf9",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={800}>
                          {use.title}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.85 }}>
                          {use.copy}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper elevation={0} sx={{ p: 3, ...sectionPaperSx }}>
                <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                  Teams & individuals
                </Typography>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                  Keep everyone aligned
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
                  Flowlist keeps personal tasks and team deliverables in the
                  same rhythm—so switching contexts never breaks the flow.
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Group color="primary" />
                    <Typography variant="body2">
                      Shared priorities stay visible week to week.
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Sync color="primary" />
                    <Typography variant="body2">
                      Planner, Focus, and Insights pull from one source of
                      truth.
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Shield color="primary" />
                    <Typography variant="body2">
                      Consistent UI for light/dark keeps you steady anywhere.
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              mt: 4,
              borderRadius: 3,
              ...sectionPaperSx,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                  Ready to move faster with less chaos?
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Join Flowlist and keep every task connected to a plan, a
                  session, and a measurable outcome. No more scattered notes or
                  endless tabs.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Button
                    component={Link}
                    href="/auth/register"
                    variant="contained"
                    startIcon={<CheckCircle />}
                  >
                    Create account
                  </Button>
                  <Button
                    component={Link}
                    href="/auth/login"
                    variant="outlined"
                  >
                    I already have one
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
