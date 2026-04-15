import { css } from '@emotion/react';
import { PropsWithChildren } from 'react';

import { colors } from '_tosslib/constants/colors';

export function TopNavigation({ children }: PropsWithChildren<{}>) {
  return (
    <div
      css={css`
        padding: 12px 24px 0;
      `}
    >
      {children}
    </div>
  );
}

interface TopNavigationButtonProps {
  onClick: () => void;
}

TopNavigation.Button = function ({ onClick, children }: PropsWithChildren<TopNavigationButtonProps>) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="뒤로가기"
      css={css`
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        font-size: 14px;
        color: ${colors.grey600};
        &:hover {
          color: ${colors.grey900};
        }
      `}
    >
      {children}
    </button>
  );
};
