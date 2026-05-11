import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { GEMINI_API_KEY } from './services/vision';
import { environment } from '../environments/environment';
import { DataService, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, SupabaseDataService } from './services';
import { SupabaseService } from './core/services/supabase.service';

const GEMINI_API_KEY_VALUE = 'AIzaSyDDfXQv3GwkfP9UA8JlmtWT4_D528YoAs4';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    { provide: GEMINI_API_KEY, useValue: GEMINI_API_KEY_VALUE },
    { provide: SUPABASE_URL, useValue: environment.supabaseUrl },
    { provide: SUPABASE_PUBLISHABLE_KEY, useValue: environment.supabasePublishableKey },
    { provide: DataService, useExisting: SupabaseDataService }
  ]
};
