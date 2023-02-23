import React from 'react';
import styled from 'styled-components';
import ConsSelector from './ConsSelector';
import { districtTrending } from 'data/home';

const HomeHeader = ({ constList }) => {
  return (
    <Header>
      <div className="container">
        <h1 className="gradient-amazon">
          Explore District-wise Fiscal Information for Schemes
        </h1>
        <SelectorWrapper>
          <ConsSelector
            consData={constList}
            trending={districtTrending}
            sabha="lok"
          />
        </SelectorWrapper>
      </div>
    </Header>
  );
};

export default HomeHeader;

const Header = styled.header`
  background-color: var(--color-background-light);
  background-image: url('/assets/images/hero-bg.png');
  z-index: -1;
  padding-top: 92px;
  padding-bottom: 144px;
  background-size: cover;

  h1 {
    text-align: center;
    text-shadow: var(--box-shadow-1);
    font-size: 2.5rem;
    line-height: 1.2;
    font-weight: 700;
  }
`;

const SelectorWrapper = styled.div`
  margin-top: 56px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
