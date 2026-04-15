import { css } from '@emotion/react';
import { PropsWithChildren } from 'react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

export function ChipGroup({ label, children }: PropsWithChildren<{ label: string }>) {
  return (
    <div>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        {label}
      </Text>
      <Spacing size={8} />
      <div
        css={css`
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        `}
      >
        {children}
      </div>
    </div>
  );
}

interface ChipGroupItemProps extends PropsWithChildren<{}> {
  isSelected: boolean;
  onClick: () => void;
  ariaLabel: string;
}

ChipGroup.Item = function ({ isSelected, onClick, ariaLabel, children }: ChipGroupItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      css={css`
        padding: 8px 16px;
        border-radius: 20px;
        border: 1px solid ${isSelected ? colors.blue500 : colors.grey200};
        background: ${isSelected ? colors.blue50 : colors.grey50};
        color: ${isSelected ? colors.blue600 : colors.grey700};
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
        &:hover {
          border-color: ${isSelected ? colors.blue500 : colors.grey400};
        }
      `}
    >
      {children}
    </button>
  );
};
