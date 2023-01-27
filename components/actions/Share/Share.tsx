import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Facebook,
  Reddit,
  Linkedin,
  Twitter,
  ShareIcon,
} from 'components/icons';
import styled from 'styled-components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
  Box,
} from '@opub-cdl/design-system';

const Share: React.FC<{ title: string; size?: 'default' | 'compact' }> = ({
  title,
  size = 'default',
}) => {
  const router = useRouter();

  useEffect(() => {
    if (navigator.share) {
      document.getElementById('share-native')?.removeAttribute('hidden');
    }
  }, []);

  function shareButtonHandler() {
    // check if web share api is supported
    if (navigator.share) {
      navigator.share({
        text: title,
        url: window.location.href,
      });
    }
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            size={size}
            css={{
              display: 'flex',
              alignItems: 'center',
              color: 'var(--color-primary)',
              backgroundColor: 'rgb(238,246,253)',
              boxShadow: 'inset 0 0 0 2px #4190CC ',
              textDecoration: 'none !important',   
            }}
            variant = {'subtle-link'}
          >
            Share
            <Box css={{ marginLeft: '8px', fontSize: 0 }}>
              <ShareIcon
                width={size === 'compact' ? '20' : '24'}
                fill="#1D7548"
              />
            </Box>
          </Button>
        </DropdownMenuTrigger>

        <ShareComp loop hideArrow sideOffset={1}>
          <DropdownMenuItem>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.facebook.com/sharer.php?u=https://constituencyv2.openbudgetsindia.org${router.asPath}`.replaceAll(
                '&',
                '%26'
              )}
            >
              <Facebook />
              <span>Facebook</span>
              <span className="sr-only"> :opens in new window</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://twitter.com/intent/tweet?url=https://constituencyv2.openbudgetsindia.org${router.asPath}`.replaceAll(
                '&',
                '%26'
              )}
            >
              <Twitter />
              <span>Twitter</span>
              <span className="sr-only"> :opens in new window</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.linkedin.com/sharing/share-offsite/?mini=true&url=https://constituencyv2.openbudgetsindia.org${router.asPath.replaceAll(
                '=',
                '%3D'
              )}`}
            >
              <Linkedin />
              <span>LinkedIn</span>
              <span className="sr-only"> :opens in new window</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.reddit.com/submit?url=https://constituencyv2.openbudgetsindia.org${router.asPath}`.replaceAll(
                '&',
                '%26'
              )}
            >
              <Reddit />
              <span>Reddit</span>
              <span className="sr-only"> :opens in new window</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem id="share-native" hidden>
            <button onClick={() => shareButtonHandler()}>
              <Box css={{ fontSize: 0 }}>
                <ShareIcon width={20} fill="#4965B2" />
              </Box>
              <span>Share via...</span>
            </button>
          </DropdownMenuItem>
        </ShareComp>
      </DropdownMenu>
    </>
  );
};

export { Share };

const ShareComp = styled(DropdownMenuContent)`
  background-color: #fff;
  border: 1px solid #cdd1d1;
  box-shadow: 1px solid #eff2f2;

  a,
  button {
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.75;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    text-decoration-color: transparent;
    gap: 12px;

    svg {
      pointer-events: none;
    }

    &:hover {
      text-decoration-color: currentColor;
      background-color: #eee;
    }
  }

  a svg {
    width: 20px;
  }
`;
