import { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { getTodos } from "@/services/api";
import type { Todo } from "@/types";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.title, { color: colors.textMuted }]}>{title}</Text>
    </View>
  );
};

export default function StatsScreen() {
  const { colors } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      console.error("Помилка завантаження статистики:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, active, completed, percentage };
  }, [todos]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      {loading && todos.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchStats}
              tintColor={colors.primary}
            />
          }
        >
          <Text style={[styles.headerText, { color: colors.text }]}>
            Ваша продуктивність
          </Text>

          <View style={styles.grid}>
            <StatCard
              title="Всього завдань"
              value={stats.total}
              icon="list-outline"
              color={colors.primary}
            />
            <StatCard
              title="В процесі"
              value={stats.active}
              icon="time-outline"
              color="#F59E0B"
            />
            <StatCard
              title="Виконано"
              value={stats.completed}
              icon="checkmark-circle-outline"
              color={colors.success}
            />
            <StatCard
              title="Прогрес"
              value={`${stats.percentage}%`}
              icon="trending-up-outline"
              color="#8B5CF6"
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});