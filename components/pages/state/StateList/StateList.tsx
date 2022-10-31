import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { groupListByAlphabets, sortArrayOfObj } from 'utils/helper';
import { LokSabha, VidhanSabha } from 'components/icons';
import { Toolbar } from 'components/layouts/Toolbar';
import SearchCons from './SearchCons';
import { useWindowSize } from 'utils/hooks';
import { LoadingDiv } from './ConsMapView';

const ConsMapView = dynamic(() => import('./ConsMapView'), {
  ssr: false,
  loading: () => <LoadingDiv>Loading Map...</LoadingDiv>,
});

const StateList = ({ data }) => {
  const [stateData, setStateData] = React.useState<any>([]);
  const [formattedData, setFormattedData] = React.useState<any>([]);
  const [lokData, setLokData] = React.useState<any>([]);
//  const [vidhanData, setVidhanData] = React.useState<any>([]);
  const [selectedSabha, setSelectedSabha] = React.useState<any>('lok');
  const size = useWindowSize();

  React.useEffect(() => {
    // first sort the object, then group them by first character.
    // const formattedVidhan = groupListByAlphabets(
    //   sortArrayOfObj(data.vidhan, 'constituency'),
    //   'constituency'
    // );
    // setVidhanData(formattedVidhan);

    const formattedLok = groupListByAlphabets(
      sortArrayOfObj(data.lok, 'district'),
      'district'
    );
     setLokData(formattedLok);

    setFormattedData({
      lok: formattedLok,
    //  vidhan: data.vidhan,
    });
  }, [data]);

  const generateConsList = React.useCallback(
    (item) => {
      return (
        <ConsWrapper>
          <MapWrapper>
            {size.width > 810 && (
              <ConsMapView
                consData={data}
                meta={{ sabha: selectedSabha, state: data.state }}
              />
            )}
          </MapWrapper>

          <ConsList>
            <SearchCons
              data={formattedData[item.value]}
              onFilter={(arr) => onFilterChange(arr)}
            />
            <ol>
              {item.list &&
                item.list.map((group: any) => {
                  return (
                    <li key={group.char}>
                      <span>{group.char}</span>
                      <ul>
                        {group.children.map((cons) => (
                          <li key={cons.district_code_census + cons.district}>
                            <Link
                              href={`/${data.state}/${item.value}/${cons.district_code_census}`}
                              passHref
                            >
                              <ConsLink>{cons.district}</ConsLink>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
            </ol>
          </ConsList>
        </ConsWrapper>
      );
    },
    [ lokData, selectedSabha]
  );

  React.useEffect(() => {
    setStateData([
      // {
      //   value: 'vidhan',
      //   name: 'Vidhan Sabha',
      //   altName: 'Parliament Constituency',
      //   icon: <VidhanSabha width="40" />,
      //   content: generateConsList({ value: 'vidhan', list: vidhanData }),
      // },
      {
        value: 'lok',
        name: 'District',
        altName: '',
        icon: <LokSabha width="40" />,
        content: generateConsList({ value: 'lok', list: lokData }),
      },
    ]);
  }, [lokData, selectedSabha]);

  function onFilterChange(arr) {
    if (selectedSabha == 'lok') {
      setLokData(arr);
    } 
    //else setVidhanData(arr);
  }

  return (
    <Wrapper id="stateListWrapper">
      <h2>Explore Districts </h2>
      <Toolbar
        value={selectedSabha}
        data={stateData}
        //onValueChange={(e) => setSelectedSabha(e)}
      />
    </Wrapper>
  );
};

export default StateList;

const Wrapper = styled.div`
  margin-top: 32px;
  background-color: var(--color-background-light);
  min-height: 764px;

  > span {
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 0.75rem;
    line-height: 1.7;
  }

  > h2 {
    font-weight: 600;
    line-height: 1.24;
    font-size: 2rem;
    margin-bottom: 32px;
  }
`;

const ConsLink = styled.a`
  color: var(--color-amazon-300);
  font-weight: var(--font-weight-medium);
  text-decoration-color: transparent;
  text-decoration-thickness: 2px;
  text-transform: capitalize;

  &:hover {
    text-decoration-color: inherit;
    color: var(--color-amazon-400);
  }
`;

const MapWrapper = styled.div`
  flex-basis: 70%;
  flex-grow: 1;
  background-color: var(--color-background-lighter);
  padding: 24px;
  border-radius: 4px;
  border: var(--border-2);
  filter: drop-shadow(var(--box-shadow-1));

  display: flex;
  flex-direction: column;
  gap: 12px;

  height: 680px;

  @media (max-width: 810px) {
    display: none;
  }
`;

const ConsList = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 312px;
  min-width: 312px;
  flex-grow: 1;
  gap: 8px;

  background-color: var(--color-background-lighter);
  padding: 16px;
  filter: var(--box-shadow-1);
  border-radius: 4px;

  height: 680px;
  overflow-y: scroll;

  span {
    font-weight: 700;
    margin-top: 16px;
    text-transform: capitalize;
    display: inline-block;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-wrap: wrap;
  }
`;

const ConsWrapper = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 16px;
`;
