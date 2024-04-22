import { atom, useAtom } from 'jotai';
import { Notification } from '../types';

type Config = {
  selected: Notification['id'] | null;
};

const configAtom = atom<Config>({
  selected: null,
});

export function useNotification() {
  return useAtom(configAtom);
}
