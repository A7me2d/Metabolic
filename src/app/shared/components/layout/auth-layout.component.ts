import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UnifiedHeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, UnifiedHeaderComponent],
  template: `
    <app-unified-header />
    <main>
      <router-outlet />
    </main>
  `
})
export class AuthLayoutComponent {}
