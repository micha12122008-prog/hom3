import { useState } from "react";
import {
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { getTodos, deleteTodo } from "@/services/api";

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClearCompleted = () => {
    Alert.alert(
      "Очистити виконані",
      "Ви впевнені, що хочете видалити всі завершені завдання?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            try {
              setIsProcessing(true);
              const todos = await getTodos();
              const completedTodos = todos.filter((t) => t.completed);
              await Promise.all(completedTodos.map((t) => deleteTodo(t.id)));
              Alert.alert("Успіх", "Виконані завдання видалено.");
            } catch (error) {
              Alert.alert("Помилка", "Не вдалося очистити завдання.");
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Видалити всі завдання",
      "Ви дійсно хочете видалити абсолютно всі завдання? Цю дію неможливо скасувати.",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити все",
          style: "destructive",
          onPress: async () => {
            try {
              setIsProcessing(true);
              const todos = await getTodos();
              await Promise.all(todos.map((t) => deleteTodo(t.id)));
              Alert.alert("Успіх", "Усі завдання успішно видалено.");
            } catch (error) {
              Alert.alert("Помилка", "Не вдалося видалити всі завдання.");
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.headerText, { color: colors.text }]}>Налаштування</Text>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingIconText}>
              <Ionicons
                name={isDarkMode ? "moon" : "sunny"}
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.settingText, { color: colors.text }]}>
                {isDarkMode ? "Темна тема" : "Світла тема"}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: "#D1D5DB", true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            Керування даними
          </Text>
          
          <TouchableOpacity
            style={[styles.actionButton, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
            onPress={handleClearCompleted}
            disabled={isProcessing}
          >
            <Ionicons name="checkmark-done-outline" size={22} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>Очистити виконані завдання</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDeleteAll}
            disabled={isProcessing}
          >
            <Ionicons name="trash-bin-outline" size={22} color={colors.danger} />
            <Text style={[styles.actionText, { color: colors.danger }]}>Видалити всі завдання</Text>
            {isProcessing && <ActivityIndicator size="small" color={colors.danger} style={{ marginLeft: "auto" }} />}
          </TouchableOpacity>
        </View>

        <View style={[styles.aboutSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="layers-outline" size={40} color={colors.primary} />
          <Text style={[styles.appName, { color: colors.text }]}>RN Todo List</Text>
          <Text style={[styles.appVersion, { color: colors.textMuted }]}>v2.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 8,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingIconText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  aboutSection: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },
  appVersion: {
    fontSize: 14,
    marginTop: 4,
  },
});