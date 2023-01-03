import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import styled from 'styled-components';

import {
  stateDataFetch,
  stateSchemeFetch,
  updatedFetchJSON,
  updateDistrictMetadataFetch,
  updateStateMetadataFetch,
} from 'utils/fetch';

import {
  Explorer as ExplorerIcon,
  Overview as OverViewIcon,
} from 'components/icons';
import { Toolbar } from 'components/layouts/Toolbar';
import { Overview } from 'components/pages/cons';
import { Header } from 'components/pages/cons/Header';
import { useRouter } from 'next/router';
import { capitalize } from 'utils/helper';

const Explorer = dynamic(
  () => import('components/pages/cons/Explorer/Explorer'),
  {
    ssr: false,
  }
);

const Seo = dynamic(() => import('components/common/Seo/Seo'), {
  ssr: false,
});

type Props = {
  stateScheme: any;
  stateMetadata: any;
  schemeData: any;
  data: any;
  remarks: any;
  districtJson: any;
  district: any;
};
export const ConstituencyPage = React.createContext(null);

const reducer = (state: any, action: any) => {
  return { ...state, ...action };
};

const ConsPage: React.FC<Props> = ({
  stateMetadata,
  stateScheme,
  data,
  remarks,
  districtJson,
  district,
}) => {
  const router = useRouter();

  const { state, sabha, scheme, cons, indicator }: any = router.query;

  const initialProps = React.useMemo(
    () => ({
      indicator: indicator || '',
      scheme: scheme || '',
      year: '',
      consData: data['consData'],
    }),
    [indicator, scheme]
  );
  const [view, setView] = useState('overview');
  const [metaReducer, dispatch] = React.useReducer(reducer, initialProps);

  const [open, setOpen] = React.useState(false);
  const cons_name = district;

  async function handleToolbarSwitch(e: string, cardIndicator = null) {
    if (cardIndicator) {
      await router.replace({
        pathname: `/${state}/${cons}`,
        query: {
          scheme: showScheme(e),
          indicator: cardIndicator,
        },
      });
      setView('explorer');
      return;
    }

    function isTabbed(val: string) {
      if (['explorer', 'overview'].includes(val)) return true;
      return false;
    }

    function showScheme(val) {
      if (isTabbed(val)) {
        if (scheme) return scheme;
        return '';
      }
      if (val == 'list') return '';
      return val;
    }

    const tabState = isTabbed(e) ? e : 'explorer';
    setView(tabState);

 await router.replace({
      pathname: `/${state}/${cons}`,
      query: {
        scheme: showScheme(e),
        indicator,
      },
    });

    window.scrollTo(0, 0);
  }

  const tabData = React.useMemo(
    () => [
      {
        value: 'overview',
        name: 'Overview',
        altName: 'Key Highights of District',
        icon: <OverViewIcon size={40} />,
        content: (
          <ConstituencyPage.Provider
            value={{
              toolbar: handleToolbarSwitch,
              meta: { metaReducer, dispatch },
            }}
          >
            <Overview
              stateMetadata={districtJson}
              queryData={{ ...router.query, cons_name }}
              schemeList={stateScheme}
              data={data}
              //remarks={remarks}
            />
          </ConstituencyPage.Provider>
        ),
      },
      {
        value: 'explorer',
        name: 'Explorer',
        altName: 'Scheme Data of District',
        icon: <ExplorerIcon size={40} />,
        content: (
          <ConstituencyPage.Provider
            value={{
              metaReducer: { obj: metaReducer, dispatch },
            }}
          >
            <Explorer
              queryData={{ ...router.query, cons_name }}
              schemeList={stateScheme}
            />
          </ConstituencyPage.Provider>
        ),
      },
    ],
    [stateMetadata, metaReducer]
  );

  const seo = {
    title: `${capitalize(cons_name)} . ${capitalize(
      state
    )} - District Dashboard`,
    description: `Explore scheme-wise fiscal information at the level of Lok Sabha and Vidhan Sabha constituencies in the state of ${state}`,
  };

  return (
    <>
      <Seo seo={seo} />
      {
        <>
          <main className="container">
            <Header queryData={{ state, sabha, cons, cons_name }} />
            <Wrapper id="consPageWrapper">
              <Toolbar
                value={view}
                onValueChange={(e) => handleToolbarSwitch(e)}
                fullScreenId="consPageWrapper"
                data={tabData}
              />
            </Wrapper>
          </main>
        </>
      }
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  res,
  query,
}) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  const queryValue: any = query || {};
  // if (!['vidhan', 'lok'].includes(queryValue.sabha)) return { notFound: true };

  const [stateScheme, stateMetadata, stateData] = await Promise.all([
    stateSchemeFetch(queryValue.state.replace(/-/g, ' ')),
    updateStateMetadataFetch(queryValue.state.replace(/-/g, ' ')),
    stateDataFetch(queryValue.state),
  ]);

  const updatedJsonData: any = await updatedFetchJSON('all districts');
  const state_format =
    queryValue.state == 'uttar-pradesh'
      ? 'Uttar Pradesh'
      : queryValue.state[0].toUpperCase() + queryValue.state.substring(1);

  const district = updatedJsonData[state_format].find(
    (item) => item.district_code_lg == queryValue.cons
  ).district;

  const districtJson: any = await updateDistrictMetadataFetch(
    state_format,
    district
  );

  if (!(stateMetadata && stateScheme && queryValue.cons))
    return { notFound: true };

  return {
    props: {
      stateMetadata: stateMetadata,
      stateScheme,
      district: district,
      districtJson: districtJson,
      data: {
        consData: stateData['district_name_data'],
        stateAvg: stateData['state_avg'],
      },
      // remarks,
    },
  };
};

export default ConsPage;

const Wrapper = styled.div`
  margin-top: 32px;
  background-color: var(--color-background-light);
`;
const EditorialWrapper = styled.div`
  margin-top: 20px;
`;

const EditorialHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  > span {
    font-weight: 700;
  }

  > button {
    color: #888f8b;
  }
`;
