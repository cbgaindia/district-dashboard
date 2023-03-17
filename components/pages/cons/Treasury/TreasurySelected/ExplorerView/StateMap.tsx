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

const StateMap = ({ meta, schemeData, showTable, consList, schemeName, onTableDataChange }) => {
  const [mapValues, setMapvalues] = useState([]);
  const [mapIndicator, setMapIndicator] = useState(undefined);
  const { state, indicator } = meta;
  const [tableData, setTableData] = useState<any>();

  // const { metaReducer } = React.useContext(ConstituencyPage);
  // const { consData } = metaReducer.obj;

  const [year, setYear] = useState(meta.year);
  const [filteredData, setFilteredData] = useState(
    getParameterCaseInsensitive(schemeData, meta.state)[year]
  );

  const [val, setVal] = React.useState(1);

  const { data, isLoading } = swrFetch(`/assets/maps/${meta.state}.json`);

  const twoDecimals = (num) => {
    return Number(num.toString().match(/^-?\d+(?:\.\d{0,2})?/));
  };
  
  // preparing indicator data for echarts component
  useEffect(() => {
    if (filteredData) {
      const stateData = Object.values(filteredData).map(Number);
      stateData.sort(function (a, b) {
        return a - b;
      });
      const uniq = [...new Set(stateData)];
      const length = uniq.length;

      if (length > 4) {
        const a = uniq[0];
        const e = uniq[length - 1];

        const diff = e - a;

        let div = diff / 4;
        let b = twoDecimals(a + div);
        let c = twoDecimals(b + div);
        let d = twoDecimals(c + div);

        let binLength = Math.floor(uniq.length / 4);
        const vizIndicators = binLength
          ? [
              {
                min: a,
                max: b,
                label: `upto to ${b}`,
                color: '#41A8A8',
              },
              {
                min: b,
                max: c,
                label: `${b} to ${c}`,
                color: '#368B8B',
              },
              {
                min: c,
                max: d,
                label: `${c} to ${d}`,
                color: '#286767',
              },
              {
                min: d,
                max: e,
                label: `${d} and above`,
                color:'#173B3B',
              },
              {
                value: -9999999999,
                label: `Data Not Available`,
                color: '#494D44',
              },
            ]
          : [
              {
                value: -9999999999,
                label: `Data Not Found`,
                color: '#494D44',
              },
            ];
        setMapIndicator(vizIndicators);
      } else {
        const vizIndicators = [];
        for (let i = 0; i < uniq.length; i++) {
          vizIndicators.push({
            min: uniq[i],
            max: uniq[i],
            label: `${uniq[i]}`,
            color:
              i === 0
                ? '#41A8A8'
                : i === 1
                ? '#368B8B'
                : i === 2
                ? '#286767'
                : '#173B3B',
          });
        }
        vizIndicators.push({
          value: -999999999,
          label: `Data Not Available`,
          color: '#494D44',
        });
        setMapIndicator(vizIndicators);
      }
    }
  }, [filteredData, data]);


  const findConstName = (code: string) => {
    for (const key in consList) {
      if (Object.prototype.hasOwnProperty.call(consList, key)) {
        const matchingObj = consList[key].find((obj) => obj.constCode == code);
        if (matchingObj) {
          return matchingObj.constName;
        }
      }
    }
    return null;
  };
  // changing map chart values on sabha change
  useEffectOnChange(() => {
    setFilteredData(getParameterCaseInsensitive(schemeData, meta.state)[year]);
  }, [year, schemeData]);

  // changing map chart values on sabha change
  useEffect(() => {
    if (data && filteredData) {
      const tempData = Object.keys(filteredData).map((item: any) => ({
        name: item,
        value: filteredData[item] || -9999999999999,
        mapName: findConstName(item),
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
      updateTableData(tableData)
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


  const updateTableData = (newData: any) => {
    setTableData(newData);
    onTableDataChange(newData);
  };
  

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
