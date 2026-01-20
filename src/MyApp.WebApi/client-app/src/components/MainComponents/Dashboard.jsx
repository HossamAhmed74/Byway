import React from "react";
import Sidebar from "../DashboardComponents/Sidebar";
import {
  categoriesList,
  instructorsList,
  coursesAtom,
} from "../Jotai/courses/CreateCourseAtoms";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [categories] = useAtom(categoriesList);
  const [instructors] = useAtom(instructorsList);
  const [courses] = useAtom(coursesAtom);
  const [courseCount, setCourseCount] = useState(0);
  const [instructorsCount, setInstructorCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/Courses/GetAllCourses");
        const data = await response.json();
        setCourseCount(data.length);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [courses]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch("/api/Instructor/GetAllInstructors");
        const data = await response.json();
        setInstructorCount(data.length);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };
    fetchInstructors();
  }, [instructors]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/Category/GetAllCategories");
        const data = await response.json();
        setCategoriesCount(data.length);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [categories]);

  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <TopBar />

          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold relative bottom-[4rem]">
              Dashboard
            </h1>
            <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-3">
              <KPI title="Instructors" value={instructorsCount} icon="👤" />
              <KPI title="Categories" value={categoriesCount} icon="📄" />
              <KPI title="Courses" value={courseCount} icon="📚" />
            </div>

            <div className="mt-6 grid gap-6 grid-cols-1 xl:grid-cols-3">
              <WalletCard className="xl:col-span-2" />
              <PieCard
                instructorCount={instructorsCount}
                categoriesCount={categoriesCount}
                courseCount={courseCount}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ——— Inline components ——— */
function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
      <div className="md:hidden flex items-center gap-3">
        <button className="h-9 w-9 grid place-content-center rounded-lg border border-slate-200">
          ☰
        </button>
        <span className="font-semibold">Byway</span>
      </div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        <button className="h-9 w-9 grid place-content-center rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}

function KPI({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/5 p-5 flex items-center justify-between">
      <div>
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-xs text-slate-500 mt-1">{title}</div>
      </div>
      <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 grid place-content-center text-lg">
        {icon}
      </div>
    </div>
  );
}

function WalletCard({ className = "" }) {
  return (
    <section
      className={`bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/5 p-5 ${className}`}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold">Wallet</h3>
        <span className="text-xs text-slate-500">This month</span>
      </div>

      <div className="mt-3">
        <div className="text-3xl font-bold">$37.5K</div>
        <div className="text-xs text-slate-500 mt-1">
          Wallet Balance · <span className="text-emerald-600">+2.45%</span>
        </div>

        <div className="flex items-center gap-2 text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>On your account</span>
        </div>
      </div>

      <div className="mt-6">
        <svg viewBox="0 0 600 220" className="w-full h-48">
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g transform="translate(8,8)">
            <rect x="0" y="0" width="584" height="204" rx="12" fill="#f8fafc" />
            <path
              d="M0,150 C60,120 120,140 180,110 C240,80 300,120 360,90 C420,60 480,110 540,80"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M0,150 C60,120 120,140 180,110 C240,80 300,120 360,90 C420,60 480,110 540,80 L540,204 L0,204 Z"
              fill="url(#g1)"
            />
            <path
              d="M0,170 C60,160 120,150 180,160 C240,140 300,150 360,140 C420,120 480,140 540,130"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M0,170 C60,160 120,150 180,160 C240,140 300,150 360,140 C420,120 480,140 540,130 L540,204 L0,204 Z"
              fill="url(#g2)"
            />
          </g>
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-8 text-sm">
        <div className="space-y-2">
          <Legend color="#6366f1" label="Deposits" />
          <Legend color="#22d3ee" label="Withdrawals" />
        </div>

        {/* Month Labels - UNDER the diagram */}
        <div className="flex justify-between  relative right-[13rem] text-xs text-slate-400">
          <span>SEP</span>
          <span>OCT</span>
          <span>NOV</span>
          <span>DEC</span>
          <span>JAN</span>
        </div>
      </div>
    </section>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      <span className="text-slate-600">{label}</span>
    </div>
  );
}

function PieCard({ instructorCount, categoriesCount, courseCount }) {
  const total = instructorCount + categoriesCount + courseCount || 1;

  const slices = [
    {
      pct: (instructorCount / total) * 100,
      color: "#6366f1",
      label: "Instructors",
    },
    {
      pct: (categoriesCount / total) * 100,
      color: "#38bdf8",
      label: "Categories",
    },
    { pct: (courseCount / total) * 100, color: "#94a3b8", label: "Courses" },
  ];

  const cumulative = slices.reduce(
    (acc, s) => {
      const start = acc.total;
      const end = start + s.pct;
      acc.total = end;
      acc.spans.push([start, end]);
      return acc;
    },
    { total: 0, spans: [] }
  ).spans;

  const circle = { cx: 80, cy: 80, r: 56, c: 2 * Math.PI * 56 };

  return (
    <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/5 p-5">
      <h3 className="font-semibold mb-6">Statistics</h3>

      {/* Pie Chart */}
      <div className="flex justify-center mb-4">
        <svg viewBox="0 0 160 160" className="h-44 w-44">
          <circle cx={circle.cx} cy={circle.cy} r={circle.r} fill="#eef2ff" />
          {slices.map((s, i) => (
            <circle
              key={s.label}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill="transparent"
              stroke={s.color}
              strokeWidth="40"
              strokeDasharray={`${(s.pct / 100) * circle.c} ${circle.c}`}
              strokeDashoffset={-((cumulative[i][0] / 100) * circle.c)}
              transform="rotate(-90 80 80)"
            />
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-sm mt-9">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-slate-600">{s.label}</span>
            <span className="font-semibold">{Math.round(s.pct)}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
