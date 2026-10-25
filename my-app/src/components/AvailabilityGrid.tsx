import { Pressable, ScrollView, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import { dayParts } from '@/utils/dates';

export const TIME_SLOTS = ['10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'];

export const slotKey = (iso: string, slot: string) => `${iso}|${slot}`;

/**
 * LettuceMeet-style grid: days across, time slots down. Tap a cell to toggle it,
 * tap a day header to toggle that whole day.
 */
export function AvailabilityGrid({
  days,
  value,
  onChange,
}: {
  days: string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const { colors } = useAppTheme();

  const toggleCell = (key: string) =>
    onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);

  const toggleDay = (iso: string) => {
    const keys = TIME_SLOTS.map((s) => slotKey(iso, s));
    const allOn = keys.every((k) => value.includes(k));
    onChange(allOn ? value.filter((k) => !keys.includes(k)) : Array.from(new Set([...value, ...keys])));
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1.5,
        borderRadius: 24,
        padding: 12,
      }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: 52 }} />
            {days.map((iso) => {
              const { dow, day } = dayParts(iso);
              return (
                <Pressable
                  key={iso}
                  accessibilityRole="button"
                  accessibilityLabel={`Toggle all of ${dow} ${day}`}
                  onPress={() => toggleDay(iso)}
                  style={{ width: 58, alignItems: 'center', paddingBottom: 8 }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '700' }}>
                    {dow}
                  </Text>
                  <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800' }}>{day}</Text>
                </Pressable>
              );
            })}
          </View>

          {TIME_SLOTS.map((slot) => (
            <View key={slot} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 52 }}>
                <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600' }}>
                  {slot}
                </Text>
              </View>
              {days.map((iso) => {
                const key = slotKey(iso, slot);
                const on = value.includes(key);
                return (
                  <Pressable
                    key={key}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={`${iso} at ${slot}`}
                    onPress={() => toggleCell(key)}
                    style={{ width: 58, height: 38, padding: 3 }}>
                    <View
                      style={{
                        flex: 1,
                        borderRadius: 10,
                        borderWidth: 1.5,
                        backgroundColor: on ? colors.accent : colors.surfaceAlt,
                        borderColor: on ? colors.accent : colors.border,
                      }}
                    />
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
