/**
 * GovMitra Local Database & Sync Repository
 * Provides offline-first Room SQLite simulation with IndexedDB/LocalStorage persistence,
 * sync queue management, conflict resolution, and reactive state subscriptions.
 */

import { ALL_SCHEMES } from '../data/schemesData';
import { 
  AuditLog, 
  ChatMessage, 
  CitizenProfile, 
  NotificationItem, 
  Scheme, 
  SchemeApplication, 
  SyncState 
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'govmitra_profile_v1',
  SCHEMES: 'govmitra_schemes_v1',
  APPLICATIONS: 'govmitra_applications_v1',
  SAVED_SCHEMES: 'govmitra_saved_schemes_v1',
  MESSAGES: 'govmitra_messages_v1',
  NOTIFICATIONS: 'govmitra_notifications_v1',
  AUDIT_LOGS: 'govmitra_audit_logs_v1',
  SYNC_QUEUE: 'govmitra_sync_queue_v1',
  SETTINGS: 'govmitra_settings_v1'
};

const DEFAULT_PROFILE: CitizenProfile = {
  id: 'citizen-default',
  fullName: 'Asha Kumari',
  age: 19,
  gender: 'FEMALE',
  state: 'Karnataka',
  district: 'Bengaluru Rural',
  annualIncome: 180000,
  occupation: 'STUDENT',
  studentLevel: 'UNDERGRADUATE',
  landHoldingAcres: 0,
  isArtisan: false,
  hasDisability: false,
  casteCategory: 'OBC',
  rationCardType: 'BPL',
  preferredLanguage: 'kn',
  seniorMode: false,
  highContrast: false,
  voiceReadAloud: true
};

export class LocalDatabase {
  private static listeners: Set<() => void> = new Set();
  private static isOfflineSimulated: boolean = false;
  private static isAiFailureSimulated: boolean = false;

  public static subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private static notifyListeners() {
    this.listeners.forEach(cb => cb());
  }

  // --- OFFLINE & SIMULATION FLAGS ---
  public static isOffline(): boolean {
    return this.isOfflineSimulated || !navigator.onLine;
  }

  public static setOfflineSimulation(active: boolean) {
    this.isOfflineSimulated = active;
    this.addAuditLog('SIMULATION', `Offline mode toggled: ${active}`);
    this.notifyListeners();
  }

  public static isAiUnavailable(): boolean {
    return this.isAiFailureSimulated;
  }

  public static setAiFailureSimulation(active: boolean) {
    this.isAiFailureSimulated = active;
    this.addAuditLog('SIMULATION', `AI Failure fallback mode toggled: ${active}`);
    this.notifyListeners();
  }

  // --- CITIZEN PROFILE ---
  public static getProfile(): CitizenProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading profile from local storage', e);
    }
    return DEFAULT_PROFILE;
  }

  public static saveProfile(profile: CitizenProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    this.addAuditLog('PROFILE', `Updated profile for ${profile.fullName}`);
    this.queueSync('PROFILE', profile.id, profile);
    this.notifyListeners();
  }

  // --- SCHEMES (Local Room Cache) ---
  public static normalizeScheme(s: Scheme): Scheme {
    const locNames = s.localizedNames || s.nameLocal || {
      en: s.name,
      kn: s.name,
      hi: s.name,
      ta: s.name,
      te: s.name,
      mr: s.name,
      bn: s.name,
      ml: s.name
    };
    const docs = s.requiredDocuments || s.documentsRequired || [];
    const url = s.officialPortalUrl || s.officialUrl || s.applicationUrl || 'https://www.myscheme.gov.in';
    const expl = s.simplifiedExplanation || {
      en: s.description || s.name,
      kn: s.description || s.name,
      hi: s.description || s.name,
      ta: s.description || s.name,
      te: s.description || s.name,
      mr: s.description || s.name,
      bn: s.description || s.name,
      ml: s.description || s.name
    };

    return {
      ...s,
      localizedNames: locNames,
      nameLocal: locNames,
      requiredDocuments: docs,
      documentsRequired: docs,
      officialPortalUrl: url,
      officialUrl: url,
      simplifiedExplanation: expl
    };
  }

  public static getSchemes(): Scheme[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHEMES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(s => this.normalizeScheme(s));
        }
      }
    } catch (e) {
      console.warn('Error reading cached schemes', e);
    }
    // Initialize with comprehensive master dataset
    const normalized = ALL_SCHEMES.map(s => this.normalizeScheme(s));
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(normalized));
    return normalized;
  }

  public static saveScheme(scheme: Scheme): void {
    const schemes = this.getSchemes();
    const index = schemes.findIndex(s => s.id === scheme.id);
    if (index >= 0) {
      schemes[index] = scheme;
    } else {
      schemes.unshift(scheme);
    }
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(schemes));
    this.addAuditLog('ADMIN', `Updated scheme record: ${scheme.name}`);
    this.notifyListeners();
  }

  public static getSavedSchemeIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_SCHEMES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static toggleSaveScheme(schemeId: string): boolean {
    const saved = this.getSavedSchemeIds();
    const index = saved.indexOf(schemeId);
    let isNowSaved = false;
    if (index >= 0) {
      saved.splice(index, 1);
      isNowSaved = false;
    } else {
      saved.push(schemeId);
      isNowSaved = true;
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_SCHEMES, JSON.stringify(saved));
    this.notifyListeners();
    return isNowSaved;
  }

  // --- APPLICATIONS ---
  public static getApplications(): SchemeApplication[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static getApplicationById(id: string): SchemeApplication | undefined {
    return this.getApplications().find(app => app.id === id);
  }

  public static saveApplication(application: SchemeApplication): void {
    const applications = this.getApplications();
    const index = applications.findIndex(a => a.id === application.id);
    if (index >= 0) {
      applications[index] = { ...application, updatedAt: new Date().toISOString() };
    } else {
      applications.unshift({ ...application, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    this.addAuditLog('APPLICATION', `Saved draft application: ${application.referenceId} (${application.status})`);
    this.queueSync('APPLICATION', application.id, application);
    this.notifyListeners();
  }

  // --- CHAT MESSAGES ---
  public static getMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveMessage(message: ChatMessage): void {
    const messages = this.getMessages();
    messages.push(message);
    // Keep max 100 recent messages
    const trimmed = messages.slice(-100);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(trimmed));
    this.notifyListeners();
  }

  public static clearMessages(): void {
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    this.notifyListeners();
  }

  // --- NOTIFICATIONS ---
  public static getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback initial notifications
    }
    const initial: NotificationItem[] = [
      {
        id: 'notif-1',
        title: 'NSP Scholarship 2026-27 Window Active',
        message: 'Applications for AICTE Pragati & Central Sector Scholarships are currently open on National Scholarship Portal.',
        type: 'SCHEME_ALERT',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        read: false
      },
      {
        id: 'notif-2',
        title: 'Ayushman Vay Vandana 70+ Enrollment Active',
        message: 'Senior citizens aged 70 and above can now register with Aadhaar e-KYC for universal ₹5 Lakh hospital coverage.',
        type: 'SCHEME_ALERT',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        read: false
      }
    ];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initial));
    return initial;
  }

  public static markNotificationRead(id: string) {
    const notifs = this.getNotifications();
    const notif = notifs.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
      this.notifyListeners();
    }
  }

  // --- AUDIT LOGS ---
  public static getAuditLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static addAuditLog(category: AuditLog['category'] | string, details: string) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action: details,
      category: (category as any) || 'APPLICATION',
      details
    };
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  }

  // --- SYNC QUEUE ENGINE ---
  private static queueSync(entity: string, id: string, payload: any) {
    if (this.isOffline()) {
      const queue = this.getSyncQueue();
      queue.push({
        id: `sync-${Date.now()}`,
        entity,
        entityId: id,
        timestamp: new Date().toISOString(),
        payload
      });
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    }
  }

  public static getSyncQueue(): any[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static syncPendingOperations(): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
        this.addAuditLog('SYNC', 'Synchronized pending local transactions with backend registry.');
        this.notifyListeners();
        resolve(true);
      }, 800);
    });
  }

  // --- CLEAR / RESET DATA ---
  public static resetDemoState(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.SAVED_SCHEMES);
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(ALL_SCHEMES));
    this.addAuditLog('DATA_PRIVACY', 'Demo state reset by user.');
    this.notifyListeners();
  }

  public static deleteAllUserData(): void {
    localStorage.clear();
    this.notifyListeners();
  }
}
