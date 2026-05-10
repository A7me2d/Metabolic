import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-ring',
  imports: [CommonModule],
  template: `
    <div class="relative" [style.width.px]="size()" [style.height.px]="size()">
      <svg 
        [attr.width]="size()" 
        [attr.height]="size()" 
        class="transform -rotate-90">
        <!-- Background circle -->
        <circle
          [attr.cx]="size() / 2"
          [attr.cy]="size() / 2"
          [attr.r]="radius()"
          fill="none"
          [attr.stroke]="bgColor()"
          [attr.stroke-width]="strokeWidth()"
          class="opacity-20"
        />
        <!-- Progress circle -->
        <circle
          [attr.cx]="size() / 2"
          [attr.cy]="size() / 2"
          [attr.r]="radius()"
          fill="none"
          [attr.stroke]="progressColor()"
          [attr.stroke-width]="strokeWidth()"
          [attr.stroke-linecap]="rounded() ? 'round' : 'butt'"
          [attr.stroke-dasharray]="circumference()"
          [attr.stroke-dashoffset]="offset()"
          class="transition-all duration-500 ease-out"
        />
      </svg>
      <!-- Center content -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class ProgressRingComponent {
  readonly progress = input<number>(0); // 0-100
  readonly size = input<number>(120);
  readonly strokeWidth = input<number>(8);
  readonly color = input<string>('#10b981'); // emerald-500
  readonly bgColor = input<string>('currentColor');
  readonly rounded = input<boolean>(true);

  // Computed values
  protected radius = computed(() => (this.size() - this.strokeWidth()) / 2);
  protected circumference = computed(() => 2 * Math.PI * this.radius());
  
  protected offset = computed(() => {
    const progress = Math.min(100, Math.max(0, this.progress()));
    return this.circumference() - (progress / 100) * this.circumference();
  });

  protected progressColor = computed(() => {
    const progress = this.progress();
    if (progress >= 100) return '#ef4444'; // red-500 (over target)
    if (progress >= 80) return '#f59e0b'; // amber-500 (close to target)
    return this.color();
  });
}
