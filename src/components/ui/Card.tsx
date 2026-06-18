import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `flat` drops the shadow for nested/low-emphasis surfaces. */
  elevation?: 'raised' | 'flat';
  /** Internal padding; `none` lets the caller control spacing. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

/**
 * A surface container: surface background, soft border, large radius and a
 * warm shadow. Composable -- pass any HTML div props and children.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { elevation = 'raised', padding = 'md', className, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'border-border bg-surface text-text rounded-lg border',
          elevation === 'raised' && 'shadow-warm-md',
          paddingClasses[padding],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export default Card;
