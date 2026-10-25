import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import { WEEKDAY_LETTERS, isoFor, monthGrid, monthTitle, todayISO } from '@/utils/dates';

import { AppText } from './ui';

/**
 * Month grid with colored busy marks (one bar per person, max 3 shown).
 * `marks` maps an ISO date to the colors of whoever is busy that day.
 */
export function MonthCalendar({
  marks,
  selected,
  onSelect,
}: {
  marks: Record<string, string[]>;
  selected?: string;
  onSelect?: (iso: string) => void;
}) {
  const { colors } = useAppTheme();
  const now = new Date();
  const [offset, setOffset] = useState(0);

  const shown = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const year = shown.getFullYear();
  const month = shown.getMonth();
  const weeks = monthGrid(year, month);
  const today = todayISO();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1.5,
        borderRadius: 24,
        padding: 12,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <NavButton label="Previous month" glyph="‹" onPress={() => setOffset((o) => o - 1)} />
        <AppText variant="heading" style={{ flex: 1, textAlign: 'center' }}>
          {monthTitle(year, month)}
        </AppText>
        <NavButton label="Next month" glyph="›" onPress={() => setOffset((o) => o + 1)} />
      </View>

      <View style={{ flexDirection: 'row' }}>
        {WEEKDAY_LETTERS.map((l, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}>
            <AppText variant="caption" muted>
              {l}
            </AppText>
          </View>
        ))}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} style={{ flexDirection: 'row' }}>
          {week.map((d, di) => {
            if (d === null) return <View key={di} style={{ flex: 1, height: 52 }} />;
            const iso = isoFor(year, month, d);
            const dots = (marks[iso] ?? []).slice(0, 3);
            const isSelected = selected === iso;
            const isToday = today === iso;
            return (
              <Pressable
                key={di}
                accessibilityRole="button"
                accessibilityLabel={`${iso}${dots.length ? `, ${dots.length} busy` : ''}`}
                onPress={() => onSelect?.(iso)}
                style={{ flex: 1, height: 52, alignItems: 'center', paddingTop: 4 }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                    borderWidth: isToday && !isSelected ? 1.5 : 0,
                    borderColor: colors.accent,
                  }}>
                  <Text
                    style={{
                      color: isSelected ? colors.onPrimary : colors.text,
                      fontWeight: isSelected || isToday ? '800' : '500',
                      fontSize: 14,
                    }}>
                    {d}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 2, marginTop: 3 }}>
                  {dots.map((c, i) => (
                    <View
                      key={i}
                      style={{ width: 8, height: 4, borderRadius: 2, backgroundColor: c }}
                    />
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function NavButton({
  glyph,
  label,
  onPress,
}: {
  glyph: string;
  label: string;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={10}
      style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text, fontSize: 26, marginTop: -3 }}>{glyph}</Text>
    </Pressable>
  );
}