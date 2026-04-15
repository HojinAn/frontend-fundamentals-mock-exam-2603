import { css } from '@emotion/react';
import { PropsWithChildren } from 'react';

import { colors } from '_tosslib/constants/colors';
import { TOTAL_MINUTES } from 'constants/time.constant';
import { timeToMinutes } from 'utils/time.utils';

export function Timeline({ children }: PropsWithChildren<{}>) {
  return (
    <div
      css={css`
        flex: 1;
        height: 24px;
        background: ${colors.white};
        border-radius: 6px;
        position: relative;
        overflow: visible;
      `}
    >
      {children}
    </div>
  );
}

interface TimelineRangeProps {
  start: string;
  end: string;
}

Timeline.Range = ({ start, end, children }: PropsWithChildren<TimelineRangeProps>) => {
  const left = (timeToMinutes(start) / TOTAL_MINUTES) * 100;
  const width = ((timeToMinutes(end) - timeToMinutes(start)) / TOTAL_MINUTES) * 100;
  return (
    <div
      css={css`
        position: absolute;
        left: ${left}%;
        width: ${width}%;
        height: 100%;
      `}
    >
      {children}
    </div>
  );
};

interface TimelineRangeTrackProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive: boolean;
}

Timeline.Track = ({ isActive, ...props }: TimelineRangeTrackProps) => {
  return (
    <div
      role="button"
      {...props}
      css={css`
        width: 100%;
        height: 100%;
        background: ${colors.blue400};
        border-radius: 4px;
        opacity: ${isActive ? 1 : 0.75};
        cursor: pointer;
        transition: opacity 0.15s;
        &:hover {
          opacity: 1;
        }
      `}
    />
  );
};
