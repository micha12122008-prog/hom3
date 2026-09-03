import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface TodoFormProps {
  onAdd: (text: string) => Promise<void>;
  loading: boolean;
}

export function TodoForm({ onAdd, loading }: TodoFormProps) {
  const { colors } = useTheme();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || loading || isSubmitting) return;

    setIsSubmitting(true);
    Keyboard.dismiss();

    try {
      await onAdd(text.trim());
      setText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = !text.trim() || loading || isSubmitting;

  return (
    <View style={styles.form}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.bg,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Що потрібно зробити?"
        placeholderTextColor={colors.textMuted}
        value={text}
        onChangeText={setText}
        editable={!(loading || isSubmitting)}
        maxLength={120}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDisabled ? colors.textMuted : colors.primary },
        ]}
        disabled={isDisabled}
        onPress={handleSubmit}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Додати</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});