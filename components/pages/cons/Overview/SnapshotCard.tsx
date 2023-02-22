import { Button, ProgressBar } from '@opub-cdl/design-system';
import { Notice } from 'components/icons';
import { SplitBar } from 'components/viz/SplitBar';
import Image from 'next/image';
import { ConstituencyPage } from 'pages/[state]/[cons]';
import React from 'react';
import styled from 'styled-components';
import SchemesData from 'utils/schemesData';

const SnapshotCard = ({
  data,
  indicator,
}: {
  data: any;
  indicator: string;
}) => {
  const { toolbar } = React.useContext(ConstituencyPage);

  return (
    <SnapshotSchemeCard>
      <CardTitle>
        <figure>
          {SchemesData[data.scheme_slug] ? (
            <Image
              src={SchemesData[data.scheme_slug].logo}
              width={72}
              height={72}
              layout="fixed"
              alt=""
              className="img-cover"
            />
          ) : null}
        </figure>

        <h5>{data.scheme_name}</h5>
      </CardTitle>
      <Separator role="none" />
      {data.value ? (
        <>
          <SnapshotSchemeBar>
            <div>
              <AverageTitle>District Value</AverageTitle>
              <div>
                <SplitBar val={data.value.district.bar} dataVal={data.value.district.value?.toFixed(2)}  />

                <AverageValue>
                  {data.value.district.value?.toFixed(2)} Cr.
                </AverageValue>
              </div>
            </div>
            <div>
              <AverageTitle>Max</AverageTitle>
              <div>
                <SplitBar val={data.value.max.bar} dataVal={data.value.max.value?.toFixed(2)} />

                <AverageValue>
                  {data.value.max.value?.toFixed(2)} Cr.
                </AverageValue>
              </div>
            </div>
            <div>
              <AverageTitle>Min</AverageTitle>
              <div>
                <SplitBar val={data.value.min.bar} dataVal={data.value.min.value?.toFixed(2)}/>

                <AverageValue>
                  {data.value.min.value?.toFixed(2)} Cr.
                </AverageValue>
              </div>
            </div>
          </SnapshotSchemeBar>
          <Button
            onClick={() => toolbar(data.scheme_slug, indicator)}
            variant={'secondary-outline'}
          >
            Explore More
          </Button>
        </>
      ) : (
        <>
          <NoSchemeData>
            <Notice fill="#ABB0AD" width={48} />
            <p>
              The data is not available for the selected indicator and fiscal
              year!
            </p>
          </NoSchemeData>
          <Button
            onClick={() => toolbar('list')}
            variant={'secondary-outline'}
          >
            Explore Other Data
          </Button>
        </>
      )}
    </SnapshotSchemeCard>
  );
};

export default SnapshotCard;

const SnapshotSchemeCard = styled.li`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;

  padding: 16px;
  background-color: var(--color-background-lighter);
  border-radius: 4px;

  @media (max-width: 520px) {
    > button {
      flex-grow: 1;
    }
  }
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-basis: 288px;

  > figure {
    width: 72px;
    height: 72px;
    display: block;
  }

  h5 {
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.7;
  }
`;

const Separator = styled.span`
  background-color: var(--color-grey-500);
  height: 48px;
  width: 1px;

  @media (max-width: 1086px) and (min-width: 980px) {
    display: none;
  }
  @media (max-width: 741px) {
    display: none;
  }
`;

const SnapshotSchemeBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-basis: 330px;
  flex-grow: 1;

  > div {
    display: flex;
    align-items: center;
    gap: 20px;

    > div {
      display: flex;
      flex-grow: 1;
      align-items: center;
      background-color: var(--color-grey-600);
    }

    [role='progressbar'] {
      --sizes-1: 20px;
      --radii-pill: 0;
      --colors-slate4: var(--color-grey-600);
      flex-grow: 1;
    }

    [data-fill='pink'] {
      --colors-slate8: var(--color-flamingo-100);

      + span {
        color: var(--color-flamingo-400);
      }
    }

    [data-fill='teal'] {
      --colors-slate8: var(--color-teal-100);

      + span {
        color: var(--color-teal-400);
      }
    }
  }
`;

const NoSchemeData = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--text-light-medium);
  line-height: 1.3;
  font-weight: 500;

  flex-basis: 287px;
  flex-grow: 1;

  svg {
    min-width: 48px;
  }
`;

const AverageTitle = styled.span`
  font-size: 0.75rem;
  line-height: 1.7;
  color: var(--text-light-medium);
  font-weight: 600;
  flex-basis: 26%;
`;
const AverageValue = styled.span`
  font-size: 0.625rem;
  height: 100%;
  line-height: 1.7;
  padding-inline: 8px;
  font-weight: 600;
  white-space: nowrap;
  min-width: 77px;
  text-align: end;
`;
