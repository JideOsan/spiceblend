import { useSearchParams } from 'react-router-dom';

export function useModal() {
  const key = 'modal';
  const [searchParams, setSearchParams] = useSearchParams();

  const modal = searchParams.get(key);

  const openModal = (modalName: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, modalName);
    setSearchParams(params);
  };

  const closeModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    setSearchParams(params);
  };

  return {
    modal,
    openModal,
    closeModal,
    isOpen: (modalName: string) => modal === modalName,
  };
}
