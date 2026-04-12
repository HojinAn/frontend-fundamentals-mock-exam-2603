import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { PropsWithChildren } from 'react';
import { timeToMinutes } from 'utils/time.utils';

function TimetableRoot({ children }: PropsWithChildren<{}>) {
  return (
    <div
      css={css`
        background: ${colors.grey50};
        border-radius: 14px;
        padding: 16px;
      `}
    >
      {children}
    </div>
  );
}

interface TimetableHeaderProps {
  labels: string[];
  totalMinutes: number;
}

function TimetableHeader({ labels, totalMinutes }: TimetableHeaderProps) {
  return (
    <div
      css={css`
        display: flex;
        align-items: flex-end;
        margin-bottom: 8px;
      `}
    >
      <div
        css={css`
          width: 80px;
          flex-shrink: 0;
          padding-right: 8px;
        `}
      />
      <div
        css={css`
          flex: 1;
          position: relative;
          height: 18px;
        `}
      >
        {labels.map(t => {
          const left = (timeToMinutes(t) / totalMinutes) * 100;
          return (
            <Text
              key={t}
              typography="t7"
              color={colors.grey400}
              css={css`
                position: absolute;
                left: ${left}%;
                transform: translateX(-50%);
                font-size: 10px;
                letter-spacing: -0.3px;
              `}
            >
              {t.slice(0, 2)}
            </Text>
          );
        })}
      </div>
    </div>
  );
}

interface TimetableRowProps {
  label: string;
  index: number;
}

function TimetableRow({ label, children, index }: PropsWithChildren<TimetableRowProps>) {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        height: 32px;
        ${index > 0 ? 'margin-top: 4px;' : ''}
      `}
    >
      <div
        css={css`
          width: 80px;
          flex-shrink: 0;
          padding-right: 8px;
        `}
      >
        <Text
          typography="t7"
          fontWeight="medium"
          color={colors.grey700}
          ellipsisAfterLines={1}
          css={css`
            font-size: 12px;
          `}
        >
          {label}
        </Text>
      </div>
      {children}
    </div>
  );
}

export const Timetable = Object.assign(TimetableRoot, {
  Header: TimetableHeader,
  Row: TimetableRow,
});
