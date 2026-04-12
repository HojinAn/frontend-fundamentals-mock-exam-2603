import { Mutation, QueryClientConsumer } from '@suspensive/react-query';
import { Button } from '_tosslib/components';
import { myReservationKeys, reservationKeys } from 'models/queryOptions';
import { cancelReservation } from 'pages/remotes';

interface ReservationCancelButtonProps {
  reservationId: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export function ReservationCancelButton({ reservationId, onSuccess, onError }: ReservationCancelButtonProps) {
  return (
    <QueryClientConsumer>
      {queryClient => (
        <Mutation
          mutationFn={cancelReservation}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.all });
            queryClient.invalidateQueries({ queryKey: myReservationKeys.all });
          }}
        >
          {cancelMutation => (
            <Button
              type="danger"
              style="weak"
              size="small"
              onClick={async e => {
                e.stopPropagation();
                if (window.confirm('정말 취소하시겠습니까?')) {
                  try {
                    await cancelMutation.mutateAsync(reservationId);
                    onSuccess?.();
                  } catch {
                    onError?.();
                  }
                }
              }}
            >
              취소
            </Button>
          )}
        </Mutation>
      )}
    </QueryClientConsumer>
  );
}
