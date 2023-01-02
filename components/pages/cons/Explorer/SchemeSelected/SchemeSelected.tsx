import React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import ExplorerView from './ExplorerView';
import { newSchemeDataFetch } from 'utils/fetch';
import SubHeading from './SubHeading';
import { swrFetch } from 'utils/helper';
import { ConstituencyPage } from 'pages/[state]/[cons]';

const reducer = (state: any, action: any) => {
  return { ...state, ...action };
};

const SchemeSelected = ({ queryData, schemeList }) => {
  const { metaReducer } = React.useContext(ConstituencyPage);
  const { indicator, year } = metaReducer.obj;
  const dispatchCons = metaReducer.dispatch;

  const { data: schemeRes } = swrFetch(
    `${process.env.NEXT_PUBLIC_CKAN_URL}/package_search?fq=slug:"${queryData.scheme}" AND organization:constituency-v3 AND private:false`
  );
  const schemeObj = schemeRes?.result.results[0];

  const newFetcher = () =>
    newSchemeDataFetch(queryData.scheme, queryData.sabha, schemeObj);
  const { data } = useSWR(
    `${queryData.state}/${queryData.scheme}/new`,
    newFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  React.useEffect(() => {
    dispatch({
      schemeName: schemeObj?.extras[0].value,
    });
  }, [schemeObj]);

  React.useEffect(() => {
    if (data) {
      const schemeData = queryData.sabha == 'vidhan' ? data.ac : data.pc;

      if (schemeData.data) {
        const years = Object.keys(
          Object.values(schemeData.data)[0]['state_Obj'][queryData.state]
        ).map((item) => ({
          value: item,
          label: item,
        }));
        dispatchCons({
          indicator: Object.keys(schemeData.data).includes(indicator)
            ? indicator
            : Object.keys(schemeData.data)[0],
        });
        dispatch({
          schemeData,
          year: year || years[0].value,
          allYears: years,
        });
      }
    }
  }, [data, indicator]);

  const initalState = {
    state: queryData.state || '',
    sabha: queryData.sabha || 'lok',
    cons: queryData.cons || '',
    cons_name: queryData.cons_name || '',
    schemeName: 'Loading...',
    schemeData: '',
    year: year || '',
    allYears: [],
    unit: '',
    vizType: 'map',
  };
  const [reducerState, dispatch] = React.useReducer(reducer, initalState);

  return (
    <>
      <SubHeading
        meta={reducerState}
        schemeList={schemeList}
        queryData={queryData}
      />
      <ExplorerWrapper>
        {!reducerState.schemeData ? (
          <div>Loading...</div>
        ) : (
          <>
            <ExplorerView
              meta={{
                ...reducerState,
                scheme: queryData.scheme,
                indicator,
              }}
              dispatch={dispatch}
            />
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
