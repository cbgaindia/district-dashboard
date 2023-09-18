import React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import ExplorerView from './ExplorerView';
import { newSchemeDataFetch } from 'utils/fetch';
import SubHeading from './SubHeading';
import { swrFetch } from 'utils/helper';
import { ConstituencyPage } from 'pages/[state]/[cons]';
import { DEFAULT_YEAR } from 'config/year';

const reducer = (state: any, action: any) => {
  return { ...state, ...action };
};

const TreasurySelected = ({ queryData }) => {

  const { data: schemeRes } = swrFetch(
    `${process.env.NEXT_PUBLIC_CKAN_URL}/package_search?fq=slug:treasury AND organization:district-dashboard-all AND private:false`
  );
  const schemeObj = schemeRes?.result.results[0];

  const newFetcher = () => newSchemeDataFetch("treasury", schemeObj);
  const { data } = useSWR(schemeObj, newFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });


  const initalState = {
    state: queryData.state || '',
    sabha: queryData.sabha || 'lok',
    cons: queryData.cons || '',
    cons_name: queryData.cons_name || '',
    schemeName: 'Loading...',
    schemeData: '',
    year: '',
    allYears: [],
    unit: '',
    vizType: 'map',
    indicator: 'total-allocation'
  };
  const [reducerState, dispatch] = React.useReducer(reducer, initalState);

  React.useEffect(() => {
    dispatch({
      schemeName: schemeObj?.extras[0].value,
    });
  }, []);


  React.useEffect(() => {
    if (data) {
      const schemeData = data;

      if (schemeData.data) {
        const years = Object.keys(
          Object.values(schemeData.data)[0]['state_Obj'][queryData.state]
        ).map((item) => ({
          value: item,
          label: item,
        }));

        dispatch({
          indicator: Object.keys(schemeData.data)[0],
          schemeData,
          year: years[0].value,
          allYears: years,
        })
      }
    }
  }, [data]);



  return (
    <>
      <SubHeading
        meta={reducerState}
      />
      <ExplorerWrapper>
        {!reducerState.schemeData ? (
          <div>Loading...</div>
        ) : (
          <>
            <ExplorerView
              meta={{
                ...reducerState,

                indicator:reducerState.indicator,
              }}
              dispatch={dispatch}
            />
          </>
        )}
      </ExplorerWrapper>
    </>
  );
};

export default TreasurySelected;

const ExplorerWrapper = styled.div`
  margin-top: 32px;
`;
