"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Divider,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
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
  TrendingUp,
  DataUsage,
  RocketLaunch,
  DoneAll,
  DonutLarge,
  Timeline,
  Psychology,
  Lock,
} from "@mui/icons-material";
import { getAppTheme } from "./theme";

interface FeatureCard {
  title: string;
  copy: string;
  href: string;
  icon: React.ReactNode;
}

interface MetricCard {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  caption: string;
}

interface Pillar {
  icon: React.ReactNode;
  title: string;
  copy: string;
}

interface JourneyStep {
  step: string;
  title: string;
  copy: string;
  outcome: string;
}

interface UseCase {
  title: string;
  copy: string;
  metric: string;
}

const featureCards: FeatureCard[] = [
  {
    title: "Weekly Planner",
    copy: "Distribute priorities across the week, prevent overload, and spot risk days early.",
    href: "/planner",
    icon: <CalendarMonth color="primary" />,
  },
  {
    title: "Insights",
    copy: "Track completion quality, overdue trend, category balance, and weekly consistency.",
    href: "/insights",
    icon: <Insights color="primary" />,
  },
  {
    title: "Focus Mode",
    copy: "Launch distraction-resistant sessions tied to one task and see execution velocity.",
    href: "/focus",
    icon: <PlayArrow color="primary" />,
  },
  {
    title: "Reliable Task Flow",
    copy: "Capture with context, move quickly, and keep one source of truth across surfaces.",
    href: "/home",
    icon: <Sync color="primary" />,
  },
];

const metricCards: MetricCard[] = [
  {
    label: "Tasks structured per week",
    value: 24,
    suffix: "k+",
    caption: "Prioritized and tracked from capture to completion",
  },
  {
    label: "Average completion rate",
    value: 82,
    suffix: "%",
    caption: "Sustained output with fewer dropped commitments",
  },
  {
    label: "Focus sessions launched",
    value: 12,
    suffix: "k+",
    caption: "Intentional work blocks connected to outcomes",
  },
  {
    label: "Schedule confidence",
    value: 96,
    suffix: "%",
    caption: "Users report clearer weekly workload visibility",
  },
  {
    label: "On-time delivery improvement",
    value: 38,
    suffix: "%",
    caption: "Compared with unstructured to-do workflows",
  },
  {
    label: "Average weekly active days",
    value: 5.6,
    decimals: 1,
    caption: "Steady, repeatable execution across the week",
  },
  {
    label: "Workflow satisfaction",
    value: 4.8,
    suffix: "/5",
    decimals: 1,
    caption: "Rated for clarity, speed, and consistency",
  },
  {
    label: "Platform availability",
    value: 99.95,
    suffix: "%",
    decimals: 2,
    caption: "Reliable access when planning and executing",
  },
];

const pillarList: Pillar[] = [
  {
    icon: <Bolt color="primary" />,
    title: "Fast capture",
    copy: "Add title, notes, priority, and due date in seconds without context switching.",
  },
  {
    icon: <Timeline color="primary" />,
    title: "Visual load balancing",
    copy: "Weekly planning reveals collision points before they become fire drills.",
  },
  {
    icon: <Timer color="primary" />,
    title: "Single-task execution",
    copy: "Focused sessions protect attention and increase high-priority throughput.",
  },
  {
    icon: <DataUsage color="primary" />,
    title: "Decision-grade insights",
    copy: "Completion trends and overdue patterns inform practical planning changes.",
  },
  {
    icon: <Shield color="primary" />,
    title: "Predictable UX",
    copy: "A stable interface in both light and dark keeps momentum uninterrupted.",
  },
  {
    icon: <Lock color="primary" />,
    title: "Dependable behavior",
    copy: "Planner, Focus, and Insights stay synchronized to eliminate data mismatch.",
  },
];

const journeySteps: JourneyStep[] = [
  {
    step: "01",
    title: "Capture",
    copy: "Collect every task quickly with deadline and priority context.",
    outcome: "No loose notes or forgotten requests",
  },
  {
    step: "02",
    title: "Prioritize",
    copy: "Sort by urgency and impact to protect the most valuable work.",
    outcome: "Daily execution aligns to strategic goals",
  },
  {
    step: "03",
    title: "Execute",
    copy: "Start focused sessions tied to one clear task at a time.",
    outcome: "Higher completion quality with less context switching",
  },
  {
    step: "04",
    title: "Review",
    copy: "Inspect weekly data and rebalance next week proactively.",
    outcome: "Continuous improvement with measurable signal",
  },
];

const useCases: UseCase[] = [
  {
    title: "Individual Professionals",
    copy: "Run deliverables, meetings, and personal priorities in one operational rhythm.",
    metric: "2.1x better weekly planning consistency",
  },
  {
    title: "Founders & Operators",
    copy: "Keep product, hiring, and admin streams coordinated while moving fast.",
    metric: "35% reduction in overdue critical tasks",
  },
  {
    title: "Students",
    copy: "Plan assignments, revision cycles, and exams with deadline confidence.",
    metric: "Up to 4 extra focused study blocks per week",
  },
  {
    title: "Freelancers",
    copy: "Track clients, proposals, and delivery milestones without fragmented tooling.",
    metric: "29% faster project turnaround",
  },
  {
    title: "Small Teams",
    copy: "Unify personal accountability and team commitments with transparent progress.",
    metric: "41% stronger weekly completion predictability",
  },
  {
    title: "Side Project Builders",
    copy: "Convert spare hours into reliable progress with structured execution windows.",
    metric: "3x more frequent milestone shipping",
  },
];

const getRevealStyles = (
  isVisible: boolean,
  prefersReducedMotion: boolean,
  delay = 0,
  offset = 20,
): SxProps<Theme> => ({
  opacity: isVisible ? 1 : 0,
  transform:
    isVisible || prefersReducedMotion
      ? "none"
      : `translate3d(0, ${offset}px, 0)`,
  transition: prefersReducedMotion
    ? "none"
    : `opacity 720ms cubic-bezier(0.2, 0.65, 0.2, 1) ${delay}ms, transform 720ms cubic-bezier(0.2, 0.65, 0.2, 1) ${delay}ms`,
  willChange: prefersReducedMotion ? "auto" : "opacity, transform",
});

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(mediaQuery.matches);

    onChange();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

  return prefersReducedMotion;
}

function useRevealInView(threshold = 0.15, rootMargin = "0px 0px -10% 0px") {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible, rootMargin, threshold]);

  return { ref, isVisible };
}

function useCountUp(
  target: number,
  shouldStart: boolean,
  prefersReducedMotion: boolean,
  duration = 1400,
) {
  const [value, setValue] = useState(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!shouldStart || hasAnimatedRef.current) {
      return;
    }

    hasAnimatedRef.current = true;

    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    let animationFrame = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, [duration, prefersReducedMotion, shouldStart, target]);

  return value;
}

function formatMetricValue(value: number, decimals = 0) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  offset?: number;
  sx?: SxProps<Theme>;
  prefersReducedMotion: boolean;
}

function Reveal({
  children,
  delay = 0,
  offset = 20,
  sx,
  prefersReducedMotion,
}: RevealProps) {
  const { ref, isVisible } = useRevealInView();
  const revealSx = sx
    ? {
        ...(getRevealStyles(
          isVisible,
          prefersReducedMotion,
          delay,
          offset,
        ) as object),
        ...(sx as object),
      }
    : getRevealStyles(isVisible, prefersReducedMotion, delay, offset);

  return (
    <Box ref={ref} sx={revealSx}>
      {children}
    </Box>
  );
}

interface CountUpNumberProps {
  target: number;
  start: boolean;
  prefersReducedMotion: boolean;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function CountUpNumber({
  target,
  start,
  prefersReducedMotion,
  prefix,
  suffix,
  decimals,
}: CountUpNumberProps) {
  const displayValue = useCountUp(target, start, prefersReducedMotion, 1500);

  return (
    <>
      {prefix}
      {formatMetricValue(displayValue, decimals)}
      {suffix}
    </>
  );
}

interface AnimatedMetricCardProps {
  metric: MetricCard;
  isDarkMode: boolean;
  delay: number;
  prefersReducedMotion: boolean;
}

function AnimatedMetricCard({
  metric,
  isDarkMode,
  delay,
  prefersReducedMotion,
}: AnimatedMetricCardProps) {
  const { ref, isVisible } = useRevealInView(0.08, "0px 0px -12% 0px");

  return (
    <Paper
      ref={ref}
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        height: "100%",
        background: isDarkMode
          ? "linear-gradient(180deg, rgba(16,34,27,0.95), rgba(11,26,21,0.95))"
          : "linear-gradient(180deg, #ffffff, #f3f9f6)",
        border: "1px solid",
        borderColor: isDarkMode
          ? "rgba(255,255,255,0.1)"
          : "rgba(15,143,95,0.16)",
        ...getRevealStyles(isVisible, prefersReducedMotion, delay, 22),
      }}
    >
      <Typography
        sx={{
          fontWeight: 900,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          fontSize: { xs: "2.05rem", sm: "2.7rem", md: "3.1rem" },
          mb: 1.2,
        }}
      >
        <CountUpNumber
          target={metric.value}
          start={isVisible}
          prefersReducedMotion={prefersReducedMotion}
          prefix={metric.prefix}
          suffix={metric.suffix}
          decimals={metric.decimals}
        />
      </Typography>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ lineHeight: 1.25, mb: 1, minHeight: { xs: "auto", sm: 40 } }}
      >
        {metric.label}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.78 }}>
        {metric.caption}
      </Typography>
    </Paper>
  );
}

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null,
  );
  const prefersReducedMotion = usePrefersReducedMotion();

  const theme = useMemo(() => getAppTheme(isDarkMode), [isDarkMode]);

  const sectionPaperSx = {
    backgroundColor: isDarkMode ? "#0f1f1a" : "#ffffff",
    border: "1px solid",
    borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(15,143,95,0.15)",
    borderRadius: 3,
  };

  const highlightPaperSx = {
    background: isDarkMode
      ? "linear-gradient(180deg, #123026, #0e241d)"
      : "linear-gradient(180deg, #ffffff, #eef8f2)",
    border: "1px solid",
    borderColor: isDarkMode ? "rgba(255,255,255,0.14)" : "rgba(15,143,95,0.2)",
  };
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    ) as { id: number; username: string } | null;

    if (storedUser) {
      setUser(storedUser);
    }

    const prefersDarkMode = JSON.parse(
      localStorage.getItem("darkMode") || "true",
    ) as boolean;

    setIsDarkMode(prefersDarkMode);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          background: isDarkMode
            ? "radial-gradient(circle at 16% 14%, #0f4b36 0%, #08140f 38%, #050b08 100%)"
            : "radial-gradient(circle at 8% 16%, #dbf4e7 0%, #edf6f1 42%, #f6faf8 100%)",
          color: isDarkMode ? "#e7f4ed" : "#0d2621",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -180,
            right: -120,
            width: { xs: 280, md: 460 },
            height: { xs: 280, md: 460 },
            borderRadius: "50%",
            background: isDarkMode
              ? "radial-gradient(circle, rgba(28,140,94,0.24), rgba(28,140,94,0))"
              : "radial-gradient(circle, rgba(15,143,95,0.18), rgba(15,143,95,0))",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -160,
            left: -120,
            width: { xs: 260, md: 420 },
            height: { xs: 260, md: 420 },
            borderRadius: "50%",
            background: isDarkMode
              ? "radial-gradient(circle, rgba(28,140,94,0.2), rgba(28,140,94,0))"
              : "radial-gradient(circle, rgba(15,143,95,0.14), rgba(15,143,95,0))",
            pointerEvents: "none",
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            py: { xs: 4.5, md: 8 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Grid container spacing={{ xs: 2.5, md: 4 }} alignItems="stretch">
            <Grid item xs={12} md={7}>
              <Reveal prefersReducedMotion={prefersReducedMotion}>
                <Stack spacing={2.3}>
                  <Chip
                    icon={<RocketLaunch color="primary" />}
                    label="Flowlist Productivity Platform"
                    variant="outlined"
                    sx={{
                      alignSelf: "flex-start",
                      px: 0.8,
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.24)"
                        : "rgba(15,143,95,0.4)",
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 900,
                      letterSpacing: "-0.03em",
                      lineHeight: { xs: 1.1, md: 1.02 },
                      fontSize: {
                        xs: "2rem",
                        sm: "2.7rem",
                        md: "3.8rem",
                      },
                      maxWidth: 820,
                    }}
                  >
                    Operational clarity for every week, every task, every team.
                  </Typography>
                  <Typography
                    sx={{
                      opacity: 0.84,
                      fontSize: { xs: "1rem", md: "1.14rem" },
                      maxWidth: 760,
                    }}
                  >
                    Build a predictable execution system: capture high-signal
                    tasks, plan your load with confidence, and review
                    performance using practical metrics that improve week after
                    week.
                  </Typography>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.4}
                    sx={{ pt: 0.7 }}
                  >
                    <Button
                      component={Link}
                      href="/home"
                      variant="contained"
                      size="large"
                      startIcon={<CheckCircle />}
                    >
                      Enter workspace
                    </Button>
                    <Button
                      component={Link}
                      href={user ? "/planner" : "/auth/register"}
                      variant="outlined"
                      size="large"
                      startIcon={<CalendarMonth />}
                    >
                      {user ? "Plan this week" : "Create account"}
                    </Button>
                  </Stack>
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={1}
                    sx={{ pt: 0.8 }}
                  >
                    <Chip
                      icon={<DoneAll color="success" />}
                      label="Priority-based execution"
                      variant="outlined"
                    />
                    <Chip
                      icon={<DonutLarge color="primary" />}
                      label="Insight-led planning"
                      variant="outlined"
                    />
                    <Chip
                      icon={<Psychology color="primary" />}
                      label="Focus-first workflow"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              </Reveal>
            </Grid>

            <Grid item xs={12} md={5}>
              <Reveal
                prefersReducedMotion={prefersReducedMotion}
                delay={100}
                sx={{ height: "100%" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    ...highlightPaperSx,
                    p: { xs: 2.4, md: 3 },
                    borderRadius: 3,
                    height: "100%",
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="overline" sx={{ letterSpacing: 1.6 }}>
                      Today snapshot
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        ...sectionPaperSx,
                        p: 2,
                        borderRadius: 2.5,
                        backgroundColor: isDarkMode
                          ? "rgba(11,24,19,0.9)"
                          : "rgba(255,255,255,0.8)",
                      }}
                    >
                      <Stack spacing={1.2}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="subtitle1" fontWeight={800}>
                            Q1 launch checklist
                          </Typography>
                          <Chip size="small" color="error" label="High" />
                        </Stack>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Finalize onboarding flow, QA handoff notes, and
                          release sequence timeline.
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                          <Chip
                            size="small"
                            label="Due today"
                            variant="outlined"
                          />
                          <Chip
                            size="small"
                            label="Product"
                            variant="outlined"
                          />
                          <Chip
                            size="small"
                            label="Owner: Son"
                            variant="outlined"
                          />
                        </Stack>
                      </Stack>
                    </Paper>

                    <Grid container spacing={1.3}>
                      <Grid item xs={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            ...sectionPaperSx,
                            p: 1.6,
                            borderRadius: 2.2,
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="h5" fontWeight={900}>
                            14
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.78 }}>
                            Tasks done today
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            ...sectionPaperSx,
                            p: 1.6,
                            borderRadius: 2.2,
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="h5" fontWeight={900}>
                            5h 20m
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.78 }}>
                            Deep work time
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Divider sx={{ borderColor: "rgba(127,127,127,0.2)" }} />

                    <Stack spacing={1.1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <TrendingUp color="primary" />
                        <Typography variant="body2" sx={{ opacity: 0.84 }}>
                          Weekly completion trend is up 11% versus last week.
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Flag color="error" />
                        <Typography variant="body2" sx={{ opacity: 0.84 }}>
                          3 high-priority deadlines are due within 48 hours.
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Group color="primary" />
                        <Typography variant="body2" sx={{ opacity: 0.84 }}>
                          Team alignment score currently at 92%.
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Paper>
              </Reveal>
            </Grid>
          </Grid>

          <Reveal
            prefersReducedMotion={prefersReducedMotion}
            delay={60}
            sx={{ mt: { xs: 4, md: 6 } }}
          >
            <Paper
              elevation={0}
              sx={{ p: { xs: 2.5, md: 3.5 }, ...sectionPaperSx }}
            >
              <Stack spacing={1}>
                <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                  Performance Overview
                </Typography>
                <Typography variant="h4" fontWeight={900}>
                  Big numbers, measurable momentum
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.82, maxWidth: 820 }}
                >
                  Flowlist is engineered for execution quality at scale. These
                  indicators represent how structured planning and focused
                  action translate into consistent delivery.
                </Typography>
              </Stack>
            </Paper>
          </Reveal>

          <Grid container spacing={2} sx={{ mt: { xs: 0.4, md: 1 } }}>
            {metricCards.map((metric, index) => (
              <Grid item xs={12} sm={6} lg={3} key={metric.label}>
                <AnimatedMetricCard
                  metric={metric}
                  isDarkMode={isDarkMode}
                  delay={index * 80}
                  prefersReducedMotion={prefersReducedMotion}
                />
              </Grid>
            ))}
          </Grid>

          <Reveal
            prefersReducedMotion={prefersReducedMotion}
            delay={80}
            sx={{ mt: { xs: 4, md: 6 } }}
          >
            <Paper
              elevation={0}
              sx={{ p: { xs: 2.5, md: 3.5 }, ...sectionPaperSx }}
            >
              <Stack spacing={1}>
                <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                  Core Capability Stack
                </Typography>
                <Typography variant="h4" fontWeight={900}>
                  Designed for professional execution
                </Typography>
              </Stack>

              <Grid container spacing={2} sx={{ mt: 0.8 }}>
                {featureCards.map((card, index) => (
                  <Grid item xs={12} sm={6} key={card.title}>
                    <Reveal
                      prefersReducedMotion={prefersReducedMotion}
                      delay={index * 70}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.3,
                          height: "100%",
                          borderRadius: 2.5,
                          backgroundColor: isDarkMode ? "#14261f" : "#f7fbf9",
                          border: "1px solid",
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(15,143,95,0.14)",
                        }}
                      >
                        <Stack spacing={1.1}>
                          {card.icon}
                          <Typography variant="h6" fontWeight={800}>
                            {card.title}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.82 }}>
                            {card.copy}
                          </Typography>
                          <Button
                            component={Link}
                            href={card.href}
                            variant="text"
                            sx={{ alignSelf: "flex-start", mt: 0.4 }}
                          >
                            Open module
                          </Button>
                        </Stack>
                      </Paper>
                    </Reveal>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Reveal>

          <Grid container spacing={2.5} sx={{ mt: { xs: 1.5, md: 2.2 } }}>
            <Grid item xs={12} md={7}>
              <Reveal prefersReducedMotion={prefersReducedMotion}>
                <Paper
                  elevation={0}
                  sx={{ p: { xs: 2.5, md: 3.5 }, ...sectionPaperSx }}
                >
                  <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                    Execution Framework
                  </Typography>
                  <Typography variant="h4" fontWeight={900} gutterBottom>
                    Capture to review in one controlled loop
                  </Typography>
                  <Stack spacing={1.6} sx={{ mt: 1.5 }}>
                    {journeySteps.map((step, index) => (
                      <Reveal
                        key={step.step}
                        prefersReducedMotion={prefersReducedMotion}
                        delay={index * 90}
                        offset={16}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: { xs: 1.7, md: 2 },
                            borderRadius: 2.4,
                            backgroundColor: isDarkMode ? "#14261f" : "#f7fbf9",
                            border: "1px solid",
                            borderColor: isDarkMode
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(15,143,95,0.14)",
                          }}
                        >
                          <Stack spacing={0.5}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Chip
                                label={step.step}
                                color="primary"
                                size="small"
                                sx={{ color: "#ffffff", fontWeight: 700 }}
                              />
                              <Typography variant="subtitle1" fontWeight={800}>
                                {step.title}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ opacity: 0.84 }}>
                              {step.copy}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: isDarkMode ? "#8ce4b8" : "#0f8f5f",
                                fontWeight: 700,
                              }}
                            >
                              Outcome: {step.outcome}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Reveal>
                    ))}
                  </Stack>
                </Paper>
              </Reveal>
            </Grid>

            <Grid item xs={12} md={5}>
              <Reveal prefersReducedMotion={prefersReducedMotion} delay={80}>
                <Paper
                  elevation={0}
                  sx={{ p: { xs: 2.5, md: 3.5 }, ...sectionPaperSx }}
                >
                  <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                    Operating Principles
                  </Typography>
                  <Typography variant="h4" fontWeight={900} gutterBottom>
                    Focused, measurable, dependable
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 1.2 }}>
                    {[
                      "Clarity before volume",
                      "Priorities over urgency theater",
                      "Data-informed weekly planning",
                      "Consistent execution rhythm",
                      "Reliable interface behavior",
                      "Shared visibility across contexts",
                    ].map((item, index) => (
                      <Reveal
                        key={item}
                        prefersReducedMotion={prefersReducedMotion}
                        delay={index * 85}
                        offset={14}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle color="success" fontSize="small" />
                          <Typography variant="body2" sx={{ opacity: 0.84 }}>
                            {item}
                          </Typography>
                        </Stack>
                      </Reveal>
                    ))}
                  </Stack>

                  <Divider
                    sx={{ my: 2.2, borderColor: "rgba(127,127,127,0.2)" }}
                  />

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2.3,
                      backgroundColor: isDarkMode ? "#13261f" : "#f5faf7",
                      border: "1px solid",
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(15,143,95,0.16)",
                    }}
                  >
                    <Stack spacing={0.9}>
                      <Typography variant="subtitle1" fontWeight={800}>
                        Leadership-ready visibility
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.82 }}>
                        Build a weekly operating review with clear metrics,
                        delivery risk indicators, and throughput trends.
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        gap={1}
                      >
                        <Chip
                          size="small"
                          icon={<Insights />}
                          label="Completion trend"
                        />
                        <Chip
                          size="small"
                          icon={<Flag />}
                          label="Risk surfacing"
                        />
                        <Chip
                          size="small"
                          icon={<DataUsage />}
                          label="Load balance"
                        />
                      </Stack>
                    </Stack>
                  </Paper>
                </Paper>
              </Reveal>
            </Grid>
          </Grid>

          <Reveal
            prefersReducedMotion={prefersReducedMotion}
            sx={{ mt: { xs: 4, md: 6 } }}
          >
            <Paper
              elevation={0}
              sx={{ p: { xs: 2.5, md: 3.5 }, ...sectionPaperSx }}
            >
              <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                Platform Pillars
              </Typography>
              <Typography variant="h4" fontWeight={900} gutterBottom>
                Built for repeatable, professional delivery
              </Typography>
              <Grid container spacing={2} sx={{ mt: 0.6 }}>
                {pillarList.map((pillar, index) => (
                  <Grid item xs={12} sm={6} md={4} key={pillar.title}>
                    <Reveal
                      prefersReducedMotion={prefersReducedMotion}
                      delay={index * 75}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.1,
                          borderRadius: 2.3,
                          height: "100%",
                          backgroundColor: isDarkMode ? "#14261f" : "#f7fbf9",
                          border: "1px solid",
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(15,143,95,0.14)",
                        }}
                      >
                        <Stack spacing={1}>
                          {pillar.icon}
                          <Typography variant="subtitle1" fontWeight={800}>
                            {pillar.title}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.83 }}>
                            {pillar.copy}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Reveal>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Reveal>

          <Reveal
            prefersReducedMotion={prefersReducedMotion}
            sx={{ mt: { xs: 4, md: 6 } }}
          >
            <Paper
              elevation={0}
              sx={{ p: { xs: 2.5, md: 3.5 }, ...sectionPaperSx }}
            >
              <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                Who It Serves
              </Typography>
              <Typography variant="h4" fontWeight={900} gutterBottom>
                Adaptable across roles and workload styles
              </Typography>
              <Grid container spacing={2} sx={{ mt: 0.7 }}>
                {useCases.map((entry, index) => (
                  <Grid item xs={12} sm={6} md={4} key={entry.title}>
                    <Reveal
                      prefersReducedMotion={prefersReducedMotion}
                      delay={index * 70}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.2,
                          borderRadius: 2.3,
                          height: "100%",
                          backgroundColor: isDarkMode ? "#14261f" : "#f7fbf9",
                          border: "1px solid",
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(15,143,95,0.14)",
                        }}
                      >
                        <Stack spacing={1}>
                          <Typography variant="subtitle1" fontWeight={800}>
                            {entry.title}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.83 }}>
                            {entry.copy}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              color: isDarkMode ? "#8ce4b8" : "#0f8f5f",
                              mt: 0.4,
                            }}
                          >
                            {entry.metric}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Reveal>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Reveal>

          <Reveal
            prefersReducedMotion={prefersReducedMotion}
            sx={{ mt: { xs: 4, md: 6 } }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 4 },
                ...sectionPaperSx,
                background: isDarkMode
                  ? "linear-gradient(100deg, rgba(18,41,32,0.96), rgba(13,31,24,0.96))"
                  : "linear-gradient(100deg, #ffffff, #edf8f2)",
              }}
            >
              <Grid container spacing={2.2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      fontSize: { xs: "1.8rem", md: "2.5rem" },
                      mb: 1,
                    }}
                  >
                    Ready for a calmer, higher-performing workflow?
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ opacity: 0.84, maxWidth: 760 }}
                  >
                    Start with one workspace, one plan, and one repeatable
                    operating rhythm. Flowlist keeps execution visible, focused,
                    and measurable from day one.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack
                    direction={{ xs: "column", sm: "row", md: "column" }}
                    spacing={1.1}
                    sx={{ justifyContent: "center" }}
                  >
                    <Button
                      component={Link}
                      href="/auth/register"
                      variant="contained"
                      size="large"
                      startIcon={<CheckCircle />}
                    >
                      Create account
                    </Button>
                    <Button
                      component={Link}
                      href="/auth/login"
                      variant="outlined"
                      size="large"
                    >
                      Sign in
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Reveal>
        </Container>

        <Reveal prefersReducedMotion={prefersReducedMotion}>
          <Box
            component="footer"
            sx={{
              borderTop: "1px solid",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.12)"
                : "rgba(15,143,95,0.24)",
              background: isDarkMode
                ? "linear-gradient(180deg, rgba(7,16,12,0.96), rgba(5,11,8,0.96))"
                : "linear-gradient(180deg, rgba(243,250,246,0.95), rgba(236,247,241,0.95))",
              mt: { xs: 5, md: 7 },
              py: { xs: 4, md: 5 },
            }}
          >
            <Container maxWidth="xl">
              <Grid container spacing={2.4} alignItems="flex-start">
                <Grid item xs={12} md={5}>
                  <Typography variant="h6" fontWeight={900} gutterBottom>
                    Flowlist
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.84, maxWidth: 500 }}
                  >
                    A professional task operating system for structured
                    planning, focused execution, and measurable weekly delivery.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                    Explore
                  </Typography>
                  <Stack spacing={0.8}>
                    <Button
                      component={Link}
                      href="/home"
                      variant="text"
                      sx={{ justifyContent: "flex-start", px: 0 }}
                    >
                      Workspace
                    </Button>
                    <Button
                      component={Link}
                      href="/planner"
                      variant="text"
                      sx={{ justifyContent: "flex-start", px: 0 }}
                    >
                      Planner
                    </Button>
                    <Button
                      component={Link}
                      href="/insights"
                      variant="text"
                      sx={{ justifyContent: "flex-start", px: 0 }}
                    >
                      Insights
                    </Button>
                    <Button
                      component={Link}
                      href="/focus"
                      variant="text"
                      sx={{ justifyContent: "flex-start", px: 0 }}
                    >
                      Focus Mode
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                    Get Started
                  </Typography>
                  <Stack spacing={1}>
                    <Button
                      component={Link}
                      href={user ? "/home" : "/auth/register"}
                      variant="contained"
                      startIcon={<CheckCircle />}
                      sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
                    >
                      {user ? "Go to app" : "Create account"}
                    </Button>
                    <Button
                      component={Link}
                      href={user ? "/profile" : "/auth/login"}
                      variant="outlined"
                      sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
                    >
                      {user ? "View profile" : "Sign in"}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
              <Divider
                sx={{ my: 2.5, borderColor: "rgba(127,127,127,0.22)" }}
              />
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                Copyright {currentYear} Flowlist. Structured execution for
                modern teams and individuals.
              </Typography>
            </Container>
          </Box>
        </Reveal>
      </Box>
    </ThemeProvider>
  );
}
