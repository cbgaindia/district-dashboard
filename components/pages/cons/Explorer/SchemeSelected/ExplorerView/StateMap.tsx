import React, { useEffect, useState } from 'react';
import { MapViz } from 'components/viz';
import styled from 'styled-components';
import {
  capitalize,
  getParameterCaseInsensitive,
  swrFetch,
} from 'utils/helper';
import { Menu } from 'components/actions';
import useEffectOnChange from 'utils/hooks';
import { Table } from 'components/data';
import { ConstituencyPage } from 'pages/[state]/[cons]';
import { yearOptions } from 'utils/fetch';
import { IconGeneralAdd } from 'components/icons/IconlAdd';
import { IconMinimize } from 'components/icons';

const StateMap = ({ meta, schemeData, showTable, consList, schemeName }) => {
  const [mapValues, setMapvalues] = useState([]);
  const [mapIndicator, setMapIndicator] = useState(undefined);
  const { state, indicator } = meta;
  const [tableData, setTableData] = useState<any>();

  const { metaReducer } = React.useContext(ConstituencyPage);
  const { consData } = metaReducer.obj;

  const [year, setYear] = useState(meta.year);
  const [filteredData, setFilteredData] = useState(
    getParameterCaseInsensitive(schemeData, meta.state)[year]
  );

  const [val, setVal] = React.useState(1);

  const { data, isLoading } = swrFetch(`/assets/maps/${meta.state}.json`);

  // preparing indicator data for echarts component
  useEffect(() => {
    if (filteredData) {
      const stateData = Object.values(filteredData).map(Number);
      stateData.sort(function (a, b) {
        return a - b;
      });
      const uniq = [...new Set(stateData)];
      const binLength = Math.floor(uniq.length / 5);
      const vizIndicators = binLength
        ? [
            {
              max: -999999999,
              label: `Data not avaialble`,
              color: '#EBF0EE',
            },
            {
              min: uniq[0],
              max: uniq[binLength],
              label: `${uniq[0]} to ${uniq[binLength + 1]}`,
              color: '#41A8A8',
            },
            {
              min: uniq[binLength + 1],
              max: uniq[binLength * 2],
              label: `${uniq[binLength + 1]} to ${uniq[binLength * 2]}`,
              color: ' #368B8B',
            },
            {
              min: uniq[2 * binLength + 1],
              max: uniq[binLength * 3],
              label: `${uniq[binLength * 2]} to ${uniq[binLength * 3]}`,
              color: '#286767',
            },
            {
              min: uniq[3 * binLength + 1],
              max: uniq[binLength * 4],
              label: `${uniq[binLength * 3]} to ${uniq[binLength * 4]}`,
              color: '#1F5151',
            },
            {
              min: uniq[4 * binLength + 1],
              max: uniq[uniq.length - 1],
              label: `${uniq[binLength * 4]} to ${uniq[uniq.length - 1]}`,
              color: ' #173B3B',
            },
          ]
        : [
            {
              value: Infinity,
              label: `data not found`,
              color: '#494D44',
            },
          ];
      setMapIndicator(vizIndicators);
    }
  }, [filteredData, data]);

  // changing map chart values on sabha change
  useEffectOnChange(() => {
    setFilteredData(getParameterCaseInsensitive(schemeData, meta.state)[year]);
  }, [year, schemeData]);

  // changing map chart values on sabha change
  useEffect(() => {
    if (data && filteredData) {
      const tempData = Object.keys(filteredData).map((item: any) => ({
        name: item,
        value: filteredData[item] || Infinity,
        mapName: consData[item]?.district_name_name,
      }));
      setMapvalues(tempData);
    }
  }, [data, filteredData, meta.sabha]);

  // setting tabular data
  useEffect(() => {
    if (meta.allYears && schemeData) {
      const tableHeader = [{ Header: 'District', accessor: 'constHeader' }];

      // generate headers for all years (state view)
      meta.allYears.forEach((element) =>
        tableHeader.push({
          Header: `${indicator.replaceAll('-', ' ')} ${element.label}`,
          accessor: `${indicator}-${element.label}`,
        })
      );

      const rowData = [];
      if (schemeData[state] && schemeData[state][meta.year]) {
        Object.values(schemeData[state][meta.year]).forEach((item, index) => {
          const tempObj = {
            [tableHeader[0].accessor]:
              consList[capitalize(state)][index]?.constName,
          };
          const constCode = consList[capitalize(state)][index]?.constCode;
          Object.keys(schemeData[state]).forEach((item1, index1) => {
            tempObj[tableHeader[index1 + 1].accessor] =
              schemeData[state][item1][constCode];
          });

          rowData.push(tempObj);
        });
      }

      const tableData = {
        header: tableHeader,
        rows: rowData,
      };

      setTableData(tableData);
    }
  }, [schemeData]);

  // const newMapItem = useCallback((e) => {
  //   if (e) {
  //     // overriding map highlight on district selection
  //     const myChart = echarts.getInstanceByDom(
  //       document.querySelector('#mapView .echarts-for-react')
  //     );
  //     if (myChart) {
  //       myChart.dispatchAction({
  //         type: 'select',
  //         name: e.name,
  //       });
  //     }
  //   }
  // }, []);

  return showTable ? (
    tableData ? (
      <Table
        header={tableData.header ? tableData.header : ['table not available']}
        rows={tableData.rows ? tableData.rows : []}
      />
    ) : (
      <p>Loading Table...</p>
    )
  ) : (
    <>
      <Title>
        {`${schemeName} . ${meta.indicator?.replace(
          '-',
          ' '
        )} ${`${year}`} . ${meta.state}`}
      </Title>

      <Wrapper>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          mapIndicator && (
            <>
              {meta.allYears && (
                <YearSelector>
                  <Menu
                    value={year}
                    showLabel={false}
                    options={yearOptions(meta.allYears)}
                    heading="Financial Year:"
                    handleChange={(e) => setYear(e)}
                  />
                </YearSelector>
              )}
              <ZoomButtons>
                <button
                  aria-label="Increase Zoom"
                  title="Increase Zoom"
                  onClick={() => {
                    setVal(Math.min(val + 0.1, 3));
                  }}
                >
                  <IconGeneralAdd fill="var(--color-grey-300)" />
                </button>
                <button
                  aria-label="Decrease Zoom"
                  title="Increase Zoom"
                  onClick={() => {
                    setVal(Math.max(val - 0.1, 1));
                  }}
                >
                  <IconMinimize fill="var(--color-grey-300)" />
                </button>
              </ZoomButtons>
              <MapViz
                mapFile={data}
                meta={meta}
                data={mapValues}
                vizIndicators={mapIndicator}
                val={val}
                // newMapItem={newMapItem}
              />
            </>
          )
        )}
      </Wrapper>
    </>
  );
};

export default React.memo(StateMap);

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

const YearSelector = styled.div`
  position: absolute;
  top: 20px;
  right: 16px;
  z-index: 10;
`;

const Title = styled.div`
  border-radius: 2px;
  background-color: var(--color-background-light);
  border-bottom: 7px solid white;

  font-weight: 600;
  font-size: 0.75rem;
  line-height: 1.7;
  padding: 8px 16px;
  text-transform: capitalize;

  @media (max-width: 480px) {
    margin-inline: 4px;
    padding: 6px 12px;
  }
`;

export const ZoomButtons = styled.div`
  position: absolute;
  left: 16px;
  top: 16px;
  isolation: isolate;
  z-index: 10;

  display: flex;
  flex-direction: column;
  gap: 1px;
  border-radius: 2px;
  border: 1px solid var(--color-grey-600);
  filter: drop-shadow(var(--box-shadow-1));

  button {
    padding: 4px;
    background-color: var(--color-white);
    color: var(--color-grey-300);
    transition: background-color 150ms ease;
    line-height: 0;

    &:hover {
      background-color: var(--color-grey-600);
    }

    &:first-of-type {
      border-radius: 2px 2px 0 0;
    }
    &:last-of-type {
      border-radius: 0px 0px 2px 2px;
    }
  }
`;
