// Define your models here.

/**
 * Interface representing a model with its properties.
 */
export interface Model {
  id: string; // Unique identifier for the model
  label: string; // Display name for the model
  apiIdentifier: string; // Identifier used for API calls
  description: string; // Brief description of the model
}

/**
 * Array of model objects available in the application.
 */
export const models: Array<Model> = [
  {
    id: "gemini-1.5-flash-002",
    label: "Gemini 1.5 Flash",
    apiIdentifier: "gemini-1.5-flash-002",
    description: "Small model for fast, lightweight tasks",
  },
  {
    id: "gemini-1.5-pro-002",
    label: "Gemini 1.5 pro",
    apiIdentifier: "gemini-1.5-pro-002",
    description: "For complex, multi-step tasks",
  },
] as const;

/**
 * The default model name used in the application.
 */
export const DEFAULT_MODEL_NAME: string = "gemini-1.5-pro-002";
