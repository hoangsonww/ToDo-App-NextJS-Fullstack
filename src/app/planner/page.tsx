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
  CalendarMonth,
  Refresh,
  CheckCircle,
  Flag,
  AccessTime,
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

export default function PlannerPage() {
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

  const weekPlan = useMemo(() => {
    const start = startOfDay(new Date());
    return Array.from({ length: 7 }).map((_, idx) => {
      const current = new Date(start);
      current.setDate(start.getDate() + idx);
      const nextDay = new Date(current);
      nextDay.setDate(current.getDate() + 1);

      const dayTodos = todos
        .filter((todo) => {
          const date = parseDate(todo.dueDate);
          return (
            date &&
            date >= current &&
            date < nextDay &&
            todo.completed === false
          );
        })
        .sort(
          (a, b) =>
            (parseDate(a.dueDate)?.getTime() ?? 0) -
            (parseDate(b.dueDate)?.getTime() ?? 0),
        );

      return {
        date: current,
        label: current.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        todos: dayTodos,
      };
    });
  }, [todos]);

  const backlog = todos.filter((todo) => !todo.dueDate && !todo.completed);
  const completed = todos.filter((todo) => todo.completed);
  const highPriority = todos.filter(
    (todo) => !todo.completed && (todo.priority || "medium") === "high",
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
                  Plan your week
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.92 }}>
                  See what is coming, shuffle priorities, and make sure nothing
                  slips. Dates, priorities, and completion live side by side
                  here.
                </Typography>
                <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                  <Chip
                    icon={<CalendarMonth sx={{ color: "#b2f5ea" }} />}
                    label="7-day horizon"
                    sx={{
                      color: "#e9fffa",
                      backgroundColor: "rgba(255,255,255,0.12)",
                    }}
                  />
                  <Chip
                    icon={<Flag sx={{ color: "#b2f5ea" }} />}
                    label={`${highPriority.length} high-priority`}
                    sx={{
                      color: "#e9fffa",
                      backgroundColor: "rgba(255,255,255,0.12)",
                    }}
                  />
                  <Chip
                    icon={<CheckCircle sx={{ color: "#b2f5ea" }} />}
                    label={`${completed.length} done`}
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
                    Refresh
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
              <Grid item xs={12} md={8}>
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
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarMonth />
                      <Typography variant="h6" fontWeight={700}>
                        Week board
                      </Typography>
                    </Stack>
                    <Chip
                      label={`${todos.length} tasks tracked`}
                      variant="outlined"
                    />
                  </Stack>
                  <Grid container spacing={2}>
                    {weekPlan.map((day) => (
                      <Grid item xs={12} sm={6} md={4} key={day.label}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            height: "100%",
                            border: "1px solid",
                            borderColor: isDarkMode
                              ? "rgba(255,255,255,0.06)"
                              : "rgba(0,0,0,0.04)",
                            backgroundColor: isDarkMode ? "#14261f" : "#f8fbf9",
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight={700}>
                            {day.label}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          {day.todos.length === 0 ? (
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>
                              No tasks scheduled.
                            </Typography>
                          ) : (
                            <Stack spacing={1}>
                              {day.todos.map((todo) => (
                                <Paper
                                  key={todo.id}
                                  elevation={0}
                                  sx={{
                                    p: 1.5,
                                    backgroundColor: isDarkMode
                                      ? "#0f1f1a"
                                      : "#ffffff",
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={700}
                                  >
                                    {todo.task}
                                  </Typography>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    justifyContent="space-between"
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
                                  </Stack>
                                </Paper>
                              ))}
                            </Stack>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
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
                      mb={2}
                    >
                      <Flag color="error" />
                      <Typography variant="h6" fontWeight={700}>
                        High priority
                      </Typography>
                    </Stack>
                    {highPriority.length === 0 ? (
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        No urgent tasks right now.
                      </Typography>
                    ) : (
                      <Stack spacing={1}>
                        {highPriority.map((todo) => (
                          <Paper
                            key={todo.id}
                            elevation={0}
                            sx={{
                              p: 1.5,
                              backgroundColor: isDarkMode
                                ? "#14261f"
                                : "#f4faf6",
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
                                label={todo.dueDate || "Anytime"}
                                icon={<AccessTime />}
                                variant="outlined"
                                sx={chipTone}
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
                      mb={2}
                    >
                      <CheckCircle color="success" />
                      <Typography variant="h6" fontWeight={700}>
                        Completion pulse
                      </Typography>
                    </Stack>
                    <Stack spacing={1}>
                      <Typography variant="body2">Completed</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          todos.length
                            ? Math.round(
                                (completed.length / todos.length) * 100,
                              )
                            : 0
                        }
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {completed.length} of {todos.length} tasks completed
                      </Typography>
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" gutterBottom>
                      Backlog without a date
                    </Typography>
                    <Stack spacing={0.5}>
                      {backlog.length === 0 ? (
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Everything has a home.
                        </Typography>
                      ) : (
                        backlog.slice(0, 4).map((todo) => (
                          <Typography key={todo.id} variant="body2">
                            • {todo.task}
                          </Typography>
                        ))
                      )}
                    </Stack>
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
