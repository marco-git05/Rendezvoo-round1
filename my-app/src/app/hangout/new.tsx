import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { DayPicker } from '@/components/DayPicker';
import { AppText, Button, Card, Chip, Header, Screen, SectionTitle } from '@/components/ui';
import { useAppData } from '@/data/AppData';
import { HANGOUT_TYPES, HOSTED_TYPES, type HangoutType } from '@/data/types';
import { useAppTheme } from '@/theme/ThemeProvider';
import { prettyDate, upcomingDays } from '@/utils/dates';

type OptionalSection = 'deadline' | 'budget' | 'type' | 'cars';

const SECTION_LABEL: Record<OptionalSection, string> = {
  deadline: 'Deadline',
  budget: 'Budget',
  type: 'Type',
  cars: 'Cars',
};

const DAY_OPTIONS = upcomingDays(14);

export default function NewHangoutScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { getGroup, createInvite } = useAppData();

  const [days, setDays] = useState<string[]>([]);
  const [sections, setSections] = useState<OptionalSection[]>([]);
  const [deadline, setDeadline] = useState<string | undefined>();
  const [type, setType] = useState<HangoutType | undefined>();

  const group = getGroup(groupId);
  if (!group) {
    return (
      <Screen>
        <Header title="Group not found" onBack />
      </Screen>
    );
  }

  const has = (s: OptionalSection) => sections.includes(s);
  const addSection = (s: OptionalSection) => setSections((prev) => [...prev, s]);
  const removeSection = (s: OptionalSection) => {
    setSections((prev) => prev.filter((x) => x !== s));
    if (s === 'deadline') setDeadline(undefined);
    if (s === 'type') setType(undefined);
  };

  const toggleDay = (iso: string) =>
    setDays((prev) => (prev.includes(iso) ? prev.filter((d) => d !== iso) : [...prev, iso].sort()));

  const send = () => {
    createInvite({
      groupId: group.id,
      days,
      deadline: has('deadline') ? deadline : undefined,
      askBudget: has('budget'),
      type: has('type') ? type : undefined,
      askCars: has('cars'),
    });
    router.back();
  };

  const remaining = (Object.keys(SECTION_LABEL) as OptionalSection[]).filter((s) => !has(s));

  return (
    <Screen>
      <Header title="Plan a hangout!" subtitle={group.name} onBack />

      <AppText variant="heading" style={{ marginBottom: 4 }}>
        Availability: when?
      </AppText>
      <AppText variant="caption" muted style={{ marginBottom: 12 }}>
        Pick the days you want to offer. Everyone fills in their times.
      </AppText>
      <DayPicker days={DAY_OPTIONS} selected={days} onToggle={toggleDay} />

      <SectionTitle>Add details</SectionTitle>
      <AppText variant="caption" muted style={{ marginBottom: 10, marginTop: -6 }}>
        All optional. Add only what your crew needs.
      </AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {remaining.map((s) => (
          <Chip key={s} label={`+ ${SECTION_LABEL[s]}`} onPress={() => addSection(s)} color={colors.accent} />
        ))}
        {remaining.length === 0 ? (
          <AppText variant="caption" muted>
            You added everything.
          </AppText>
        ) : null}
      </View>

      <View style={{ gap: 12, marginTop: 16 }}>
        {has('deadline') ? (
          <SectionCard title="Reply by" onRemove={() => removeSection('deadline')}>
            <DayPicker
              days={DAY_OPTIONS}
              selected={deadline ? [deadline] : []}
              onToggle={(iso) => setDeadline((d) => (d === iso ? undefined : iso))}
            />
          </SectionCard>
        ) : null}

        {has('budget') ? (
          <SectionCard title="Budget" onRemove={() => removeSection('budget')}>
            <AppText variant="caption" muted>
              Everyone will enter what they can spend. Rendezvoo suggests a budget that works for all.
            </AppText>
          </SectionCard>
        ) : null}

        {has('type') ? (
          <SectionCard title="Type of hangout" onRemove={() => removeSection('type')}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {HANGOUT_TYPES.map((t) => (
                <Chip key={t} label={t} selected={type === t} onPress={() => setType(t)} />
              ))}
            </View>
            {type && HOSTED_TYPES.includes(type) ? (
              <AppText variant="caption" style={{ color: colors.accent, marginTop: 4 }}>
                Everyone will also be asked if they are willing to host.
              </AppText>
            ) : null}
          </SectionCard>
        ) : null}

        {has('cars') ? (
          <SectionCard title="Cars" onRemove={() => removeSection('cars')}>
            <AppText variant="caption" muted>
              Everyone will say whether they can drive, so rides are easy to set up.
            </AppText>
          </SectionCard>
        ) : null}
      </View>

      <View style={{ marginTop: 28, gap: 8 }}>
        <Button label="Send invite" onPress={send} disabled={days.length === 0} />
        {days.length === 0 ? (
          <AppText variant="caption" muted style={{ textAlign: 'center' }}>
            Pick at least one day to send the invite.
          </AppText>
        ) : (
          <AppText variant="caption" muted style={{ textAlign: 'center' }}>
            {days.length} day{days.length === 1 ? '' : 's'} offered
            {deadline ? ` · reply by ${prettyDate(deadline)}` : ''}
          </AppText>
        )}
      </View>
    </Screen>
  );
}

function SectionCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AppText variant="label" style={{ flex: 1 }}>
          {title}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${title}`}
          onPress={onRemove}
          hitSlop={10}>
          <AppText variant="caption" muted>
            Remove
          </AppText>
        </Pressable>
      </View>
      {children}
    </Card>
  );
}
