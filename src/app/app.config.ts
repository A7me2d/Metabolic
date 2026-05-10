import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { GEMINI_API_KEY } from './services/vision';

// API Key from plan.md
const GEMINI_API_KEY_VALUE = 'AIzaSyBl4DhYoIU1lii_55oC7gFQ4voSgu1Bpo8';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    { provide: GEMINI_API_KEY, useValue: GEMINI_API_KEY_VALUE }
  ]
};
