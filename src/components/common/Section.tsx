import { css } from '@emotion/react';
import { PropsWithChildren } from 'react';

export function Section({ children }: PropsWithChildren<{}>) {
  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      {children}
    </div>
  );
}

Section.Header = function ({ children }: PropsWithChildren<{}>) {
  return (
    <div
      css={css`
        display: flex;
        align-items: baseline;
        gap: 6px;
      `}
    >
      {children}
    </div>
  );
};

Section.Row = function ({ children }: PropsWithChildren<{}>) {
  return (
    <div
      css={css`
        display: flex;
        gap: 12px;
      `}
    >
      {children}
    </div>
  );
};
