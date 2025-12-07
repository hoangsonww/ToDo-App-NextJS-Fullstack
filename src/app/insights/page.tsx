"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Paper,
  Grid,
  Typography,
  Stack,
  Chip,
  LinearProgress,
  Divider,
  Button,
} from "@mui/material";
import {
  Insights,
  CheckCircle,
  Flag,
  CalendarMonth,
  Refresh,
} from "@mui/icons-material";
import NavBar from "../components/NavBar";
import { getAppTheme } from "../theme";
import { TodoItem } from "@/types/todo";

const parseDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export default function InsightsPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null,
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useMemo(() => getAppTheme(isDarkMode), [isDarkMode]);
  const router = useRouter();

  const sectionPaperSx = {
    backgroundColor: isDarkMode ? "#0f1f1a" : "#ffffff",
    border: "1px solid",
    borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
  };

  const chipTone = isDarkMode
    ? {
        backgroundColor: "rgba(255,255,255,0.08)",
        color: "#eaf7f0",
        borderColor: "rgba(255,255,255,0.2)",
      }
    : {};

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem("darkMode", JSON.stringify(next));
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/auth/login");
  };

  const fetchTodos = async (userId: number, showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch(`/api/todos?userId=${userId}`);
      const data: TodoItem[] = await response.json();
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    const storedDarkMode = JSON.parse(
      localStorage.getItem("darkMode") || "true",
    );
    setIsDarkMode(storedDarkMode);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
    if (!storedUser) {
      router.push("/auth/login");
      return;
    }
    setUser(storedUser);
    fetchTodos(storedUser.id, true);
  }, [router]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const todayEnd = useMemo(() => {
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return end;
  }, [today]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const overdue = todos.filter((t) => {
      const date = parseDate(t.dueDate);
      return date && date < today && !t.completed;
    }).length;
    const todayCount = todos.filter((t) => {
      const date = parseDate(t.dueDate);
      return (
        date &&
        date.getTime() >= today.getTime() &&
        date.getTime() <= todayEnd.getTime() &&
        !t.completed
      );
    }).length;
    const highPriority = todos.filter(
      (t) => !t.completed && (t.priority || "medium") === "high",
    ).length;

    const categoryMap: Record<string, number> = {};
    todos.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + 1;
    });

    const priorityMap = {
      high: todos.filter((t) => (t.priority || "medium") === "high").length,
      medium: todos.filter((t) => (t.priority || "medium") === "medium").length,
      low: todos.filter((t) => (t.priority || "medium") === "low").length,
    };

    return {
      total,
      completed,
      active,
      overdue,
      todayCount,
      highPriority,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
      categoryMap,
      priorityMap,
    };
  }, [todos, today, todayEnd]);

  const categoryBreakdown = useMemo(
    () =>
      Object.entries(stats.categoryMap)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count),
    [stats.categoryMap],
  );

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
          transition: "background 0.3s ease",
        }}
      >
        <NavBar
          user={user}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={logout}
        />

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              background: isDarkMode
                ? "linear-gradient(135deg, #0f3326, #0d5a3f)"
                : "linear-gradient(135deg, #0f8f5f, #0a6c45)",
              color: "#ffffff",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                  Insight dashboard
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Spot patterns across categories and priorities. Celebrate
                  progress and surface the next best action.
                </Typography>
                <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                  <Chip
                    icon={<CheckCircle sx={{ color: "#b2f5ea" }} />}
                    label={`${stats.completionRate}% complete`}
                    sx={{
                      color: "#e9fffa",
                      backgroundColor: "rgba(255,255,255,0.12)",
                    }}
                  />
                  <Chip
                    icon={<CalendarMonth sx={{ color: "#b2f5ea" }} />}
                    label={`${stats.todayCount} due today`}
                    sx={{
                      color: "#e9fffa",
                      backgroundColor: "rgba(255,255,255,0.12)",
                    }}
                  />
                  <Chip
                    icon={<Flag sx={{ color: "#b2f5ea" }} />}
                    label={`${stats.highPriority} high-priority`}
                    sx={{
                      color: "#e9fffa",
                      backgroundColor: "rgba(255,255,255,0.12)",
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1.5} alignItems="flex-end">
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Refresh />}
                    onClick={() => fetchTodos(user?.id || 0, true)}
                    sx={{ color: "#ffffff" }}
                  >
                    Refresh data
                  </Button>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      width: "100%",
                      backgroundColor: "rgba(255,255,255,0.12)",
                      color: "#ffffff",
                    }}
                  >
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Completion rate
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={stats.completionRate}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "rgba(255,255,255,0.2)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#b2f5ea",
                        },
                      }}
                    />
                    <Typography variant="caption">
                      {stats.completed} of {stats.total} tasks
                    </Typography>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {loading ? (
            <Paper elevation={0} sx={{ p: 3, ...sectionPaperSx }}>
              <LinearProgress />
            </Paper>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: "100%",
                    ...sectionPaperSx,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <Insights color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                      Category breakdown
                    </Typography>
                  </Stack>
                  <Stack spacing={1.5}>
                    {categoryBreakdown.length === 0 && (
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Add tasks to see insights.
                      </Typography>
                    )}
                    {categoryBreakdown.slice(0, 6).map((entry) => {
                      const percent = stats.total
                        ? Math.round((entry.count / stats.total) * 100)
                        : 0;
                      return (
                        <Box key={entry.category}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="subtitle2" fontWeight={700}>
                              {entry.category}
                            </Typography>
                            <Typography variant="caption">
                              {entry.count} · {percent}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={percent}
                            sx={{ mt: 0.5, height: 10, borderRadius: 5 }}
                          />
                        </Box>
                      );
                    })}
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      ...sectionPaperSx,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={1}
                    >
                      <Flag color="error" />
                      <Typography variant="h6" fontWeight={700}>
                        Priority mix
                      </Typography>
                    </Stack>
                    <Grid container spacing={2}>
                      {(["high", "medium", "low"] as const).map((priority) => {
                        const totalForPriority =
                          stats.priorityMap[priority] || 0;
                        const percent = stats.total
                          ? Math.round((totalForPriority / stats.total) * 100)
                          : 0;
                        return (
                          <Grid item xs={12} sm={4} key={priority}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                backgroundColor: isDarkMode
                                  ? "#14261f"
                                  : "#f8fbf9",
                                height: "100%",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                fontWeight={700}
                                gutterBottom
                              >
                                {priority.toUpperCase()}
                              </Typography>
                              <Typography variant="h5" fontWeight={800}>
                                {totalForPriority}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ opacity: 0.8 }}
                              >
                                {percent}% of total
                              </Typography>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      ...sectionPaperSx,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={1}
                    >
                      <CalendarMonth color="primary" />
                      <Typography variant="h6" fontWeight={700}>
                        Active timeline
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        label={`${stats.overdue} overdue`}
                        color={stats.overdue ? "error" : "default"}
                        sx={chipTone}
                      />
                      <Chip
                        label={`${stats.todayCount} due today`}
                        color="primary"
                        variant="outlined"
                        sx={chipTone}
                      />
                      <Chip
                        label={`${stats.active} in progress`}
                        variant="outlined"
                        sx={chipTone}
                      />
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" gutterBottom>
                      Completion momentum
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={stats.completionRate}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
