export type TodoPriority = "low" | "medium" | "high";

export interface TodoItem {
  id: number;
  userId: string | number;
  task: string;
  category: string;
  completed: boolean;
  priority?: TodoPriority;
  dueDate?: string;
  notes?: string;
  createdAt?: number;
}
