import React from 'react';
import { useRouter } from 'next/router';
import { MapViz } from 'components/viz';
import { swrFetch } from 'utils/helper';
import styled from 'styled-components';
import { Info } from 'components/icons';

function generateMapData(obj) {
  const mapObj = [...obj].map((item) => {
    return {
      mapName: item.district,
      value: '1',
      name: item.district_code_lg,
    };
  });

  return mapObj;
}

const ConsMapView = ({ meta, consData }) => {
  const router = useRouter();
  const { data, isLoading } = swrFetch(
    `/assets/maps/district/${meta.state}.json`
  );

  return isLoading ? (
    <LoadingDiv>Loading Map...</LoadingDiv>
  ) : (
    <>
      <Wrapper>
        <MapViz
          mapFile={data}
          meta={meta}
          data={generateMapData(consData[meta.sabha])}
          vizIndicators={[]}
          onlyLabel
          newMapItem={(e) => {
            e ? router.push(`${meta.state}/${meta.sabha}/${e.name}`) : null;
          }}
        />
      </Wrapper>

      <MapNote>
        <Info fill="#D7AA3B" />
        Click on any district to explore more about it.
      </MapNote>
    </>
  );
};

export default ConsMapView;

const Wrapper = styled.div`
  height: 100%;
`;

export const LoadingDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-background-light);
`;

const MapNote = styled.aside`
  border-radius: 2px;
  font-size: 0.75rem;
  line-height: 1.7;
  padding: 8px 16px;
  text-transform: capitalize;
  background-color: var(--color-background-light);

  display: flex;
  align-items: center;
  gap: 8px;
`;
