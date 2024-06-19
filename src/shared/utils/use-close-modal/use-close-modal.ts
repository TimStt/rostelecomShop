import { RefObject, useCallback } from "react";

const useCloseModal = (
  refModal: RefObject<HTMLDialogElement>,
  toggleModalState: (state: boolean) => void
) => {
  const closeModal = useCallback(() => {
    toggleModalState(false);
    setTimeout(() => refModal.current?.close(), 1000);
  }, []);
};
