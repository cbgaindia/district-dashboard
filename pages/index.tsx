import React from 'react';
import dynamic from 'next/dynamic';
import { HomeHeader } from 'components/pages/home';
import { GetStaticProps } from 'next';
import { fetchJSON , updatedFetchJSON } from 'utils/fetch';
import { Banner } from 'components/layouts';

const HomeStates = dynamic(
  () => import('components/pages/home/HomeStates/HomeStates'),
  {
    ssr: false,
  }
);

const Seo = dynamic(() => import('components/common/Seo/Seo'), {
  ssr: false,
});

export default function Home({ constList }) {
  const seo = {
    title: 'Welcome - District Dashboard',
    description:
      'A unique, one-of-its-kind dashboard that opens up district-wise fiscal information for several centrally sponsored and central sector schemes.',
  };

  return (
    <>
      <Seo seo={seo} />
      <main>
        <HomeHeader constList={constList} />
        <HomeStates />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const jsonData = await updatedFetchJSON('all districts');

  return {
    props: {
      constList: jsonData,
    },
  };
};
