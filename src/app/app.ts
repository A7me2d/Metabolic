import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore, NutritionStore } from './stores';
import { VisionService } from './services/vision';
import { UiFeedbackService } from './services';
import { 
  DashboardComponent, 
  OnboardingComponent, 
  CameraComponent, 
  FoodConfirmModalComponent,
  ManualEntryComponent 
} from './components';
import { GeminiFoodResponse } from './models';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, 
    DashboardComponent,
    OnboardingComponent,
    CameraComponent,
    FoodConfirmModalComponent,
    ManualEntryComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private userStore = inject(UserStore);
  private nutritionStore = inject(NutritionStore);
  private visionService = inject(VisionService);
  protected ui = inject(UiFeedbackService);

  // State
  protected showCamera = signal(false);
  protected showConfirmModal = signal(false);
  protected showAddMenu = signal(false);
  protected lastCapturedImage = signal<string | null>(null);
  protected lastAiResult = signal<GeminiFoodResponse | null>(null);

  // Computed
  protected isLoggedIn = this.userStore.isLoggedIn;
  protected isLoading = this.userStore.isLoading;

  constructor() {
    // Auto-hide menu when modal opens
    effect(() => {
      if (this.showCamera() || this.showConfirmModal()) {
        this.showAddMenu.set(false);
      }
    });
  }

  // Camera handlers
  onImageCaptured(dataUrl: string): void {
    this.lastCapturedImage.set(dataUrl.split(',')[1]); // Remove data URL prefix
    this.showCamera.set(false);
    this.analyzeImage(dataUrl);
  }

  async analyzeImage(dataUrl: string): Promise<void> {
    try {
      const result = await this.ui.track(
        'Analyzing your food photo...',
        this.visionService.analyzeFromDataUrl(dataUrl)
      );
      this.lastAiResult.set(result);
      this.showConfirmModal.set(true);
      this.ui.success('Food analysis is ready.');
    } catch (error) {
      console.error('Failed to analyze image:', error);
      this.ui.error(error instanceof Error ? error.message : 'Failed to analyze image. Please try again.');
    }
  }

  async onFoodConfirmed(data: { foodName: string; macros: { cal: number; p: number; c: number; f: number } }): Promise<void> {
    try {
      await this.ui.track(
        'Saving meal to your log...',
        this.nutritionStore.quickAddMeal(data.foodName, data.macros, 'ai')
      );
      this.showConfirmModal.set(false);
      this.lastAiResult.set(null);
      this.lastCapturedImage.set(null);
      this.ui.success('Meal added to your log.');
    } catch (error) {
      this.ui.error(error instanceof Error ? error.message : 'Could not save this meal.');
    }
  }

  onFoodCancelled(): void {
    this.showConfirmModal.set(false);
    this.lastAiResult.set(null);
    this.lastCapturedImage.set(null);
  }

  // Menu toggle
  toggleAddMenu(): void {
    this.showAddMenu.update(v => !v);
  }

  openCamera(): void {
    this.showCamera.set(true);
    this.showAddMenu.set(false);
  }

  openManualEntry(): void {
    this.showAddMenu.set(false);
    const section = document.getElementById('manual-entry-section');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
