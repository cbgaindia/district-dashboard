import React, { useState, useEffect } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import dynamic from 'next/dynamic';

import { fetchJSON, stateMetadataFetch, updatedFetchJSON, updateStateMetadataFetch } from 'utils/fetch';
import { capitalize, getParameterCaseInsensitive } from 'utils/helper';
import Header from 'components/pages/state/Header';
import StateList from 'components/pages/state/StateList/StateList';

const Seo = dynamic(() => import('components/common/Seo/Seo'), {
  ssr: false,
});

type Props = {
  pathName: string;
  constList: any;
  stateData: any;
};

const State: React.FC<Props> = ({ pathName, constList, stateData }) => {
  const [currentLokCons, setCurrentLokCons] = useState<any>([]);
 // const [currentVidhanCons, setCurrentVidhanCons] = useState<any>([]);
  const state = pathName;

  useEffect(() => {
    // get constituencies of current state
    if (constList) {
    //  const vidhan = getParameterCaseInsensitive(constList?.vidhan, state);
      const lok = getParameterCaseInsensitive(constList?.lok, state);
    //  setCurrentVidhanCons(vidhan);
      setCurrentLokCons(lok);
    }
  }, [constList]);

  const seo = {
    title: `${capitalize(
      state.replaceAll('-', ' ')
    )} - District Dashboard`,
    description: `Explore scheme-wise fiscal information at the level of Lok Sabha and Vidhan Sabha constituencies in the state of ${state}`,
  };

  return (
    <>
      <Seo seo={seo} />
      {constList && (
        <>
          <main className="container">
            <Header data={stateData} />
            <StateList
              data={{
                lok: currentLokCons,
                //vidhan: currentVidhanCons,
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
  const state_val = state as string ;
  const stateNormalised = state_val.replace(/-/g, ' ');
  try {
    const stateData = await updateStateMetadataFetch(stateNormalised);


    const updatedJsonData: any = await updatedFetchJSON('all districts');

    const finalJSON = {
     
      lok:  state == "uttar-pradesh" 
             ?{[state.toLowerCase()]: updatedJsonData["Uttar Pradesh"]} 
             :{[state.toLowerCase()]: updatedJsonData[state[0].toUpperCase() + state.substring(1)]},
   //   vidhan: { [state]: jsonData.vidhan[state] },
    };

    return finalJSON
      ? {
          props: {
            pathName: state,
            constList: finalJSON,
            stateData,
          },
        }
      : { notFound: true };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default State;
