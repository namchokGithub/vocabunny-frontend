import type { CreateQuestionSetPayload, DifficultyLevel, EntityStatus } from "@/types";

export interface QuestionSetFormValues {
  title: string;
  description: string;
  lessonId: string;
  unitId: string;
  difficulty: DifficultyLevel | "";
  status: EntityStatus | "";
  tags: string;
}

export type QuestionSetFormErrors = Partial<Record<keyof QuestionSetFormValues, string>>;

export const defaultQuestionSetValues: QuestionSetFormValues = {
  title: "",
  description: "",
  lessonId: "",
  unitId: "",
  difficulty: "",
  status: "draft",
  tags: "",
};

export function validateQuestionSetForm(
  values: QuestionSetFormValues,
): QuestionSetFormErrors {
  const errors: QuestionSetFormErrors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!values.lessonId.trim()) {
    errors.lessonId = "Lesson ID is required.";
  }

  if (!values.unitId.trim()) {
    errors.unitId = "Unit ID is required.";
  }

  if (!["easy", "medium", "hard"].includes(values.difficulty)) {
    errors.difficulty = "Difficulty must be easy, medium, or hard.";
  }

  if (!["active", "draft", "archived", "paused"].includes(values.status)) {
    errors.status = "Status must be active, draft, archived, or paused.";
  }

  if (values.description.trim().length > 300) {
    errors.description = "Description must be 300 characters or fewer.";
  }

  return errors;
}

export function toCreateQuestionSetPayload(
  values: QuestionSetFormValues,
): CreateQuestionSetPayload {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    lessonId: values.lessonId.trim(),
    unitId: values.unitId.trim(),
    difficulty: values.difficulty || "easy",
    status: values.status || "draft",
    tags: values.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  };
}
