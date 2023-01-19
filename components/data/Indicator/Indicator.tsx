import Radio from 'components/layouts/Radio';
import { RadioItem } from 'components/layouts/Radio/Radio';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

type Props = {
  newIndicator: any;
  selectedIndicator: any;
  data: any;
  titleAs?: 'h2' | 'h3' | 'h4' | 'span' | 'p';
  returnName?: false | true;
  primary?: false | true;
};

const Indicator = ({
  newIndicator,
  selectedIndicator,
  data,
  titleAs = 'h4',
  returnName = false,
  primary,
}: Props) => {
  const indicatorRef = useRef(null);
  useEffect(() => {
    if (selectedIndicator) {
      const indicatorELm = indicatorRef.current.querySelector(
        `[value="${selectedIndicator}"]`
      );
      if (indicatorELm) indicatorELm.checked = true;
    }
  }, [selectedIndicator, data]);

  function handleIndicatorChange(e: any) {
    e.stopPropagation();
    const elm = e.target;

    newIndicator(elm.id || elm.value);
  }

  const commonIndi = data.filter(item => item.type == "common")
  const uniqueIndi = data.filter(item => item.type == "unique")

  if (primary) {
    return (
      <IndicatorWrapper className="indicator">
        <IndicatorTitle as={titleAs}>Indicators</IndicatorTitle>
        <fieldset ref={indicatorRef}>
          <legend data-html2canvas-ignore className="sr-only">
            Choose Indicator:
          </legend>
          <Heading> Common Indicators </Heading>
          {commonIndi &&
            commonIndi.map(
              (item: any) =>
                item && (
                  <Radio
                    onClick={handleIndicatorChange}
                    color="var(--color-amazon-300)"
                    data-selected={
                      selectedIndicator == (returnName ? item.name : item.slug)
                        ? 'true'
                        : 'false'
                    }
                    id={returnName ? item.name : item.slug}
                    text={
                      <>
                        {item.name}
                        <Info>
                          <p>{item.description}</p>
                        </Info>
                      </>
                    }
                    name="indicators"
                    key={`indicatorItem-${item.slug}`}
                  />
                )
            )}
          <HorizontalLine />
          <Heading> Unique Indicators </Heading>
          {uniqueIndi &&
            uniqueIndi.map(
              (item: any) =>
                item && (
                  <Radio
                    onClick={handleIndicatorChange}
                    color="var(--color-amazon-300)"
                    data-selected={
                      selectedIndicator == (returnName ? item.name : item.slug)
                        ? 'true'
                        : 'false'
                    }
                    id={returnName ? item.name : item.slug}
                    text={
                      <>
                        {item.name}
                        <Info>
                          <p>{item.description}</p>
                        </Info>
                      </>
                    }
                    name="indicators"
                    key={`indicatorItem-${item.slug}`}
                  />
                )
            )}
        </fieldset>
      </IndicatorWrapper>
    )
  }

  else {
    return (
      <IndicatorWrapper className="indicator">
        <IndicatorTitle as={titleAs}>Indicators</IndicatorTitle>
        <fieldset ref={indicatorRef}>
          <legend data-html2canvas-ignore className="sr-only">
            Choose Indicator:
          </legend>
          {data &&
            data.map(
              (item: any) =>
                item && (
                  <Radio
                    onClick={handleIndicatorChange}
                    color="var(--color-amazon-300)"
                    data-selected={
                      selectedIndicator == (returnName ? item.name : item.slug)
                        ? 'true'
                        : 'false'
                    }
                    id={returnName ? item.name : item.slug}
                    text={
                      <>
                        {item.name}
                        <Info>
                          <p>{item.description}</p>
                        </Info>
                      </>
                    }
                    name="indicators"
                    key={`indicatorItem-${item.slug}`}
                  />
                )
            )}
        </fieldset>
      </IndicatorWrapper>
    );
  }
}

export default Indicator;

const Info = styled.div`
  display: none;
  font-weight: 400;
  line-height: 1.7;
  font-size: 0.75rem;
  color: var(--text-light-medium);
  grid-column: 2/3;
  pointer-events: none;
  margin-top: -10px;
`;

export const IndicatorWrapper = styled.div`
  background-color: var(--color-background-lighter);
  filter: drop-shadow(var(--box-shadow-1));
  border: var(--border-2);
  border-radius: 4px;
  padding: 24px;

  fieldset {
    overflow-y: auto;
    max-height: 800px;
    scrollbar-width: thin;

    ::-webkit-scrollbar {
      width: 5px;
    }

    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
      border-radius: 8px;
      -webkit-border-radius: 8px;
    }

    ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 10px;
      border-radius: 10px;
      background: rgba(100, 100, 100, 0.8);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }
  }

  ${RadioItem} {
    line-height: 1.7;
    margin-top: 8px;
    color: var(--text-light-high);
    letter-spacing: 0.01em;
    padding: 8px;

    &:hover {
      background-color: var(--color-grey-600);
    }

    &[data-selected='true'] {
      font-weight: 600;
      background-color: var(--color-grey-600);
    }

    input {
      pointer-events: none;
    }

    input:checked {
      + ${Info} {
        display: block;
      }
    }
  }

  @media (max-width: 980px) {
    display: none;
  }
`;

const IndicatorTitle = styled.h4`
  font-weight: 700;
  border-bottom: var(--border-2);
  padding-bottom: 16px;
`;

const HorizontalLine = styled.hr`
  width:90%;
  border-top: 1px solid grey;
`;

const Heading = styled.h5`
  font-weight:550;
  margin-top:10px;
`;