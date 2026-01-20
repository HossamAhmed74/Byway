// src/state/auth.js
import { atom } from 'jotai';

export const tokenAtom = atom(localStorage.getItem('token') || ''); 
export const isLoggedInAtom = atom((get) => !!get(tokenAtom)); 
export const usernameAtom = atom(localStorage.getItem('username') || null);
export const expirationAtom = atom(null);

