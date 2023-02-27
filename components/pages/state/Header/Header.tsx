import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { Share } from 'components/actions/Share';
import { Summary } from 'components/pages/shared';
import { Box, Button } from '@opub-cdl/design-system';
import { ExternalLink } from 'components/icons';

const Header = ({ data }) => {
  const summaryCards = React.useMemo(() => {
    return Object.keys(data).reduce(function (result, key) {
      if (key != 'State' && key != 'Description') {
        result.push({
          text: key,
          value: data[key],
        });
      }
      return result;
    }, []);
  }, [data]);

  return (
    <HeaderWrapper>
      <article>
        {data?.State && (
          <>
            <figure>
              <Image
                src={`/assets/states/${data.State.toLowerCase()}.jpg`}
                width={144}
                height={144}
                alt=""
                className="img-cover"
              />
            </figure>
            <Main>
              <div>
                <h1 className="gradient-amazon">{data.State}</h1>
                <InfoButtons>
                  <Share title={data.State} />
                  <a
                    href={`https://ckan.civicdatalab.in/dataset/${data.State.replace(' ', '-')}-district-dashboard`.toLowerCase()}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Button
                      css={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--color-primary)',
                        backgroundColor: 'rgb(238,246,253)',
                        boxShadow: 'inset 0 0 0 2px #4190CC ',
                        textDecoration: 'none !important',
                      }}
                      variant={'subtle-link'}
                    >
                      Dataset
                      <Box css={{ marginLeft: '8px', fontSize: 0 }}>
                        <ExternalLink fill="#4190CC" />
                      </Box>
                    </Button>
                  </a>
                </InfoButtons>
              </div>
              <p>{data.Description}</p>
            </Main>
          </>
        )}
      </article>
      <Summary title="Demographic Highlights" cards={summaryCards} />
    </HeaderWrapper>
  );
};

export default Header;

export const HeaderWrapper = styled.div`
  margin-top: 40px;

  article {
    display: flex;
    gap: 40px;
    align-items: flex-start;

    figure {
      display: inline-block;
      min-width: 160px;
      top: 10px;
      position: sticky;

      padding: 8px;
      filter: drop-shadow(var(--box-shadow-1));
      border-radius: 4px;
      background-color: var(--color-background-lighter);
      font-size: 0;

      @media (max-width: 673px) {
        display: none;
      }
    }

    > section {
      flex-grow: 1;
    }
  }
`;

const Main = styled.section`
  > div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    line-height: 1.2;
    text-transform: capitalize;
  }

  p {
    margin-top: 16px;
    letter-spacing: 0.01em;
  }
`;

const SummaryTitle = styled.h2`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const Separator = styled.span`
  color: var(--text-light-disabled);

  @media (max-width: 480px) {
    display: none;
  }
`;

const InfoButtons = styled.div`
  display: flex;
  gap: 20px;

  a {
    text-decoration: none !important;
  }
`;