import type { ReactNode } from 'react';
import { useRouter } from 'expo-router';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/theme/ThemeProvider';

/* ---------- Screen ---------- */

export function Screen({
  children,
  scroll = true,
  bottomPad = 24,
}: {
  children: ReactNode;
  scroll?: boolean;
  bottomPad?: number;
}) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  if (!scroll) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>{children}</View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: bottomPad + insets.bottom }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}

/* ---------- Text ---------- */

type Variant = 'title' | 'heading' | 'body' | 'label' | 'caption';

const VARIANTS: Record<Variant, TextStyle> = {
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  heading: { fontSize: 20, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  label: { fontSize: 14, fontWeight: '700', letterSpacing: 0.3 },
  caption: { fontSize: 13, fontWeight: '500' },
};

export function AppText({
  variant = 'body',
  muted,
  color,
  style,
  children,
  numberOfLines,
}: {
  variant?: Variant;
  muted?: boolean;
  color?: string;
  style?: StyleProp<TextStyle>;
  children: ReactNode;
  numberOfLines?: number;
}) {
  const { colors } = useAppTheme();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[VARIANTS[variant], { color: color ?? (muted ? colors.textMuted : colors.text) }, style]}>
      {children}
    </Text>
  );
}

/* ---------- Header ---------- */

export function Header({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: boolean;
  right?: ReactNode;
}) {
  const router = useRouter();
  const { colors } = useAppTheme();
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          hitSlop={12}
          style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={{ color: colors.text, fontSize: 22, marginTop: -2 }}>‹</Text>
        </Pressable>
      ) : null}
      <View style={{ flex: 1 }}>
        <AppText variant="title" numberOfLines={2}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" muted>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right}
    </View>
  );
}

export function IconButton({
  glyph,
  onPress,
  label,
}: {
  glyph: string;
  onPress: () => void;
  label: string;
}) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={12}
      style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={{ fontSize: 18 }}>{glyph}</Text>
    </Pressable>
  );
}

/* ---------- Card ---------- */

export function Card({
  children,
  style,
  onPress,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  const { colors } = useAppTheme();
  const base: ViewStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 16,
  };
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [base, { opacity: pressed ? 0.85 : 1 }, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}

/* ---------- Buttons & chips ---------- */

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'accent' | 'ghost';
  disabled?: boolean;
}) {
  const { colors } = useAppTheme();
  const bg =
    variant === 'primary' ? colors.primary : variant === 'accent' ? colors.accent : 'transparent';
  const fg =
    variant === 'primary' ? colors.onPrimary : variant === 'accent' ? colors.onAccent : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bg,
          borderColor: variant === 'ghost' ? colors.border : bg,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        },
      ]}>
      <Text style={{ color: fg, fontSize: 16, fontWeight: '800' }}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  color,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
}) {
  const { colors } = useAppTheme();
  const tint = color ?? colors.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? tint : colors.surfaceAlt,
          borderColor: selected ? tint : colors.border,
        },
      ]}>
      <Text
        style={{
          color: selected ? colors.onPrimary : colors.text,
          fontSize: 14,
          fontWeight: '700',
        }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.segmented, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.value)}
            style={[styles.segment, { backgroundColor: on ? colors.primary : 'transparent' }]}>
            <Text
              style={{
                color: on ? colors.onPrimary : colors.textMuted,
                fontWeight: '800',
                fontSize: 14,
              }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- Avatar ---------- */

export function Avatar({ label, color, size = 48 }: { label: string; color: string; size?: number }) {
  const { colors } = useAppTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.border,
      }}>
      <Text style={{ color: colors.onPrimary, fontWeight: '800', fontSize: size * 0.4 }}>
        {label.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

/* ---------- Inputs ---------- */

export function Field({
  label,
  ...inputProps
}: { label: string } & TextInputProps) {
  const { colors } = useAppTheme();
  return (
    <View style={{ gap: 6 }}>
      <AppText variant="label" muted>
        {label}
      </AppText>
      <TextInput
        placeholderTextColor={colors.textMuted}
        {...inputProps}
        style={[
          styles.input,
          { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          inputProps.style,
        ]}
      />
    </View>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <AppText variant="heading" style={{ marginTop: 24, marginBottom: 10 }}>
      {children}
    </AppText>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    minHeight: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 4,
  },
  segment: {
    flex: 1,
    minHeight: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    fontSize: 16,
  },
});
