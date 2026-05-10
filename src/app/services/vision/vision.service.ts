import { Injectable, inject, InjectionToken, signal, computed } from '@angular/core';
import { GeminiFoodResponse } from '../../models';

// Secure injection token for Gemini API Key
export const GEMINI_API_KEY = new InjectionToken<string>('GEMINI_API_KEY');

const GEMINI_VISION_PROMPT = `Analyze this food image and return a JSON object with the following structure:
{
  "food_name": "string - name of the food item",
  "macros": {
    "cal": "number - total calories",
    "p": "number - protein in grams",
    "c": "number - carbohydrates in grams", 
    "f": "number - fat in grams"
  },
  "confidence": "number - confidence score between 0 and 1"
}

Be as accurate as possible with portion estimation. If multiple food items are present, estimate the total macros.
Return ONLY valid JSON, no additional text.`;

@Injectable({
  providedIn: 'root'
})
export class VisionService {
  private apiKey = inject(GEMINI_API_KEY, { optional: true });
  
  // State
  private _isAnalyzing = signal(false);
  private _lastResult = signal<GeminiFoodResponse | null>(null);
  private _error = signal<string | null>(null);
  private _lastImageBase64 = signal<string | null>(null);

  // Public signals
  readonly isAnalyzing = this._isAnalyzing.asReadonly();
  readonly lastResult = this._lastResult.asReadonly();
  readonly error = this._error.asReadonly();
  readonly lastImageBase64 = this._lastImageBase64.asReadonly();

  // Computed
  readonly hasApiKey = computed(() => !!this.apiKey);

  /**
   * Analyze a food image using Gemini 2.0 Flash Vision API
   * @param base64Image Base64 encoded image (without data URL prefix)
   * @param mimeType Image MIME type (e.g., 'image/jpeg', 'image/png')
   */
  async analyzeFoodImage(base64Image: string, mimeType: string = 'image/jpeg'): Promise<GeminiFoodResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API Key not configured. Please provide an API key.');
    }

    this._isAnalyzing.set(true);
    this._error.set(null);
    this._lastImageBase64.set(base64Image);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': this.apiKey
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: GEMINI_VISION_PROMPT },
                {
                  inlineData: {
                    mimeType,
                    data: base64Image
                  }
                }
              ]
            }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract text from response
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textContent) {
        throw new Error('No response from Gemini API');
      }

      // Parse JSON response
      const result: GeminiFoodResponse = JSON.parse(textContent);
      
      // Validate required fields
      if (!result.food_name || !result.macros) {
        throw new Error('Invalid response format from Gemini');
      }

      this._lastResult.set(result);
      return result;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to analyze image';
      this._error.set(message);
      throw e;
    } finally {
      this._isAnalyzing.set(false);
    }
  }

  /**
   * Analyze from a data URL (e.g., from canvas toDataURL)
   */
  async analyzeFromDataUrl(dataUrl: string): Promise<GeminiFoodResponse> {
    const matches = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid data URL format');
    }
    
    const mimeType = matches[1];
    const base64 = matches[2];
    
    return this.analyzeFoodImage(base64, mimeType);
  }

  /**
   * Clear last result
   */
  clearResult(): void {
    this._lastResult.set(null);
    this._lastImageBase64.set(null);
    this._error.set(null);
  }
}
