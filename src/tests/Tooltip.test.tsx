import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Tooltip from '@components/Tooltip';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Tooltip component', () => {
  it('should render the child element and not display tooltip content by default', () => {
    const { queryByText, getByText } = render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(getByText('Hover me')).toBeInTheDocument();
    expect(queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  it('should display the tooltip content on mouse enter and hide on mouse leave', async () => {
    const { getByText, queryByText } = render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    const triggerElement = getByText('Hover me');

    // Trigger mouse enter to show the tooltip.
    fireEvent.mouseEnter(triggerElement);
    // Wait at least 1000 ms before checking for tooltip content.
    await new Promise((res) => setTimeout(res, 1000));

    // Wait for the tooltip content to appear.
    await waitFor(() => {
      expect(getByText('Tooltip content')).toBeInTheDocument();
    });

    // Trigger mouse leave to hide the tooltip.
    fireEvent.mouseLeave(triggerElement);
    // Wait at least 1000 ms before checking that the tooltip is hidden.
    await new Promise((res) => setTimeout(res, 1000));

    // Wait for the tooltip content to disappear.
    await waitFor(() => {
      expect(queryByText('Tooltip content')).not.toBeInTheDocument();
    });
  });

  it('should render the tooltip arrow element', async () => {
    const { container, getByText } = render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    const triggerElement = getByText('Hover me');

    // Hover to display the tooltip including the arrow.
    fireEvent.mouseEnter(triggerElement);
    // Wait at least 1000 ms before checking for tooltip content.
    await new Promise((res) => setTimeout(res, 1000));

    // Wait for the tooltip content to appear.
    await waitFor(() => {
      expect(getByText('Tooltip content')).toBeInTheDocument();
    });

    // Check for the arrow element rendered inside the tooltip.
    const arrowElement = container.querySelector('[class*="fill-"]');
    expect(arrowElement).toBeInTheDocument();
  });
});
