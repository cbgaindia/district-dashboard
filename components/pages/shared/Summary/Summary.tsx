import React from 'react';
import styled from 'styled-components';

type Props = {
  title?: React.ReactNode;
  cards: {
    value: string;
    text: string;
  }[];

  titleAs?: 'h2' | 'h3' | 'h4' | 'span' | 'p';
};

const Summary = ({ title, cards, titleAs = 'h3' }: Props) => {
  return (
    <Wrapper>
      {title && typeof title === 'string' ? (
        <Title as={titleAs}>{title}</Title>
      ) : (
        title
      )}

      <ul>
        {cards.map((item, index) => (
          <li key={`summary-${index}`}>
            <div></div>
            <strong>{item.value}</strong>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};

export default Summary;

const Wrapper = styled.div`
  margin-top: 24px;
  padding-bottom: 40px;
  border-bottom: var(--separator-6);

  > div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  ul {
    margin-top: 20px;
    gap: 14px;
    flex-wrap: wrap;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    li {
      text-align: center;
      background-color: var(--color-background-lighter);
      padding: 20px 16px;
      border: var(--border-1);
      border-radius: 4px;
      filter: drop-shadow(var(--box-shadow-1));
      flex-basis: 214px;
      flex-grow: 1;
      position: relative;

      > div {
        width: 4px;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: var(--gradient-sapphire);
      }
    }

    strong {
      font-weight: 900;
    }

    span {
      display: block;
      font-size: 0.75rem;
      color: var(--text-light-medium);
      line-height: 1.7;
      margin-top: 4px;
    }
  }
`;

const Title = styled.h3`
  line-height: 1.5;
  font-size: 1.5rem;
  font-weight: 700;
`;
