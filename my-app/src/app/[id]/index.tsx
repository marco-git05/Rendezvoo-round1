import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { MonthCalendar } from '@/components/MonthCalendar';
import { AppText, Button, Card, Header, IconButton, Screen } from '@/components/ui';
import { useAppData } from '@/data/AppData';
import { useAppTheme } from '@/theme/ThemeProvider';
import { prettyDate } from '@/utils/dates';

export default function GroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { getGroup } = useAppData();
  const [selected, setSelected] = useState<string | undefined>();

  const group = getGroup(id);

  if (!group) {
    return (
      <Screen>
        <Header title="Group not found" onBack />
      </Screen>
    );
  }

  const memberById = Object.fromEntries(group.members.map((m) => [m.id, m]));
  const marks: Record<string, string[]> = {};
  for (const b of group.busy) {
    const m = memberById[b.memberId];
    if (m) (marks[b.date] ??= []).push(m.color);
  }
  const busyOnSelected = group.busy.filter((b) => b.date === selected && memberById[b.memberId]);

  return (
    <Screen>
      <Header
        title={group.name}
        subtitle="Group calendar"
        onBack
        right={
          <IconButton
            glyph="⚙️"
            label="Group settings"
            onPress={() => router.push({ pathname: '/group/[id]/settings', params: { id: group.id } })}
          />
        }
      />

      <MonthCalendar marks={marks} selected={selected} onSelect={setSelected} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
        {group.members.map((m) => (
          <View key={m.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: m.color }} />
            <AppText variant="caption" muted>
              {m.name}
            </AppText>
          </View>
        ))}
      </View>

      {selected ? (
        <Card style={{ marginTop: 14 }}>
          <AppText variant="label" muted>
            {prettyDate(selected)}
          </AppText>
          {busyOnSelected.length === 0 ? (
            <AppText style={{ marginTop: 6 }}>Everyone looks free.</AppText>
          ) : (
            busyOnSelected.map((b) => (
              <AppText key={b.id} style={{ marginTop: 6 }}>
                {memberById[b.memberId].name} is busy · {b.label}
              </AppText>
            ))
          )}
        </Card>
      ) : null}

      <View style={{ marginTop: 20 }}>
        <Button
          label="+ Plan a hangout"
          onPress={() => router.push({ pathname: '/hangout/new', params: { groupId: group.id } })}
        />
      </View>

      <AppText variant="heading" style={{ marginTop: 24, marginBottom: 10 }}>
        Recent
      </AppText>
      <Card style={{ gap: 4 }}>
        {group.feed.length === 0 ? (
          <AppText variant="caption" muted>
            Nothing yet. Plan the first hangout!
          </AppText>
        ) : null}
        {group.feed.map((f, i) => (
          <Pressable
            key={f.id}
            accessibilityRole={f.inviteId ? 'button' : 'text'}
            disabled={!f.inviteId}
            onPress={() =>
              f.inviteId &&
              router.push({ pathname: '/hangout/[id]', params: { id: f.inviteId } })
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingVertical: 10,
              borderTopWidth: i === 0 ? 0 : 1,
              borderTopColor: colors.border,
            }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: f.inviteId ? colors.accent : colors.primary,
              }}
            />
            <AppText style={{ flex: 1 }}>{f.text}</AppText>
            <AppText variant="caption" muted>
              {f.when}
            </AppText>
          </Pressable>
        ))}
      </Card>
    </Screen>
  );
}
