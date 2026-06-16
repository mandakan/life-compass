import type { ComponentType, LazyExoticComponent } from 'react';

export type ToolId = string;

export interface ToolDef {
  /** Stable id, also the URL segment, e.g. 'behavioral-experiment'. */
  id: ToolId;
  /** i18n key for the display name shown on the shelf card and in ToolShell. */
  labelKey: string;
  /** i18n key for the one-sentence description shown on the shelf card. */
  descriptionKey: string;
  /** Heroicons-style icon for the shelf card. */
  icon?: ComponentType<{ className?: string }>;
  /** True when the tool may optionally link to a LifeArea (like Goal.areaId). */
  attachesToArea?: boolean;
  /** The full tool UI. Lazy so each tool is code-split. */
  component: LazyExoticComponent<ComponentType> | ComponentType;
}

/**
 * Static registry: each tool appends its ToolDef here. This is the single
 * source of truth for what the Practices shelf renders, mirroring VIEWS in
 * src/components/your-compass/views.ts. No tool depends on another.
 */
export const TOOLS: ToolDef[] = [];
