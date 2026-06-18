import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '@tests/test-i18n';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import ThoughtRecord from '@components/practices/tools/thought-record/ThoughtRecord';

// Inject thought_record + crisis keys into the sv bundle used by test-i18n.
// Keep in sync with public/locales/en/translation.json.
i18n.addResourceBundle(
  'sv',
  'translation',
  {
    practices: {
      crisis: {
        trigger: 'If things feel overwhelming right now',
        intro: "You don't have to sit with this alone.",
        resources: ['Emergency: call 112'],
      },
      tools: {
        thought_record: {
          label: 'Thought record',
          description: 'Notice a sticky thought, then gently widen the view.',
          empty_state:
            'No thought records yet. Start one when a thought is weighing on you.',
          new: 'New thought record',
          step_label: 'Step {{current}} of {{total}}',
          back: 'Back',
          next: 'Next',
          save: 'Save',
          done: 'Done',
          delete: 'Delete',
          edit: 'Edit',
          untitled: 'Untitled situation',
          collapse: 'Hide details',
          expand: 'Show details',
          step1: {
            title: 'What happened?',
            prompt: 'Where were you, who was there, what was going on?',
            placeholder: 'Describe the situation in a sentence or two.',
            area_label: 'Relates to (optional)',
            area_none: 'Not linked to an area',
          },
          step2: {
            title: 'What went through your mind?',
            prompt: 'The thought that stings most. Write it as it came.',
            placeholder: 'e.g. I always let people down.',
          },
          step3: {
            title: 'How does it feel?',
            prompt: 'Name the feeling, and notice how strong it is right now.',
            feeling_placeholder: 'e.g. sad, anxious, ashamed',
            strength_label: 'How strong does it feel?',
          },
          step4: {
            title: 'Widen the view',
            prompt: 'Gently, without arguing with yourself.',
            supports_label: 'What supports this thought?',
            supports_placeholder: 'What makes it feel true?',
            wider_label: 'What else might be true?',
            wider_placeholder: 'What might you say to a friend in this spot?',
            kinder_label: 'A kinder, wider way to hold this',
            kinder_placeholder:
              'If you stepped back, how else could you carry it?',
          },
          step5: {
            title: 'How does it feel now?',
            prompt:
              'Just notice how the same feeling sits now. There is no right answer.',
            strength_label: 'How strong does it feel now?',
          },
          feeling_scale: {
            1: 'faint',
            2: 'mild',
            3: 'noticeable',
            4: 'strong',
            5: 'overwhelming',
          },
        },
      },
    },
  },
  true,
  true,
);

beforeEach(() => {
  useLifeCompassStore.setState({
    lifeAreas: [],
    history: [],
    goals: [],
    behavioralExperiments: [],
    thoughtRecords: [],
  });
});

const renderTool = () =>
  render(
    <MemoryRouter>
      <ThoughtRecord />
    </MemoryRouter>,
  );

describe('ThoughtRecord tool', () => {
  it('shows the empty state when there are no records', () => {
    renderTool();
    expect(screen.getByText(/no thought records yet/i)).toBeTruthy();
  });

  it('creates a new record and opens the flow when clicking "New thought record"', () => {
    renderTool();
    fireEvent.click(
      screen.getByRole('button', { name: /new thought record/i }),
    );
    // Should now show the flow (step 1 heading)
    expect(screen.getByText('What happened?')).toBeTruthy();
    expect(useLifeCompassStore.getState().thoughtRecords).toHaveLength(1);
  });

  it('saves the situation text and shows the card in the list after completing the flow', async () => {
    renderTool();

    // Start a new record
    fireEvent.click(
      screen.getByRole('button', { name: /new thought record/i }),
    );

    // Step 1: type the situation
    const textarea = screen.getByPlaceholderText(
      /describe the situation/i,
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, {
      target: { value: 'I felt ignored in the meeting' },
    });

    // Advance through all 5 steps
    const clickNext = () =>
      fireEvent.click(screen.getByRole('button', { name: /^next$/i }));
    clickNext(); // -> step 2
    clickNext(); // -> step 3
    clickNext(); // -> step 4
    clickNext(); // -> step 5

    // Done button on step 5
    fireEvent.click(screen.getByRole('button', { name: /^done$/i }));

    // Back on list view, the card title should be the situation text
    await waitFor(() => {
      expect(screen.getByText('I felt ignored in the meeting')).toBeTruthy();
    });

    // Verify store has the record with the correct situation
    const records = useLifeCompassStore.getState().thoughtRecords;
    expect(records).toHaveLength(1);
    expect(records[0].situation).toBe('I felt ignored in the meeting');
  });

  it('never shows a numeric percentage for feeling strength', () => {
    // Pre-populate a record with a feeling strength set
    useLifeCompassStore.getState().addThoughtRecord();
    const id = useLifeCompassStore.getState().thoughtRecords[0].id;
    useLifeCompassStore
      .getState()
      .updateThoughtRecord(id, { feelingBefore: 3, feelingAfter: 1 });

    renderTool();

    // The list should NOT contain any percentage
    expect(document.body.textContent).not.toMatch(/\d+\s*%/);
    // No progressbar role
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('shows word labels for feeling strength, never a raw digit', () => {
    useLifeCompassStore.getState().addThoughtRecord();
    const id = useLifeCompassStore.getState().thoughtRecords[0].id;
    useLifeCompassStore
      .getState()
      .updateThoughtRecord(id, { feelingBefore: 1, situation: 'Test' });

    renderTool();

    // Open the flow for this record
    fireEvent.click(
      screen.getByRole('button', { name: /new thought record/i }),
    );

    // Navigate to step 3 to see the feeling scale
    const clickNext = () =>
      fireEvent.click(screen.getByRole('button', { name: /^next$/i }));
    clickNext(); // step 2
    clickNext(); // step 3

    // The word label "faint" should appear as an aria-pressed button
    const faintButton = screen.getByRole('button', { name: 'faint' });
    expect(faintButton).toBeTruthy();

    // The container text should not match a bare digit used as a strength indicator
    expect(document.body.textContent).not.toMatch(/\d+\s*%/);
  });

  it('shows the word bucket in the collapsed item card, not a number', () => {
    useLifeCompassStore.getState().addThoughtRecord();
    const id = useLifeCompassStore.getState().thoughtRecords[0].id;
    useLifeCompassStore.getState().updateThoughtRecord(id, {
      situation: 'Hard day',
      feelingBefore: 2,
    });

    const { container } = renderTool();

    // Expand the item
    fireEvent.click(screen.getByRole('button', { name: /show details/i }));

    // "mild" (bucket 2) should appear; the raw number "2" should not appear as a strength indicator
    expect(screen.getByText(/mild/i)).toBeTruthy();
    expect(container.textContent).not.toMatch(/\d+\s*%/);
  });
});
