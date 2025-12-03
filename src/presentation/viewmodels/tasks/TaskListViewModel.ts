import { writable, type Writable } from 'svelte/store';
import type { Task } from '$core/models/Task';
import type { GetTasksUseCase } from '$core/usecases/GetTasksUseCase';

export class TaskListViewModel {
	tasks: Writable<Task[]> = writable([]);
	loading = writable(false);
	error = writable<string | null>(null);

	constructor(private getTasksUseCase: GetTasksUseCase) {}

	async loadTasks() {
		this.loading.set(true);
		try {
			const data = await this.getTasksUseCase.execute();
			this.tasks.set(data);
			this.error.set(null);
		} catch (err) {
			const message = (err as Error).message || 'Failed to load tasks';
			this.error.set(message);
		} finally {
			this.loading.set(false);
		}
	}
}
