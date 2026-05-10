import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore, NutritionStore } from './stores';
import { VisionService } from './services/vision';
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
      const result = await this.visionService.analyzeFromDataUrl(dataUrl);
      this.lastAiResult.set(result);
      this.showConfirmModal.set(true);
    } catch (error) {
      console.error('Failed to analyze image:', error);
      alert('Failed to analyze image. Please try again.');
    }
  }

  onFoodConfirmed(data: { foodName: string; macros: { cal: number; p: number; c: number; f: number } }): void {
    this.nutritionStore.quickAddMeal(data.foodName, data.macros, 'ai');
    this.showConfirmModal.set(false);
    this.lastAiResult.set(null);
    this.lastCapturedImage.set(null);
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
