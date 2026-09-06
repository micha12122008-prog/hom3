import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import type { Todo } from "@/types";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: any[];
  refreshing?: boolean;
  onRefresh?: () => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (id: string, text: string) => Promise<void>;
}

export function TodoList({
  todos,
  refreshing = false,
  onRefresh = async () => {},
  onToggle,
  onDelete,
  onEdit = async () => {},
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Список завдань порожній. Додайте нове завдання!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => (item.id || item._id).toString()}
      renderItem={({ item }) => {
        const normalizedTodo = {
          ...item,
          id: item.id || item._id,
          completed: item.completed !== undefined ? item.completed : item.isCompleted,
        };

        return (
          <TodoItem
            todo={normalizedTodo as Todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        );
      }}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#6366f1"]}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
});