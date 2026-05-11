import { Inject, Injectable, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseClient, User, Session, createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '../../services/supabase/supabase.tokens';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly clientInstance: SupabaseClient;

  private authState = signal<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });

  user = computed(() => this.authState().user);
  session = computed(() => this.authState().session);
  loading = computed(() => this.authState().loading);
  error = computed(() => this.authState().error);
  isAuthenticated = computed(() => !!this.authState().session);

  constructor(
    @Inject(SUPABASE_URL) supabaseUrl: string,
    @Inject(SUPABASE_PUBLISHABLE_KEY) supabasePublishableKey: string
  ) {
    this.clientInstance = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: this.isBrowser,
        autoRefreshToken: this.isBrowser,
        detectSessionInUrl: this.isBrowser
      }
    });

    if (this.isBrowser) {
      this.initAuth();

      this.clientInstance.auth.onAuthStateChange((event, session) => {
        this.authState.update(state => ({
          ...state,
          session,
          user: session?.user ?? null,
          loading: false
        }));
      });
    } else {
      this.authState.update(state => ({ ...state, loading: false }));
    }
  }

  get client(): SupabaseClient {
    return this.clientInstance;
  }

  getClient(): SupabaseClient {
    return this.clientInstance;
  }

  async getCurrentAuthUser(): Promise<User | null> {
    const { data, error } = await this.clientInstance.auth.getUser();
    if (error) {
      if (error.name === 'AuthSessionMissingError') {
        return null;
      }
      throw error;
    }
    return data.user ?? null;
  }

  getUserId(): string | null {
    return this.authState().user?.id ?? null;
  }

  private async initAuth(): Promise<void> {
    try {
      const { data: { session }, error } = await this.clientInstance.auth.getSession();
      if (error) throw error;

      this.authState.set({
        user: session?.user ?? null,
        session,
        loading: false,
        error: null
      });
    } catch {
      this.authState.set({
        user: null,
        session: null,
        loading: false,
        error: null
      });
    }
  }

  async signUp(email: string, password: string, metadata?: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
    this.authState.update(state => ({ ...state, loading: true, error: null }));

    const { data, error } = await this.clientInstance.auth.signUp({
      email,
      password,
      ...(metadata ? { options: { data: metadata } } : {})
    });

    if (error) {
      this.authState.update(state => ({ ...state, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }

    this.authState.update(state => ({
      ...state,
      user: data.user,
      session: data.session,
      loading: false
    }));

    return { success: true };
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.authState.update(state => ({ ...state, loading: true, error: null }));

    const { data, error } = await this.clientInstance.auth.signInWithPassword({ email, password });

    if (error) {
      this.authState.update(state => ({ ...state, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }

    this.authState.update(state => ({
      ...state,
      user: data.user,
      session: data.session,
      loading: false
    }));

    return { success: true };
  }

  async signOut(): Promise<void> {
    await this.clientInstance.auth.signOut();
    this.authState.set({
      user: null,
      session: null,
      loading: false,
      error: null
    });
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.clientInstance.auth.resetPasswordForEmail(email);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }
}
