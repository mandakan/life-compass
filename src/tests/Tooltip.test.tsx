import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Tooltip from '@components/Tooltip';
import { describe, it, expect, beforeEach } from 'vitest';

// Mock the Portal implementation for testing
vi.mock('@radix-ui/react-tooltip', async () => {
  const actual = await vi.importActual('@radix-ui/react-tooltip');
  return {
    ...actual,
    Portal: ({ children }) => <div data-testid="tooltip-portal">{children}</div>,
  };
});

describe('Tooltip component', () => {
  it('should render the child element and not display tooltip content by default', () => {
    const { queryByText, getByText } = render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>,
    );

    expect(getByText('Hover me')).toBeInTheDocument();
    expect(queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  it('should display the tooltip content on mouse enter and hide on mouse leave', async () => {
    const { getByText, queryByText, getByTestId, queryByTestId } = render(
      <Tooltip content="Tooltip content" delayDuration={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    const triggerElement = getByText('Hover me');

    // Trigger mouse enter to show the tooltip.
    fireEvent.mouseEnter(triggerElement);
    fireEvent.focus(triggerElement);

    // Wait for the tooltip content to appear.
    await waitFor(() => {
      const tooltipContent = getByTestId('tooltip-portal');
      expect(tooltipContent).toBeInTheDocument();
      expect(tooltipContent.textContent).toContain('Tooltip content');
    });

    // Trigger mouse leave to hide the tooltip.
    fireEvent.mouseLeave(triggerElement);
    fireEvent.blur(triggerElement);

    // The portal element may still be in the DOM, but the content should be empty or hidden
    // Instead of checking if the portal is gone, we'll check if the content is no longer visible
    await waitFor(() => {
      const portal = queryByTestId('tooltip-portal');
      // Either the portal is gone or it doesn't contain the tooltip content anymore
      expect(portal?.textContent?.includes('Tooltip content') || false).toBe(false);
    });
  });

  it('should render the tooltip arrow element', async () => {
    const { container, getByText, getByTestId } = render(
      <Tooltip content="Tooltip content" delayDuration={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    const triggerElement = getByText('Hover me');

    // Hover to display the tooltip including the arrow.
    fireEvent.mouseEnter(triggerElement);
    fireEvent.focus(triggerElement);

    // Wait for the tooltip content to appear.
    await waitFor(() => {
      const tooltipContent = getByTestId('tooltip-portal');
      expect(tooltipContent).toBeInTheDocument();
    });

    // Check for the arrow element rendered inside the tooltip.
    const arrowElement = container.querySelector('[class*="fill-"]');
    expect(arrowElement).toBeInTheDocument();
  });

  it('should accept custom side and alignment props', async () => {
    const { getByText, getByTestId } = render(
      <Tooltip
        content="Tooltip content"
        side="bottom"
        align="start"
        delayDuration={0}
      >
        <button>Hover me</button>
      </Tooltip>,
    );

    const triggerElement = getByText('Hover me');
    fireEvent.mouseEnter(triggerElement);
    fireEvent.focus(triggerElement);

    await waitFor(() => {
      const tooltipContent = getByTestId('tooltip-portal');
      expect(tooltipContent).toBeInTheDocument();
      expect(tooltipContent.textContent).toContain('Tooltip content');
    });
  });
});
