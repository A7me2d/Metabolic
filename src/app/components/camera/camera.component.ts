import { Component, signal, output, ElementRef, viewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera',
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <div class="glass-panel overflow-hidden rounded-[1.75rem] p-3 sm:rounded-[2rem] sm:p-4 md:p-5">
        <div class="relative h-[58vh] min-h-[300px] max-h-[420px] w-full overflow-hidden rounded-[1.25rem] bg-black sm:rounded-[1.5rem]">
          <video
            #videoEl
            class="h-full w-full object-cover"
            [class.hidden]="!streamActive()"
            autoplay
            playsinline
            muted>
          </video>

          <img
            *ngIf="capturedImage()"
            [src]="capturedImage()"
            class="h-full w-full object-cover"
            alt="Captured food">

          <canvas #canvasEl class="hidden"></canvas>

          <div *ngIf="!streamActive() && !capturedImage()" class="absolute inset-0 flex items-center justify-center">
            <div *ngIf="isLoading()" class="px-4 text-center">
              <div class="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-4 border-white/25 border-t-white"></div>
              <p class="text-sm text-white/70">Starting camera...</p>
            </div>

            <div *ngIf="error()" class="max-w-sm px-5 text-center sm:px-6">
              <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-400/15 text-rose-300">
                <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h4a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
              <p class="text-sm text-rose-200">{{ error() }}</p>
              <button (click)="startCamera()" class="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
                Retry camera
              </button>
            </div>
          </div>

          <div *ngIf="streamActive() && !capturedImage()" class="pointer-events-none absolute inset-0">
            <div class="absolute inset-4 rounded-[1.35rem] border border-white/25 sm:inset-6 sm:rounded-[1.75rem]"></div>
            <div class="absolute left-1/2 top-1/2 w-44 -translate-x-1/2 -translate-y-1/2 text-center text-[10px] uppercase tracking-[0.22em] text-white/50 sm:w-56 sm:text-xs sm:tracking-[0.3em]">
              Center your meal and capture
            </div>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-center gap-3 sm:mt-5">
          <button
            *ngIf="streamActive() && !capturedImage()"
            (click)="capture()"
            class="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white p-1 shadow-[0_24px_70px_rgba(255,255,255,0.15)] transition hover:scale-105 active:scale-95 sm:h-18 sm:w-18">
            <div class="h-12 w-12 rounded-full border-4 border-slate-900 sm:h-14 sm:w-14"></div>
          </button>

          <button
            *ngIf="capturedImage()"
            (click)="retake()"
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10 sm:w-auto">
            Retake
          </button>

          <button
            *ngIf="capturedImage()"
            (click)="showConfirmDialog.set(true)"
            class="w-full rounded-2xl bg-linear-to-r from-emerald-400 via-lime-300 to-orange-400 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] sm:w-auto">
            Analyze food
          </button>

          <button
            *ngIf="!streamActive() && !capturedImage() && !isLoading()"
            (click)="startCamera()"
            class="w-full rounded-2xl bg-linear-to-r from-sky-400 to-cyan-300 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] sm:w-auto">
            Start camera
          </button>
        </div>
      </div>

      <div *ngIf="showConfirmDialog()" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 backdrop-blur-xl" (click)="showConfirmDialog.set(false)">
        <div class="glass-panel max-w-sm rounded-[1.75rem] p-5 text-center sm:rounded-[2rem] sm:p-6" (click)="$event.stopPropagation()">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white sm:text-2xl">Analyze with AI?</h3>
          <p class="mt-3 text-sm leading-6 text-slate-400">We'll send this capture to Gemini so it can estimate the food and macros for you.</p>
          <div class="mt-6 flex flex-col gap-3 sm:flex-row">
            <button (click)="showConfirmDialog.set(false)" class="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-200 transition hover:bg-white/10">
              Cancel
            </button>
            <button (click)="confirmAndSend()" class="flex-1 rounded-2xl bg-linear-to-r from-emerald-400 via-lime-300 to-orange-400 px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.01]">
              Analyze
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CameraComponent implements OnInit, OnDestroy {
  private videoEl = viewChild<ElementRef<HTMLVideoElement>>('videoEl');
  private canvasEl = viewChild<ElementRef<HTMLCanvasElement>>('canvasEl');

  protected streamActive = signal(false);
  protected isLoading = signal(false);
  protected error = signal<string | null>(null);
  protected capturedImage = signal<string | null>(null);
  protected showConfirmDialog = signal(false);

  readonly imageCaptured = output<string>();
  readonly cameraError = output<string>();

  private stream: MediaStream | null = null;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stopCamera();
  }

  async startCamera(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 1280 }
        }
      });

      const video = this.videoEl()?.nativeElement;
      if (video) {
        video.srcObject = this.stream;
        await video.play();
        this.streamActive.set(true);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Camera access denied';
      this.error.set(message);
      this.cameraError.emit(message);
    } finally {
      this.isLoading.set(false);
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.streamActive.set(false);
  }

  capture(): void {
    const video = this.videoEl()?.nativeElement;
    const canvas = this.canvasEl()?.nativeElement;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      this.capturedImage.set(dataUrl);
      this.stopCamera();
    }
  }

  retake(): void {
    this.capturedImage.set(null);
    this.showConfirmDialog.set(false);
    this.startCamera();
  }

  confirmAndSend(): void {
    const image = this.capturedImage();
    if (image) {
      this.showConfirmDialog.set(false);
      this.imageCaptured.emit(image);
    }
  }
}
