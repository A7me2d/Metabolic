import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  while (supabaseService.loading()) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (supabaseService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const publicGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  while (supabaseService.loading()) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (!supabaseService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/nutrition']);
  return false;
};
