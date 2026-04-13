import { css } from '@emotion/react';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { Mutation, SuspenseQuery } from '@suspensive/react-query';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Border, Button, ListRow, Select, Spacing, Text, Top } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { ChipGroup } from 'components/common/ChipGroup';
import { DatePicker, formatDate } from 'components/common/DatePicker';
import { FilterField } from 'components/common/FilterField';
import { ListView } from 'components/common/ListView';
import { PageContainer } from 'components/common/PageContainer';
import { Section } from 'components/common/Section';
import { SelectableCard } from 'components/common/SelectableCard';
import { TextBanner } from 'components/common/TextBanner';
import { TopNavigation } from 'components/common/TopNavigation';
import { ALL_EQUIPMENT, EQUIPMENT_LABELS, TIME_SLOTS } from 'constants/reservation.constant';
import { myReservationKeys, reservationKeys, reservationsQueryOptions, roomsQueryOptions } from 'models/queryOptions';
import { createReservation } from 'pages/remotes';
import { alertTextStyle, numberInputStyle } from 'styles/index';

export function RoomBookingPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const date = searchParams.get('date') || formatDate(new Date());
  const startTime = searchParams.get('startTime') || '';
  const endTime = searchParams.get('endTime') || '';
  const attendees = Number(searchParams.get('attendees')) || 1;
  const equipment = searchParams.get('equipment')?.split(',').filter(Boolean) ?? [];
  const preferredFloor = searchParams.get('floor') ? Number(searchParams.get('floor')) : null;

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // URL 쿼리 파라미터 동기화
  const updateFilter = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) next.delete(key);
      else next.set(key, value);
    }
    setSearchParams(next, { replace: true });
    // 필터 변경 시 선택 초기화
    setSelectedRoomId(null);
    setErrorMessage(null);
  };
  // 입력 검증
  const hasTimeInputs = startTime !== '' && endTime !== '';
  const validationError = (() => {
    if (hasTimeInputs) {
      if (endTime <= startTime) {
        return '종료 시간은 시작 시간보다 늦어야 합니다.';
      }
      if (attendees < 1) {
        return '참석 인원은 1명 이상이어야 합니다.';
      }
    }
    return null;
  })();
  const isFilterComplete = hasTimeInputs && !validationError;

  return (
    <PageContainer>
      <TopNavigation>
        <TopNavigation.Button onClick={() => navigate('/')}>← 예약 현황으로</TopNavigation.Button>
      </TopNavigation>
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        예약하기
      </Top.Top03>

      {errorMessage && (
        <Section>
          <Spacing size={12} />
          <TextBanner type="error" text={errorMessage} />
        </Section>
      )}

      <Spacing size={24} />

      <ErrorBoundary
        fallback={({ error, reset }) => (
          <Section>
            <Button onClick={reset}>리셋</Button>
            {error.message}
          </Section>
        )}
      >
        {/* 예약 조건 입력 */}
        <Suspense
          fallback={
            <Section>
              <Text>로딩중...</Text>
            </Section>
          }
        >
          <SuspenseQuery {...roomsQueryOptions()}>
            {({ data: rooms }) => (
              <Section>
                <Text typography="t5" fontWeight="bold" color={colors.grey900}>
                  예약 조건
                </Text>
                <Spacing size={16} />

                {/* 날짜 */}
                <DatePicker date={date} onChange={date => updateFilter({ date })} label="날짜" />
                <Spacing size={14} />

                {/* 시간 */}
                <Section.Row>
                  <FilterField label="시작 시간">
                    <Select
                      value={startTime}
                      onChange={e => updateFilter({ startTime: e.target.value })}
                      aria-label="시작 시간"
                    >
                      <option value="">선택</option>
                      {TIME_SLOTS.slice(0, -1).map(t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                  </FilterField>
                  <FilterField label="종료 시간">
                    <Select
                      value={endTime}
                      onChange={e => updateFilter({ endTime: e.target.value })}
                      aria-label="종료 시간"
                    >
                      <option value="">선택</option>
                      {TIME_SLOTS.slice(1).map(t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                  </FilterField>
                </Section.Row>
                <Spacing size={14} />

                {/* 참석 인원 + 선호 층 */}
                <Section.Row>
                  <FilterField label="참석 인원">
                    <input
                      type="number"
                      min={1}
                      value={attendees}
                      onChange={e => updateFilter({ attendees: String(Math.max(1, Number(e.target.value))) })}
                      aria-label="참석 인원"
                      css={numberInputStyle}
                    />
                  </FilterField>
                  <FilterField label="선호 층">
                    <Select
                      value={preferredFloor ?? ''}
                      onChange={e => updateFilter({ floor: e.target.value || null })}
                      aria-label="선호 층"
                    >
                      <option value="">전체</option>
                      {/* 필터링 */}
                      {[...new Set(rooms.map(r => r.floor))]
                        .sort((a: number, b: number) => a - b)
                        .map((f: number) => (
                          <option key={f} value={f}>
                            {f}층
                          </option>
                        ))}
                    </Select>
                  </FilterField>
                </Section.Row>
                <Spacing size={14} />

                {/* 장비 */}
                <ChipGroup label="필요 장비">
                  {ALL_EQUIPMENT.map(eq => (
                    <ChipGroup.Item
                      key={eq}
                      isSelected={equipment.includes(eq)}
                      ariaLabel={EQUIPMENT_LABELS[eq]}
                      onClick={() => {
                        const next = equipment.includes(eq) ? equipment.filter(e => e !== eq) : [...equipment, eq];
                        updateFilter({ equipment: next.length > 0 ? next.join(',') : null });
                      }}
                    >
                      {EQUIPMENT_LABELS[eq]}
                    </ChipGroup.Item>
                  ))}
                </ChipGroup>
              </Section>
            )}
          </SuspenseQuery>
        </Suspense>

        {validationError && (
          <Section>
            <Spacing size={8} />
            <span css={alertTextStyle} role="alert">
              {validationError}
            </span>
          </Section>
        )}

        <Spacing size={24} />
        <Border size={8} />
        <Spacing size={24} />

        {/* 예약 가능 회의실 목록 */}
        {isFilterComplete && (
          <Section>
            <Suspense
              fallback={
                <Section>
                  <Text>로딩중...</Text>
                </Section>
              }
            >
              <SuspenseQuery {...reservationsQueryOptions(date)}>
                {({ data: reservations }) => (
                  <SuspenseQuery
                    {...roomsQueryOptions()}
                    select={rooms =>
                      rooms
                        .filter(room => {
                          if (room.capacity < attendees) return false;
                          if (!equipment.every(eq => room.equipment.includes(eq))) return false;
                          if (preferredFloor !== null && room.floor !== preferredFloor) return false;
                          const hasConflict = reservations.some(
                            r => r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime
                          );
                          if (hasConflict) return false;
                          return true;
                        })
                        .sort((a, b) => {
                          if (a.floor !== b.floor) return a.floor - b.floor;
                          return a.name.localeCompare(b.name);
                        })
                    }
                  >
                    {({ data: availableRooms }) => (
                      <>
                        <Section.Header>
                          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
                            예약 가능 회의실
                          </Text>
                          <Text typography="t7" fontWeight="medium" color={colors.grey500}>
                            {availableRooms.length}개
                          </Text>
                        </Section.Header>
                        <Spacing size={16} />

                        <ListView
                          data={availableRooms}
                          ListEmptyComponent={
                            <ListView.Empty>
                              <Text typography="t6" color={colors.grey500}>
                                조건에 맞는 회의실이 없습니다.
                              </Text>
                            </ListView.Empty>
                          }
                          renderItem={room => {
                            const isSelected = selectedRoomId === room.id;
                            return (
                              <SelectableCard
                                key={room.id}
                                isSelected={isSelected}
                                onClick={() => setSelectedRoomId(room.id)}
                                ariaLabel={room.name}
                              >
                                <ListRow
                                  contents={
                                    <ListRow.Text2Rows
                                      top={room.name}
                                      topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                                      bottom={`${room.floor}층 · ${room.capacity}명 · ${room.equipment
                                        .map((e: string) => EQUIPMENT_LABELS[e])
                                        .join(', ')}`}
                                      bottomProps={{ typography: 't7', color: colors.grey600 }}
                                    />
                                  }
                                  right={isSelected ? <SelectableCard.Badge>선택됨</SelectableCard.Badge> : undefined}
                                />
                              </SelectableCard>
                            );
                          }}
                        />
                      </>
                    )}
                  </SuspenseQuery>
                )}
              </SuspenseQuery>
            </Suspense>

            <Spacing size={16} />

            <Mutation
              mutationFn={createReservation}
              onSuccess={(result, variables) => {
                queryClient.invalidateQueries({ queryKey: reservationKeys.detail(variables.date) });
                queryClient.invalidateQueries({ queryKey: myReservationKeys.all });

                if ('ok' in result && result.ok) {
                  navigate('/', { state: { message: '예약이 완료되었습니다!' } });
                  return;
                }

                const errResult = result as { message?: string };
                setErrorMessage(errResult.message ?? '예약에 실패했습니다.');
                setSelectedRoomId(null);
              }}
              onError={err => {
                let serverMessage = '예약에 실패했습니다.';
                if (axios.isAxiosError(err)) {
                  const data = err.response?.data as { message?: string } | undefined;
                  serverMessage = data?.message ?? serverMessage;
                }
                setErrorMessage(serverMessage);
                setSelectedRoomId(null);
              }}
            >
              {createMutation => (
                <Button
                  display="full"
                  onClick={async () => {
                    if (!selectedRoomId) {
                      setErrorMessage('회의실을 선택해주세요.');
                      return;
                    }
                    if (!startTime || !endTime) {
                      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
                      return;
                    }

                    await createMutation.mutateAsync({
                      roomId: selectedRoomId,
                      date,
                      start: startTime,
                      end: endTime,
                      attendees,
                      equipment,
                    });
                  }}
                  disabled={createMutation.isLoading}
                >
                  {createMutation.isLoading ? '예약 중...' : '확정'}
                </Button>
              )}
            </Mutation>
          </Section>
        )}
      </ErrorBoundary>

      <Spacing size={24} />
    </PageContainer>
  );
}
