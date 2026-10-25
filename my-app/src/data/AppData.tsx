import { createContext, useContext, useState, type ReactNode } from 'react';

import { INITIAL_GROUPS, INITIAL_INVITES, INITIAL_PROFILE, ME } from './mock';
import type { Group, Invite, InviteResponse, NewInviteInput, Profile } from './types';

/**
 * In-memory app state with mock data. Every function here is a seam where
 * the Supabase calls will go later, so screens never need to change.
 */
interface AppDataValue {
  profile: Profile;
  updateProfile: (patch: Partial<Profile>) => void;

  groups: Group[];
  getGroup: (id: string) => Group | undefined;
  togglePin: (id: string) => void;
  setShowLocation: (id: string, value: boolean) => void;
  setGroupColor: (id: string, color: string) => void;
  addMember: (id: string, name: string) => void;
  removeMember: (id: string, memberId: string) => void;

  invites: Invite[];
  getInvite: (id: string) => Invite | undefined;
  createInvite: (input: NewInviteInput) => string;

  responses: InviteResponse[];
  getResponse: (inviteId: string) => InviteResponse | undefined;
  submitResponse: (response: InviteResponse) => void;
}

const AppDataContext = createContext<AppDataValue | null>(null);

const MEMBER_COLORS = ['#E491A6', '#92E4BA', '#90C67F', '#EBAEE6', '#FF857A', '#ADEBB3'];

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [invites, setInvites] = useState<Invite[]>(INITIAL_INVITES);
  const [responses, setResponses] = useState<InviteResponse[]>([]);

  const patchGroup = (id: string, fn: (g: Group) => Group) =>
    setGroups((prev) => prev.map((g) => (g.id === id ? fn(g) : g)));

  const value: AppDataValue = {
    profile,
    updateProfile: (patch) => setProfile((p) => ({ ...p, ...patch })),

    groups,
    getGroup: (id) => groups.find((g) => g.id === id),
    togglePin: (id) => patchGroup(id, (g) => ({ ...g, pinned: !g.pinned })),
    setShowLocation: (id, v) => patchGroup(id, (g) => ({ ...g, showLocation: v })),
    setGroupColor: (id, color) =>
      patchGroup(id, (g) => ({
        ...g,
        color,
        members: g.members.map((m) => (m.id === ME ? { ...m, color } : m)),
      })),
    addMember: (id, name) =>
      patchGroup(id, (g) => ({
        ...g,
        members: [
          ...g.members,
          {
            id: `m-${Date.now()}`,
            name,
            color: MEMBER_COLORS[g.members.length % MEMBER_COLORS.length],
          },
        ],
      })),
    removeMember: (id, memberId) =>
      patchGroup(id, (g) => ({
        ...g,
        members: g.members.filter((m) => m.id !== memberId),
        busy: g.busy.filter((b) => b.memberId !== memberId),
      })),

    invites,
    getInvite: (id) => invites.find((i) => i.id === id),
    createInvite: (input) => {
      const id = `inv-${Date.now()}`;
      setInvites((prev) => [...prev, { ...input, id, creator: 'You' }]);
      patchGroup(input.groupId, (g) => ({
        ...g,
        feed: [{ id: `f-${id}`, text: 'You sent an invite', when: 'just now', inviteId: id }, ...g.feed],
      }));
      return id;
    },

    responses,
    getResponse: (inviteId) => responses.find((r) => r.inviteId === inviteId),
    submitResponse: (response) =>
      setResponses((prev) => [...prev.filter((r) => r.inviteId !== response.inviteId), response]),
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>');
  return ctx;
}
