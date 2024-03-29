import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { states } from 'data/home';
import { HomeTitle } from 'styles/GlobalStyles';
import { Banner } from 'components/layouts';

const HomeStates = () => {
  const details = {
    color: '#B6E0FF',
    heading: 'District Factsheets',
    content:
      "Analysis of schemes' performance in select districts.",
  };
  return (
    <Wrapper>
      <div className="container">
        <HomeTitle>Explore via states</HomeTitle>
        <h2>Navigate to your District via State</h2>
        <StateList>
          {states.map((item, index) => (
            <li key={`state-${index}`}>
              <Link href={`/${item.link}`}>
                <a>
                  <Image
                    src={item.img}
                    width={368}
                    height={160}
                    alt=""
                    className="img-cover"
                  />
                  <h3>{item.title}</h3>
                </a>
              </Link>
            </li>
          ))}
        </StateList>

        <Banner details={details} />
      </div>
    </Wrapper>
  );
};

export default HomeStates;

const Wrapper = styled.section`
  margin-top: 64px;
  /* .container {
    padding-top: 80px;
  } */

  h2 {
    margin-top: 8px;
    font-weight: 600;
    line-height: 1.24;
    font-size: 2rem;
  }
`;

const StateList = styled.ul`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-top: 40px;
  padding-bottom: 16px;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(384px, 100%), 1fr));
  gap: 32px;

  /* overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; */

  li {
    /* min-width: 176px; */
    /* scroll-snap-align: start; */
  }

  a {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    text-decoration-color: transparent;
    background-color: var(--color-background-lighter);
    filter: drop-shadow(var(--box-shadow-1));
    border-radius: 4px;
  }

  h3 {
    text-align: center;
    font-weight: 700;
  }
`;
