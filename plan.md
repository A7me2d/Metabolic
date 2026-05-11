The Professional Angular 21 Architecture Prompt
System Role: You are a Senior Angular Architect and AI Integration Expert.
Objective: Scaffold a high-performance Nutrition & Health Tracker using Angular 21, Signals, and Tailwind CSS.

1. State Management & Data Flow:

Reactive Core: Use Angular Signals as the primary state mechanism. Implement a UserStore and NutritionStore using signal, computed (for BMI and TDEE calculations), and effect for local persistence.

Mifflin-St Jeor Service: Create a specialized service to calculate BMR and provide a DailyTargets object: { lose: number, maintain: number, gain: number }.

2. Gemini 2.0 Flash Integration (Vision API):

api key: AIzaSyDDfXQv3GwkfP9UA8JlmtWT4_D528YoAs4

Task: Implement a VisionService using @google/generative-ai.

Snapshot Logic: Integrate a CameraComponent that captures a Base64 string from a HTMLVideoElement.

AI Prompting: Use "Structured Output" (JSON Mode). The prompt sent to Gemini must strictly request:

JSON
{ "food_name": "string", "macros": { "cal": "int", "p": "int", "c": "int", "f": "int" }, "confidence": "float" }
API Security: Design the service to request the Gemini API Key from me before initializing. Implement a secure injection token for the API key.

3. Feature Set (Mobile-First):

Dynamic Dashboard: Use Tailwind to build a mobile-optimized dashboard with a "Calorie Progress Ring".

Multi-Input System:

Image Mode: Post-process Gemini results with a "Confirmation Modal" before adding to signals.

Manual Mode: Quick-add for Vitamins/Supplements (Name/Type/Time).

Totalizer: A computed signal that aggregates all meals/supplements for the current 24-hour window.

4. Backend Readiness (Supabase):

Interface-First: Define strict TypeScript Interfaces for User, Meal, and Supplement.

Abstraction: Wrap all data operations in an abstract DataService so I can swap the LocalStorage implementation for Supabase seamlessly later.

5. Immediate Step:

Stop and Ask: Before providing any code, ask me for my Gemini API Key.

Once provided, generate the GeminiService and the NutritionStore using the latest Angular 21 syntax (including resource or linkedSignal if applicable to the use case).