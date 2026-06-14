import React from 'react';
import { cn } from '@/lib/utils';

export interface ContentPageProps {
  /** Page heading rendered as an h1 in the display serif. */
  title: string;
  /** Optional short supporting line under the title. */
  subtitle?: string;
  /** Page body. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared editorial layout for the static content pages (About, Privacy,
 * Settings). Gives them a constrained readable measure, a Fraunces heading,
 * and consistent vertical rhythm on Phase A tokens.
 *
 * The app already provides the single <main> landmark in App.tsx, so this
 * wraps its content in a plain <article> rather than nesting a second main.
 */
const ContentPage: React.FC<ContentPageProps> = ({
  title,
  subtitle,
  children,
  className,
}) => {
  return (
    <div className="bg-bg text-text px-4 py-10 sm:py-14">
      <article className={cn('mx-auto w-full max-w-2xl', className)}>
        <header className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-text sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-lg text-text-muted">{subtitle}</p>
          )}
        </header>
        {children}
      </article>
    </div>
  );
};

export default ContentPage;
