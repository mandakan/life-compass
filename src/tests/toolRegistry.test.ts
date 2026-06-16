import { describe, it, expect } from 'vitest';
import { TOOLS, type ToolDef } from '../practices/toolRegistry';

describe('tool registry', () => {
  it('exposes a TOOLS array', () => {
    expect(Array.isArray(TOOLS)).toBe(true);
  });

  it('every tool has a unique id and the required ToolDef fields', () => {
    const ids = new Set<string>();
    TOOLS.forEach((tool: ToolDef) => {
      expect(tool.id).toBeTruthy();
      expect(ids.has(tool.id)).toBe(false);
      ids.add(tool.id);
      expect(tool.labelKey).toMatch(/^practices\.tools\./);
      expect(tool.descriptionKey).toMatch(/^practices\.tools\./);
      expect(tool.component).toBeDefined();
    });
  });

  it('registers the behavioral-experiment tool', async () => {
    await import('../practices'); // triggers side-effect registration
    const { TOOLS: registered } = await import('../practices/toolRegistry');
    const tool = registered.find(x => x.id === 'behavioral-experiment');
    expect(tool).toBeDefined();
    expect(tool?.labelKey).toBe('practices.tools.behavioral_experiment.label');
    expect(tool?.component).toBeDefined();
  });
});
