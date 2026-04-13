import { css } from '@emotion/react';
import { PropsWithChildren } from 'react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface FilterFieldProps extends PropsWithChildren<{}> {
  label: string;
}

export function FilterField({ label, children }: FilterFieldProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
      `}
    >
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        {label}
      </Text>
      {children}
    </div>
  );
}
