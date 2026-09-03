import { useState, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import type { Todo } from "@/types";
import {
  getTodos,
  addTodo,
  toggleTodo,
  updateTodoText,
  deleteTodo,
} from "@/services/api";
import { useTheme } from "@/context/ThemeContext";

export default function Index() {
  const { colors } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError("Не вдалося з'єднатися з сервером.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (text: string) => {
    try {
      const newTodo = await addTodo(text);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      Alert.alert("Помилка", "Не вдалося створити завдання.");
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed } : t)),
      );
      await toggleTodo(id, completed);
    } catch (err) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)),
      );
      Alert.alert("Помилка", "Не вдалося оновити статус завдання.");
    }
  };

  const handleEdit = async (id: string, text: string) => {
    try {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
      await updateTodoText(id, text);
    } catch (err) {
      fetchTodos();
      Alert.alert("Помилка", "Не вдалося оновити текст завдання.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      await deleteTodo(id);
    } catch (err) {
      fetchTodos();
      Alert.alert("Помилка", "Не вдалося видалити завдання.");
    }
  };

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos],
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Header totalCount={todos.length} completedCount={completedCount} />

          {error && (
            <View style={[styles.errorBanner, { backgroundColor: `${colors.danger}20` }]}>
              <View style={styles.errorTextContainer}>
                <Text style={[styles.errorTitle, { color: colors.danger }]}>{"⚠️ Помилка"}</Text>
                <Text style={{ color: colors.text }}>{error}</Text>
              </View>
              <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.danger }]} onPress={() => fetchTodos()}>
                <Text style={styles.retryBtnText}>Повторити</Text>
              </TouchableOpacity>
            </View>
          )}

          <TodoForm onAdd={handleAdd} loading={loading} />

          {loading && !refreshing && todos.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textMuted }]}>Завантаження...</Text>
            </View>
          ) : (
            <View style={styles.listWrapper}>
              <TodoList
                todos={todos}
                refreshing={refreshing}
                onRefresh={() => fetchTodos(true)}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  card: {
    flex: 1,
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorTextContainer: { flex: 1, marginRight: 12 },
  errorTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  retryBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  retryBtnText: { color: "#ffffff", fontWeight: "600", fontSize: 14 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 16 },
  listWrapper: { flex: 1, marginTop: 16 },
});