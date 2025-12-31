"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import isEqual from "lodash/isEqual";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Stack,
  LinearProgress,
  Divider,
  Tooltip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  CheckCircle,
  RadioButtonUnchecked,
  AccessTime,
  Flag,
  Refresh,
  Search,
  FilterList,
  NoteAlt,
  CalendarMonth,
} from "@mui/icons-material";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import NavBar from "../components/NavBar";
import { TodoItem, TodoPriority } from "@/types/todo";
import { getAppTheme } from "../theme";
import "../page.css";

const categories = [
  "General",
  "Work",
  "Personal",
  "Shopping",
  "Health",
  "Finance",
  "Learning",
  "Chores",
  "Family",
  "Goals",
];

const priorityColors: Record<TodoPriority, string> = {
  high: "#d32f2f",
  medium: "#ed6c02",
  low: "#2e7d32",
};

const parseDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const chipGroupSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
  alignItems: "center",
};

export default function Home() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed"
  >("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null,
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [greeting, setGreeting] = useState("Welcome back");
  const [editOpen, setEditOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const theme = useMemo(() => getAppTheme(isDarkMode), [isDarkMode]);

  const router = useRouter();
  const todosRef = useRef<TodoItem[]>([]);
  const taskInputRef = useRef<HTMLInputElement | null>(null);
  const itemRefs = useRef<Record<number, React.RefObject<HTMLDivElement>>>({});

  const getNodeRef = (id: number) => {
    if (!itemRefs.current[id]) {
      itemRefs.current[id] = React.createRef<HTMLDivElement>();
    }
    return itemRefs.current[id];
  };

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

      if (!isEqual(data, todosRef.current)) {
        todosRef.current = data;
        setTodos(data);
      }
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

    const hour = new Date().getHours();
    setGreeting(
      hour >= 18
        ? "Good Evening"
        : hour >= 12
          ? "Good Afternoon"
          : "Good Morning",
    );
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

    const interval = setInterval(() => fetchTodos(storedUser.id), 8000);
    return () => clearInterval(interval);
  }, [router]);

  const addTodo = async () => {
    if (!task.trim() || !user) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          task,
          category,
          completed: false,
          priority,
          dueDate,
          notes,
        }),
      });

      if (response.ok) {
        setTask("");
        setNotes("");
        setPriority("medium");
        setDueDate("");
        setCategory("General");
        fetchTodos(user.id);
        taskInputRef.current?.focus();
      }
    } catch (err) {
      console.error("Error adding todo:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleCompletion = async (todoId: number) => {
    if (!user) return;
    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const deleteTodo = async (todoId: number) => {
    if (!user) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/todos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          todoId,
        }),
      });
      if (response.ok) fetchTodos(user.id);
    } catch (err) {
      console.error("Error deleting todo:", err);
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async () => {
    if (!editingTodo || !user) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/todos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          todoId: editingTodo.id,
          task: editingTodo.task,
          category: editingTodo.category,
          priority: editingTodo.priority,
          dueDate: editingTodo.dueDate,
          notes: editingTodo.notes,
          completed: editingTodo.completed,
        }),
      });

      if (response.ok) {
        fetchTodos(user.id);
        setEditOpen(false);
        setEditingTodo(null);
      }
    } catch (err) {
      console.error("Error updating todo:", err);
    } finally {
      setSaving(false);
    }
  };

  const today = useMemo(() => startOfDay(new Date()), []);
  const todayEnd = useMemo(() => {
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return end;
  }, [today]);

  const filteredTodos = useMemo(() => {
    const order: Record<TodoPriority, number> = {
      high: 0,
      medium: 1,
      low: 2,
    };

    const matchesSearch = (todo: TodoItem) =>
      todo.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.notes || "").toLowerCase().includes(searchTerm.toLowerCase());

    const filtered = todos
      .filter((todo) => {
        if (statusFilter === "completed" && !todo.completed) return false;
        if (statusFilter === "active" && todo.completed) return false;
        if (categoryFilter === "today") {
          const date = parseDate(todo.dueDate);
          if (
            !date ||
            date.getTime() < today.getTime() ||
            date.getTime() > todayEnd.getTime()
          ) {
            return false;
          }
        } else if (
          categoryFilter !== "all" &&
          todo.category !== categoryFilter
        ) {
          return false;
        }
        if (priorityFilter !== "all" && todo.priority !== priorityFilter)
          return false;
        if (searchTerm && !matchesSearch(todo)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "priority") {
          return (
            (order[a.priority || "medium"] ?? 1) -
            (order[b.priority || "medium"] ?? 1)
          );
        }
        if (sortBy === "dueDate") {
          const aDate = parseDate(a.dueDate)?.getTime() ?? Infinity;
          const bDate = parseDate(b.dueDate)?.getTime() ?? Infinity;
          return aDate - bDate;
        }
        if (sortBy === "category") {
          return a.category.localeCompare(b.category);
        }
        const aCreated = a.createdAt ?? a.id;
        const bCreated = b.createdAt ?? b.id;
        return bCreated - aCreated;
      });

    return filtered;
  }, [
    todos,
    statusFilter,
    categoryFilter,
    priorityFilter,
    searchTerm,
    sortBy,
    today,
    todayEnd,
  ]);

  const overdueTodos = todos
    .filter((todo) => {
      const date = parseDate(todo.dueDate);
      return date && date < today && !todo.completed;
    })
    .sort(
      (a, b) =>
        (parseDate(a.dueDate)?.getTime() ?? 0) -
        (parseDate(b.dueDate)?.getTime() ?? 0),
    );

  const todayTodos = todos.filter((todo) => {
    const date = parseDate(todo.dueDate);
    return (
      date &&
      date.getTime() >= today.getTime() &&
      date.getTime() <= todayEnd.getTime() &&
      !todo.completed
    );
  });

  const upcomingTodos = todos
    .filter((todo) => {
      const date = parseDate(todo.dueDate);
      return date && date > todayEnd && !todo.completed;
    })
    .sort(
      (a, b) =>
        (parseDate(a.dueDate)?.getTime() ?? 0) -
        (parseDate(b.dueDate)?.getTime() ?? 0),
    )
    .slice(0, 5);

  const completedCount = todos.filter((todo) => todo.completed).length;
  const total = todos.length;
  const completionRate = total ? Math.round((completedCount / total) * 100) : 0;

  const uniqueCategories = Array.from(new Set(todos.map((t) => t.category)));

  const resetFilters = () => {
    setCategoryFilter("all");
    setPriorityFilter("all");
    setStatusFilter("all");
    setSearchTerm("");
    setSortBy("recent");
  };

  const chipTone = isDarkMode
    ? {
        backgroundColor: "rgba(255,255,255,0.08)",
        color: "#eaf7f0",
        borderColor: "rgba(255,255,255,0.2)",
      }
    : {};

  const fieldBaseSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: isDarkMode ? "#1a2f26" : "#ffffff",
    },
    "& .MuiInputBase-input": {
      color: isDarkMode ? "#ffffff" : theme.palette.text.primary,
      "&::placeholder": {
        color: isDarkMode ? "#ffffff" : "#4a5c55",
        opacity: 0.9,
      },
    },
    "& .MuiInputLabel-root": {
      color: isDarkMode ? "#e8f5ef" : theme.palette.text.secondary,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.18)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: isDarkMode ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.28)",
    },
    "& .MuiSvgIcon-root": {
      color: isDarkMode ? "#ffffff" : theme.palette.text.primary,
    },
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: isDarkMode
                    ? "linear-gradient(135deg, #0f3326, #0d5a3f)"
                    : "linear-gradient(135deg, #0f8f5f, #0a6c45)",
                  color: "#ffffff",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="h5" fontWeight={800} gutterBottom>
                      {greeting}, {user?.username || "organizer"}.
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Shape your day with focused tasks, priorities, and a
                      planner view that keeps the important things in sight.
                    </Typography>
                    <Box sx={{ ...chipGroupSx, mt: 2 }}>
                      <Chip
                        icon={<CheckCircle sx={{ color: "#b2f5ea" }} />}
                        label={`${completionRate}% done`}
                        sx={{
                          color: "#e9fffa",
                          backgroundColor: "rgba(255,255,255,0.16)",
                          borderColor: "rgba(255,255,255,0.3)",
                        }}
                        variant="outlined"
                      />
                      <Chip
                        icon={<CalendarMonth sx={{ color: "#b2f5ea" }} />}
                        label={`${todayTodos.length} due today`}
                        sx={{
                          color: "#e9fffa",
                          backgroundColor: "rgba(255,255,255,0.16)",
                        }}
                      />
                      <Chip
                        icon={<Flag sx={{ color: "#b2f5ea" }} />}
                        label={`${overdueTodos.length} overdue`}
                        sx={{
                          color: "#e9fffa",
                          backgroundColor: "rgba(255,255,255,0.16)",
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "#ffffff",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" gutterBottom>
                        Progress
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={completionRate}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgba(255,255,255,0.2)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#b2f5ea",
                          },
                        }}
                      />
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        mt={1}
                      >
                        <Typography variant="caption">
                          {completedCount} completed
                        </Typography>
                        <Typography variant="caption">
                          {total - completedCount} remaining
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} mt={2}>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => taskInputRef.current?.focus()}
                          startIcon={<Add />}
                          sx={{ color: "#ffffff" }}
                        >
                          New task
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => fetchTodos(user?.id || 0, true)}
                          startIcon={<Refresh />}
                          sx={{
                            color: "#fff",
                            borderColor: "rgba(255,255,255,0.4)",
                          }}
                        >
                          Refresh
                        </Button>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: isDarkMode ? "#0f1f1a" : "#ffffff",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      Capture a new task
                    </Typography>
                    {saving && (
                      <LinearProgress sx={{ width: { xs: "100%", md: 200 } }} />
                    )}
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                      <TextField
                        fullWidth
                        label="Task"
                        placeholder="Write meeting notes, prep deck, book flights..."
                        value={task}
                        inputRef={taskInputRef}
                        onChange={(e) => setTask(e.target.value)}
                        sx={fieldBaseSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <NoteAlt color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <FormControl fullWidth sx={fieldBaseSx}>
                        <InputLabel
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          Category
                        </InputLabel>
                        <Select
                          value={category}
                          label="Category"
                          onChange={(e) => setCategory(e.target.value)}
                          sx={fieldBaseSx}
                        >
                          {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                              {cat}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth sx={fieldBaseSx}>
                        <InputLabel
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          Priority
                        </InputLabel>
                        <Select
                          value={priority}
                          label="Priority"
                          onChange={(e) =>
                            setPriority(e.target.value as TodoPriority)
                          }
                          sx={fieldBaseSx}
                        >
                          <MenuItem value="high">High</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="low">Low</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Due date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        sx={fieldBaseSx}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Notes"
                        placeholder="Add context or links"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        sx={fieldBaseSx}
                      />
                    </Grid>
                  </Grid>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    justifyContent="flex-end"
                    mt={2}
                  >
                    <Button onClick={resetFilters} startIcon={<FilterList />}>
                      Reset filters
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={addTodo}
                      sx={{ color: "#ffffff" }}
                    >
                      Add to list
                    </Button>
                  </Stack>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: isDarkMode ? "#0f1f1a" : "#ffffff",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    justifyContent="space-between"
                  >
                    <Typography variant="h6" fontWeight={700}>
                      Your tasks
                    </Typography>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      width="100%"
                      justifyContent="flex-end"
                    >
                      <TextField
                        placeholder="Search title or notes"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>Sort</InputLabel>
                        <Select
                          value={sortBy}
                          label="Sort"
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <MenuItem value="recent">Newest first</MenuItem>
                          <MenuItem value="dueDate">Due date</MenuItem>
                          <MenuItem value="priority">Priority</MenuItem>
                          <MenuItem value="category">Category</MenuItem>
                        </Select>
                      </FormControl>
                      <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={() => fetchTodos(user?.id || 0, true)}
                      >
                        Sync
                      </Button>
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ ...chipGroupSx, mb: 2 }}>
                    {["all", "active", "completed"].map((status) => (
                      <Chip
                        key={status}
                        label={
                          status === "all"
                            ? "All"
                            : status === "active"
                              ? "In progress"
                              : "Completed"
                        }
                        color={statusFilter === status ? "primary" : "default"}
                        onClick={() =>
                          setStatusFilter(status as typeof statusFilter)
                        }
                        icon={
                          status === "completed" ? (
                            <CheckCircle />
                          ) : status === "active" ? (
                            <Flag />
                          ) : (
                            <FilterList />
                          )
                        }
                        sx={chipTone}
                      />
                    ))}

                    <Chip
                      label="High priority"
                      color={priorityFilter === "high" ? "primary" : "default"}
                      onClick={() =>
                        setPriorityFilter(
                          priorityFilter === "high" ? "all" : "high",
                        )
                      }
                      icon={<Flag />}
                      sx={chipTone}
                    />
                    <Chip
                      label="Due today"
                      color={categoryFilter === "today" ? "primary" : "default"}
                      onClick={() =>
                        setCategoryFilter(
                          categoryFilter === "today" ? "all" : "today",
                        )
                      }
                      icon={<CalendarMonth />}
                      sx={chipTone}
                    />
                  </Box>

                  <Box sx={{ ...chipGroupSx, mb: 2 }}>
                    <Chip
                      label="All categories"
                      variant={categoryFilter === "all" ? "filled" : "outlined"}
                      onClick={() => setCategoryFilter("all")}
                      sx={chipTone}
                    />
                    {uniqueCategories.map((cat) => (
                      <Chip
                        key={cat}
                        label={cat}
                        variant={categoryFilter === cat ? "filled" : "outlined"}
                        onClick={() => setCategoryFilter(cat)}
                        sx={chipTone}
                      />
                    ))}
                  </Box>

                  {loading ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      minHeight={220}
                    >
                      <LinearProgress sx={{ width: "100%" }} />
                    </Box>
                  ) : filteredTodos.length === 0 ? (
                    <Box
                      textAlign="center"
                      py={4}
                      sx={{ opacity: 0.7 }}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={1}
                    >
                      <Typography variant="h6" fontWeight={700}>
                        Nothing to show here
                      </Typography>
                      <Typography variant="body2">
                        Adjust filters or create a new task to get moving.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => taskInputRef.current?.focus()}
                        sx={{ mt: 1 }}
                      >
                        Add your first task
                      </Button>
                    </Box>
                  ) : (
                    <TransitionGroup>
                      {filteredTodos.map((todo) => {
                        const nodeRef = getNodeRef(todo.id);
                        return (
                          <CSSTransition
                            key={todo.id}
                            timeout={400}
                            classNames="todo"
                            nodeRef={nodeRef}
                          >
                            <Paper
                              ref={nodeRef}
                              elevation={0}
                              sx={{
                                p: 2,
                                mb: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                                backgroundColor: todo.completed
                                  ? isDarkMode
                                    ? "#0f1f1a"
                                    : "#f0f5f2"
                                  : isDarkMode
                                    ? "#14261f"
                                    : "#f8fbf9",
                                border: "1px solid",
                                borderColor: isDarkMode
                                  ? "rgba(255,255,255,0.06)"
                                  : "rgba(0,0,0,0.04)",
                                opacity: todo.completed ? 0.7 : 1,
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={2}>
                                <Tooltip
                                  title={
                                    todo.completed
                                      ? "Mark as active"
                                      : "Mark as done"
                                  }
                                >
                                  <IconButton
                                    color={
                                      todo.completed ? "primary" : "default"
                                    }
                                    onClick={() => toggleCompletion(todo.id)}
                                  >
                                    {todo.completed ? (
                                      <CheckCircle />
                                    ) : (
                                      <RadioButtonUnchecked />
                                    )}
                                  </IconButton>
                                </Tooltip>
                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                    sx={{
                                      textDecoration: todo.completed
                                        ? "line-through"
                                        : "none",
                                    }}
                                  >
                                    {todo.task}
                                  </Typography>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    useFlexGap
                                    mt={0.5}
                                  >
                                    <Chip
                                      size="small"
                                      label={todo.category}
                                      variant="outlined"
                                    />
                                    <Chip
                                      size="small"
                                      label={(
                                        todo.priority || "medium"
                                      ).toUpperCase()}
                                      sx={{
                                        color:
                                          priorityColors[
                                            todo.priority || "medium"
                                          ],
                                        borderColor:
                                          priorityColors[
                                            todo.priority || "medium"
                                          ],
                                      }}
                                      icon={<Flag />}
                                      variant="outlined"
                                    />
                                    {todo.dueDate && (
                                      <Chip
                                        size="small"
                                        label={todo.dueDate}
                                        icon={<AccessTime />}
                                        variant="outlined"
                                      />
                                    )}
                                  </Stack>
                                  {todo.notes && (
                                    <Typography
                                      variant="body2"
                                      sx={{ mt: 0.5 }}
                                    >
                                      {todo.notes}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="Edit">
                                  <IconButton
                                    onClick={() => {
                                      setEditingTodo(todo);
                                      setEditOpen(true);
                                    }}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    color="error"
                                    onClick={() => deleteTodo(todo.id)}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Paper>
                          </CSSTransition>
                        );
                      })}
                    </TransitionGroup>
                  )}
                </Paper>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: isDarkMode ? "#0f1f1a" : "#ffffff",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      Today&apos;s focus
                    </Typography>
                    <Chip
                      size="small"
                      label={`${todayTodos.length} tasks`}
                      color="primary"
                    />
                  </Stack>
                  {todayTodos.length === 0 ? (
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      Nothing scheduled today. Add due dates to stay on track.
                    </Typography>
                  ) : (
                    <Stack spacing={1}>
                      {todayTodos.map((todo) => (
                        <Paper
                          key={todo.id}
                          elevation={0}
                          sx={{
                            p: 1.5,
                            backgroundColor: isDarkMode ? "#14261f" : "#f4faf6",
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
                              label={todo.category}
                              variant="outlined"
                            />
                            <Chip
                              size="small"
                              label={(todo.priority || "medium").toUpperCase()}
                              sx={{
                                color:
                                  priorityColors[todo.priority || "medium"],
                                borderColor:
                                  priorityColors[todo.priority || "medium"],
                              }}
                              variant="outlined"
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
                    backgroundColor: isDarkMode ? "#0f1f1a" : "#ffffff",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      Upcoming
                    </Typography>
                    <Chip
                      size="small"
                      label={`${upcomingTodos.length} queued`}
                      variant="outlined"
                    />
                  </Stack>
                  <Stack spacing={1}>
                    {upcomingTodos.length === 0 && (
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Assign due dates to see your pipeline.
                      </Typography>
                    )}
                    {upcomingTodos.map((todo) => (
                      <Paper
                        key={todo.id}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          backgroundColor: isDarkMode ? "#14261f" : "#f4faf6",
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={700}>
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
                            label={todo.dueDate || "Anytime"}
                            icon={<AccessTime />}
                            variant="outlined"
                          />
                          <Chip
                            size="small"
                            label={(todo.priority || "medium").toUpperCase()}
                            sx={{
                              color: priorityColors[todo.priority || "medium"],
                              borderColor:
                                priorityColors[todo.priority || "medium"],
                            }}
                            variant="outlined"
                          />
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: isDarkMode ? "#0f1f1a" : "#ffffff",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <Flag color="error" />
                    <Typography variant="h6" fontWeight={700}>
                      Overdue
                    </Typography>
                  </Stack>
                  {overdueTodos.length === 0 ? (
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      You&apos;re caught up. Nicely done!
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
                            backgroundColor: isDarkMode ? "#261416" : "#fff5f5",
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
                              label={todo.dueDate}
                              icon={<AccessTime />}
                              color="error"
                              variant="outlined"
                            />
                            <Chip
                              size="small"
                              label={todo.category}
                              variant="outlined"
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
        </Container>

        <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
          <DialogTitle>Edit task</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Task"
                fullWidth
                value={editingTodo?.task || ""}
                onChange={(e) =>
                  setEditingTodo(
                    editingTodo
                      ? { ...editingTodo, task: e.target.value }
                      : null,
                  )
                }
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={editingTodo?.category || ""}
                  onChange={(e) =>
                    setEditingTodo(
                      editingTodo
                        ? { ...editingTodo, category: e.target.value }
                        : null,
                    )
                  }
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  label="Priority"
                  value={editingTodo?.priority || "medium"}
                  onChange={(e) =>
                    setEditingTodo(
                      editingTodo
                        ? {
                            ...editingTodo,
                            priority: e.target.value as TodoPriority,
                          }
                        : null,
                    )
                  }
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Due date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={editingTodo?.dueDate || ""}
                onChange={(e) =>
                  setEditingTodo(
                    editingTodo
                      ? { ...editingTodo, dueDate: e.target.value }
                      : null,
                  )
                }
              />
              <TextField
                label="Notes"
                fullWidth
                value={editingTodo?.notes || ""}
                onChange={(e) =>
                  setEditingTodo(
                    editingTodo
                      ? { ...editingTodo, notes: e.target.value }
                      : null,
                  )
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit} variant="contained">
              Save changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
