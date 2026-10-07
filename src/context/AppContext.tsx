import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  Role,
  BeneficiaryProfile,
  Notification,
  Claim,
  UploadedDocument,
  SupportTicket,
} from '@/types';
import { seedProfile, seedNotifications, seedClaims, seedSupportTickets } from '@/data/seed';
import { DEFAULT_INSTITUTION_ID } from '@/data/institutions';

interface AppContextValue {
  role: Role;
  setRole: (role: Role) => void;
  switchRole: (role: Role) => void;
  switching: boolean;

  activeInstitutionId: string;
  setActiveInstitution: (id: string) => void;

  profile: BeneficiaryProfile;
  setProfile: (profile: BeneficiaryProfile) => void;

  notifications: Notification[];
  setNotifications: (n: Notification[]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;

  claims: Claim[];
  setClaims: (c: Claim[]) => void;
  addClaim: (claim: Claim) => void;
  updateClaim: (claim: Claim) => void;

  documents: UploadedDocument[];
  addDocument: (doc: UploadedDocument) => void;
  updateDocument: (doc: UploadedDocument) => void;
  removeDocument: (id: string) => void;

  tickets: SupportTicket[];
  addTicket: (t: SupportTicket) => void;

  consentGiven: boolean;
  setConsentGiven: (v: boolean) => void;

  resetDemo: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const STORAGE_KEY = 'owafind-demo-state';

// Single source of truth for each role's home route.
export const ROLE_HOME: Record<Role, string> = {
  beneficiary: '/app/dashboard',
  institution: '/app/institution',
  regulator: '/app/regulator',
  executive: '/app/executive',
  admin: '/app/admin',
};

export function roleHomePath(role: Role) {
  return ROLE_HOME[role];
}

interface PersistedState {
  role: Role;
  activeInstitutionId: string;
  profile: BeneficiaryProfile;
  notifications: Notification[];
  claims: Claim[];
  documents: UploadedDocument[];
  tickets: SupportTicket[];
  consentGiven: boolean;
}

function loadState(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function saveState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const persisted = loadState();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>(persisted.role || 'beneficiary');
  const [activeInstitutionId, setActiveInstitutionId] = useState<string>(
    persisted.activeInstitutionId || DEFAULT_INSTITUTION_ID
  );
  const [profile, setProfile] = useState<BeneficiaryProfile>(persisted.profile || seedProfile);
  const [notifications, setNotifications] = useState<Notification[]>(
    persisted.notifications || seedNotifications
  );
  const [claims, setClaims] = useState<Claim[]>(persisted.claims || seedClaims);
  const [documents, setDocuments] = useState<UploadedDocument[]>(persisted.documents || []);
  const [tickets, setTickets] = useState<SupportTicket[]>(persisted.tickets || seedSupportTickets);
  const [consentGiven, setConsentGiven] = useState<boolean>(persisted.consentGiven ?? false);
  const [switching, setSwitching] = useState(false);
  const switchTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    saveState({ role, activeInstitutionId, profile, notifications, claims, documents, tickets, consentGiven });
  }, [role, activeInstitutionId, profile, notifications, claims, documents, tickets, consentGiven]);

  useEffect(() => () => window.clearTimeout(switchTimer.current), []);

  // Centralized role switch: updates state, persists (via the save effect),
  // navigates to the new role's dashboard, and briefly shows the
  // workspace-switch overlay. Pages remount because the layout is keyed by
  // role, so no page-level state leaks across roles.
  const switchRole = (next: Role) => {
    if (next !== role) {
      setSwitching(true);
      setRole(next);
    }
    navigate(roleHomePath(next), { replace: true });
    window.clearTimeout(switchTimer.current);
    switchTimer.current = window.setTimeout(() => setSwitching(false), 350);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addClaim = (claim: Claim) => {
    setClaims((prev) => [claim, ...prev]);
  };

  const updateClaim = (claim: Claim) => {
    setClaims((prev) => prev.map((c) => (c.id === claim.id ? claim : c)));
  };

  const addDocument = (doc: UploadedDocument) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  const updateDocument = (doc: UploadedDocument) => {
    setDocuments((prev) => prev.map((d) => (d.id === doc.id ? doc : d)));
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const addTicket = (t: SupportTicket) => {
    setTickets((prev) => [t, ...prev]);
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRole('beneficiary');
    setActiveInstitutionId(DEFAULT_INSTITUTION_ID);
    setProfile(seedProfile);
    setNotifications(seedNotifications);
    setClaims(seedClaims);
    setDocuments([]);
    setTickets(seedSupportTickets);
    setConsentGiven(false);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        switchRole,
        switching,
        activeInstitutionId,
        setActiveInstitution: setActiveInstitutionId,
        profile,
        setProfile,
        notifications,
        setNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        claims,
        setClaims,
        addClaim,
        updateClaim,
        documents,
        addDocument,
        updateDocument,
        removeDocument,
        tickets,
        addTicket,
        consentGiven,
        setConsentGiven,
        resetDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
