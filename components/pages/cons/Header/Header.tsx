import { GradientLokSabha, GradientVidhanSabha } from 'components/icons';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import styled from 'styled-components';
import ConsSelectorMobile from './ConsSelectorMobile';
import { Button } from '@opub-cdl/design-system';

const ConsSelectorModal = dynamic(() => import('./ConsSelectorModal'), {
  ssr: false,
});
const Share = dynamic(
  () => import('components/actions/Share/').then((module) => module.Share),
  {
    ssr: false,
  }
);

const Header = ({ queryData }) => {
  return (
    <Wrapper>
      <Meta>
        {queryData.sabha === 'lok' ? (
          <GradientLokSabha width={80} />
        ) : (
          <GradientVidhanSabha width={80} />
        )}

        <ConsDetails>
          <SabhaName>{`${queryData.sabha === 'lok' ? 'Lok' : 'Vidhan'
            } Sabha contituency`}</SabhaName>
          <div>
            <h1 className="gradient-maple">{queryData.cons_name}</h1>
            <StateName>
              <span>
                <Link href={`/${queryData.state.toLowerCase()}`}>
                  <a>{`(${queryData.state.replaceAll('-', ' ')})`}</a>
                </Link>
              </span>

              <div className="selector-mobile">
                <ConsSelectorMobile />
              </div>
              <div className="selector-desktop">
                <ConsSelectorModal />
              </div>
            </StateName>
          </div>
        </ConsDetails>
      </Meta>
      <HeaderLinks>
        <Button
          css={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-primary)',
          }}
          variant={'outline'}
        >
          Open Factsheet
        </Button>
        <Share title={queryData.cons_name + ' page'} />
      </HeaderLinks>
    </Wrapper>
  );
};

export { Header };

const Wrapper = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const Meta = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  > svg {
    min-width: 80px;
    @media (max-width: 460px) {
      display: none;
    }
  }

  @media (max-width: 600px) {
    align-items: flex-start;
  }
`;

const ConsDetails = styled.div`
  flex-direction: column;
  display: flex;

  > div {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 12px;

    h1,
    span {
      text-transform: capitalize;
      text-shadow: var(--box-shadow-1);
      font-weight: 700;
    }

    h1 {
      font-size: 2.5rem;
      line-height: 1.2;
    }

    span {
      color: #4190cc;
      font-size: 1.2rem;

      /* a {
        text-decoration-color: transparent;

        &:hover {
          text-decoration-color: inherit;
        }
      } */
    }
  }
`;

const StateName = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  .selector-mobile {
    display: none;
    @media (max-width: 480px) {
      display: block;
    }
  }
  .selector-desktop {
    @media (max-width: 480px) {
      display: none;
    }
  }
`;

const SabhaName = styled.span`
  text-transform: uppercase;
  text-shadow: var(--box-shadow-1);
  color: var(--text-light-light);
  letter-spacing: 0.04em;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.7;
`;

const HeaderLinks = styled.div`
  display: flex;
  gap: 15px;
`;