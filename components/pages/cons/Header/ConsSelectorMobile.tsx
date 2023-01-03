import { IconButton } from '@opub-cdl/design-system';
import { Cross, IconDropdown } from 'components/icons';
import React from 'react';
import styled from 'styled-components';
import { updatedFetchJSON } from 'utils/fetch';
import { swrFetch } from 'utils/helper';
import StateTab from './StateTab';

import { Button, Modal } from 'components/actions';
import { Header } from 'components/data/MobileAlter/MobileAlterComp';

const ConsSelectorMobile = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { data, isLoading } = swrFetch(`/distList`, updatedFetchJSON, [
    'all districts',
  ]);

  return (
    <Wrapper>
      {isLoading ? (
        <IconButton
          aria-label="Open dialog"
          size="2"
          css={{ fill: '#888f8b' }}
        >
          <IconDropdown width={32} />
        </IconButton>
      ) : (
        <>
          <IconButton
            aria-label="Open dialog"
            onClick={() => setIsOpen(!isOpen)}
            size="2"
            css={{ fill: '#888f8b' }}
          >
            <IconDropdown width={32} />
          </IconButton>
          <Modal
            isOpen={isOpen}
            label="district change modal"
            modalHandler={() => setIsOpen(!isOpen)}
          >
            <Header>
              <h1 id="modal-head">Change District</h1>

              <Button
                icon={<Cross />}
                iconSide="left"
                kind="custom"
                aria-label="close modal"
                onClick={() => setIsOpen(!isOpen)}
              >
                close
              </Button>
            </Header>

            <Content>
              <StateTab data={data} sabha="lok" />
            </Content>
          </Modal>
        </>
      )}
    </Wrapper>
  );
};

export default ConsSelectorMobile;

const Wrapper = styled.div`
  line-height: 0;
`;

const Content = styled.div`
  background-color: var(--color-background-lighter);
  font-size: 14px;
`;

const MobileStateWrapper = styled.div`
  > div {
    margin-top: 0;
  }
  background-color: var(--color-background-light);

  [role='tablist'] {
    flex-basis: 150px;
  }

  button {
    padding: 0;

    span {
      padding: 8px 12px;
    }
  }
`;

const SabhaSelector = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-background-lighter);
  padding: 16px 16px 0;
  border-radius: 2px;
  border-bottom: var(--border-1);
  width: 100%;

  > div {
    display: flex;
    gap: 16px;
  }

  button {
    font-weight: 600;
    padding: 0 10px 16px;
    color: var(--text-light-medium);
    gap: 8px;
    flex: unset;
    cursor: pointer;
    border-bottom: 2px solid transparent;

    > div {
      line-height: 0;
    }

    svg {
      fill: var(--color-grey-300);
    }

    &[data-state='active'] {
      color: var(--color-amazon-300);
      border-color: var(--color-amazon-300);

      svg {
        fill: var(--color-amazon-300);
      }
    }
  }
`;
