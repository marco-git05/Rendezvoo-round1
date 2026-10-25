import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';

import { AppText, Avatar, Button, Card, Field, Header, Screen, SectionTitle } from '@/components/ui';
import { useAppData } from '@/data/AppData';
import { ME } from '@/data/mock';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function GroupSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, palette } = useAppTheme();
  const { getGroup, setShowLocation, setGroupColor, addMember, removeMember } = useAppData();
  const [newName, setNewName] = useState('');

  const group = getGroup(id);
  if (!group) {
    return (
      <Screen>
        <Header title="Group not found" onBack />
      </Screen>
    );
  }

  const isAdmin = group.role === 'admin';
  const submitMember = () => {
    const name = newName.trim();
    if (!name) return;
    addMember(group.id, name);
    setNewName('');
  };

  return (
    <Screen>
      <Header title="Group settings" subtitle={group.name} onBack />

      <Card style={{ gap: 18 }}>
        <Row label="Status">
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 18,
              borderWidth: 1.5,
              borderColor: isAdmin ? colors.primary : colors.border,
              backgroundColor: colors.surfaceAlt,
            }}>
            <AppText variant="label">{isAdmin ? 'Admin' : 'Member'}</AppText>
            {isAdmin ? <Text>👑</Text> : null}
          </View>
        </Row>

        <Row label="Show location 🏠">
          <Switch
            accessibilityLabel="Show my home location to this group"
            value={group.showLocation}
            onValueChange={(v) => setShowLocation(group.id, v)}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor={group.showLocation ? colors.onAccent : colors.textMuted}
          />
        </Row>

        <View style={{ gap: 10 }}>
          <AppText variant="label">Group color</AppText>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {palette.groupColors.map((c) => {
              const on = group.color === c;
              return (
                <Pressable
                  key={c}
                  accessibilityRole="button"
                  accessibilityLabel={`Group color ${c}`}
                  accessibilityState={{ selected: on }}
                  onPress={() => setGroupColor(group.id, c)}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: c,
                    borderWidth: on ? 3 : 1.5,
                    borderColor: on ? colors.text : colors.border,
                  }}
                />
              );
            })}
          </View>
        </View>
      </Card>

      {isAdmin ? (
        <>
          <SectionTitle>Admin functions</SectionTitle>
          <Card style={{ gap: 14 }}>
            <AppText variant="label">Add member</AppText>
            <Field
              label="Name"
              value={newName}
              onChangeText={setNewName}
              placeholder="Friend's name"
              returnKeyType="done"
              onSubmitEditing={submitMember}
            />
            <Button label="Add to group" variant="accent" onPress={submitMember} disabled={!newName.trim()} />
          </Card>

          <SectionTitle>Members</SectionTitle>
          <Card style={{ gap: 4 }}>
            {group.members.map((m, i) => (
              <View
                key={m.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 10,
                  borderTopWidth: i === 0 ? 0 : 1,
                  borderTopColor: colors.border,
                }}>
                <Avatar label={m.name} color={m.color} size={36} />
                <AppText style={{ flex: 1 }}>{m.name}</AppText>
                {m.id !== ME ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${m.name}`}
                    onPress={() => removeMember(group.id, m.id)}
                    hitSlop={8}>
                    <AppText variant="label" color={colors.primary}>
                      Remove
                    </AppText>
                  </Pressable>
                ) : (
                  <AppText variant="caption" muted>
                    You
                  </AppText>
                )}
              </View>
            ))}
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <AppText variant="label">{label}</AppText>
      {children}
    </View>
  );
}
