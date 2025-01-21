import { createLazyFileRoute, Link } from '@tanstack/react-router';
import MyLayout from '../components/MyLayout.tsx';
import { coin, gift, squirrel } from '../images';

import { formatDateTime, formatNumber } from '../utils/text.ts';
import useReferralStore from '../store/referral.ts';
import { useCallback, useState } from 'react';
import { useToast } from '../contexts/ToastContext.tsx';
import { getTelegramInviteLink } from '../utils/telegram.ts';
import { useTWASession } from '../contexts/TWASessionContext.tsx';

// @ts-ignore
export const Route = createLazyFileRoute('/frens')({
  component: Page,
});

function Page() {
  const { session } = useTWASession();
  const [linkCopied, setLinkCopied] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleCopyInviteLink = useCallback(() => {
    if (!session) {
      showError('No session');
      return;
    }

    const link = getTelegramInviteLink(
      import.meta.env.VITE_BOT_USERNAME,
      import.meta.env.VITE_APP_URL_SHORT_NAME,
      session.user.authUserId ?? '',
    );
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setLinkCopied(true);
        showSuccess('Invite link copied to clipboard!');

        setTimeout(() => {
          setLinkCopied(false);
        }, 5000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        showError('Failed to copy link. Please try again.');
      });
  }, [session, showSuccess, showError]);

  return (
    <MyLayout>
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 font-medium text-white">
        <div className="bg-gradient-secondary absolute inset-0 top-1/2 z-0"></div>
        <div className="z-10 flex h-full w-full flex-1 flex-col items-center gap-y-2 overflow-y-auto p-4">
          <div className="mt-4 text-3xl font-semibold">Invite Friends</div>
          <div className="text-base text-gray-500">
            You and your friend will receive bonus points
          </div>
          <Link to="/" className="text-primary mt-4">
            Back to game
          </Link>
          <BonusItems className="mt-4 w-full" />
          <button
            className="bg-primary mt-8 w-full rounded-lg p-4 active:bg-yellow-400 disabled:bg-[#272a2f]"
            disabled={linkCopied}
            onClick={handleCopyInviteLink}
          >
            {linkCopied ? 'Copied' : 'Copy referral link'}
          </button>
          <Friends className={'mt-8 w-full'} />
        </div>
      </div>
    </MyLayout>
  );
}

function BonusItems({ className }: { className?: string }) {
  const { bonusItems } = useReferralStore();

  return (
    <div className={className}>
      <div className="mt-4 flex flex-col gap-y-2">
        {bonusItems.map((item) => (
          <div
            key={item.id}
            className="flex w-full items-center justify-between rounded-lg bg-[#272a2f] p-4"
          >
            <div className="flex items-center">
              <img src={gift} alt="Exchange" className="h-10 w-10" />
              <div className="ml-2 flex flex-col">
                <span className="text-left font-medium">{item.title}</span>
                <span className="flex items-center justify-start gap-x-1 text-sm font-normal text-gray-400">
                  <img src={coin} width={16} height={16} />
                  <span className="text-primary font-semibold">
                    +{formatNumber(item.points)}
                  </span>{' '}
                  for you and your friend
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Friends({ className }: { className?: string }) {
  const { friends } = useReferralStore();

  return (
    <div className={className}>
      <div className={'text-base font-semibold text-gray-100'}>
        Your Friends
      </div>
      <div className="mt-4 flex flex-col gap-y-2">
        {friends.map((item) => (
          <div
            key={item.username}
            className="flex w-full items-center justify-between rounded-lg bg-[#272a2f] p-4"
          >
            <div className="flex w-full items-center justify-between">
              <img src={squirrel} alt="Exchange" className="h-10 w-10" />
              <div className="ml-2 flex flex-1 flex-col">
                <span className="text-left font-medium">{item.username}</span>
                <span className="flex items-center justify-start gap-x-1 text-sm font-normal text-gray-400">
                  {formatDateTime(new Date(item.joinedAt).getTime())}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
