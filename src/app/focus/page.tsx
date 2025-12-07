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
  Button,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  Replay,
  AccessTime,
  CheckCircle,
  Flag,
  Refresh,
} from "@mui/icons-material";
import NavBar from "../components/NavBar";
import { getAppTheme } from "../theme";
import { TodoItem, TodoPriority } from "@/types/todo";

const parseDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const priorityOrder: Record<TodoPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export default function FocusPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null,
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTask, setActiveTask] = useState<TodoItem | null>(null);
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

  useEffect(() => {
    setSecondsLeft(focusMinutes * 60);
  }, [focusMinutes]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
    }
  }, [secondsLeft, isRunning]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const todayEnd = useMemo(() => {
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return end;
  }, [today]);

  const focusCandidates = useMemo(() => {
    const ranked = todos
      .filter((t) => !t.completed)
      .sort((a, b) => {
        const aDate = parseDate(a.dueDate);
        const bDate = parseDate(b.dueDate);
        if (aDate && bDate && aDate.getTime() !== bDate.getTime()) {
          return aDate.getTime() - bDate.getTime();
        }
        return (
          (priorityOrder[a.priority || "medium"] ?? 1) -
          (priorityOrder[b.priority || "medium"] ?? 1)
        );
      });
    const todayTasks = ranked.filter((t) => {
      const date = parseDate(t.dueDate);
      return (
        date &&
        date.getTime() >= today.getTime() &&
        date.getTime() <= todayEnd.getTime()
      );
    });
    const overdue = ranked.filter((t) => {
      const date = parseDate(t.dueDate);
      return date && date < today;
    });

    return [...overdue, ...todayTasks, ...ranked].slice(0, 6);
  }, [todos, today, todayEnd]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const toggleCompletion = async (todoId: number) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/todos`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          todoId,
          completed: !todos.find((t) => t.id === todoId)?.completed,
        }),
      });
      if (response.ok) fetchTodos(user.id);
    } catch (err) {
      console.error("Error toggling completion:", err);
    }
  };

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
                  Focus mode
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Pick one task, start a timer, and protect your focus. Track
                  overdue and today&apos;s commitments without distractions.
                </Typography>
                <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                  <Chip
                    icon={<AccessTime sx={{ color: "#b2f5ea" }} />}
                    label={`Session: ${focusMinutes} min`}
                    sx={{
                      color: "#e9fffa",
                      backgroundColor: "rgba(255,255,255,0.12)",
                    }}
                  />
                  <Chip
                    icon={<Flag sx={{ color: "#b2f5ea" }} />}
                    label={`${focusCandidates.length} in queue`}
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
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    ...sectionPaperSx,
                  }}
                >
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Timer
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 3,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.05)",
                      background: isDarkMode
                        ? "radial-gradient(circle, #10231b 0, #0b1612 100%)"
                        : "radial-gradient(circle, #f0f7f4 0, #ffffff 100%)",
                    }}
                  >
                    <Typography variant="h2" fontWeight={800}>
                      {formatTime(secondsLeft)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ opacity: 0.7, mt: 1, textAlign: "center" }}
                    >
                      {activeTask
                        ? activeTask.task
                        : "Pick a task from the queue to focus on."}
                    </Typography>
                    <Stack direction="row" spacing={1.5} mt={2}>
                      <Button
                        variant="contained"
                        startIcon={isRunning ? <Pause /> : <PlayArrow />}
                        onClick={() => setIsRunning((prev) => !prev)}
                        disabled={!activeTask}
                        sx={{ color: "#ffffff" }}
                      >
                        {isRunning ? "Pause" : "Start"}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Replay />}
                        onClick={() => {
                          setIsRunning(false);
                          setSecondsLeft(focusMinutes * 60);
                        }}
                      >
                        Reset
                      </Button>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mt={2}
                    >
                      {[15, 25, 50].map((minutes) => (
                        <Chip
                          key={minutes}
                          label={`${minutes} min`}
                          color={
                            focusMinutes === minutes ? "primary" : "default"
                          }
                          onClick={() => {
                            setIsRunning(false);
                            setFocusMinutes(minutes);
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
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
                    <Typography variant="h6" fontWeight={700}>
                      Focus queue
                    </Typography>
                    <Chip
                      label={`${focusCandidates.length} tasks`}
                      variant="outlined"
                      color="primary"
                    />
                  </Stack>
                  {focusCandidates.length === 0 ? (
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      Nothing queued yet. Set due dates and priorities to
                      surface tasks here.
                    </Typography>
                  ) : (
                    <Stack spacing={1.5}>
                      {focusCandidates.map((todo) => (
                        <Paper
                          key={todo.id}
                          elevation={0}
                          sx={{
                            p: 1.5,
                            border: "1px solid",
                            borderColor: isDarkMode
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.05)",
                            backgroundColor: isDarkMode ? "#14261f" : "#f8fbf9",
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={2}
                          >
                            <Box>
                              <Typography variant="subtitle1" fontWeight={700}>
                                {todo.task}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                flexWrap="wrap"
                              >
                                <Chip
                                  size="small"
                                  label={todo.category}
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
                            </Box>
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                  setActiveTask(todo);
                                  setIsRunning(false);
                                  setSecondsLeft(focusMinutes * 60);
                                }}
                              >
                                Focus
                              </Button>
                              <IconButton
                                color="success"
                                onClick={() => toggleCompletion(todo.id)}
                              >
                                <CheckCircle />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
