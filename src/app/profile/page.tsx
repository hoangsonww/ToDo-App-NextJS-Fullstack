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
  Divider,
  LinearProgress,
  Button,
} from "@mui/material";
import {
  Person,
  CalendarMonth,
  CheckCircle,
  Flag,
  AccessTime,
  Refresh,
  Insights,
  Timeline as TimelineIcon,
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

export default function ProfilePage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null,
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const theme = useMemo(() => getAppTheme(isDarkMode), [isDarkMode]);

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

    return {
      total,
      completed,
      active,
      overdue,
      todayCount,
      highPriority,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [todos, today, todayEnd]);

  const recent = todos
    .slice()
    .sort((a, b) => (b.createdAt ?? b.id ?? 0) - (a.createdAt ?? a.id ?? 0))
    .slice(0, 6);

  const overdueTodos = todos
    .filter((t) => {
      const date = parseDate(t.dueDate);
      return date && date < today && !t.completed;
    })
    .sort(
      (a, b) =>
        (parseDate(a.dueDate)?.getTime() ?? 0) -
        (parseDate(b.dueDate)?.getTime() ?? 0),
    )
    .slice(0, 4);

  const priorityCounts = ["high", "medium", "low"].map((level) => {
    const count = todos.filter(
      (t) => (t.priority || "medium") === level && !t.completed,
    ).length;
    return { level, count };
  });

  const maxPriorityCount =
    priorityCounts.reduce((max, p) => Math.max(max, p.count), 1) || 1;

  const next7Days = Array.from({ length: 7 }).map((_, idx) => {
    const day = new Date(today);
    day.setDate(today.getDate() + idx);
    const end = new Date(day);
    end.setDate(day.getDate() + 1);
    const count = todos.filter((t) => {
      const date = parseDate(t.dueDate);
      return date && date >= day && date < end && !t.completed;
    }).length;
    return {
      label: day.toLocaleDateString(undefined, { weekday: "short" }),
      count,
    };
  });
  const maxUpcomingCount =
    next7Days.reduce((max, d) => Math.max(max, d.count), 1) || 1;

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
                  Profile & account
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Review your Flowlist footprint: tasks, activity, and account
                  data—all in one clean dashboard.
                </Typography>
                <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                  <Chip
                    icon={<Person sx={{ color: "#b2f5ea" }} />}
                    label={user?.username || "Guest"}
                    sx={{
                      color: "#e9fffa",
                      backgroundColor: "rgba(255,255,255,0.12)",
                    }}
                  />
                  <Chip
                    icon={<CheckCircle sx={{ color: "#b2f5ea" }} />}
                    label={`${stats.completionRate}% complete`}
                    sx={{
                      color: "#e9fffa",
                      backgroundColor: "rgba(255,255,255,0.12)",
                    }}
                  />
                  <Chip
                    icon={<Flag sx={{ color: "#b2f5ea" }} />}
                    label={`${stats.highPriority} high-priority open`}
                    sx={{
                      color: "#e9fffa",
                      backgroundColor: "rgba(255,255,255,0.12)",
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Refresh />}
                    onClick={() => fetchTodos(user?.id || 0, true)}
                    sx={{ color: "#ffffff" }}
                  >
                    Refresh data
                  </Button>
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
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <Paper elevation={0} sx={{ p: 3, ...sectionPaperSx }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={1}
                    >
                      <Person color="primary" />
                      <Typography variant="h6" fontWeight={700}>
                        Account
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                      Username
                    </Typography>
                    <Typography variant="body1" fontWeight={700} gutterBottom>
                      {user?.username || "Guest"}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                      User ID
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {user?.id ?? "N/A"}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                      Email
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Not provided
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={1}>
                      <Chip label="Flowlist identity" variant="outlined" />
                      <Chip label="Secure storage" variant="outlined" />
                      <Chip label="Dark mode ready" variant="outlined" />
                    </Stack>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, ...sectionPaperSx }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={1}
                    >
                      <CheckCircle color="success" />
                      <Typography variant="h6" fontWeight={700}>
                        Completion snapshot
                      </Typography>
                    </Stack>
                    <Stack spacing={1.5}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: isDarkMode ? "#14261f" : "#f8fbf9",
                          border: "1px solid",
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(0,0,0,0.05)",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="subtitle2" fontWeight={800}>
                            Overall
                          </Typography>
                          <Typography variant="h6" fontWeight={800}>
                            {stats.completionRate}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={stats.completionRate}
                          sx={{ height: 10, borderRadius: 5, mt: 1 }}
                        />
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {stats.completed} of {stats.total} tasks complete
                        </Typography>
                      </Box>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              backgroundColor: isDarkMode
                                ? "#12241d"
                                : "#f8fbf9",
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={800}>
                              In progress
                            </Typography>
                            <Typography variant="h6" fontWeight={800}>
                              {stats.active}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              backgroundColor: isDarkMode
                                ? "#12241d"
                                : "#f8fbf9",
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={800}>
                              Overdue
                            </Typography>
                            <Typography variant="h6" fontWeight={800}>
                              {stats.overdue}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              backgroundColor: isDarkMode
                                ? "#12241d"
                                : "#f8fbf9",
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={800}>
                              Due today
                            </Typography>
                            <Typography variant="h6" fontWeight={800}>
                              {stats.todayCount}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              backgroundColor: isDarkMode
                                ? "#12241d"
                                : "#f8fbf9",
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={800}>
                              Completed
                            </Typography>
                            <Typography variant="h6" fontWeight={800}>
                              {stats.completed}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>

              <Grid item xs={12} md={8}>
                <Stack spacing={2}>
                  <Paper elevation={0} sx={{ p: 3, ...sectionPaperSx }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={2}
                    >
                      <CalendarMonth color="primary" />
                      <Typography variant="h6" fontWeight={700}>
                        Recent activity
                      </Typography>
                      <Chip
                        label={`${recent.length} shown`}
                        variant="outlined"
                        sx={chipTone}
                      />
                    </Stack>
                    {recent.length === 0 ? (
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        No tasks yet. Create one from Home to start tracking.
                      </Typography>
                    ) : (
                      <Stack spacing={1.2}>
                        {recent.map((todo) => (
                          <Paper
                            key={todo.id}
                            elevation={0}
                            sx={{
                              p: 1.5,
                              backgroundColor: isDarkMode
                                ? "#14261f"
                                : "#f8fbf9",
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Typography variant="subtitle1" fontWeight={700}>
                                {todo.task}
                              </Typography>
                              <Chip
                                size="small"
                                label={todo.completed ? "Done" : "Active"}
                                color={todo.completed ? "success" : "default"}
                                variant="outlined"
                                sx={chipTone}
                              />
                            </Stack>
                            <Stack
                              direction="row"
                              spacing={1}
                              flexWrap="wrap"
                              mt={0.5}
                            >
                              <Chip
                                size="small"
                                label={todo.category}
                                variant="outlined"
                                sx={chipTone}
                              />
                              <Chip
                                size="small"
                                label={(
                                  todo.priority || "medium"
                                ).toUpperCase()}
                                icon={<Flag />}
                                variant="outlined"
                                sx={chipTone}
                              />
                              {todo.dueDate && (
                                <Chip
                                  size="small"
                                  label={todo.dueDate}
                                  icon={<AccessTime />}
                                  variant="outlined"
                                  sx={chipTone}
                                />
                              )}
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    )}
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, ...sectionPaperSx }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={2}
                    >
                      <Insights color="primary" />
                      <Typography variant="h6" fontWeight={700}>
                        Priority mix
                      </Typography>
                    </Stack>
                    <Stack spacing={1.5}>
                      {priorityCounts.map((p) => {
                        const percent = Math.round(
                          (p.count / maxPriorityCount) * 100,
                        );
                        const color =
                          p.level === "high"
                            ? theme.palette.error.main
                            : p.level === "medium"
                              ? theme.palette.warning.main
                              : theme.palette.success.main;
                        return (
                          <Box key={p.level}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography variant="subtitle2" fontWeight={700}>
                                {p.level.toUpperCase()}
                              </Typography>
                              <Typography variant="caption">
                                {p.count} open
                              </Typography>
                            </Stack>
                            <Box
                              sx={{
                                height: 12,
                                borderRadius: 6,
                                backgroundColor: isDarkMode
                                  ? "rgba(255,255,255,0.08)"
                                  : "rgba(0,0,0,0.06)",
                                overflow: "hidden",
                                mt: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${percent}%`,
                                  height: "100%",
                                  background: color,
                                  transition: "width 0.3s ease",
                                }}
                              />
                            </Box>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, ...sectionPaperSx }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={2}
                    >
                      <TimelineIcon color="primary" />
                      <Typography variant="h6" fontWeight={700}>
                        Next 7 days
                      </Typography>
                    </Stack>
                    <Grid container spacing={1}>
                      {next7Days.map((day) => {
                        const percent = Math.round(
                          (day.count / maxUpcomingCount) * 100,
                        );
                        return (
                          <Grid item xs={12} sm={6} md={3} key={day.label}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.5,
                                background: isDarkMode
                                  ? "linear-gradient(180deg, #12241d, #0f1f1a)"
                                  : "linear-gradient(180deg, #f8fbf9, #ffffff)",
                                border: "1px solid",
                                borderColor: isDarkMode
                                  ? "rgba(255,255,255,0.08)"
                                  : "rgba(0,0,0,0.05)",
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={800}>
                                {day.label}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ opacity: 0.8 }}
                              >
                                {day.count} tasks
                              </Typography>
                              <Box
                                sx={{
                                  mt: 1,
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: isDarkMode
                                    ? "rgba(255,255,255,0.08)"
                                    : "rgba(0,0,0,0.06)",
                                  overflow: "hidden",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: `${percent}%`,
                                    height: "100%",
                                    background:
                                      "linear-gradient(90deg, #0f8f5f, #0a6c45)",
                                    transition: "width 0.3s ease",
                                  }}
                                />
                              </Box>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, ...sectionPaperSx }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={2}
                    >
                      <Flag color="error" />
                      <Typography variant="h6" fontWeight={700}>
                        Overdue
                      </Typography>
                      <Chip
                        label={`${overdueTodos.length} items`}
                        variant="outlined"
                        sx={chipTone}
                      />
                    </Stack>
                    {overdueTodos.length === 0 ? (
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        No overdue tasks. Keep it going!
                      </Typography>
                    ) : (
                      <Stack spacing={1}>
                        {overdueTodos.map((todo) => (
                          <Paper
                            key={todo.id}
                            elevation={0}
                            sx={{
                              p: 1.5,
                              border: "1px solid rgba(211,47,47,0.35)",
                              backgroundColor: isDarkMode
                                ? "#261416"
                                : "#fff5f5",
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={700}>
                              {todo.task}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Chip
                                size="small"
                                label={todo.dueDate || "No date"}
                                icon={<AccessTime />}
                                color="error"
                                variant="outlined"
                              />
                              <Chip
                                size="small"
                                label={todo.category}
                                variant="outlined"
                                sx={chipTone}
                              />
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    )}
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
