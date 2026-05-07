import type { Question } from "@/types";
import { apiClient } from "./client";

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

export const questionApi = {
  getQuestions: () => apiClient.mock(questions),
};
