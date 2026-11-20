import { createContext, useContext } from 'react';

export const ModalContext = createContext({ open: () => {}, close: () => {} });

/** open('demo' | 'enquiry' | 'privacy' | 'terms', props?) */
export const useModal = () => useContext(ModalContext);
