import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseClient, User as SupabaseAuthUser, createClient } from '@supabase/supabase-js';
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './supabase.tokens';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly clientInstance: SupabaseClient;

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
  }

  get client(): SupabaseClient {
    return this.clientInstance;
  }

  async getCurrentAuthUser(): Promise<SupabaseAuthUser | null> {
    const { data, error } = await this.client.auth.getUser();
    if (error) {
      if (error.name === 'AuthSessionMissingError') {
        return null;
      }
      throw error;
    }
    return data.user ?? null;
  }
}
