import { Pressable, Text, View } from 'react-native';

import { AppText, Avatar, Card, Chip, Field, Header, Screen, SectionTitle } from '@/components/ui';
import { useAppData } from '@/data/AppData';
import { DIETARY_OPTIONS } from '@/data/types';
import { PALETTES, THEME_ORDER } from '@/theme/palettes';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function ProfileScreen() {
  const { colors, themeName, setThemeName } = useAppTheme();
  const { profile, updateProfile } = useAppData();

  const toggleDiet = (item: string) =>
    updateProfile({
      dietary: profile.dietary.includes(item)
        ? profile.dietary.filter((d) => d !== item)
        : [...profile.dietary, item],
    });

  return (
    <Screen>
      <Header title="Your profile" />

      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <Avatar label={profile.name || '?'} color={colors.primary} size={96} />
        <AppText variant="caption" muted style={{ marginTop: 8 }}>
          Photo upload coming soon
        </AppText>
      </View>

      <View style={{ gap: 14, marginTop: 12 }}>
        <Field
          label="Name"
          value={profile.name}
          onChangeText={(name) => updateProfile({ name })}
          placeholder="Your name"
        />
        <Field
          label="Pronouns"
          value={profile.pronouns}
          onChangeText={(pronouns) => updateProfile({ pronouns })}
          placeholder="Optional"
        />
      </View>

      <SectionTitle>My theme</SectionTitle>
      <View style={{ gap: 10 }}>
        <AppText variant="label" muted>
          Colors
        </AppText>
        {THEME_ORDER.map((name) => {
          const p = PALETTES[name];
          const on = themeName === name;
          return (
            <Pressable
              key={name}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => setThemeName(name)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                padding: 14,
                borderRadius: 20,
                borderWidth: 2,
                backgroundColor: colors.surface,
                borderColor: on ? colors.primary : colors.border,
              }}>
              <View style={{ flexDirection: 'row' }}>
                {p.swatches.map((s, i) => (
                  <View
                    key={s}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: s,
                      marginLeft: i === 0 ? 0 : -8,
                      borderWidth: 2,
                      borderColor: colors.surface,
                    }}
                  />
                ))}
              </View>
              <AppText variant="label" style={{ flex: 1 }}>
                {p.label}
              </AppText>
              {on ? <Text style={{ color: colors.primary, fontWeight: '800' }}>✓</Text> : null}
            </Pressable>
          );
        })}
        <AppText variant="label" muted style={{ marginTop: 6 }}>
          Images
        </AppText>
        <Card style={{ opacity: 0.6 }}>
          <AppText variant="caption" muted>
            Photo backgrounds are coming soon.
          </AppText>
        </Card>
      </View>

      <SectionTitle>Dietary restrictions</SectionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {DIETARY_OPTIONS.map((d) => (
          <Chip key={d} label={d} selected={profile.dietary.includes(d)} onPress={() => toggleDiet(d)} />
        ))}
      </View>
      <View style={{ marginTop: 12 }}>
        <Field
          label="Anything else?"
          value={profile.dietaryNote}
          onChangeText={(dietaryNote) => updateProfile({ dietaryNote })}
          placeholder="e.g. no shellfish"
        />
      </View>

      <SectionTitle>Map</SectionTitle>
      <Card style={{ alignItems: 'center', paddingVertical: 28, gap: 6 }}>
        <Text style={{ fontSize: 34 }}>📍</Text>
        <AppText variant="label">Your map spot</AppText>
        <AppText variant="caption" muted style={{ textAlign: 'center' }}>
          Your location only shows in groups where you turn on "show location".
        </AppText>
      </Card>
    </Screen>
  );
}
