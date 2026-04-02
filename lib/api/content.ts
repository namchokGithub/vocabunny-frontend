import type {
  CreateQuestionSetPayload,
  Lesson,
  Question,
  QuestionSet,
  Section,
  Unit,
} from "@/types";
import { apiClient } from "./client";

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

const questionSets: QuestionSet[] = [
  {
    id: "QSET-001",
    title: "Greetings Quick Quiz",
    description: "Short comprehension set for basic greetings and farewells.",
    lessonId: "LES-001",
    unitId: "UNT-001",
    lesson: "Greetings Sprint",
    unit: "Hello and Bye",
    questionCount: 10,
    difficulty: "easy",
    status: "active",
    tags: ["starter", "speaking"],
  },
  {
    id: "QSET-002",
    title: "Gear Rush",
    description: "Recognition and typing drills for classroom equipment vocabulary.",
    lessonId: "LES-002",
    unitId: "UNT-002",
    lesson: "School Missions",
    unit: "Classroom Gear",
    questionCount: 15,
    difficulty: "medium",
    status: "active",
    tags: ["daily-life", "gear"],
  },
  {
    id: "QSET-003",
    title: "Boss Warmup",
    description: "Pre-boss review set for recap words and challenge pacing.",
    lessonId: "LES-003",
    unitId: "UNT-003",
    lesson: "Boss Review Alpha",
    unit: "Battle Recap",
    questionCount: 8,
    difficulty: "hard",
    status: "draft",
    tags: ["boss", "review"],
  },
];

const questions: Question[] = [
  {
    id: "Q-001",
    questionSetId: "QSET-001",
    prompt: "Choose the correct meaning of 'greet'.",
    type: "multiple-choice",
    questionSet: "Greetings Quick Quiz",
    difficulty: "easy",
    status: "active",
  },
  {
    id: "Q-002",
    questionSetId: "QSET-002",
    prompt: "Type the word for a chair used in class.",
    type: "typing",
    questionSet: "Gear Rush",
    difficulty: "medium",
    status: "active",
  },
  {
    id: "Q-003",
    questionSetId: "QSET-003",
    prompt: "True or false: 'defeat' means to win against.",
    type: "true-false",
    questionSet: "Boss Warmup",
    difficulty: "hard",
    status: "draft",
  },
];

export const contentApi = {
  getSections: () => apiClient.mock(sections),
  getLessons: () => apiClient.mock(lessons),
  getUnits: () => apiClient.mock(units),
  getQuestionSets: () => apiClient.mock(questionSets),
  getQuestions: () => apiClient.mock(questions),
  createQuestionSet: (payload: CreateQuestionSetPayload) =>
    apiClient.mock({
      id: `QSET-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      lessonId: payload.lessonId,
      unitId: payload.unitId,
      lesson: payload.lessonId,
      unit: payload.unitId,
      questionCount: 0,
      difficulty: payload.difficulty,
      status: payload.status,
      tags: payload.tags,
    }),
};
