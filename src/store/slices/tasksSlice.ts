
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';

export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

// Load tasks from localStorage
const loadTasksFromStorage = (): Task[] => {
  try {
    const tasksJson = localStorage.getItem('tasks');
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (e) {
    console.error('Error loading tasks from localStorage', e);
    return [];
  }
};

// Save tasks to localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks to localStorage', e);
  }
};

const initialState: TasksState = {
  tasks: loadTasksFromStorage(),
  loading: false,
  error: null,
};

// Async thunks for simulating API calls
export const fetchTasks = createAsyncThunk<Task[], void, { state: RootState }>(
  'tasks/fetchTasks',
  async (_, { getState }) => {
    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getState().tasks.tasks;
  }
);

export const addTaskAsync = createAsyncThunk<Task, Omit<Task, 'id' | 'createdAt'>, { state: RootState }>(
  'tasks/addTaskAsync',
  async (newTask, { getState }) => {
    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    return task;
  }
);

export const deleteTaskAsync = createAsyncThunk<string, string>(
  'tasks/deleteTaskAsync',
  async (taskId) => {
    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return taskId;
  }
);

export const toggleTaskAsync = createAsyncThunk<string, string, { state: RootState }>(
  'tasks/toggleTaskAsync',
  async (taskId, { getState }) => {
    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return taskId;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
      saveTasksToStorage(state.tasks);
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      saveTasksToStorage(state.tasks);
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        saveTasksToStorage(state.tasks);
      }
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        saveTasksToStorage(state.tasks);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        saveTasksToStorage(state.tasks);
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        saveTasksToStorage(state.tasks);
      })
      .addCase(toggleTaskAsync.fulfilled, (state, action) => {
        const task = state.tasks.find((task) => task.id === action.payload);
        if (task) {
          task.completed = !task.completed;
          saveTasksToStorage(state.tasks);
        }
      });
  },
});

export const { addTask, deleteTask, toggleTask, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;
