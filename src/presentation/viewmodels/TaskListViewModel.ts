import { writable } from 'svelte/store';
import type { Task } from '../../core/models/Task';
import { GetTasksUseCase } from '../../core/usecases/GetTasksUseCase';
import { TaskRepositoryImpl } from '../../data/repositories/TaskRepositoryImpl';

export class TaskListViewModel {
	tasks = writable<Task[]>([]);
	loading = writable(false);
	error = writable<string | null>(null);

	private getTasksUseCase = new GetTasksUseCase(new TaskRepositoryImpl());

	async loadTasks() {
		this.loading.set(true);
		try {
			const data = await this.getTasksUseCase.execute();
			console.log('WKWK data', data);
			this.tasks.set(data);
		} catch (e: any) {
			console.log('WKWK ERROR', e.message);
			this.error.set(e.message);
		} finally {
			this.loading.set(false);
			console.log('WKWK loading', this.loading);
		}
	}
}
