<!--
Generated 2026-06-16 from a multi-agent research workflow.
Method: 15 candidate tools each run through evidence research -> adversarial
verification (refute overstatement) -> architecture/effort fit -> guided
("clinician-assisted") re-appraisal, then synthesized and ranked by guided
clinical impact. Source catalogue: kbtiprimarvarden.se.

VERIFY BEFORE RELYING ON THESE (asserted by an automated site crawl, not
independently confirmed):
- The site content licence (reported as CC BY-NC-SA 4.0). This gates the
  "digitize the worksheets" plan -- confirm directly before building on it.
- Authorship / who the creator is. You are already in contact, so trust that
  over anything the crawl inferred.
- A handful of named worksheets/modules (e.g. exact module numbers); spot-check
  against the live manuals before quoting them to the creator.
-->

# Life Compass: Dual-Mode Clinical Build Roadmap

## Executive summary

This roadmap re-ranks 15 candidate tools under a deliberate reframe: Life Compass is a **dual-mode** instrument. Its PRIMARY mode is clinician-assisted -- a therapist screens, assigns, and reviews while the client captures work between sessions, with data shared through the existing Ajv-validated JSON export/import. Its SECONDARY mode is optional unguided self-help. Ranking by guided clinical impact (therapist-delivered evidence x condition burden x the value of digitizing that specific kbtiprimarvarden.se worksheet), with clinician-workflow fit and engineering effort as tie-breakers, substantially reorders the earlier unguided-only view. The core CBT worksheets -- behavioral activation, thought records, behavioral experiments, problem solving -- that score "limited" as solo self-help jump to the top, because they are precisely the therapist worksheets with strong guided evidence and a direct home in the site's completed primary-care manuals. The ACT valued-living tools (which the app already embodies) and the relaxation/positive-psychology tools (breathing, gratitude, self-compassion) fall toward the middle and bottom: they are cheap and ethos-aligned, but their guided evidence is moderate-to-limited and several have no named site worksheet to digitize.

## Two delivery modes

**Guided (primary).** The therapist applies severity and contraindication screening at intake, assigns a tool as between-session homework, and reviews the client's exported JSON at the next appointment. This is where the strong evidence lives -- every guideline endorsement in this dataset (NICE, APA, AASM, ESRS, CANMAT, Socialstyrelsen) is anchored in therapist-delivered or clinician-supervised delivery. Guided mode also absorbs most safety risk: the clinician handles suicidality monitoring, bipolar/contraindication exclusion, rumination/reassurance-ritual drift, and the interpretation of any numbers so the client never over-reads a daily fluctuation. Tools that suit guided-first: Behavioral Activation, Thought Record, Behavioral Experiment, Problem Solving, CBT-I, Worry Postponement, Self-Monitoring, Sleep Hygiene, Psychoeducation, Physical Activity Scheduling.

**Unguided (secondary).** A self-referring user works alone with no screening. Across this set the honest unguided rating is "limited" for almost everything -- the consistent finding is that waitlist-controlled and non-clinical-sample effects shrink or vanish against active controls, and dropout is severe (60-80% in several self-guided RCTs). Only two tools earn a "moderate" unguided rating and are genuinely defensible solo: **CBT-I** and **Brief Mindfulness / Body Scan**. The app's existing ACT valued-living core (the wheel, drift reflections, goals) is the other reasonable unguided layer because it is low-risk reflection rather than a treatment claim. Everything else should carry the app's existing non-clinical tone and avoid any efficacy promise when used alone.

## Ranked roadmap (by guided clinical impact)

| # | Tool | Guided impact | Unguided impact | Guided evidence | Clinician-workflow fit | Effort | Maps to site worksheet |
|---|------|---------------|-----------------|-----------------|------------------------|--------|------------------------|
| 1 | Behavioral Activation | high | low | strong | moderate | L | Activity & Mood Schedule (red/green), Plus Activities, TRAP/TRAC -- depression manuals |
| 2 | Thought Record | high | low | strong | moderate | L | Cognitive restructuring module (CBT depression); Worst Thought (GAD) |
| 3 | Behavioral Experiment | high | low | strong | moderate | M | Behavioral Experiment Recording Sheet (CBT GAD) |
| 4 | Values Clarification & Committed Action | high | medium | moderate | moderate | M | "life compass tool" + values/goals worksheet (CBT depression Module 4); ACT Matrix |
| 5 | Structured Problem Solving | high | low | moderate | moderate | M | Problem-solving worksheet (CBT depression Module 10; GAD Module 4) |
| 6 | CBT-I (Stimulus Control + Sleep Restriction) | high | medium | strong | moderate | XL | Sleep diary, Sov gott, stimulus control, sleep restriction (sleep manual) |
| 7 | Structured Physical Activity Scheduling | medium | low | moderate | moderate | L | Activity & Mood Schedule; Levnadsvanor lifestyle form |
| 8 | Worry Postponement | medium | low | moderate | moderate | M | Worry Diary / Orosdagbok (anxiety manual; GAD "worry time") |
| 9 | Mood & Activity Self-Monitoring | medium | low | moderate | moderate | XL | activity log mood/pleasure/emotion variants (depression manuals) |
| 10 | Brief Mindfulness / Body Scan | medium | medium | strong | moderate | M | none published (mindfulness modules in development) |
| 11 | Self-Compassion Practice | medium | low | moderate | moderate | M | none directly; adjunct to values/goals + FACT |
| 12 | Sleep Hygiene Psychoeducation | medium | low | moderate | moderate | M | Sov gott handout / psychoeducation (sleep manual) |
| 13 | Controlled Breathing | low | low | moderate | moderate | S | none directly; component within CBT/FACT |
| 14 | Psychoeducation Module | medium | low | moderate | moderate | M | Depression model diagram + handouts (CBT/counseling manuals) |

Note: Gratitude Journal is not separately ranked in this table because it has **no site worksheet** and the lowest guideline standing (no NICE/SBU/APA endorsement, no named manual). If built, treat it as a low-priority optional adjunct alongside Self-Compassion -- moderate guided evidence, limited unguided, clean architecture, effort M.

## Recommended build order

The clinical ranking and the engineering sequence pull in slightly different directions; this order reconciles them.

**Phase 1 -- prove the loop with the best impact-to-effort worksheet (do first).**
1. **Behavioral Experiment (#3, effort M, archFit moderate).** Start here despite being rank 3, not rank 1, because it copies the existing goals/ActionStep top-level-array pattern almost verbatim, fills a real clinical gap, and exercises the full assign -> capture -> export -> import loop end to end. It is the cheapest way to validate the whole guided workflow before committing to the heavier builds.
2. **Values Clarification "Clarity session" view (#4, effort M, archFit clean).** No new data model at all -- a guided PerspectiveSwitcher view over data the app already holds. It is the literal digital version of the site's "life compass tool" worksheet, making it the strongest single artefact to show the creators. Quick win.

**Phase 2 -- the high-impact CBT cluster.**
3. **Thought Record (#2, effort L).** The cognitive layer the app lacks; clean store extension but real i18n and ACT/CBT-tone work.
4. **Structured Problem Solving (#5, effort M).** Reuses the same new-array pattern; collapse its plan/act steps into the existing Goals system to cut effort and ethos tension.
5. **Behavioral Activation (#1, effort L, archFit hard).** Highest clinical impact but build it after the cheaper worksheets prove the pattern, because it introduces the first genuinely new data shape (scheduled activities with dates). Fold Mood & Activity Self-Monitoring (#9) in as BA's logging substrate rather than as a separate tool.

**Phase 3 -- the sleep track (largest, gate behind demand).**
6. **CBT-I (#6, effort XL).** Highest single-condition evidence and a moderate unguided rating, but it is effectively a second app: a time-series sleep-diary model, rise-time config, and unavoidable numeric sleep-efficiency. Build only after the worksheet cluster lands, and consider a clearly-labelled clinician-mode sleep-diary section so the numeric requirement does not leak into the general no-scores UX.
7. **Sleep Hygiene Psychoeducation (#12, effort M)** can ship earlier as a cheap standalone content page if a full CBT-I build is deferred -- it is the gentle first-step version.

**Quick wins anytime (cheap, ethos-aligned, low risk).**
- **Controlled Breathing (#13, effort S)** -- near-free animated pacer, no persistence.
- **Self-Compassion (#11) / Gratitude** -- clean free-text adjuncts; cost is warm 6-language copy, not code.
- **Worry Postponement (#8, effort M)** -- single localStorage key, no schema bump.

**Co-design candidate.** **Brief Mindfulness (#10)** -- the site's mindfulness modules are still under development, so this is a build-it-together opportunity rather than a digitize-existing one.

## Relation to kbtiprimarvarden.se

The site has five completed manuals and a deep worksheet library under CC BY-NC-SA 4.0 -- an explicit invitation to collaborative adaptation. The mapping splits cleanly:

**Tools that digitize existing, completed site worksheets (lowest content risk):**
- BA -> Activity and Mood Schedule (red/green), Plus Activities, TRAP/TRAC -- present in *both* depression manuals.
- Thought Record -> cognitive restructuring module (CBT depression) and Worst Thought sheet (GAD).
- Behavioral Experiment -> the Behavioral Experiment Recording Sheet (GAD manual) -- a near-verbatim match.
- Problem Solving -> the problem-solving worksheet in *both* the depression (Module 10) and GAD (Module 4) manuals.
- CBT-I -> the sleep diary, Sov gott handout, stimulus control, and sleep restriction protocol -- all four artefacts of the sleep counseling manual.
- Worry Postponement -> the Orosdagbok worry diary (anxiety manual) and "worry time" (GAD manual).
- Self-Monitoring -> the activity-log mood/pleasure/emotion variants.
- Sleep Hygiene and Psychoeducation -> the Sov gott and depression/anxiety model handouts.

**The standout strategic match:** the CBT-for-depression manual *names a "life compass tool"* as its Module 4 Values worksheet. Life Compass is already the digital realization of that worksheet -- this is the natural centre of any collaboration.

**Where the app ADDS something the site lacks:** the entire **ACT valued-living core** (importance-vs-satisfaction balance wheel, drift-driven non-judgmental reflection, snapshot trend history) is richer than anything in the manuals, which treat values as a single paper worksheet. The site's ACT presence is thin (ACT Matrix and Four-Quadrant in the problem-analysis tools; FACT brief format) and its open ACT/mindfulness group manuals are unbuilt. The app's structured, longitudinal valued-living layer is genuinely additive, not a digitization. Mindfulness is similarly a co-build, not a port -- the site has no published mindfulness worksheet yet.

## Digital over pen-and-paper

The concrete, defensible advantages of the app over the paper worksheets, and what is achievable today versus what needs more infrastructure:

**Works today via the existing JSON export/import (no backend):**
- **Between-session capture with timestamps.** Clients record activities, thoughts, worries, or experiment outcomes at the moment they occur rather than reconstructing them the night before the appointment -- the single most common failure mode of paper BA logs and thought records.
- **Trend-over-time.** Snapshot history and the radar chart give therapist and client a dated, visual trajectory across an episode that loose paper sheets cannot reconstruct.
- **Export-to-clinician.** The client exports one Ajv-validated JSON file; the therapist imports it (with a preview) and reviews the full record set before the session. No lost or forgotten sheets, since data persists in localStorage.
- **Legibility and completeness.** Typed structured fields beat illegible, abbreviated, distress-degraded handwriting, and pre-labelled prompts reduce blank-page paralysis.
- **Gentle, pressure-free framing.** Word-bucket scales (no raw numbers shown), no streaks, and non-judgmental copy are built in -- a better default than a paper grid of empty rows.

**Needs a sharing/backend layer to fully realize (not available today):**
- **Passive clinician visibility between sessions.** There is no push, no sync, and no therapist dashboard. The client must remember to export and transmit the file (email, 1177, or showing the screen). For the site's stepped-care, letter-based primary-care workflow this manual handoff is familiar and acceptable, but it is real friction.
- **Multi-client review tooling.** Importing a client's file overwrites the clinician's own localStorage; a therapist needs a separate browser profile per client, and there is no diff view between sessions. A read-only "share with my therapist" link would move workflow fit from moderate to clean.
- **Mid-week alerting.** No mechanism exists to flag a sharp satisfaction drop or a stalled/abandoned worksheet between appointments. This is the same limitation as paper -- not better.
- **Scheduled reminders.** Interval-based self-monitoring and "plan for Tuesday" BA scheduling are inert without OS/service-worker notifications, which the SPA cannot provide.

## Collaboration opportunities

The creator conversation has several realistic, concrete angles, ordered roughly by how quickly they could produce something shared:

1. **Co-designed digital worksheets for their manuals.** Start with the exact matches: the life compass tool (their Module 4), the Behavioral Experiment Recording Sheet, the BA Activity/Mood Schedule, and the worry diary. Each becomes a faithful digital version that feeds the client's existing life-area data, so the therapist sees valued-living and CBT homework in one file.
2. **The app as the between-session layer for their primary-care CBT.** Their stepped-care model already runs on assigned homework reviewed at appointments. Life Compass is a drop-in between-session capture surface for that loop -- positioned as adjunct to their protocols, never as standalone treatment.
3. **Swedish-first localization and content licensing.** The site is Swedish primary care; the app already ships an `sv` locale and predefined life-area sets. Their CC BY-NC-SA 4.0 license explicitly permits adaptation with attribution and share-alike -- ideal for non-commercial use, with a separate commercial license negotiable if the app monetizes. Their clinically-reviewed Swedish worksheet copy solves the app's biggest soft cost: warm, accurate, non-clinical wording across six languages.
4. **The site as evidence backbone.** Their manuals already encode which technique maps to which condition and which rating scales gate it (PHQ-9, GAD-7, ISI). The app can reference that framework rather than inventing its own clinical scaffolding.
5. **Clinician validation and a small pilot.** Run a pilot in their primary-care setting -- therapists assign the digital worksheets, measure whether between-session adherence and completeness improve over paper. This is the cleanest path to a real-world signal the app cannot get from the existing self-guided RCT literature.
6. **Build the modules they have not built yet.** Their open ACT group, mindfulness, and several counseling/CBT manuals (insomnia, panic, stress, burnout) are under development. The ACT valued-living core and a co-designed mindfulness module are areas where the app could lead rather than follow.

## Safety and ethos notes

**Where clinician oversight mitigates an unguided risk (the case for guided-first):**
- **Severity and suicidality screening.** BA, Thought Record, Problem Solving, and Self-Monitoring all carry the risk that an unscreened, symptomatic user delays appropriate care or is reached in acute suicidal ideation. The therapist's intake screening and ongoing SI monitoring close this gap; the app never has to function as a crisis tool.
- **Reassurance-ritual drift (Behavioral Experiment).** In OCD/health anxiety, a self-designed experiment can become a reassurance ritual. The clinician's review of the experiment design *before* the client acts is the specific safeguard absent in solo use.
- **Contraindication exclusion (CBT-I, Physical Activity, Breathing).** Sleep restriction is contraindicated in bipolar/epilepsy/OSA/parasomnias; exercise in recent cardiac events and active eating disorders; breathing-as-safety-behaviour entrenches panic avoidance. None of these can be self-screened reliably; the clinician handles them at intake.
- **Trauma/fear-of-self-compassion (Self-Compassion).** Compassion exercises can flood trauma survivors; clinician screening (e.g. Fears of Compassion Scales) and in-session containment mitigate what an app cannot.
- **Rumination and bipolar (Self-Monitoring, Worry Postponement).** Repeated introspective logging can worsen rumination, and standalone monitoring misses manic escalation; the therapeutic relationship catches both.

**Where the no-scores / no-pressure design still needs active guarding (even in guided mode):**
- **Numeric scores are intrinsic to some tools.** BA mood-before/after, CBT-I sleep-efficiency %, and Self-Monitoring mood/energy values are load-bearing for the clinical mechanism but contradict the no-numeric-scores ethos. Resolve with a clearly-labelled clinician-mode section rather than leaking numbers into the general UX; never show a comparison delta to an unguided user.
- **Compliance loops.** Physical Activity Scheduling (frequency-vs-target) and any daily-cadence framing (gratitude, monitoring) reintroduce streak pressure. Prefer open-ended or session-paced prompts; strip the target comparison from any general-mode surface.
- **Clinical register.** Thought Records ("cognitive distortion"), Behavioral Experiments ("feared prediction"), and the Psychoeducation Module (vicious-cycle/maintenance-factor language) all carry a harder diagnostic tone than the app's gentle ACT voice. Copy must be softened in all six languages, ideally with the therapists' review.
- **Crisis signposting.** Any tool that surfaces during acute distress (Thought Record, Worry Postponement) should add a crisis-resource link -- the app currently has none.

## Worth a second look (critic omissions, not yet fully researched)

Three candidates were flagged by the completeness critic and are *not* researched in this dataset. (Structured Physical Activity Scheduling is fully researched and ranked at #7, so it is not an omission.)

- **Applied Relaxation (Ost protocol).** NICE CG113 names it a first-line high-intensity treatment for GAD at the same level as CBT, with its own manual -- and the site's GAD manual explicitly lists applied relaxation as a parallel intervention. It is mechanistically distinct from breathing and mindfulness and addresses a high-burden condition. Strongest of the three to evaluate next.
- **MBCT structured relapse-prevention protocol.** NICE-recommended specifically for preventing relapse in recurrent depression (3+ episodes), a high-relapse condition no current tool targets. Distinct from the general Brief Mindfulness tool already ranked. Aligns with the site's under-development mindfulness modules -- another co-design candidate.
- **Progressive Muscle Relaxation.** Broad evidence base and a different (proprioceptive) pathway from breathing, though more of a borderline addition since a relaxation tool (breathing) is already present.
