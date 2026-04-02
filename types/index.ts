export type EntityStatus = "active" | "draft" | "archived" | "paused";
export type StaffRole = "admin" | "operator" | "content_manager";
export type DifficultyLevel = "easy" | "medium" | "hard";
export type LessonDifficulty = "beginner" | "intermediate" | "advanced";

export interface Section {
  id: string;
  name: string;
  code: string;
  description: string;
  lessons: number;
  status: EntityStatus;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  section: string;
  units: number;
  difficulty: LessonDifficulty;
  status: EntityStatus;
}

export interface Unit {
  id: string;
  lessonId: string;
  title: string;
  lesson: string;
  vocabularyCount: number;
  status: EntityStatus;
}

export interface QuestionSet {
  id: string;
  title: string;
  description: string;
  lessonId: string;
  unitId: string;
  lesson: string;
  unit: string;
  questionCount: number;
  difficulty: DifficultyLevel;
  status: EntityStatus;
  tags: string[];
}

export interface Question {
  id: string;
  questionSetId: string;
  prompt: string;
  type: "multiple-choice" | "true-false" | "typing";
  questionSet: string;
  difficulty: DifficultyLevel;
  status: EntityStatus;
}

export interface CreateQuestionSetPayload {
  title: string;
  description: string;
  lessonId: string;
  unitId: string;
  difficulty: DifficultyLevel;
  status: EntityStatus;
  tags: string[];
}

export interface QuestDefinition {
  id: string;
  title: string;
  rewardCoins: number;
  frequency: "daily" | "weekly" | "event";
  status: EntityStatus;
}

export interface TrophyTier {
  id: string;
  name: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  unlocks: number;
  progress: number;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: "booster" | "cosmetic" | "bundle";
  stockStatus: "in_stock" | "limited" | "out_of_stock";
}

export interface ShopOrder {
  id: string;
  orderNo: string;
  itemName: string;
  buyer: string;
  amount: number;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
}

export interface Actor {
  id: string;
  name: string;
  actorType: "guest" | "user";
  status: "online" | "offline" | "suspended";
  country: string;
}

export interface Wallet {
  id: string;
  owner: string;
  balance: number;
  tier: "starter" | "plus" | "vip";
  status: "healthy" | "review" | "frozen";
}

export interface CoinTransaction {
  id: string;
  walletOwner: string;
  type: "earn" | "spend" | "adjustment";
  amount: number;
  source: string;
  createdAt: string;
}

export interface AnalyticsSummary {
  dau: number;
  lessonsStarted: number;
  lessonsCompleted: number;
  revenueCoins: number;
  retentionRate: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  allowedRoles?: StaffRole[];
  children?: Array<{ title: string; href: string }>;
}

export interface StaffSession {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
}

export interface RouteAccessMeta {
  pattern: string;
  allowedRoles: StaffRole[];
  label: string;
}
