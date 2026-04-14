import { ErrorBoundary, Suspense } from '@suspensive/react';
import { Mutation, SuspenseQueries } from '@suspensive/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Border, Button, ListRow, Spacing, Text, Top } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { DatePicker, formatDate } from 'components/common/DatePicker';
import { ListView } from 'components/common/ListView';
import { PageContainer } from 'components/common/PageContainer';
import { Section } from 'components/common/Section';
import { TextBanner } from 'components/common/TextBanner';
import { Timeline } from 'components/common/Timeline';
import { Timetable } from 'components/common/Timetable';
import { Tooltip } from 'components/common/Tooltip';
import { EQUIPMENT_LABELS, HOUR_LABELS } from 'constants/reservation.constant';
import {
  myReservationKeys,
  myReservationsQueryOptions,
  reservationKeys,
  reservationsQueryOptions,
  roomsQueryOptions,
} from 'models/queryOptions';
import { cancelReservation } from 'pages/remotes';
import { pageTitleStyle } from 'styles/index';

export function ReservationStatusPage() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(formatDate(new Date()));

  const location = useLocation();
  const locationState = location.state as { message?: string } | null;
  useEffect(() => {
    if (locationState?.message) {
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    locationState?.message ? { type: 'success', text: locationState.message } : null
  );

  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  return (
    <PageContainer>
      <Top.Top03 css={pageTitleStyle}>회의실 예약</Top.Top03>

      <Spacing size={24} />

      {/* 날짜 선택 */}
      <Section>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          날짜 선택
        </Text>
        <Spacing size={16} />
        <DatePicker date={date} onChange={setDate} />
      </Section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <ErrorBoundary
        fallback={({ error, reset }) => (
          <Section>
            <Button onClick={reset}>리셋</Button>
            {error.message}
          </Section>
        )}
      >
        <Suspense
          fallback={
            <Section>
              <Text>로딩중...</Text>
            </Section>
          }
        >
          <SuspenseQueries queries={[roomsQueryOptions(), reservationsQueryOptions(date)]}>
            {([{ data: rooms }, { data: reservations }]) => (
              <Section>
                <Text typography="t5" fontWeight="bold" color={colors.grey900}>
                  예약 현황
                </Text>
                <Spacing size={16} />

                <Timetable>
                  <Timetable.Header labels={HOUR_LABELS} />
                  {rooms.map((room, index) => (
                    <Timetable.Row key={room.id} label={room.name} index={index}>
                      <Timeline>
                        {reservations
                          .filter(r => r.roomId === room.id)
                          .map(res => {
                            const isActive = activeReservation === res.id;
                            return (
                              <Timeline.Range key={res.id} start={res.start} end={res.end}>
                                <Timeline.Track
                                  aria-label={`${room.name} ${res.start}-${res.end} 예약 상세`}
                                  onClick={() => setActiveReservation(isActive ? null : res.id)}
                                  isActive={isActive}
                                />
                                {isActive && (
                                  <Tooltip>
                                    <div>
                                      {res.start} ~ {res.end}
                                    </div>
                                    <div>{res.attendees}명</div>
                                    {res.equipment.length > 0 && (
                                      <div>{res.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ')}</div>
                                    )}
                                  </Tooltip>
                                )}
                              </Timeline.Range>
                            );
                          })}
                      </Timeline>
                    </Timetable.Row>
                  ))}
                </Timetable>
              </Section>
            )}
          </SuspenseQueries>
        </Suspense>
      </ErrorBoundary>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 메시지 배너 */}
      {message && (
        <Section>
          <TextBanner type={message.type} text={message.text} />
          <Spacing size={12} />
        </Section>
      )}

      {/* 내 예약 목록 */}
      <ErrorBoundary
        fallback={({ error, reset }) => (
          <Section>
            <Button onClick={reset}>리셋</Button>
            {error.message}
          </Section>
        )}
      >
        <Suspense
          fallback={
            <Section>
              <Text>로딩중...</Text>
            </Section>
          }
        >
          <SuspenseQueries queries={[roomsQueryOptions(), myReservationsQueryOptions()]}>
            {([{ data: rooms }, { data: myReservationList }]) => (
              <Section>
                <Section.Header>
                  <Text typography="t5" fontWeight="bold" color={colors.grey900}>
                    내 예약
                  </Text>
                  {myReservationList.length > 0 && (
                    <Text typography="t7" fontWeight="medium" color={colors.grey500}>
                      {myReservationList.length}건
                    </Text>
                  )}
                </Section.Header>
                <Spacing size={16} />

                <ListView
                  ListEmptyComponent={
                    <ListView.Empty>
                      <Text typography="t6" color={colors.grey500}>
                        예약 내역이 없습니다.
                      </Text>
                    </ListView.Empty>
                  }
                  data={myReservationList}
                  renderItem={res => (
                    <ListView.Item key={res.id}>
                      <ListRow
                        contents={
                          <ListRow.Text2Rows
                            top={rooms.find(r => r.id === res.roomId)?.name ?? res.roomId}
                            topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                            bottom={`${res.date} ${res.start}~${res.end} · ${res.attendees}명 · ${
                              res.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'
                            }`}
                            bottomProps={{ typography: 't7', color: colors.grey600 }}
                          />
                        }
                        right={
                          <Mutation
                            mutationFn={cancelReservation}
                            onSuccess={() => {
                              queryClient.invalidateQueries({ queryKey: reservationKeys.all });
                              queryClient.invalidateQueries({ queryKey: myReservationKeys.all });
                              setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
                            }}
                            onError={() => setMessage({ type: 'error', text: '취소에 실패했습니다.' })}
                          >
                            {cancelMutation => (
                              <Button
                                type="danger"
                                style="weak"
                                size="small"
                                onClick={async e => {
                                  e.stopPropagation();
                                  if (window.confirm('정말 취소하시겠습니까?')) {
                                    await cancelMutation.mutateAsync(res.id);
                                  }
                                }}
                              >
                                취소
                              </Button>
                            )}
                          </Mutation>
                        }
                      />
                    </ListView.Item>
                  )}
                />
              </Section>
            )}
          </SuspenseQueries>
        </Suspense>
      </ErrorBoundary>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <Section>
        <Link to="/booking">
          <Button display="full">예약하기</Button>
        </Link>
      </Section>

      <Spacing size={24} />
    </PageContainer>
  );
}
