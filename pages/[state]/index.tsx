import { GetStaticPaths, GetStaticProps } from 'next';
import React, { useEffect, useState } from 'react';

import Header from 'components/pages/state/Header';
import StateList from 'components/pages/state/StateList/StateList';
import { updatedFetchJSON, updateStateMetadataFetch } from 'utils/fetch';
import { capitalize, getParameterCaseInsensitive } from 'utils/helper';

type Props = {
  pathName: string;
  constList: any;
  stateData: any;
};

const State: React.FC<Props> = ({ pathName, constList, stateData }) => {
  const [currentLokCons, setCurrentLokCons] = useState<any>([]);
  const state = pathName;

  useEffect(() => {
    if (constList) {
      const lok = getParameterCaseInsensitive(constList?.lok, state);
      setCurrentLokCons(lok);
    }
  }, [constList]);

  return (
    <>
      {constList && (
        <>
          <main className="container">
            <Header data={stateData} />
            <StateList
              data={{
                lok: currentLokCons,
                state,
              }}
            />
          </main>
        </>
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const stateData = await updateStateMetadataFetch();
  return {
    paths: stateData.map((obj) => ({
      params: {
        state: obj.State.replace(/\s+/g, '-').toLowerCase(),
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { state }: any = params;
  const state_val = state as string;
  const stateNormalised = state_val.replace(/-/g, ' ');
  try {
    const stateData = await updateStateMetadataFetch(stateNormalised);

    const updatedJsonData: any = await updatedFetchJSON('all districts');

    const finalJSON = {
      lok:
        state == 'uttar-pradesh'
          ? { [state.toLowerCase()]: updatedJsonData['uttar-pradesh'] }
          : {
              [state.toLowerCase()]:
                updatedJsonData[state[0].toUpperCase() + state.substring(1)],
            },
    };

    return finalJSON
      ? {
          props: {
            pathName: state,
            constList: finalJSON,
            stateData,
            meta: {
              title: `${capitalize(
                state.replaceAll('-', ' ')
              )} - District Dashboard`,
              description: `Explore scheme-wise fiscal information at the level of Lok Sabha and Vidhan Sabha constituencies in the state of ${state}`,
            },
          },
        }
      : { notFound: true };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default State;
