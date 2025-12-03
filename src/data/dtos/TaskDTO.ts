// Representasi dari backend (misalnya API response)
export interface TaskDTO {
	task_id: string;
	name: string;
	is_done: boolean;
}

// Mapper dari DTO → Domain Model
import type { Task } from '$core/models/Task';

export function toDomainTask(dto: TaskDTO): Task {
	return {
		id: dto.task_id,
		title: dto.name,
		completed: dto.is_done
	};
}

// Mapper dari Domain → DTO (untuk kirim ke server)
export function toTaskDto(domain: Task): TaskDTO {
	return {
		task_id: domain.id,
		name: domain.title,
		is_done: domain.completed
	};
}
