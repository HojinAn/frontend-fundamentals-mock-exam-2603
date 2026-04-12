import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { PropsWithChildren } from 'react';

interface ListViewProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  ListEmptyComponent?: React.ReactNode;
  gap?: number;
}

export const ListView = <T,>({ data, renderItem, ListEmptyComponent, gap = 10 }: ListViewProps<T>) => {
  if (data.length === 0) {
    return <>{ListEmptyComponent}</>;
  }

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: ${gap}px;
      `}
    >
      {data.map((item, index) => renderItem(item, index))}
    </div>
  );
};

ListView.Empty = function ({ children }: PropsWithChildren<{}>) {
  return (
    <div
      css={css`
        padding: 40px 0;
        text-align: center;
        background: ${colors.grey50};
        border-radius: 14px;
      `}
    >
      {children}
    </div>
  );
};

ListView.Item = function ({ children }: PropsWithChildren<{}>) {
  return (
    <div
      css={css`
        padding: 14px 16px;
        border-radius: 14px;
        background: ${colors.grey50};
        border: 1px solid ${colors.grey200};
      `}
    >
      {children}
    </div>
  );
};
