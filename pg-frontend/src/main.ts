import 'zone.js';  // <-- Add this line at the top

import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptorsFromDi())  // ✅ modern replacement
  ]
}).catch(err => console.error(err));
