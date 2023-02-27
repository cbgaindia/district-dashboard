import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@opub-cdl/design-system';
import { Indicator, IndicatorMobile } from 'components/data/Indicator';
import { Globe, IconGeneralTrends, IconToggleOn } from 'components/icons';
import { IconToggleOff } from 'components/icons/IconToggleOff';
import { SourceWrapper } from 'components/pages/cons/Source';
import { LoadingDiv } from 'components/pages/state/StateList/ConsMapView';
import { ConstituencyPage } from 'pages/[state]/[cons]';

const ConstBar = dynamic(() => import('./ConstBar'), {
  ssr: false,
  loading: () => <LoadingDiv>Loading Bar Chart...</LoadingDiv>,
});

const StateMap = dynamic(() => import('./StateMap'), {
  ssr: false,
  loading: () => <LoadingDiv>Loading Map...</LoadingDiv>,
});

const Table = dynamic(() => import('components/data/Table'), {
  ssr: false,
  loading: () => <LoadingDiv>Loading Table...</LoadingDiv>,
});

const Source = dynamic(() => import('components/pages/cons/Source'), {
  ssr: false,
});

const ExplorerView = ({ meta, dispatch }) => {
  const [filtered, setFiltered] = useState({});
  const [currentTab, setCurrentTab] = useState('consView');
  const [showTable, setShowTable] = useState<any>(false);

  const { state, scheme, schemeData, indicator } = meta;
  const { sabha } = meta || 'lok';


  const [tableData, setTableData] = React.useState<any>();

  const handleTableDataChange = (newData: any) => {
    setTableData(newData);
  };

  useEffect(() => {
    handleNewIndicator(indicator);
  }, [indicator, schemeData, scheme]);

  function handleNewIndicator(val: any) {
    if (val) {
      // filter based on selected indicator for state + sabha
      if (schemeData.data) {
        if (schemeData.data[val]) {
          const filtered = schemeData.data[val]['state_Obj'];
          // dispatchCons({
          //   indicator: val,
          // });
          dispatch({
            indicator: val,
            unit: schemeData.data[val].unit,
          });
          setFiltered(filtered);
        } 
        else {
          const newVal = Object.keys(schemeData.data)[0]
          const filtered = schemeData.data[newVal]['state_Obj'];
          dispatch({
            unit: schemeData.data[newVal].unit,
            indicator: newVal
          });
          setFiltered(filtered);
          // dispatchCons({
          //   indicator: newVal
          // })
        }
      } else {
        dispatch({
          indicator: val,
        });
      }
      // window.history.replaceState(
      //   {
      //     scheme: scheme,
      //     indicator: val,
      //   },
      //   '',
      //   `/${state}/${meta.cons}?&indicator=${val}`
      // );
    }
  }

  const vizToggle = [
    {
      name: `District Data Explorer`,
      id: 'consView',
      icon: <IconGeneralTrends width={24} />,
    },
    {
      name: `${state} - State view`,
      id: 'mapView',
      icon: <Globe />,
    },
  ];

  const vizItems = [
    {
      id: 'consView',
      graph: filtered ? (
        <ConstBar meta={meta} schemeData={filtered} showTable={showTable} schemeName={schemeData.metadata?.name} onTableDataChange={handleTableDataChange}/>
      ) : (
        <p>No data</p>
      ),
    },
    {
      id: 'mapView',
      graph: Object.values(filtered).length ? (
        <StateMap
          meta={{ ...meta, scheme }}
          schemeData={filtered}
          showTable={showTable}
          consList={schemeData.metadata.consList}
          schemeName={schemeData.metadata?.name}
          onTableDataChange={handleTableDataChange}
        />
      ) : (
        <p>No data</p>
      ),
    },
  ];

  return (
    <>
      {filtered ? (
        <>
          {indicator && (
            <IndicatorMobile
              indicators={
                schemeData.data ? Object.values(schemeData.data) : []
              }
              newIndicator={(e) => handleNewIndicator(e)}
              selectedIndicator={indicator || ''}
            />
          )}

          <Wrapper>
            <Indicator
              newIndicator={(e) => handleNewIndicator(e)}
              selectedIndicator={indicator}
              data={schemeData.data ? Object.values(schemeData.data) : []}
            />

            <VizWrapper id="mapViewContainer">
              <div>
                <Tabs
                  defaultValue={currentTab}
                  onValueChange={(e) => setCurrentTab(e)}
                >
                  <VizHeader data-html2canvas-ignore>
                    <div>
                      {vizToggle.map((item, index) => (
                        <VizTabs value={item.id} key={`toggleItem-${index}`}>
                          {item.icon}
                          {item.name}
                        </VizTabs>
                      ))}
                    </div>

                    <TableTab
                      aria-selected={showTable}
                      onClick={() => setShowTable(!showTable)}
                    >
                      Table View
                      {showTable ? (
                        <IconToggleOn fill="#888F8B" />
                      ) : (
                        <IconToggleOff fill="#888F8B" />
                      )}
                    </TableTab>
                  </VizHeader>
                  <div id="vizWrapperDownload">
                    {vizItems.map((item, index) => (
                      <VizGraph key={`vizItem-${index}`} value={item.id}>
                        {item.graph}
                      </VizGraph>
                    ))}
                  </div>
                </Tabs>
              </div>
              {
                <Source
                  currentViz={showTable ? '#tableView' : '#vizWrapperDownload'}
                  tableData={tableData ? tableData : {}}
                  meta={{
                    scheme,
                    state,
                    indicator: indicator ? indicator : 'Opening Balance',
                    sabha,
                  }}
                  source={schemeData.metadata?.source}
                />
              }
            </VizWrapper>
          </Wrapper>
        </>
      ) : (
        <NoData>No data</NoData>
      )}
    </>
  );
  1;
};

export default React.memo(ExplorerView);

export const Wrapper = styled.section`
  display: grid;
  gap: 2rem;
  grid-template-columns: 312px minmax(0, 1fr);
  margin-top: 2.5rem;

  @media (max-width: 980px) {
    display: block;
    margin-top: 1.5rem;
  }

  &.inactive-sidebar {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const VizWrapper = styled.div`
  background-color: #fff;
  border: 1px solid #f7fdf9;
  border-radius: 6px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.14);

  ${SourceWrapper} {
    margin-top: 50px;
    margin-inline: 24px;
    padding: 16px 0 24px;
    border-top: var(--border-2);

    @media (max-width: 480px) {
      margin-inline: 4px;
      padding: 12px;
    }
  }
`;

export const VizHeader = styled(TabsList)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  padding: 16px 24px;
  padding-bottom: 0;
  margin-bottom: 16px;
  gap: 8px;
  border-bottom: var(--border-2);

  > div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    flex-grow: 1;

    @media (max-width: 600px) {
      flex-direction: column;
      width: 100%;
      align-items: flex-start;
    }
  }
`;

export const VizTabs = styled(TabsTrigger)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 14px;
  text-align: center;
  border-bottom: 2px solid transparent;
  font-weight: bold;
  color: hsla(0, 0%, 0%, 0.32);
  text-transform: capitalize;

  max-width: 265px;

  svg {
    margin-right: 5px;
    fill: hsla(0, 0%, 0%, 0.32);
    pointer-events: none;
    min-width: 24px;

    &.svg-stroke {
      stroke: hsla(0, 0%, 0%, 0.32);
    }
  }

  &[aria-selected='true'] {
    color: var(--color-amazon-100);
    border-bottom: 2px solid var(--color-amazon-100);

    svg {
      fill: var(--color-amazon-300);

      &.svg-stroke {
        stroke: var(--color-amazon-300);
      }
    }
  }
`;

export const TableTab = styled.button`
  white-space: nowrap;
  text-overflow: ellipsis;

  max-width: 140px;
  display: flex;
  gap: 8px;
  padding-bottom: 8px;
  align-items: center;
  font-weight: 600;
  justify-content: flex-start;
  color: var(--text-light-medium);

  svg {
    min-width: 24px;
  }

  &[aria-selected='true'] {
    svg {
      fill: var(--color-amazon-300);
    }
  }
`;

export const VizGraph = styled(TabsContent)`
  margin: 0 24px 0;
  height: 640px;
  
  @media (max-width: 480px) {
    margin: 0 4px 32px;
  }
`;

const NoData = styled.div`
  min-height: 300px;
  display: grid;
  place-content: center;
`;

