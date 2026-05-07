import type { Lesson, Section, Unit } from "@/types";
import { apiClient } from "../client";

const sections: Section[] = [
  {
    id: "SEC-001",
    name: "Starter Worlds",
    code: "START",
    description: "First-run vocabulary progression and onboarding worlds.",
    lessons: 12,
    status: "active",
    updatedAt: "2026-04-01",
  },
  {
    id: "SEC-002",
    name: "Daily Life",
    code: "LIFE",
    description: "Everyday topics designed for retention and repeat practice.",
    lessons: 18,
    status: "active",
    updatedAt: "2026-03-30",
  },
  {
    id: "SEC-003",
    name: "Boss Arena",
    code: "BOSS",
    description: "Challenge content and review-focused boss encounters.",
    lessons: 6,
    status: "draft",
    updatedAt: "2026-03-28",
  },
];

const lessons: Lesson[] = [
  {
    id: "LES-001",
    sectionId: "SEC-001",
    title: "Greetings Sprint",
    section: "Starter Worlds",
    units: 4,
    difficulty: "beginner",
    status: "active",
  },
  {
    id: "LES-002",
    sectionId: "SEC-002",
    title: "School Missions",
    section: "Daily Life",
    units: 5,
    difficulty: "intermediate",
    status: "active",
  },
  {
    id: "LES-003",
    sectionId: "SEC-003",
    title: "Boss Review Alpha",
    section: "Boss Arena",
    units: 2,
    difficulty: "advanced",
    status: "draft",
  },
];

const units: Unit[] = [
  {
    id: "UNT-001",
    lessonId: "LES-001",
    title: "Hello and Bye",
    lesson: "Greetings Sprint",
    vocabularyCount: 24,
    status: "active",
  },
  {
    id: "UNT-002",
    lessonId: "LES-002",
    title: "Classroom Gear",
    lesson: "School Missions",
    vocabularyCount: 30,
    status: "active",
  },
  {
    id: "UNT-003",
    lessonId: "LES-003",
    title: "Battle Recap",
    lesson: "Boss Review Alpha",
    vocabularyCount: 14,
    status: "draft",
  },
];

export const contentApi = {
  getSections: () => apiClient.mock(sections),
  getLessons: () => apiClient.mock(lessons),
  getUnits: () => apiClient.mock(units),
};
