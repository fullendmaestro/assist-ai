import { google } from "@ai-sdk/google";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";

import { customMiddleware } from "./custom-middleware";

/**
 * Function to create a custom model with the specified API identifier.
 * It wraps the Google language model with custom middleware.
 *
 * @param {string} apiIdentifier - The identifier for the API model.
 * @returns {WrappedLanguageModel} - The wrapped language model with custom middleware.
 */
export const customModel = (apiIdentifier: string) => {
  return wrapLanguageModel({
    model: google(apiIdentifier),
    middleware: customMiddleware,
  });
};
