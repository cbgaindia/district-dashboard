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

const StateMap = ({ meta, schemeData, showTable, consList }) => {
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
              min: 0,
              max: 0,
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
        value: filteredData[item] || 0,
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

          Object.keys(schemeData[state]).forEach((item1, index1) => {
            tempObj[tableHeader[index1 + 1].accessor] =
              schemeData[state][item1][index + 1];
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
                  options={meta.allYears}
                  heading="Financial Year:"
                  handleChange={(e) => setYear(e)}
                />
              </YearSelector>
            )}
            <MapViz
              mapFile={data}
              meta={meta}
              data={mapValues}
              vizIndicators={mapIndicator}
              // newMapItem={newMapItem}
            />
          </>
        )
      )}
    </Wrapper>
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
  top: 16px;
  right: 16px;
  z-index: 10;
`;
