import { CardsList } from 'components/pages/resources/CardsList';
import { resourcePages } from 'data/resources';
import { GetStaticPaths, GetStaticProps } from 'next';
import styled from 'styled-components';

const Resource = ({ data }) => {
  return (
    <Wrapper className="container">
      <h2>{data.title}</h2>

      <CardsList data={data.links} />
    </Wrapper>
  );
};

export default Resource;

const Wrapper = styled.main`
  min-height: 90vh;
  margin-top: 2rem;

  h2 {
    font-size: 2rem;
    font-weight: 500;
    line-height: 2.6rem;
  }
`;

export const getStaticPaths: GetStaticPaths = async () => {
  const resourceData = Object.keys(resourcePages);
  return {
    paths: resourceData.map((page) => ({
      params: {
        resource: page.toLowerCase(),
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { resource }: any = params;

  return {
    props: {
      data: resourcePages[resource],
      meta: {
        title: `${resourcePages[resource].title} | Resources - District Dashboard`,
        description: 'Co-created by CBGA and CivicDataLab',
      },
    },
  };
};
