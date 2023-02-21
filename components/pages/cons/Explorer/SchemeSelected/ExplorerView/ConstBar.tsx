import React from 'react';
import { Combobox } from 'components/actions';
import styled from 'styled-components';
import { GroupBarChart } from 'components/viz';
import { getParameterCaseInsensitive } from 'utils/helper';
import { Table } from 'components/data';

const ConstBar = ({ meta, schemeData, showTable, schemeName }) => {
  const [barData, setBarData] = React.useState([]);
  const [selectedCons, setSelectedCons] = React.useState([
    { state: meta.state, code: meta.cons, name: meta.cons_name },
  ]);
  const [selectedYears, setSelectedYears] = React.useState<any>([
    { value: meta.year, label: meta.year },
  ]);

  selectedYears.sort((a, b) => a.value.localeCompare(b.value));
  
  const [tableData, setTableData] = React.useState<any>();

  React.useEffect(() => {
    setSelectedYears([{ value: meta.year, label: meta.year }]);
  }, [meta.year]);

  React.useLayoutEffect(() => {
    if (meta.cons && meta.state && meta.indicator) {
      generateBarChart(selectedYears, selectedCons);
    }
  }, [meta.indicator, meta.cons, selectedCons, selectedYears, schemeData]);

  function generateBarChart(years, constituencies) {
    const barChartHeader = ['Year'];

    const tableHeader = [{ Header: 'District', accessor: 'constHeader' }];

    //  years object to store the values in arrays
    const yearsObj = {};
    years.forEach((elm) => {
      yearsObj[elm.value] = [elm.value];
      tableHeader.push({
        Header: `${meta.indicator.replaceAll('-', ' ')} ${elm.value}`,
        accessor: `${meta.indicator}-${elm.value}`,
      });
    });

    const tableRows = [];

    constituencies.forEach((elm) => {
      if (Object.values(schemeData).length) {
        const { state, code, name } = elm;
        barChartHeader.push(String(name));
        const tableRowsObj = {
          [tableHeader[0].accessor]: String(name),
        };
        //  for each year, fill the district value
        Object.keys(yearsObj).length &&
          Object.keys(yearsObj).forEach((yearElm, index) => {
            const yearFiltered = getParameterCaseInsensitive(
              schemeData,
              state
            )[yearElm];
            if (yearFiltered) {
              const constValue = yearFiltered[code];
              yearsObj[yearElm].push(constValue);
              tableRowsObj[tableHeader[index + 1].accessor] = constValue;
            }
          });

        tableRows.push(tableRowsObj);
      }
    });

    const barChartArr = [barChartHeader, ...Object.values(yearsObj)];
    setBarData(barChartArr);
    setTableData({
      header: tableHeader,
      rows: tableRows,
    });
  }
  function handleConstChange(e) {
    const arr = e.map((obj) => ({
      state: obj.value.state,
      code: obj.value.code,
      name: obj.label,
    }));
    setSelectedCons(arr);
  }

  // generate grouped district list based on state
  const constList = React.useMemo(() => {
    const consList = meta.schemeData.metadata
      ? meta.schemeData.metadata.consList
      : {};
    return Object.keys(consList).map((state) => ({
      label: state,
      options: consList[state].map((item) => ({
        value: { state: state.toLowerCase(), code: item.constCode },
        label: item.constName,
      })),
    }));
  }, [meta.schemeData]);

  const yearList = selectedYears.map((year) => year.value);
  const consList = selectedCons.map((cons) => cons.state);

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
      <Title>
        {`${schemeName} . ${meta.indicator?.replace(
          '-',
          ' '
        )} ${`${JSON.stringify(yearList, null, ' ')}`} . ${`${JSON.stringify(
          consList,
          null,
          ' '
        )}`}`}
      </Title>
      <ComboWrapper>
        {meta.cons && (
          <Combobox
            options={constList}
            disableOptions={selectedCons.length >= 4}
            onChange={(e) => handleConstChange(e)}
            defaultValue={{
              value: { code: meta.cons, state: meta.state },
              label: meta.cons_name,
            }}
            isMulti
            isGrouped
            id="cons-selector"
            placeholder="Add more districts to compare"
          />
        )}
        {meta.year && (
          <Combobox
            options={meta.allYears}
            onChange={(e: any) => setSelectedYears(e)}
            defaultValue={{ value: meta.year, label: meta.year }}
            isMulti
            isSearchable={false}
            id="year-selector"
            placeholder="Select financial year"
          />
        )}
      </ComboWrapper>
      <>
        {barData ? (
          <GroupBarChart
            yAxisLabel={`Value (in ${meta.unit})`}
            xAxisLabel="District"
            theme={['#4965B2', '#ED8686', '#69BC99']}
            dataset={barData}
            stack={false}
            Title=""
            subTitle=""
            left="60vw"
            type="bar"
            smooth={true}
          />
        ) : (
          <p>Loading...</p>
        )}
      </>
    </Wrapper>
  );
};
export default ConstBar;

const Wrapper = styled.div`
  background-color: var(--color-background-light);
  height: 100%;
`;

const ComboWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-inline: 16px;
  padding-top: 16px;

  #cons-selector {
    flex-grow: 1;
    flex-basis: 50%;

    @media (max-width: 480px) {
      width: 100%;
    }
  }

  #year-selector {
    flex-grow: 1;
  }
`;

const Title = styled.div`
  border-radius: 2px;
  background-color: var(--color-background-light);
  margin-bottom: 8px;
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