export { TOOLS } from './toolRegistry';
export type { ToolDef, ToolId } from './toolRegistry';

// Side-effect import: each tool registers itself into TOOLS on load.
import '@components/practices/tools/behavioral-experiment';
