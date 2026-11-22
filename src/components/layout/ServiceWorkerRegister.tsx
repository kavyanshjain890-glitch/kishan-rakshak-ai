'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then((keys) => {
        for (const k of keys) {
          if (k === 'kishan-rakshak-v1') {
            caches.delete(k);
          }
        }
      });
    }

    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('[PWA] Service Worker registration failed:', error);
          });
      });
    } else if ('serviceWorker' in navigator) {
      // In development mode, register as well to enable offline testing
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA-Dev] Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('[PWA-Dev] Service Worker registration failed:', error);
        });
    }
  }, []);

  return null;
}
