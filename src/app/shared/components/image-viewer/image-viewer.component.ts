import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  template: `
    @if (isOpen) {
      <div 
        class="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center animate-fade-in"
        (click)="close()"
      >
        <!-- Close button -->
        <button 
          class="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-dark-800/80 hover:bg-dark-700 flex items-center justify-center transition-colors"
          (click)="close()"
        >
          <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Image -->
        <img 
          [src]="imageUrl" 
          [alt]="imageAlt"
          class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          (click)="$event.stopPropagation()"
          (error)="onImageError($event)"
        />
      </div>
    }
  `,
  styles: [`
    :host {
      display: contents;
    }
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class ImageViewerComponent {
  @Input() imageUrl: string = '';
  @Input() imageAlt: string = '';
  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.closed.emit();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c0468?w=800&h=600&fit=crop';
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen) {
      this.close();
    }
  }
}
