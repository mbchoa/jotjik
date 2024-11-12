import ActivityGraph from '@/components/ActivityGraph';
import Loader from '@/components/Loader';
import { MetricsSection } from '@/components/MetricsSection';
import NewSessionDialog from '@/components/NewSessionDialog';
import RecordList from '@/components/RecordList';
import { TimerContext } from '@/contexts/TimerContext';
import { trpc } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import type { Session } from 'types';

const useFooterAwareFAB = () => {
  const [bottomOffset, setBottomOffset] = useState(24); // Default bottom-24

  useEffect(() => {
    const updatePosition = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const footerTop = footerRect.top;
        
        if (footerTop < viewportHeight) {
          // Footer is visible, adjust FAB position
          const newOffset = viewportHeight - footerTop + 24; // 24px padding
          setBottomOffset(newOffset);
        } else {
          // Footer not visible, reset to default
          setBottomOffset(24);
        }
      }
    };

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    updatePosition(); // Initial position

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  return bottomOffset;
};

const useIntersectionObserver = (elementId: string, enabled = true) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const checkElement = () => {
      const element = document.getElementById(elementId);
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry) {
              setIsVisible(entry.isIntersecting);
            }
          },
          { threshold: 0.1 }
        );

        observer.observe(element);
        return () => observer.disconnect();
      }
    };

    // Initial check
    const initialCheck = checkElement();
    
    // Re-check after a short delay to ensure element is mounted
    const timeoutId = setTimeout(checkElement, 100);

    return () => {
      if (initialCheck) initialCheck();
      clearTimeout(timeoutId);
    };
  }, [elementId, enabled]);

  return isVisible;
};

const Sessions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSubmit = (startedAt: string, duration: number) => {
    // TODO: Call mutation to save session
    setIsOpen(false);
  };
  const router = useRouter();
  const { status } = useSession();
  const { data, isLoading, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.timedSessions.getInfiniteTimedSessions.useInfiniteQuery(
      {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      {
        enabled: status === 'authenticated',
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  const { mutateAsync: saveSession, isLoading: isSaving } =
    trpc.timedSessions.saveTimedSession.useMutation({
      onSuccess: async () => {
        localStorage.removeItem('queuedSession');
        await refetch();
      },
    });
  const { resumeFromLocalStorage } = useContext(TimerContext);
  const isVisible = useIntersectionObserver('record-0', !isLoading);
  const bottomOffset = useFooterAwareFAB();
  useEffect(() => {
    if (status === 'authenticated' && localStorage.getItem('preAuthTimerProgress')) {
      resumeFromLocalStorage();
    }
  }, [resumeFromLocalStorage, status]);

  useEffect(() => {
    async function saveQueuedSession(session: Session) {
      await saveSession(session);
    }
    const queuedSessionString = localStorage.getItem('queuedSession');
    if (status === 'authenticated' && queuedSessionString !== null) {
      const queuedSession = JSON.parse(queuedSessionString) as Session;
      void saveQueuedSession(queuedSession);
    }
  }, [saveSession, status]);

  if (status === 'unauthenticated') {
    void router.push('/api/auth/signin?callbackUrl=%2Fsessions');
    return;
  }

  return (
    <section className="h-full">
      {status !== 'authenticated' || isLoading || isSaving || !data || !data.pages[0] ? (
        <div className="flex h-full items-center justify-center">
          <Loader className="h-10 w-10 text-pink-900" />
        </div>
      ) : (
        <div className="space-y-4">
          <MetricsSection />
          <ActivityGraph />
          <RecordList sessions={data.pages.flatMap((page) => page.timedSessions)} />
          <div
            style={{ bottom: `${bottomOffset}px` }}
            className={`fixed right-6 z-50 transition-opacity duration-300 ${
              isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <button
              onClick={() => setIsOpen(true)}
              className="rounded-full bg-pink-900 p-4 text-white shadow-lg hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <NewSessionDialog
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              onSubmit={handleSubmit}
            />
        </div>
      )}
      {hasNextPage && (
        <div className="mt-4 flex justify-center">
          <button
            className="px-4 py-2 rounded-md bg-pink-900 text-white"
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? <Loader className="h-5 w-5" /> : 'Load More'}
          </button>
        </div>
      )}
    </section>
  );
};

export default Sessions;
