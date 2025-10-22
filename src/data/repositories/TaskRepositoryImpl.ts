import type { Task } from '../../core/models/Task';
import type { TaskRepository } from '../../core/repositories/TaskRepository';
import { TaskApiDataSource } from '../datasources/TaskApiDataSource';
import { toDomainTask, toTaskDto } from '../dtos/TaskDTO';

export class TaskRepositoryImpl implements TaskRepository {
	private api = new TaskApiDataSource();

	async getAll(): Promise<Task[]> {
		const dtoList = await this.api.fetchTasks();
		return dtoList.map(toDomainTask); // ✅ transform dari DTO ke Domain
	}

	async add(task: Task): Promise<void> {
		const taskDTO = toTaskDto(task); // ✅ transform dari Domain ke DTO
		await this.api.addTask(taskDTO); // Complete the API call
	}

	async toggle(id: string): Promise<void> {
		await this.api.toggleTask(id); // Complete the API call
	}
}
