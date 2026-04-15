import { css } from '@emotion/react';
import { PropsWithChildren } from 'react';

import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface SelectableCardProps extends PropsWithChildren<{}> {
  isSelected: boolean;
  onClick: () => void;
  ariaLabel: string;
}

export function SelectableCard({ isSelected, onClick, ariaLabel, children }: SelectableCardProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      aria-pressed={isSelected}
      aria-label={ariaLabel}
      css={css`
        cursor: pointer;
        padding: 14px 16px;
        border-radius: 14px;
        border: 2px solid ${isSelected ? colors.blue500 : colors.grey200};
        background: ${isSelected ? colors.blue50 : colors.white};
        transition: all 0.15s;
        &:hover {
          border-color: ${isSelected ? colors.blue500 : colors.grey300};
        }
      `}
    >
      {children}
    </div>
  );
}

SelectableCard.Badge = function ({ children }: PropsWithChildren<{}>) {
  return (
    <Text typography="t7" fontWeight="bold" color={colors.blue500}>
      {children}
    </Text>
  );
};
