import React from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

const PartnerCard = dynamic(
  () => import('components/pages/about/PartnerCard'),
  {
    ssr: false,
  }
);

const Seo = dynamic(() => import('components/common/Seo/Seo'), {
  ssr: false,
});

const About = () => {
  const headerData = {
    title: 'About Open Budgets India',
    content: [
      'The platform, Open Budgets India, has resulted from collective efforts by many organisations and individuals. Increasingly, people across the country are keen to understand and participate meaningfully in discussions on government budgets. But, the limited availability of relevant and accessible information on budgets in India at different levels has been a hindrance in this regard.',
      'In this context, our endeavour is to strengthen the discourse and demand for availability of all budget information in the public domain in a timely and accessible manner, at all levels of government in the country.  The Open Budgets India platform is a comprehensive and user-friendly open data portal that can facilitate free, easy and timely access to relevant data on government budgets in India.',
    ],
  };

  const partners = [
    {
      name: 'Centre for Budget Governance and Accountability',
      title: 'Lead Partner',
      img: '/assets/images/cbga_logo.png',
      desc: [
        "CBGA is an independent non-profit organisation enhancing transparency and accountability in governance through rigorous analysis of policies and budgets, and fostering people's participation in public policy processes by demystifying them.",
        'Envisioned by a group of civil society leaders and academicians, CBGA was started in 2002 as a programme of National Centre for Advocacy Studies (NCAS). It was set up as an independent organisation in 2005 with the mandate to promote transparent, accountable and participatory governance, and a people-centred perspective in preparation and implementation of budgets in India.',
      ],
      email: 'info@cbgaindia.org',
      github: 'https://github.com/cbgaindia',
      linkedin:
        'https://www.linkedin.com/company/centre-for-budget-and-governance-accountability-cbga-/',
      twitter: 'https://twitter.com/CBGAIndia',
    },
    {
      name: 'CivicDataLab',
      title: 'Technology Partner',
      img: '/assets/images/cdl.png',
      desc: [
        'We are a research lab working at the intersection of data, tech, design and social science to strengthen the course of civic engagements in India.',
        'We work to harness the potential of open knowledge movements and better enable citizens to engage in matters of public reform.',
        'We aim to grow data and tech literacy of governments, non-profits, think-tanks, media houses, universities, and more to enable data-driven decision making at scale.',
      ],
      email: 'info@civicdatalab.in',
      github: 'github.com/civicDataLab/',
      linkedin: 'https://www.linkedin.com/company/civicdatalab/',
      twitter: 'twitter.com/civicDatalab/',
      class: 'partners--dark-img',
    },
  ];

  const seo = {
    title: 'About - District Dashboard',
    description: 'Co-created by CBGA and CivicDataLab',
  };

  return (
    <Wrapper className="container">
      <Seo seo={seo} />
      <div>
        <h2>{headerData.title}</h2>
        <Description>
          {headerData.content.map((item, index) => (
            <p key={`header-content-${index}`}>{item}</p>
          ))}
        </Description>
      </div>

      <CardsWrapper>
        <h3>Partners</h3>
        <Cards>
          {partners.map((item, key) => {
            return (
              <li key={`partners-${key}`}>
                <PartnerCard card={item} />
              </li>
            );
          })}
        </Cards>
      </CardsWrapper>
    </Wrapper>
  );
};

export default About;

const Wrapper = styled.main`
  h2 {
    margin-top: 2rem;
    font-size: 2rem;
    font-weight: 500;
    line-height: 2.6rem;
    grid-column: 2/3;
    grid-row: 1/2;
  }
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  p {
    font-size: 1rem;
    line-height: 1.5;
    grid-column: 2/3;
    grid-row: 2/3;

    &:first-of-type {
      padding-top: 1rem;
    }

    &:last-child {
      padding-bottom: 2rem;
    }
  }
`;

const CardsWrapper = styled.div`
  > h3 {
    margin-top: 24px;
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.3;
  }
`;

const Cards = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  justify-content: space-between;
  align-items: stretch;
  gap: 30px;

  li {
    flex-basis: 48%;
    flex-grow: 1;

    > div {
      display: grid;
      height: 100%;
      grid-template-rows: max-content 1fr max-content;
    }
  }
`;
