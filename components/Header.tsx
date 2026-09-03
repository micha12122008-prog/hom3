import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  totalCount: number;
  completedCount: number;
}

export function Header({ totalCount, completedCount }: HeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <View style={styles.titleRow}>
        <Text style={styles.icon}>📝</Text>
        <Text style={[styles.title, { color: colors.text }]}>
          Мій Список Завдань
        </Text>
      </View>
      
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        {totalCount === 0
          ? "Додайте своє перше завдання"
          : `Виконано ${completedCount} з ${totalCount}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 28,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
  },
});