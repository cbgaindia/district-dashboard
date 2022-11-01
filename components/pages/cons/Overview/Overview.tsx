import React from 'react';
import styled from 'styled-components';
import { Summary } from 'components/pages/shared';
import Snapshot from './Snapshot';

const Overview = ({ stateMetadata, queryData, schemeList, data }) => {
  const summaryCards = React.useMemo(() => {
    return Object.keys(stateMetadata).reduce(function (result, key) {
      if (key != 'State' && key != 'Description') {
        result.push({
          text: key,
          value: stateMetadata[key],
        });
      }
      return result;
    }, []);
  }, [stateMetadata]); // TODO it's using state data

  return (
    <Wrapper id="overview-wrapper">
      <Main>
        <div>
          <h2>About {queryData.cons_name}</h2>
        </div>
        {/* <p>{remarks}</p> */}
      </Main>
      <Summary title="Demographic Highlights" cards={summaryCards} />
      {/* <Snapshot
        queryData={queryData}
        schemeList={schemeList}
        consData={data.consData[queryData.cons].fiscal_year}
        stateAvg={data.stateAvg}
      /> */}
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
