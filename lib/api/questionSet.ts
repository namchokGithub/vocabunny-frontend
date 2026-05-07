import type { CreateQuestionSetPayload, QuestionSet } from "@/types";
import { apiClient } from "./client";

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

export const questionSetApi = {
  getQuestionSets: () => apiClient.mock(questionSets),
  createQuestionSet: (payload: CreateQuestionSetPayload) =>
    apiClient.mock<QuestionSet>({
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
