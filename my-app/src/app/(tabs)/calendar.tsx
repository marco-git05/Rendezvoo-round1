import { useState } from 'react';
import { View } from 'react-native';

import { MonthCalendar } from '@/components/MonthCalendar';
import { AppText, Avatar, Card, Chip, Header, Screen, Segmented } from '@/components/ui';
import { useAppData } from '@/data/AppData';
import { ME } from '@/data/mock';
import { useAppTheme } from '@/theme/ThemeProvider';
import { prettyDate } from '@/utils/dates';

type View_ = 'mine' | 'friends';

export default function CalendarScreen() {
  const { colors } = useAppTheme();
  const { groups } = useAppData();
  const [view, setView] = useState<View_>('mine');
  const [selected, setSelected] = useState<string | undefined>();

  // My busy blocks across every group.
  const mine = groups.flatMap((g) =>
    g.busy.filter((b) => b.memberId === ME).map((b) => ({ ...b, group: g.name, color: g.color })),
  );
  const marks: Record<string, string[]> = {};
  for (const b of mine) (marks[b.date] ??= []).push(b.color);
  const onSelected = mine.filter((b) => b.date === selected);

  return (
    <Screen>
      <Header title="Calendar" subtitle={view === 'mine' ? 'Your schedule' : "Your friends' schedules"} />
      <Segmented
        value={view}
        onChange={setView}
        options={[
          { value: 'mine', label: 'Mine' },
          { value: 'friends', label: 'Friends' },
        ]}
      />

      {view === 'mine' ? (
        <View style={{ gap: 14, marginTop: 16 }}>
          <MonthCalendar marks={marks} selected={selected} onSelect={setSelected} />
          {selected ? (
            <Card>
              <AppText variant="label" muted>
                {prettyDate(selected)}
              </AppText>
              {onSelected.length === 0 ? (
                <AppText style={{ marginTop: 6 }}>Nothing on your calendar. Free to hang!</AppText>
              ) : (
                onSelected.map((b) => (
                  <View key={b.id} style={{ marginTop: 8 }}>
                    <AppText variant="heading">{b.label}</AppText>
                    <AppText variant="caption" muted>
                      {b.group}
                    </AppText>
                  </View>
                ))
              )}
            </Card>
          ) : (
            <AppText variant="caption" muted style={{ textAlign: 'center' }}>
              Tap a day to see what is on it.
            </AppText>
          )}
        </View>
      ) : (
        <View style={{ gap: 14, marginTop: 16 }}>
          {groups.map((g) => {
            const others = g.members.filter((m) => m.id !== ME);
            return (
              <Card key={g.id} style={{ gap: 12 }}>
                <AppText variant="heading">{g.name}</AppText>
                {others.length === 0 ? (
                  <AppText variant="caption" muted>
                    No other members yet.
                  </AppText>
                ) : null}
                {others.map((m) => {
                  const busy = g.busy.filter((b) => b.memberId === m.id);
                  return (
                    <View key={m.id} style={{ gap: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Avatar label={m.name} color={m.color} size={34} />
                        <AppText variant="label">{m.name}</AppText>
                      </View>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                        {busy.length === 0 ? (
                          <AppText variant="caption" style={{ color: colors.accent }}>
                            Wide open
                          </AppText>
                        ) : (
                          busy.map((b) => (
                            <Chip key={b.id} label={`${prettyDate(b.date)} · ${b.label}`} />
                          ))
                        )}
                      </View>
                    </View>
                  );
                })}
              </Card>
            );
          })}
        </View>
      )}
    </Screen>
  );
}