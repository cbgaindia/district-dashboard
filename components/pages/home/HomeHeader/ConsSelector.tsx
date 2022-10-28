import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'components/actions/Button';
import { Combobox } from 'components/actions/Combobox';
import { capitalize } from 'utils/helper';

const ConsSelector: React.FC<{
  consData: any;
  trending?: any;
  sabha: string;
  isLoading?: boolean;
}> = ({ consData, trending, sabha, isLoading }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCons, setSelectedCons] = useState(null);
  const [consCount, SetConsCount] = useState(null);

  const states = React.useMemo(() => {
    if (consData) {
      let count = 0;
      const stateArr = Object.keys(consData).map((state) => {
        count += consData[state].length;
        return {
          value: state,
          label: capitalize(state.replaceAll('-', ' ')),
        };
      });
      SetConsCount(count);
      return stateArr;
    }
  }, [consData]);

  const districts = React.useMemo(() => {
    if (selectedState)
      return Object.values(consData[selectedState]).map((item: any) => ({
        value: item.district_code_census,
        label: item.district,
      }));
  }, [selectedState]);

  return (
    <Wrapper>
      

      <ConsMenu>
        <Combobox
          options={states}
          isSearchable={false}
          isClearable
          placeholder="Select a State"
          isLoading={isLoading}
          isDisabled={isLoading}
          onChange={(e: any) => {
            setSelectedState(e?.value);
            setSelectedCons(null);
          }}
          isLight
        />
        <div>
          <Combobox
            key={JSON.stringify(districts)}
            options={districts}
            isClearable
            isDisabled={isLoading}
            placeholder={`Select from the given districts`}
            onChange={(e: any) => setSelectedCons(e?.value)}
            noOptionsMessage={() => 'Please select a state'}
            isDark
          />
          <Button
            kind="primary"
            href={
              selectedCons
                ? `/${selectedState}/${sabha}/${selectedCons}`
                : null
            }
            onClick={
              !selectedCons ? () => alert('Select a district') : null
            }
          >
            Explore
          </Button>
        </div>
      </ConsMenu>
      {trending && (
        <Trending>
          <span>Trending Search:</span>
          <div>
            {trending.map((item, index) => (
              <a key={`trending-${index}`} href={item.link}>
                {item.text}
              </a>
            ))}
          </div>
        </Trending>
      )}
    </Wrapper>
  );
};

export default ConsSelector;

export const Wrapper = styled.div`
  background-color: var(--color-white);
  filter: drop-shadow(var(--box-shadow-1));
  border-radius: 4px;
  padding: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  text-transform: capitalize;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
  }

  span {
    letter-spacing: 0.01em;
    color: var(--text-light-medium);
  }

  @media (max-width: 480px) {
    gap: 8px;
    align-items: flex-start;

    h2 {
      font-size: 1.1rem;
    }

    span {
      font-size: 0.875rem;
    }

    svg {
      min-width: 45px;
    }
  }
`;

export const ConsMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;

  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    > div {
      flex-grow: 1;
      flex-basis: 70%;
    }
  }
`;

const Trending = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 16px;
  flex-wrap: wrap;

  font-weight: 600;
  font-size: 0.75rem;
  line-height: 1.7;

  > div {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  a {
    color: var(--color-amazon-300);
  }
`;
