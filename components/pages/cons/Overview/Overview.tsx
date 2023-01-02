import React from 'react';
import styled from 'styled-components';
import { SummaryCarousel } from 'components/pages/shared';
import Snapshot from './Snapshot';

const Overview = ({ stateMetadata, queryData, schemeList, data }) => {
  const twoDecimals = (num) => {
    return Number(num.toString().match(/^-?\d+(?:\.\d{0,1})?/));
  };
  const summaryCards = React.useMemo(() => {
    return Object.keys(stateMetadata)
      .slice(3)
      .reduce(function (result, key) {
        if (key != 'State' && key != 'Description' && key != '1') {
          result.push({
            text: key,
            value: twoDecimals(stateMetadata[key]),
          });
        }
        return result;
      }, []);
  }, [stateMetadata]); // TODO it's using state data
  console.log(data, queryData);

  return (
    <Wrapper id="overview-wrapper">
      <SummaryCarousel title="Demographic Highlights" cards={summaryCards} />
      <Snapshot
        queryData={queryData}
        schemeList={schemeList}
        consData={data.consData[queryData.cons].fiscal_year}
        stateAvg={data.stateAvg}
      />
    </Wrapper>
  );
};

export { Overview };

export const Wrapper = styled.div`
  margin-top: 40px;
`;

const Main = styled.section`
  > div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.24;
    text-transform: capitalize;
  }

  p {
    letter-spacing: 0.01em;
  }
`;
