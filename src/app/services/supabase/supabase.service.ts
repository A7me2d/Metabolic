import { Injectable, inject } from '@angular/core';
import { SupabaseClient, User as SupabaseAuthUser } from '@supabase/supabase-js';
import { SupabaseService } from '../../core/services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseClientService {
  private supabaseService = inject(SupabaseService);

  get client(): SupabaseClient {
    return this.supabaseService.getClient();
  }

  async getCurrentAuthUser(): Promise<SupabaseAuthUser | null> {
    return this.supabaseService.getCurrentAuthUser();
  }
}
