import React from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { resourcesData } from 'data/resources';
import { Card } from 'components/pages/resources/Card';
import { CardsList } from 'components/pages/resources/CardsList';

const Seo = dynamic(() => import('components/common/Seo/Seo'), {
  ssr: false,
});

const About = () => {
  const seo = {
    title: 'Resources - District Dashboard',
    description: 'Co-created by CBGA and CivicDataLab',
  };

  return (
    <Wrapper className="container">
      <Seo seo={seo} />

      <h2>Resources</h2>
      <CardsList data={resourcesData} />
    </Wrapper>
  );
};

export default About;

const Wrapper = styled.main`
  min-height: 90vh;
  margin-top: 32px;

  h2 {
    font-size: 2rem;
    font-weight: 500;
    line-height: 2.6rem;
  }
`;

const CardsWrapper = styled.ul`
  margin-top: 24px;
  display: flex;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;

  > li {
    padding: 7px;
  }

  a {
    text-decoration-color: transparent;
    transition: text-decoration-color 150ms ease;

    &:hover,
    &:focus-visible {
      text-decoration-color: inherit;
    }
  }
`;
