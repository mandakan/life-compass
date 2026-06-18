import { LifeArea } from './LifeArea';

/**
 * A denormalized copy of a single life area's name and ratings at the moment a
 * snapshot was taken. Stored independently of the live LifeArea so that history
 * stays truthful after an area is renamed or deleted.
 */
export interface SnapshotArea {
  id: string; // links back to a LifeArea
  name: string; // denormalized on purpose
  importance: number;
  satisfaction: number;
}

/**
 * A dated, frozen copy of the life areas at a point in time. This is the unit
 * of "progress over time" history.
 */
export interface Snapshot {
  id: string;
  createdAt: string; // ISO 8601
  label?: string; // optional user note, e.g. "after summer"
  areas: SnapshotArea[];
}

/**
 * A single checkable action step belonging to a goal. Step completion is the
 * sole source of truth for goal progress; progress is never stored.
 */
export interface ActionStep {
  id: string;
  text: string;
  done: boolean;
}

/**
 * A goal attached to a life area via `areaId`. Goals live as a top-level array
 * on the document (not nested in LifeArea) so they stay independently queryable
 * and keep LifeArea unchanged.
 */
export interface Goal {
  id: string;
  areaId: string; // -> LifeArea.id
  title: string;
  steps: ActionStep[];
  createdAt: string; // ISO 8601
}

/**
 * A behavioral experiment: a worry the user wants to test, the steps they try
 * in order to test it, and a free-text reflection on what actually happened.
 * It mirrors Goal (steps reuse ActionStep) but the area link is optional and
 * it carries an outcome. There are no scores: completing steps means "I ran
 * the experiment", never "I achieved a goal".
 */
export interface BehavioralExperiment {
  id: string;
  areaId?: string; // optional link to LifeArea.id (unlike Goal, which requires it)
  title: string; // the answer to "what I was worried might happen"
  steps: ActionStep[]; // reuse ActionStep verbatim
  outcome: string; // free-text reflection; starts empty
  createdAt: string; // ISO 8601
}

/**
 * A thought record: a distressing situation, the automatic thought, the feeling
 * (named + a 1-5 word-bucket strength), a gentle widening of the view, and the
 * feeling noticed again afterwards. The hybrid "capture then widen" framing --
 * never disputing the thought, never showing a before/after delta. The area
 * link is optional, like BehavioralExperiment.
 */
export interface ThoughtRecord {
  id: string;
  areaId?: string; // optional link to LifeArea.id
  situation: string; // what happened
  thought: string; // the automatic thought
  feeling: string; // named emotion(s), free text
  feelingBefore?: number; // 1-5 word-bucket strength, omitted when not chosen
  supports: string; // what supports the thought
  widerView: string; // what else might be true
  kinderView: string; // a kinder, wider way to hold it
  feelingAfter?: number; // 1-5 word-bucket strength, omitted when not chosen
  createdAt: string; // ISO 8601
}

/**
 * One brainstormed solution inside a ProblemSolving record. `pros`/`cons` are
 * free text ("what's good about this / what's hard about this") -- never rated,
 * counted, or tallied. There is no "best" option; the user simply marks the one
 * they chose to try via ProblemSolving.chosenOptionId.
 */
export interface SolutionOption {
  id: string;
  text: string;
  pros: string; // "what's good about this", free text, starts empty
  cons: string; // "what's hard about this", free text, starts empty
}

/**
 * A structured problem-solving record: a concrete problem, a set of
 * brainstormed options (each optionally weighed), the option chosen to try, a
 * self-contained plan (reusing ActionStep), and a free-text review of how it
 * went. The area link is optional, like BehavioralExperiment / ThoughtRecord.
 * No scores: completing plan steps means "I tried it", never "I succeeded".
 */
export interface ProblemSolving {
  id: string;
  areaId?: string; // optional link to LifeArea.id
  problem: string; // the problem, concretely
  options: SolutionOption[]; // brainstormed options, each optionally weighed
  chosenOptionId?: string; // which option is being tried; cleared if that option is removed
  steps: ActionStep[]; // the plan; reuse ActionStep verbatim
  outcome: string; // review reflection; starts empty
  createdAt: string; // ISO 8601
}

/**
 * A planned activity for behavioral activation: something the user means to do,
 * optionally on a date/time-of-day, then reviewed after the fact. The two
 * feeling axes -- pleasure ("how good it felt") and meaning (mastery, reframed
 * toward values) -- are captured as predicted + experienced 1-5 word-buckets.
 * They are never rendered as numbers or a before/after delta. `done` encodes
 * activation-vs-avoidance ("I did it"), never achievement. The area link is
 * optional, like BehavioralExperiment / ThoughtRecord / ProblemSolving.
 */
export interface BehavioralActivation {
  id: string;
  areaId?: string; // optional link to LifeArea.id
  activity: string; // what I plan to do
  plannedDate?: string; // ISO date (day granularity), optional
  timeOfDay?: 'morning' | 'afternoon' | 'evening'; // optional schedule slot
  done: boolean; // did it happen? starts false
  pleasureExpected?: number; // 1-5 word-bucket, "how good do you expect it to feel?"
  pleasureActual?: number; // 1-5 word-bucket, "how good did it feel?"
  masteryExpected?: number; // 1-5 word-bucket, "do you expect it to feel meaningful?"
  masteryActual?: number; // 1-5 word-bucket, "did it feel meaningful?"
  outcome: string; // free-text "how it went"; starts empty
  createdAt: string; // ISO 8601
}

/**
 * The single persisted document. Versioned so the schema can evolve via the
 * store's persist `migrate` hook.
 */
export interface LifeCompassDocument {
  schemaVersion: 6;
  lifeAreas: LifeArea[];
  history: Snapshot[];
  goals: Goal[];
  behavioralExperiments: BehavioralExperiment[];
  thoughtRecords: ThoughtRecord[];
  problemSolvings: ProblemSolving[];
  behavioralActivations: BehavioralActivation[];
}

export const CURRENT_SCHEMA_VERSION = 6 as const;
