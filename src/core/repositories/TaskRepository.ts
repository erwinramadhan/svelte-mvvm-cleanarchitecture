import type { Task } from '../models/Task';

export interface TaskRepository {
	getAll(): Promise<Task[]>;
	add(task: Task): Promise<void>;
	toggle(id: string): Promise<void>;
}
