import type { Task } from '../models/Task';
import type { TaskRepository } from '../repositories/TaskRepository';

export class GetTasksUseCase {
	constructor(private repo: TaskRepository) {}

	async execute(): Promise<Task[]> {
		return await this.repo.getAll();
	}
}
