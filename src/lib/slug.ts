/**
 * Utility functions for generating and handling URL slugs
 */

/**
 * Generate a URL-friendly slug from id and caseNumber
 * @param id The original id (e.g., "gpt4o-1")
 * @param caseNumber The case number (e.g., 1)
 * @returns A slug string (e.g., "gpt-4o-case-1")
 */
export function generateSlug(id: string, caseNumber: number): string {
  // Extract model from id (remove the case number part)
  // e.g., "gpt4o-1" -> "gpt4o"
  const modelPart = id.replace(/-\d+$/, '');
  
  // Format the model name with hyphens for better readability
  // e.g., "gpt4o" -> "gpt-4o"
  const formattedModel = modelPart
    .replace(/([a-z])(\d)/g, '$1-$2')
    .replace(/(\d)([a-z])/g, '$1-$2')
    .toLowerCase();
  
  return `${formattedModel}-case-${caseNumber}`;
}

/**
 * Ensure a prompt has a valid slug, generating one if necessary
 * @param prompt The prompt data
 * @returns The prompt with a guaranteed slug
 */
export function ensureSlug(prompt: any): any {
  if (!prompt.slug || prompt.slug.trim() === '') {
    return {
      ...prompt,
      slug: generateSlug(prompt.id, prompt.caseNumber)
    };
  }
  return prompt;
}

/**
 * Find a prompt by slug or id
 * @param prompts Array of prompts
 * @param identifier Either a slug or id
 * @returns The matching prompt or undefined
 */
export function findPromptBySlugOrId(prompts: any[], identifier: string): any {
  // First try to find by slug
  let prompt = prompts.find(p => p.slug === identifier);
  
  // If not found by slug, try by id
  if (!prompt) {
    prompt = prompts.find(p => p.id === identifier);
  }
  
  return prompt;
}