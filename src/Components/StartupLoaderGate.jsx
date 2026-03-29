import { useEffect, useState } from 'react';
import '../Styles/startup-loader.css';

const MIN_LOADER_MS = 700;
const MAX_WAIT_MS = 3000;

const waitForWindowLoad = () =>
  new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
      return;
    }

    window.addEventListener('load', resolve, { once: true });
  });

const waitForFonts = () => {
  if (!document.fonts?.ready) {
    return Promise.resolve();
  }

  return document.fonts.ready.catch(() => undefined);
};

function StartupLoaderGate({ children }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let revealTimer;

    const runStartupChecks = async () => {
      const startTime = performance.now();

      await Promise.race([
        Promise.all([waitForWindowLoad(), waitForFonts()]),
        new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS)),
      ]);

      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, MIN_LOADER_MS - elapsed);

      revealTimer = window.setTimeout(() => {
        if (!isCancelled) {
          setIsReady(true);
        }
      }, remaining);
    };

    runStartupChecks();

    return () => {
      isCancelled = true;
      if (revealTimer) {
        window.clearTimeout(revealTimer);
      }
    };
  }, []);

  if (isReady) {
    return children;
  }

  return (
    <div className="startup-loader" role="status" aria-live="polite" aria-label="Loading portfolio">
      <div className="startup-loader__panel">
        <p className="startup-loader__eyebrow">Preparing Portfolio</p>
        <h1 className="startup-loader__title">Chad Bojelador</h1>
        <div className="startup-loader__spinner" aria-hidden="true" />
      </div>
    </div>
  );
}

export default StartupLoaderGate;
