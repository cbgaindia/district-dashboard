import { Menu } from 'components/actions';
import { Indicator, IndicatorMobile } from 'components/data';
import { ConstituencyPage } from 'pages/[state]/[cons]';
import React from 'react';
import styled from 'styled-components';
import { fetchIndicators, generateSlug } from 'utils/fetch';
import { swrFetch } from 'utils/helper';
import useEffectOnChange from 'utils/hooks';
import Source from '../Source';
import SnapshotCard from './SnapshotCard';
import { yearOptions } from 'utils/fetch';
import { DEFAULT_YEAR } from 'config/year';
import { FOOTER } from 'config/note'

type Props = {
  queryData: any;
  schemeList: any;
  consData: any;
  stateAvg: any;
};

const Snapshot = ({ queryData, schemeList, consData, stateAvg }: Props) => {
  const [selectedYear, setSelectedYear] = React.useState(
    Object.keys(consData).includes(DEFAULT_YEAR)
      ? DEFAULT_YEAR
      : Object.keys(consData)[0]
  );

  const { meta } = React.useContext(ConstituencyPage);
  const [indicator, setIndicator] = React.useState(meta.metaReducer.indicator);
  const [indicatorUnit, setIndicatorUnit] = React.useState('Cr.');
  const { scheme } = meta.metaReducer;
  const { dispatch } = meta;

  const { data: indicatorData, isLoading } = swrFetch(
    `indicatorList`,
    fetchIndicators
  );

  useEffectOnChange(() => {
    window.history.replaceState(
      {
        scheme: scheme,
        indicator: indicator,
      },
      '',
      `/${queryData.state}/${queryData.cons}?scheme=${scheme}&indicator=${indicator}`
    );
  }, [indicator]);

  const yearList = React.useMemo(() => {
    return Object.keys(consData).map((item) => ({
      label: item,
      value: item,
    }));
  }, [consData]);

  const indicatorList = React.useMemo(() => {
    const indicatorArr = [];
    !isLoading
      ? Object.values(indicatorData).forEach((elm) => {
        Object.keys(elm).forEach((item) => {
          if (item?.replaceAll(' ', '-').toLowerCase() === indicator) {
            setIndicatorUnit(elm[item].unit);
          }
          indicatorArr.push({
            name: item,
            description: elm[item].description,
            slug: generateSlug(item),
            unit: elm[item].unit,
            note: elm[item].note,
            type: elm[item].type
          });
        });
      })
      : [];
    return indicatorArr;
  }, [indicatorData]);

  useEffectOnChange(() => {
    setIndicator(meta.metaReducer.indicator);
    const currentIndicator = indicatorList.find(
      (e) => e.slug === meta.metaReducer.indicator
    );
    setIndicatorUnit(currentIndicator?.unit);
  }, [meta.metaReducer]);

  function getStateAvg(slug) {
    if (stateAvg[selectedYear][slug]) {
      const { min, max, avg } = stateAvg[selectedYear][slug][indicator];
      const barValue = ((avg - min) * 100) / (max - min || 1);
      return {
        bar: avg < 0 ? -barValue : barValue,
        value: avg,
      };
    }

    return false;
  }

  function getMinVal(slug) {
    if (stateAvg[selectedYear][slug]) {
      const { min, max } = stateAvg[selectedYear][slug][indicator];
      const barValue = ((min) * 100) / (max - min || 1);
      return {
        bar: min < 0 ? -barValue : barValue,
        value: min,
      };
    }
    return false;
  }

  function getMaxVal(slug) {
    if (stateAvg[selectedYear][slug]) {
      const { min, max } = stateAvg[selectedYear][slug][indicator];
      const barValue = ((max) * 100) / (max - min || 1);
      return {
        bar: max < 0 ? -barValue : barValue,
        value: max,
      };
    }
    return false;
  }


  function getConsAvg(slug) {
    if (
      consData[selectedYear][slug] &&
      Number.isFinite(consData[selectedYear][slug][indicator])
    ) {
      const { max, min } = stateAvg[selectedYear][slug][indicator];
      const consValue = consData[selectedYear][slug][indicator];
      let barValue;
      if (consValue == min) {
        barValue = getMinVal(slug)['bar']
      } else if (consValue == max) {
        barValue = getMaxVal(slug)['bar']
      } else {
        barValue = ((consValue - min) * 100) / (max - min || 1);
      }
      return {
        bar: consValue < 0 ? -barValue : barValue,
        value: consValue,
      };
    }

    return false;
  }

  return (
    <section>
      <SnapshotTitle>Scheme Performance Snapshots</SnapshotTitle>

      <IndicatorMobile
        indicators={indicatorList}
        newIndicator={(e) => dispatch({ indicator: e })}
        selectedIndicator={indicator || ''}
      />
      <SnapshotWrapper id="snapshotWrapper">
        <Indicator
          newIndicator={(e) => {
            dispatch({ indicator: e });
          }}
          selectedIndicator={indicator}
          data={indicatorList}
          primary={true}
        />
        <SnapshotSchemes>
          <SnapshotSchemeTitle>
            <h4>All Schemes</h4>
            <Menu
              value={selectedYear}
              options={yearOptions(yearList)}
              heading="Financial Year:"
              handleChange={(e) => {
                setSelectedYear(e);
                dispatch({ year: e });
              }}
            />
          </SnapshotSchemeTitle>
          <SnapshotSchemeList>
            {schemeList &&
              indicator &&
              schemeList.map((item) => (
                <SnapshotCard
                  key={item.scheme_slug}
                  indicator={indicator}
                  indicatorUnit={indicatorUnit}
                  data={{
                    ...item,
                    value: getConsAvg(item.scheme_slug)
                      ? {
                        state: getStateAvg(item.scheme_slug),
                        district: getConsAvg(item.scheme_slug),
                        min: getMinVal(item.scheme_slug),
                        max: getMaxVal(item.scheme_slug)
                      }
                      : null,
                  }}
                />
              ))}
          </SnapshotSchemeList>
          <SnapshotFooter>
            <Source
              currentViz={'#overview-wrapper'}
              meta={{
                state: queryData.state,
                indicator: indicator ? indicator : 'Opening Balance',
                sabha: queryData.sabha,
              }}
              source={
                'Multiple sources - MIS, RTI queries, Parliament questions etc. Visit scheme page for specific sources.'
              }
            />
          </SnapshotFooter>
          <SnapshotFooter>
            <FooterNote>
              <p> <strong>Note: </strong>{FOOTER.note}</p> 
            </FooterNote>
          </SnapshotFooter>
        </SnapshotSchemes>
      </SnapshotWrapper>
    </section>
  );
};

export default Snapshot;

const SnapshotTitle = styled.h3`
  font-size: 2rem;
  line-height: 1.24;
  font-weight: 700;
  margin-top: 32px;
`;

const SnapshotWrapper = styled.div`
  margin-top: 32px;
  display: flex;
  gap: 32px;

  > .indicator {
    min-width: 312px;
    width: 312px;
    max-height: 904px;
    overflow-y: auto;
  }
`;
const SnapshotSchemes = styled.div`
  width: 100%;
`;

const SnapshotSchemeTitle = styled.div`
  background-color: var(--color-background-lighter);
  filter: drop-shadow(var(--box-shadow-1));
  border-radius: 4px;
  border: var(--border-2);
  padding: 16px 24px;

  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;

  h4 {
    border-bottom: var(--border-2);
    padding-bottom: 16px;
    flex-grow: 1;
  }

  > div {
    > span {
      border-bottom: var(--border-2);
      padding-bottom: 16px;
    }
  }
`;

const SnapshotFooter = styled.div`
  filter: drop-shadow(var(--box-shadow-1));
  background-color: var(--color-background-lighter);
  border-radius: 4px;
  border: var(--border-2);
  margin-top: 16px;
`;

const FooterNote = styled.div`
   display: flex;
   flex-wrap:wrap;
   align-items: flex-start;
   gap: 16px;
   padding: 24px;

   p {
    font-size: 0.875rem;
    line-height: 1.7;
   }
`;

const SnapshotSchemeList = styled.ul`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
