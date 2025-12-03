import type { TaskDTO } from '$data/dtos/TaskDTO';
import axiosInstance from '$lib/api/axios-instance';

export class TaskApiDataSource {
	private baseUrl = '/tasks';

	async fetchTasks(): Promise<TaskDTO[]> {
		try {
			const response = await axiosInstance.get<TaskDTO[]>(this.baseUrl);
			return response.data;
		} catch (error) {
			console.error('Failed to fetch tasks:', error);
			throw new Error('Failed to fetch tasks');
		}
	}

	async addTask(task: TaskDTO): Promise<void> {
		try {
			await axiosInstance.post(this.baseUrl, task);
		} catch (error) {
			console.error('Failed to add task:', error);
			throw new Error('Failed to add task');
		}
	}

	async toggleTask(id: string): Promise<void> {
		try {
			// First get the current task to get its current is_done status
			const response = await axiosInstance.get<TaskDTO>(`${this.baseUrl}/${id}`);
			const currentTask = response.data;

			// Toggle the is_done property and update the task
			await axiosInstance.patch(`${this.baseUrl}/${id}`, {
				is_done: !currentTask.is_done
			});
		} catch (error) {
			console.error('Failed to toggle task:', error);
			throw new Error('Failed to toggle task');
		}
	}
}
