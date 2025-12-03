import { GetTasksUseCase } from '$core/usecases/GetTasksUseCase';
import { LoginUseCase } from '$core/usecases/LoginUseCase';
import { LogoutUseCase } from '$core/usecases/LogoutUseCase';
import { RegisterUseCase } from '$core/usecases/RegisterUseCase';
import { VerifyTokenUseCase } from '$core/usecases/VerifyTokenUseCase';
import { TaskApiDataSource } from '$data/datasources/TaskApiDataSource';
import { AuthApiDataSource } from '$data/datasources/AuthApiDataSource';
import { TaskRepositoryImpl } from '$data/repositories/TaskRepositoryImpl';
import { AuthRepositoryImpl } from '$data/repositories/AuthRepositoryImpl';
import { LocalStorageRepositoryImpl } from '$data/repositories/LocalStorageRepositoryImpl';
import { createAuthStore } from '$presentation/stores/authStore';
import { TaskListViewModel } from '$presentation/viewmodels/tasks/TaskListViewModel';
import { LoginViewModel } from '$presentation/viewmodels/auth/LoginViewModel';
import { RegisterViewModel } from '$presentation/viewmodels/auth/RegisterViewModel';
import { AuthSessionViewModel } from '$presentation/viewmodels/auth/AuthSessionViewModel';

const taskApi = new TaskApiDataSource();
const taskRepository = new TaskRepositoryImpl(taskApi);
const getTasksUseCase = new GetTasksUseCase(taskRepository);

const authApi = new AuthApiDataSource();
const authRepository = new AuthRepositoryImpl(authApi);
const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);
const verifyTokenUseCase = new VerifyTokenUseCase(authRepository);
const logoutUseCase = new LogoutUseCase(authRepository);

const storage = new LocalStorageRepositoryImpl();
export const authStore = createAuthStore(storage);

export const createTaskListViewModel = () => new TaskListViewModel(getTasksUseCase);
export const createLoginViewModel = () => new LoginViewModel(loginUseCase, authStore);
export const createRegisterViewModel = () => new RegisterViewModel(registerUseCase, authStore);
export const createAuthSessionViewModel = () =>
	new AuthSessionViewModel(verifyTokenUseCase, logoutUseCase, authStore, storage);
