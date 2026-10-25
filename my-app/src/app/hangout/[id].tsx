import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AvailabilityGrid } from '@/components/AvailabilityGrid';
import { AppText, Button, Card, Chip, Field, Header, Screen, Segmented, SectionTitle } from '@/components/ui';
import { useAppData } from '@/data/AppData';
import { HOSTED_TYPES } from '@/data/types';
import { useAppTheme } from '@/theme/ThemeProvider';
import { prettyDate } from '@/utils/dates';

type YesNo = 'yes' | 'no';

export default function FillInviteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { getInvite, getGroup, getResponse, submitResponse } = useAppData();

  const invite = getInvite(id);
  const existing = invite ? getResponse(invite.id) : undefined;

  const [availability, setAvailability] = useState<string[]>(existing?.availability ?? []);
  const [drive, setDrive] = useState<YesNo | undefined>(
    existing?.canDrive === undefined ? undefined : existing.canDrive ? 'yes' : 'no',
  );
  const [host, setHost] = useState<YesNo | undefined>(
    existing?.willingToHost === undefined ? undefined : existing.willingToHost ? 'yes' : 'no',
  );
  const [budget, setBudget] = useState(existing?.budget ?? '');
  const [submitted, setSubmitted] = useState(false);

  if (!invite) {
    return (
      <Screen>
        <Header title="Invite not found" onBack />
      </Screen>
    );
  }

  const group = getGroup(invite.groupId);
  const asksHost = !!invite.type && HOSTED_TYPES.includes(invite.type);
  const yesNo = [
    { value: 'yes' as const, label: 'Yes' },
    { value: 'no' as const, label: 'No' },
  ];

  const submit = () => {
    submitResponse({
      inviteId: invite.id,
      availability,
      canDrive: invite.askCars && drive ? drive === 'yes' : undefined,
      budget: invite.askBudget && budget.trim() ? budget.trim() : undefined,
      willingToHost: asksHost && host ? host === 'yes' : undefined,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Screen>
        <Header title="You're in!" onBack />
        <Card style={{ gap: 8 }}>
          <AppText variant="heading">Response sent</AppText>
          <AppText muted>
            Thanks! {invite.creator} and the group can see when you are free. Once everyone replies,
            Rendezvoo will suggest the best plan.
          </AppText>
        </Card>
        <View style={{ marginTop: 20 }}>
          <Button label="Done" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        title={`${invite.creator} sent an invite!`}
        subtitle={group ? group.name : undefined}
        onBack
      />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
        {invite.type ? <Chip label={invite.type} selected color={colors.accent} /> : null}
        {invite.deadline ? <Chip label={`Reply by ${prettyDate(invite.deadline)}`} /> : null}
      </View>

      <SectionTitle>Add your availability</SectionTitle>
      <AppText variant="caption" muted style={{ marginBottom: 10, marginTop: -6 }}>
        Tap the times you are free. Tap a day to select all of it.
      </AppText>
      <AvailabilityGrid days={invite.days} value={availability} onChange={setAvailability} />

      <View style={{ gap: 20, marginTop: 20 }}>
        {invite.askCars ? (
          <View style={{ gap: 8 }}>
            <AppText variant="label">Can you drive?</AppText>
            <Segmented options={yesNo} value={drive ?? ('' as YesNo)} onChange={setDrive} />
          </View>
        ) : null}

        {asksHost ? (
          <View style={{ gap: 8 }}>
            <AppText variant="label">Willing to host?</AppText>
            <Segmented options={yesNo} value={host ?? ('' as YesNo)} onChange={setHost} />
          </View>
        ) : null}

        {invite.askBudget ? (
          <Field
            label="Your budget ($)"
            value={budget}
            onChangeText={(t) => setBudget(t.replace(/[^0-9.]/g, ''))}
            keyboardType="decimal-pad"
            placeholder="e.g. 25"
          />
        ) : null}
      </View>

      <View style={{ marginTop: 28, gap: 8 }}>
        <Button label="Submit" onPress={submit} disabled={availability.length === 0} />
        {availability.length === 0 ? (
          <AppText variant="caption" muted style={{ textAlign: 'center' }}>
            Pick at least one time to submit.
          </AppText>
        ) : null}
      </View>
    </Screen>
  );
}
