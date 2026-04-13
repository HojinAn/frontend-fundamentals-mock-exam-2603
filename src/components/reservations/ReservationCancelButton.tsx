import { useMutation } from '@tanstack/react-query';
import { Button } from '_tosslib/components';
import { cancelReservation } from 'pages/remotes';

interface ReservationCancelButtonProps {
  reservationId: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export function ReservationCancelButton({ reservationId, onSuccess, onError }: ReservationCancelButtonProps) {
  const cancelMutation = useMutation({ mutationFn: cancelReservation, onError, onSuccess });

  return (
    <Button
      type="danger"
      style="weak"
      size="small"
      onClick={async e => {
        e.stopPropagation();
        if (window.confirm('정말 취소하시겠습니까?')) {
          await cancelMutation.mutateAsync(reservationId);
        }
      }}
    >
      취소
    </Button>
  );
}
