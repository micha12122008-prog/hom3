import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "react-native";
import type { Todo } from "@/types";
import {
  getTodos,
  addTodo as apiAddTodo,
  toggleTodo as apiToggleTodo,
  updateTodoText as apiUpdateTodoText,
  deleteTodo as apiDeleteTodo,
} from "@/services/api";

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  refreshTodos: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  updateTodo: (id: string, text: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  clearAll: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTodos = async () => {
    try {
      setError(null);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError("Не вдалося з'єднатися з сервером.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTodos();
  }, []);

  const addTodo = async (text: string) => {
    try {
      const newTodo = await apiAddTodo(text);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      Alert.alert("Помилка", "Не вдалося створити завдання.");
      throw err;
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
      await apiToggleTodo(id, completed);
    } catch (err) {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
      Alert.alert("Помилка", "Не вдалося оновити статус.");
    }
  };

  const updateTodo = async (id: string, text: string) => {
    try {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
      await apiUpdateTodoText(id, text);
    } catch (err) {
      refreshTodos();
      Alert.alert("Помилка", "Не вдалося оновити текст.");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      await apiDeleteTodo(id);
    } catch (err) {
      refreshTodos();
      Alert.alert("Помилка", "Не вдалося видалити завдання.");
    }
  };

  const clearCompleted = async () => {
    try {
      const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
      setTodos((prev) => prev.filter((t) => !t.completed));
      await Promise.all(completedIds.map((id) => apiDeleteTodo(id)));
    } catch (err) {
      refreshTodos();
      throw err;
    }
  };

  const clearAll = async () => {
    try {
      const allIds = todos.map((t) => t.id);
      setTodos([]);
      await Promise.all(allIds.map((id) => apiDeleteTodo(id)));
    } catch (err) {
      refreshTodos();
      throw err;
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        refreshTodos,
        addTodo,
        toggleTodo,
        updateTodo,
        deleteTodo,
        clearCompleted,
        clearAll,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};