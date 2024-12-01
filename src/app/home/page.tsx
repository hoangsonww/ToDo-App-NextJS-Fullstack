"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import isEqual from "lodash/isEqual";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  Drawer,
  ListItemText,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brightness4,
  Brightness7,
  Delete,
  AddCircle,
  Close as CloseIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../page.css";

interface Todo {
  id: number;
  task: string;
  category: string;
  completed: boolean;
  userId: number;
}

const darkGreenTheme = createTheme({
  palette: {
    primary: {
      main: "#006400", // Dark green
    },
    secondary: {
      main: "#ffffff", // White
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("General");
  // eslint-disable-next-line
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null,
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAfternoon, setIsAfternoon] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [loading, setLoading] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(!isDarkMode));
  };

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
    if (storedUser) {
      setUser(storedUser);
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        width: 250,
        bgcolor: isDarkMode ? "#333" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
        height: "100%",
        transition: "all 0.3s ease",
      }}
    >
      <IconButton
        onClick={handleDrawerToggle}
        sx={{ color: isDarkMode ? "#fff" : "#000", m: 1 }}
      >
        <CloseIcon />
      </IconButton>
      <List>
        <ListItem
          disablePadding
          sx={{
            backgroundColor: isActive("/home")
              ? "rgba(0, 128, 0, 0.3)"
              : "inherit",
          }}
        >
          <ListItemButton
            component="a"
            href="/home"
            onClick={handleDrawerToggle}
          >
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {user ? (
          <ListItem
            disablePadding
            sx={{
              backgroundColor: isActive("/auth/login")
                ? "rgba(0, 128, 0, 0.3)"
                : "inherit",
            }}
          >
            <ListItemButton
              onClick={() => {
                logout();
                handleDrawerToggle();
              }}
            >
              <ListItemText primary="Logout" sx={{ color: "red" }} />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem
              disablePadding
              sx={{
                backgroundColor: isActive("/auth/login")
                  ? "rgba(0, 128, 0, 0.3)"
                  : "inherit",
              }}
            >
              <ListItemButton
                component="a"
                href="/auth/login"
                onClick={handleDrawerToggle}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        <ListItem
          disablePadding
          sx={{
            backgroundColor: isActive("/auth/register")
              ? "rgba(0, 128, 0, 0.3)"
              : "inherit",
          }}
        >
          <ListItemButton
            component="a"
            href="/auth/register"
            onClick={handleDrawerToggle}
          >
            <ListItemText primary="Register" />
          </ListItemButton>
        </ListItem>

        {/* Divider */}
        <div
          style={{
            borderTop: isDarkMode ? "1px solid #fff" : "1px solid #333",
            marginTop: 2,
            marginBottom: 2,
          }}
        ></div>

        {/* Dark mode toggle */}
        <ListItem disablePadding>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            px={2}
            sx={{ mt: 0.5 }}
          >
            <Typography sx={{ color: isDarkMode ? "#fff" : "#000" }}>
              Dark Mode
            </Typography>
            <IconButton onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Brightness7 sx={{ color: "#fff" }} />
              ) : (
                <Brightness4 sx={{ color: "#000" }} />
              )}
            </IconButton>
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
    if (storedUser) {
      setUser(storedUser);
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser || currentUser === "null") {
      router.push("/home");
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchTodos(user.id);
    }
  }, [user]);

  useEffect(() => {
    const storedDarkMode = JSON.parse(
      localStorage.getItem("darkMode") || "true",
    );
    setIsDarkMode(storedDarkMode);
  }, []);

  useEffect(() => {
    const date = new Date();
    const hours = date.getHours();
    setIsAfternoon(hours >= 12 && hours < 18);
  }, []);

  const todosRef = useRef<Todo[]>([]);

  const fetchTodos = async (userId: number, showLoading = false) => {
    if (showLoading) setLoading(true);

    try {
      const response = await fetch(`/api/todos?userId=${userId}`);
      const data = await response.json();

      // Update state only if data changes
      if (!isEqual(data, todosRef.current)) {
        todosRef.current = data; // Update ref
        setTodos(data); // Trigger state update only when needed
      }
    } catch (err) {
      console.error("Error fetching todos:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!task.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user!.id,
          task,
          category,
          completed: false,
        }),
      });
      if (response.ok) {
        setTask("");
        fetchTodos(user!.id); // Refresh todos
      }
    } catch (err) {
      console.error("Error adding todo:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async (todoId: number) => {
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/todos`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user!.id,
          todoId,
          completed: !todo.completed,
        }),
      });
      if (response.ok) fetchTodos(user!.id); // Refresh todos
    } catch (err) {
      console.error("Error toggling completion:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (todoId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/todos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user!.id,
          todoId,
        }),
      });
      if (response.ok) fetchTodos(user!.id); // Refresh todos
    } catch (err) {
      console.error("Error deleting todo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
    if (storedUser) {
      setUser(storedUser);
      fetchTodos(storedUser.id, true); // Initial fetch with loading spinner

      // Polling for updates
      const interval = setInterval(() => fetchTodos(storedUser.id), 5000);
      return () => clearInterval(interval);
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <ThemeProvider theme={darkGreenTheme}>
      <CssBaseline />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: isDarkMode ? "#000000" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
          transition: "all 0.3s ease",
        }}
      >
        {/* Navbar */}
        <AppBar position="sticky" sx={{ backgroundColor: "#006400" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>
                The NextJS ToDo App
              </Link>
            </Typography>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
              <Link href="/home" passHref>
                <Button
                  sx={{
                    color: isActive("/home") ? "#f5f5f5" : "#ffffff",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      height: "2px",
                      width: isActive("/home") ? "100%" : "0",
                      backgroundColor: "#ffffff",
                      borderRadius: "10px",
                      transition: "width 0.3s",
                    },
                    "&:hover::after": {
                      width: "100%",
                    },
                  }}
                >
                  Home
                </Button>
              </Link>

              {user ? (
                <Button
                  onClick={logout}
                  sx={{
                    color: "red",
                    fontWeight: "bold",
                    position: "relative",
                    "&:hover": {
                      color: "#ff4d4d",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      height: "2px",
                      width: "0",
                      backgroundColor: "#fff",
                      transition: "width 0.3s",
                    },
                    "&:hover::after": {
                      width: "100%",
                    },
                  }}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link href="/auth/login" passHref>
                    <Button
                      sx={{
                        color: isActive("/auth/login") ? "#f5f5f5" : "#ffffff",
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          height: "2px",
                          width: isActive("/auth/login") ? "100%" : "0",
                          backgroundColor: "#ffffff",
                          borderRadius: "10px",
                          transition: "width 0.3s",
                        },
                        "&:hover::after": {
                          width: "100%",
                        },
                      }}
                    >
                      Login
                    </Button>
                  </Link>
                </>
              )}

              <Link href="/auth/register" passHref>
                <Button
                  sx={{
                    color: isActive("/auth/register") ? "#f5f5f5" : "#ffffff",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      height: "2px",
                      width: isActive("/auth/register") ? "100%" : "0",
                      backgroundColor: "#ffffff",
                      borderRadius: "10px",
                      transition: "width 0.3s",
                    },
                    "&:hover::after": {
                      width: "100%",
                    },
                  }}
                >
                  Register
                </Button>
              </Link>

              <IconButton color="inherit" onClick={toggleDarkMode}>
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>

            {/* Mobile Navigation */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                display: { xs: "block", md: "none" },
                textAlign: "center",
                width: "50px",
                height: "50px",
              }}
            >
              <MenuIcon sx={{ mt: "5px" }} />
            </IconButton>
          </Toolbar>

          {/* Drawer for Mobile */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
          >
            {drawer}
          </Drawer>
        </AppBar>

        {/* Content Area */}
        <Container sx={{ mt: 4, flexGrow: 1 }}>
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
              transition: "all 0.3s ease",
              backgroundColor: isDarkMode ? "#333" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            }}
          >
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Typography
                  variant="h4"
                  align="center"
                  gutterBottom
                  style={{
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    maxWidth: "100%",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  {new Date().getHours() >= 18
                    ? "Good Evening"
                    : isAfternoon
                      ? "Good Afternoon"
                      : "Good Morning"}
                  , {user?.username}!
                </Typography>
                {user && (
                  <Box textAlign="center" mb={2}>
                    <Typography
                      variant="body1"
                      style={{ marginBottom: "10px" }}
                    >
                      Here are your tasks:
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={logout}
                      sx={{
                        mt: 1,
                        backgroundColor: darkGreenTheme.palette.primary.main,
                        color: "#fff",
                        mb: 1,
                      }}
                    >
                      Logout
                    </Button>
                  </Box>
                )}
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mb={3}
                >
                  <TextField
                    label="New Task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{
                      mr: 2,
                      "& .MuiInputBase-input": {
                        color: isDarkMode ? "#fff" : "#000",
                      },
                      "& .MuiInputLabel-root": {
                        color: isDarkMode ? "#fff" : "#000",
                      },
                    }}
                    InputLabelProps={{
                      style: { color: isDarkMode ? "#fff" : "#000" },
                    }}
                    InputProps={{
                      style: { color: isDarkMode ? "#fff" : "#000" },
                    }}
                  />
                  <FormControl variant="outlined" sx={{ mr: 2, minWidth: 150 }}>
                    <InputLabel style={{ color: isDarkMode ? "#fff" : "#000" }}>
                      Category
                    </InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      label="Category"
                      sx={{
                        color: isDarkMode ? "#fff" : "#000",
                        backgroundColor: isDarkMode ? "#444" : "#fff",
                        "& .MuiSvgIcon-root": {
                          color: isDarkMode ? "#fff" : "#000",
                        },
                      }}
                    >
                      <MenuItem value="General">General</MenuItem>
                      <MenuItem value="Work">Work</MenuItem>
                      <MenuItem value="Personal">Personal</MenuItem>
                      <MenuItem value="Shopping">Shopping</MenuItem>
                      <MenuItem value="Education">Education</MenuItem>
                      <MenuItem value="Appointment">Appointment</MenuItem>
                      <MenuItem value="Fitness">Fitness</MenuItem>
                      <MenuItem value="Health">Health</MenuItem>
                      <MenuItem value="Travel">Travel</MenuItem>
                      <MenuItem value="Finance">Finance</MenuItem>
                      <MenuItem value="Entertainment">Entertainment</MenuItem>
                      <MenuItem value="Hobbies">Hobbies</MenuItem>
                      <MenuItem value="Family">Family</MenuItem>
                      <MenuItem value="Social">Social</MenuItem>
                      <MenuItem value="Chores">Chores</MenuItem>
                      <MenuItem value="Goals">Goals</MenuItem>
                      <MenuItem value="Urgent">Urgent</MenuItem>
                      <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton color="primary" onClick={addTodo}>
                    <AddCircle fontSize="large" />
                  </IconButton>
                </Box>
                {error && (
                  <Typography color="error" align="center" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}
                <TransitionGroup>
                  {todos.map((todo) => (
                    <CSSTransition
                      key={todo.id}
                      timeout={500}
                      classNames="todo"
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          boxShadow: 3,
                          backgroundColor: isDarkMode ? "#444" : "#f9f9f9",
                          color: isDarkMode ? "#fff" : "#000",
                        }}
                      >
                        <Box display="flex" alignItems="center">
                          <Checkbox
                            checked={todo.completed}
                            onChange={() => toggleCompletion(todo.id)}
                          />
                          <Typography
                            variant="body1"
                            style={{
                              textDecoration: todo.completed
                                ? "line-through"
                                : "none",
                            }}
                          >
                            [{todo.category}] {todo.task}
                          </Typography>
                        </Box>
                        <IconButton
                          color="error"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Paper>
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              </>
            )}
          </Paper>
        </Container>

        {/* Footer */}
        <Box
          sx={{
            mt: "auto",
            textAlign: "center",
            py: 2,
            backgroundColor: darkGreenTheme.palette.primary.main,
            color: "#ffffff",
          }}
        >
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} NextJS ToDo App. All Rights
            Reserved.
          </Typography>
        </Box>
      </div>
    </ThemeProvider>
  );
}
