import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SupabaseService } from './core/services/supabase.service';
import { UiFeedbackService } from './services';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private supabaseService = inject(SupabaseService);
  protected ui = inject(UiFeedbackService);
  private router = inject(Router);

  protected isLoading = this.supabaseService.loading;
  protected isLoggedIn = this.supabaseService.isAuthenticated;

  constructor() {}
}
