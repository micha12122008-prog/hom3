import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import type { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      setEditText(todo.text);
      setIsEditing(false);
      return;
    }
    if (trimmed !== todo.text) {
      try {
        setIsUpdating(true);
        await onEdit(todo.id, trimmed);
      } finally {
        setIsUpdating(false);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  return (
    <View
      style={[
        styles.todoItem,
        { backgroundColor: colors.surface, borderColor: colors.border },
        isUpdating && styles.updatingItem,
      ]}
    >
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => onToggle(todo.id, !todo.completed)}
        disabled={isUpdating}
        activeOpacity={0.7}
      >
        <Ionicons
          name={todo.completed ? "checkmark-circle" : "ellipse-outline"}
          size={26}
          color={todo.completed ? colors.success : colors.textMuted}
        />
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={[
            styles.todoEditInput,
            { color: colors.text, borderBottomColor: colors.primary },
          ]}
          value={editText}
          onChangeText={setEditText}
          onBlur={handleSave}
          onSubmitEditing={handleSave}
          autoFocus
          maxLength={120}
          returnKeyType="done"
        />
      ) : (
        <TouchableOpacity
          style={styles.textContainer}
          onLongPress={() => setIsEditing(true)}
          disabled={isUpdating}
          activeOpacity={0.6}
        >
          <Text
            style={[
              styles.todoText,
              { color: todo.completed ? colors.textMuted : colors.text },
              todo.completed && styles.todoTextCompleted,
            ]}
          >
            {todo.text}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.todoActions}>
        {!isEditing && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setIsEditing(true)}
            disabled={isUpdating}
          >
            <Ionicons name="pencil-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onDelete(todo.id)}
          disabled={isUpdating}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  updatingItem: {
    opacity: 0.5,
  },
  checkboxContainer: {
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  todoText: {
    fontSize: 16,
  },
  todoTextCompleted: {
    textDecorationLine: "line-through",
  },
  todoEditInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    borderBottomWidth: 1,
  },
  todoActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    gap: 8,
  },
  actionBtn: {
    padding: 6,
  },
});