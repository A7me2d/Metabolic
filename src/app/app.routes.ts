import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';
import { NutritionStore, UserStore } from './stores';
import { SupabaseDatabaseService } from './core/services/supabase-database.service';

const refreshPageDataResolver: ResolveFn<boolean> = async () => {
  const userStore = inject(UserStore);
  const nutritionStore = inject(NutritionStore);
  const supabaseDb = inject(SupabaseDatabaseService);

  await userStore.loadUser();
  const user = userStore.user();

  if (user) {
    await nutritionStore.loadDailyData(user.id, nutritionStore.selectedDate());
  }

  await Promise.all([
    supabaseDb.loadWorkoutDays(),
    supabaseDb.loadWorkoutLogs(),
    supabaseDb.loadUserStats()
  ]);

  return true;
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'nutrition',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./components/onboarding/onboarding.component').then(m => m.OnboardingComponent),
    canActivate: [publicGuard]
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'nutrition',
        resolve: { refresh: refreshPageDataResolver },
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'gym',
        resolve: { refresh: refreshPageDataResolver },
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'workout/day/:id',
        loadComponent: () => import('./features/workout-day/workout-day.component').then(m => m.WorkoutDayComponent)
      },
      {
        path: 'exercise/:id',
        loadComponent: () => import('./features/exercise-details/exercise-details.component').then(m => m.ExerciseDetailsComponent)
      },
      {
        path: 'home-workout',
        loadComponent: () => import('./features/home-workout/home-dashboard/home-dashboard.component').then(m => m.HomeDashboardComponent)
      },
      {
        path: 'home-workout/day/:id',
        loadComponent: () => import('./features/home-workout/home-workout-day/home-workout-day.component').then(m => m.HomeWorkoutDayComponent)
      },
      {
        path: 'home-exercise/:id',
        loadComponent: () => import('./features/home-workout/home-exercise-details/home-exercise-details.component').then(m => m.HomeExerciseDetailsComponent)
      },
      {
        path: 'body-tracking',
        loadComponent: () => import('./features/body-tracking/body-tracking.component').then(m => m.BodyTrackingComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'nutrition'
  }
];
