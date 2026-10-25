import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { AppText, Avatar, Card, Header, Screen } from '@/components/ui';
import { useAppData } from '@/data/AppData';
import { useAppTheme } from '@/theme/ThemeProvider';

const CATEGORY_LABEL = { school: 'School', personal: 'Personal', family: 'Family', work: 'Work' } as const;

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { groups, profile, togglePin } = useAppData();

  // Pinned groups float to the top; otherwise keep the original order.
  const sorted = [...groups].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <Screen>
      <Header title={`Welcome, ${profile.name || 'friend'}`} subtitle="Your crews" />

      <View style={{ gap: 12 }}>
        {sorted.map((g) => (
          <Card
            key={g.id}
            onPress={() => router.push({ pathname: '/group/[id]', params: { id: g.id } })}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Avatar label={g.name} color={g.color} size={52} />
            <View style={{ flex: 1 }}>
              <AppText variant="heading" numberOfLines={1}>
                {g.name}
              </AppText>
              <AppText variant="caption" muted>
                {CATEGORY_LABEL[g.category]} · {g.members.length} members
              </AppText>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={g.pinned ? `Unpin ${g.name}` : `Pin ${g.name}`}
              accessibilityState={{ selected: g.pinned }}
              onPress={() => togglePin(g.id)}
              hitSlop={12}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: g.pinned ? colors.primary : colors.surfaceAlt,
              }}>
              <Text style={{ fontSize: 18, opacity: g.pinned ? 1 : 0.5 }}>📌</Text>
            </Pressable>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
