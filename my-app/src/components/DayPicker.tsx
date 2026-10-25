import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import { dayParts } from '@/utils/dates';

/** Wrapping grid of day tiles (weekday + number). Works for single or multi select. */
export function DayPicker({
  days,
  selected,
  onToggle,
}: {
  days: string[];
  selected: string[];
  onToggle: (iso: string) => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {days.map((iso) => {
        const on = selected.includes(iso);
        const { dow, day, month } = dayParts(iso);
        return (
          <Pressable
            key={iso}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${dow} ${month} ${day}`}
            onPress={() => onToggle(iso)}
            style={{
              width: 56,
              paddingVertical: 8,
              borderRadius: 16,
              alignItems: 'center',
              borderWidth: 1.5,
              backgroundColor: on ? colors.primary : colors.surfaceAlt,
              borderColor: on ? colors.primary : colors.border,
            }}>
            <Text
              style={{
                color: on ? colors.onPrimary : colors.textMuted,
                fontSize: 12,
                fontWeight: '700',
              }}>
              {dow}
            </Text>
            <Text
              style={{
                color: on ? colors.onPrimary : colors.text,
                fontSize: 18,
                fontWeight: '800',
              }}>
              {day}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}