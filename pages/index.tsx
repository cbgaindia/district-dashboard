import { HomeHeader } from 'components/pages/home';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { updatedFetchJSON } from 'utils/fetch';
import { Seo } from 'components/common';

const HomeStates = dynamic(
  () => import('components/pages/home/HomeStates/HomeStates'),
  {
    ssr: false,
  }
);

// const Seo = dynamic(() => import('components/common/Seo/Seo'));

export default function Home({ constList }) {
  return (
    <>
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
      meta: {
        title: 'Welcome - District Dashboard',
        description:
          'A unique, one-of-its-kind dashboard that opens up district-wise fiscal information for several centrally sponsored and central sector schemes.',
      },
    },
  };
};
