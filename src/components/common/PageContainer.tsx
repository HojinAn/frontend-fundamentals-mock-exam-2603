import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { PropsWithChildren } from 'react';

export function PageContainer({ children }: PropsWithChildren<{}>) {
  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      {children}
    </div>
  );
}
