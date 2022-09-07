import React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import ExplorerView from './ExplorerView';
import { dataTransform } from 'utils/fetch';
import { SchemeSearch } from './SchemeSearch';

const reducer = (state: any, action: any) => {
  return { ...state, ...action };
};

const SchemeSelected = ({ schemeName, queryData }) => {
  const fetcher = (url: string) => dataTransform(schemeName);
  const { data } = useSWR(`${queryData.state}/${schemeName}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const initalState = {
    state: queryData.state || '',
    scheme: schemeName || '',
    schemeData: '',
    sabha: queryData.sabha || 'lok',
    indicator: '',
    year: '',
    allYears: [],
    unit: '',
    constituency: queryData.cons || '',
    consCode: '',
    vizType: 'map',
  };

  const [state, dispatch] = React.useReducer(reducer, initalState);

  return (
    <>
      <SchemeSearch />
      <ExplorerWrapper>
        {!data ? (
          <div>Loading...</div>
        ) : (
          <>
            <ExplorerView schemeRaw={data} meta={state} dispatch={dispatch} />
          </>
        )}
      </ExplorerWrapper>
    </>
  );
};

export default SchemeSelected;

const ExplorerWrapper = styled.div`
  margin-top: 32px;
`;