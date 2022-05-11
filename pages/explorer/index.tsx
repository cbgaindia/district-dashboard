import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import styled from 'styled-components';

import {
  ExplorerDetailsViz,
  ExplorerHeader,
  ExplorerViz,
} from 'components/pages/explorer';
import SchemeSelector from 'components/pages/shared/SchemeSelector';
import {
  HeaderControls,
  SchemesMenu,
} from 'components/pages/shared/SchemeSelector/SchemeSelector';
import { dataTransform } from 'utils/fetch';

type Props = {
  data: any;
  meta: any;
  scheme: any;
};

const headerData = {
  content:
    'It is the most populated state in India, as well as the most populous country subdivision in the world. The state is bordered by Rajasthan to the west, Haryana, Himachal Pradesh and Delhi to the northwest, Uttarakhand and an international border with Nepal to the north, Bihar to the east, Madhya Pradesh to the south, and touches the states of Jharkhand and Chhattisgarh to the southeast.',
};

function verifyState(state) {
  if (
    [
      'Uttar Pradesh',
      'Chhattisgarh',
      'Bihar',
      'Odisha',
      'Maharashtra',
      'Jharkhand',
    ].some((e) => e.toLowerCase() === state.toLowerCase())
  )
    return true;
  else return false;
}

const Explorer: React.FC<Props> = ({ data, scheme }) => {  
  const [showReport, setShowReport] = useState(false);
  const [meta, setMeta] = useState({});

  function handleReportBtn(bool, metaObj = {}) {
    setShowReport(bool);
    setMeta(metaObj);
  }
  return (
    <>
      <Head>
        <title>Explorer | Constituency Dashboard</title>
      </Head>
      <Wrapper>
        <div className="container">
          <SchemeSelector
            suggestion={false}
            sabha={false}
            state={data.state}
            scheme={data.scheme}
          />

          {Object.keys(data).length !== 0 && verifyState(data.state) ? (
            <>
              <ExplorerHeader />
              {!showReport && (
                <ExplorerViz
                  data={data}
                  meta={meta}
                  handleReportBtn={handleReportBtn}
                  scheme={scheme}
                />
              )}

              {showReport && (
                <ExplorerDetailsViz
                  data={data}
                  meta={meta}
                  handleReportBtn={handleReportBtn}
                  scheme={scheme}
                />
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </Wrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { state, scheme, sabha } = context.query;
  const schemeData = await dataTransform(context.query.scheme || '');

  let data: any = {};

  data.state = state || '';
  data.scheme = scheme || '';
  data.sabha = sabha || '';

  return {
    props: {
      data,
      scheme: schemeData,
    },
  };
};

export default Explorer;

const Wrapper = styled.main`
  .indicator-mobile {
    margin-top: 2rem;

    @media (min-width: 980px) {
      display: none;
    }
  }

  .heading {
    margin-bottom: 0.5rem;
    font-weight: 900;
    font-size: 2.5rem;
  }

  ${HeaderControls} {
    margin-top: 40px;
    padding: 16px;
  }

  ${SchemesMenu} {
    margin-top: 0;
  }
`;
