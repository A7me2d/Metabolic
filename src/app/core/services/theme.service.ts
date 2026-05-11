import { Injectable, signal, effect } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly isDarkMode = signal(true);
  
  constructor(private storageService: StorageService) {
    const savedTheme = this.storageService.getTheme();
    this.isDarkMode.set(savedTheme === 'dark');
    
    effect(() => {
      const isDark = this.isDarkMode();
      this.storageService.saveTheme(isDark ? 'dark' : 'light');
      this.applyTheme(isDark);
    });
  }

  toggle(): void {
    this.isDarkMode.update(current => !current);
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkMode.set(isDark);
  }

  private applyTheme(isDark: boolean): void {
    const body = document.body;
    if (isDark) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }
}
