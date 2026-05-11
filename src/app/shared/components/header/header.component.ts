import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../core/services/supabase.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-unified-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header class="sticky top-0 z-50 border-b border-white/10 bg-[var(--panel-strong)] backdrop-blur-xl">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">

          <a routerLink="/nutrition" class="flex items-center gap-2.5 group">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-orange-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 2c0 5-4 7-4 12a4 4 0 0 0 8 0c0-5-4-7-4-12z"/>
              </svg>
            </div>
            <span class="text-lg font-bold text-white hidden sm:block">FitHub</span>
          </a>

          @if (isAuthenticated()) {
            <nav class="flex items-center gap-1 rounded-full border border-white/8 bg-white/4 p-1">
              <a
                routerLink="/nutrition"
                routerLinkActive
                [routerLinkActiveOptions]="{ exact: false }"
                #nutritionLink="routerLinkActive"
                [class.bg-emerald-400/15]="nutritionLink.isActive"
                [class.text-emerald-200]="nutritionLink.isActive"
                [class.text-slate-400]="!nutritionLink.isActive"
                class="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 hover:bg-white/8 hover:text-white">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2c0 5-4 7-4 12a4 4 0 0 0 8 0c0-5-4-7-4-12z"/>
                  <path d="M12 22a2 2 0 0 0 2-2c0-1.5-2-2-2-4 0 0-2 2.5-2 4a2 2 0 0 0 2 2z"/>
                </svg>
                <span class="hidden sm:inline">Nutrition</span>
              </a>
              <a
                routerLink="/gym"
                routerLinkActive
                [routerLinkActiveOptions]="{ exact: false }"
                #gymLink="routerLinkActive"
                [class.bg-sky-400/15]="gymLink.isActive"
                [class.text-sky-200]="gymLink.isActive"
                [class.text-slate-400]="!gymLink.isActive"
                class="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 hover:bg-white/8 hover:text-white">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6.5 4.5a2 2 0 0 0-3 0l-.5.5a2 2 0 0 0 0 3l1.5 1.5"/>
                  <path d="M17.5 4.5a2 2 0 0 1 3 0l.5.5a2 2 0 0 1 0 3l-1.5 1.5"/>
                  <path d="M8 12h8"/>
                </svg>
                <span class="hidden sm:inline">Gym</span>
              </a>
            </nav>

            <div class="flex items-center gap-2">
              <button
                (click)="toggleLanguage()"
                class="h-9 rounded-xl border border-white/8 bg-white/4 px-3 text-xs font-bold transition hover:bg-white/8"
                [class.text-sky-300]="isArabic()"
                [class.text-slate-400]="!isArabic()">
                {{ isArabic() ? 'EN' : 'ع' }}
              </button>

              <button
                (click)="toggleTheme()"
                class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/4 transition hover:bg-white/8"
                [attr.aria-label]="isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'">
                @if (isDarkMode()) {
                  <svg class="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  </svg>
                } @else {
                  <svg class="h-4 w-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                }
              </button>

              <button
                (click)="logout()"
                class="flex h-9 items-center gap-1.5 rounded-xl border border-rose-300/15 bg-rose-400/8 px-3 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/15">
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span class="hidden sm:inline">Logout</span>
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `
})
export class UnifiedHeaderComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  private themeService = inject(ThemeService);
  private translationService = inject(TranslationService);
  private router = inject(Router);

  isDarkMode = this.themeService.isDarkMode;
  isArabic = this.translationService.isArabic;
  isAuthenticated = this.supabaseService.isAuthenticated;

  ngOnInit(): void {
    this.translationService.initLanguage();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }

  async logout(): Promise<void> {
    await this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }
}
