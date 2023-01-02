import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@opub-cdl/design-system';
import { IconArrowRight } from 'components/icons';
import React from 'react';
import styled from 'styled-components';
import { handleArrOfObjSearch } from 'utils/helper';

const StateTab = ({ data, sabha }) => {
  return data ? (
    <Wrapper>
      <Tabs defaultValue={Object.keys(data)[0]} orientation="vertical">
        <TabsList>
          {Object.keys(data) &&
            Object.keys(data).map((item) => (
              <StyleTrigger value={item} key={item}>
                <span>
                  {item.replaceAll('-', ' ')}
                  <IconArrowRight width={24} />
                </span>
              </StyleTrigger>
            ))}
        </TabsList>

        {Object.keys(data) &&
          Object.keys(data).map((item) => {
            const sortedList = data[item];
            return (
              <ConstituencyList
                key={item}
                list={sortedList}
                state={item}
                sabha={sabha}
              />
            );
          })}
      </Tabs>
    </Wrapper>
  ) : (
    <></>
  );
};

const ConstituencyList = ({ list, state, sabha }) => {
  const [consList, setConsList] = React.useState([...list]);
  function handleSearchChange(val, list) {
    const filteredList = handleArrOfObjSearch(val, list);
    setConsList(filteredList);
  }

  return (
    <StyledContent value={state}>
      <div>
        <SearchInput
          type="text"
          placeholder="Search here"
          onChange={(e) => handleSearchChange(e.target.value, list)}
        />
        {consList.length ? (
          consList.map((cons: any) => (
            <React.Fragment key={cons.district_code_lg}>
              <ConsLink
                href={`/${state}/${sabha}/${cons.district_code_lg}`}
                key={`${cons.district_code_lg}`}
              >
                {cons.district}
              </ConsLink>
            </React.Fragment>
          ))
        ) : (
          <p style={{ marginTop: '16px' }}>No results...</p>
        )}
      </div>
    </StyledContent>
  );
};

export default StateTab;

const Wrapper = styled.div`
  margin-top: 16px;

  [role='tablist'] {
    flex-basis: 175px;
  }
`;

const StyleTrigger = styled(TabsTrigger)`
  width: 100% !important;
  text-transform: capitalize;

  > span {
    width: 100%;
    border-radius: 2px;
    padding: 8px 16px;
    color: var(--text-light-medium);

    display: flex;
    align-items: center;
    justify-content: space-between;

    svg {
      fill: #abb0ad;
    }
  }

  &[data-state='active'] {
    > span {
      background-color: var(--color-background-lighter);
      font-weight: 600;
      color: var(--text-light-high);
      text-decoration: underline;

      svg {
        fill: #888f8b;
      }
    }
  }
`;

const StyledContent = styled(TabsContent)`
  > div {
    height: 656px;
    height: clamp(300px, calc(100vh - 220px), 656px);
    overflow-y: scroll;
    background-color: var(--color-background-lighter);
    width: 100%;
    padding: 16px;
    border-radius: 2px;

    > span {
      margin-top: 16px;
      display: inline-block;
      font-weight: 700;
      text-transform: capitalize;
    }
  }
`;

const ConsLink = styled.a`
  color: var(--color-amazon-100);
  font-weight: 600;
  text-decoration-color: transparent;
  text-decoration-thickness: 2px;
  text-transform: capitalize;
  display: block;
  margin-top: 4px;

  &:hover {
    text-decoration-color: inherit;
    color: var(--color-amazon-300);
  }
`;

const SearchInput = styled.input`
  padding: 8px 8px 8px 36px;
  font-size: 0.875rem;
  color: var(--text-light-medium);
  border: var(--border-1);
  width: 100%;
  background-image: url("data:image/svg+xml,%0A%3Csvg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.9162 9.6667H10.2579L10.0245 9.4417C11.0245 8.27503 11.5412 6.68337 11.2579 4.9917C10.8662 2.67503 8.93288 0.825033 6.59954 0.5417C3.07454 0.108366 0.107878 3.07503 0.541211 6.60003C0.824545 8.93337 2.67454 10.8667 4.99121 11.2584C6.68288 11.5417 8.27454 11.025 9.44121 10.025L9.66621 10.2584V10.9167L13.2079 14.4584C13.5495 14.8 14.1079 14.8 14.4495 14.4584C14.7912 14.1167 14.7912 13.5584 14.4495 13.2167L10.9162 9.6667ZM5.91621 9.6667C3.84121 9.6667 2.16621 7.9917 2.16621 5.9167C2.16621 3.8417 3.84121 2.1667 5.91621 2.1667C7.99121 2.1667 9.66621 3.8417 9.66621 5.9167C9.66621 7.9917 7.99121 9.6667 5.91621 9.6667Z' fill='%23666E6A'/%3E%3C/svg%3E");
  background-position: left 8px top 50%, 0px 0px;
  background-repeat: no-repeat, repeat;
`;
