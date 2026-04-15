import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface TextBannerProps {
  type: 'success' | 'error';
  text: string;
}

export function TextBanner({ type, text }: TextBannerProps) {
  return (
    <div
      css={css`
        padding: 10px 14px;
        border-radius: 10px;
        background: ${type === 'success' ? colors.blue50 : colors.red50};
        display: flex;
        align-items: center;
        gap: 8px;
      `}
    >
      <Text
        typography="t7"
        color={type === 'success' ? colors.blue600 : colors.red600}
        css={css`
          font-size: 12px;
        `}
      >
        {text}
      </Text>
    </div>
  );
}
