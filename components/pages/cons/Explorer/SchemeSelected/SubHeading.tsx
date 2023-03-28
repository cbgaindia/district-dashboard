import styled from 'styled-components';
import React from 'react';
import Image from 'next/image';
import { IconGeneralAdd } from 'components/icons/IconlAdd';
import { Combobox } from 'components/actions/Combobox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@opub-cdl/design-system';
import { IconMinimize } from 'components/icons';
import { useRouter } from 'next/router';
import { ConstituencyPage } from 'pages/[state]/[cons]';
import SchemesData from 'utils/schemesData';

const SubHeading = ({ meta, schemeList, queryData }) => {
  const { metaReducer } = React.useContext(ConstituencyPage);
  const indicator = metaReducer.obj.indicator;

  const dispatchCons = metaReducer.dispatch;

  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  const schemes = React.useMemo(() => {
    if (schemeList) {
      const schemeArr = schemeList.map((scheme) => {
        return {
          value: scheme['scheme_slug'],
          label: scheme['scheme_name'],
        };
      });
      return schemeArr;
    }
  }, [schemeList]);
  return (
    <Wrapper>
      <SchemeWrapper>
        <Image
          src={SchemesData[queryData.scheme].logo}
          width={48}
          height={48}
          layout="fixed"
          alt=""
          className="img-cover"
        />

        <Combobox
          options={schemes}
          key={meta.schemeName}
          isSearchable={false}
          placeholder="Select a scheme"
          isLoading={!schemes}
          onChange={(e: any) => {
            router
              .replace({
                pathname: `/${queryData.state}/${queryData.cons}`,
                query: { scheme: e.value, indicator: indicator },
              })
              .then(() => {
                dispatchCons({ scheme: e.value, indicator: indicator });
              });
          }}
          defaultValue={{
            value: queryData.scheme,
            label: meta.schemeName || 'Loading...',
          }}
          isLight
        />
      </SchemeWrapper>
      <EditorialWrapper>
        <Collapsible open={open} onOpenChange={setOpen}>
          <EditorialHeader>
            <span>Scheme Editorial Notes</span>
            <CollapsibleTrigger aria-label="Expand scheme Editorial notes">
              {!open ? (
                <IconGeneralAdd fill="#888F8B" />
              ) : (
                <IconMinimize fill="#888F8B" />
              )}
            </CollapsibleTrigger>
          </EditorialHeader>
          <CollapsibleContent>
            <EditorialNotes schemeData={meta.schemeData} />
          </CollapsibleContent>
        </Collapsible>
      </EditorialWrapper>
    </Wrapper>
  );
};

export default React.memo(SubHeading);

const Wrapper = styled.div`
  margin-top: 32px;
  padding: 24px;
  background-color: var(--color-background-lighter);
  border: var(--border-2);
  box-shadow: var(--box-shadow-1);
  border-radius: 4px;

  .react-select__single-value {
    font-size: 0.875rem;
    line-height: 1.7;
  }

  @media (max-width: 480px) {
    padding: 18px;
  }
`;

const SchemeWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  > span {
    min-width: 48px;
  }

  > div {
    flex-grow: 1;
    width: 100%;
  }

  @media (max-width: 580px) {
    flex-wrap: wrap;
  }
`;

const EditorialWrapper = styled.div`
  margin-top: 20px;
`;

const EditorialHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  > span {
    font-weight: 700;
  }

  > button {
    color: #888f8b;
  }
`;

const EditorialNotes = ({ schemeData }) => {
  return (
    <SchemeNotes data-html2canvas-ignore>
      <p>{schemeData.metadata?.description}</p>
      <div>
        {schemeData.data &&
          Object.values(schemeData.data).map((item: any) => (
            <NotesInidicator key={`indicator-${item.slug}`}>
              <NotesTitle>
                <h3>{item.name}</h3> ({item.unit})
              </NotesTitle>
              <p>{item.description}</p>
              <IndicatorNotes>
                <strong>Note:</strong> {item.note || 'NA'}
              </IndicatorNotes>
            </NotesInidicator>
          ))}
      </div>
      {schemeData.metadata?.methodology &&
        <NotesInidicator key={`methodology`}>
          <NotesTitle>
            <h3>Methodology </h3>
          </NotesTitle>
          <p>{schemeData.metadata?.methodology}</p>
        </NotesInidicator>
      }
      {schemeData.metadata?.remarks &&
        <NotesInidicator key={`remarks`}>
          <NotesTitle>
            <h3>Remarks </h3>
          </NotesTitle>
          <p>{schemeData.metadata?.remarks}</p>
        </NotesInidicator>
      }
    </SchemeNotes>
  );
};

const SchemeNotes = styled.div`
  padding-top: 16px;
  margin-top: 16px;
  max-height: 592px;
  overflow-y: auto;
  border-top: var(--border-2);

  > p {
    border-left: 4px solid var(--color-amazon-100);
    padding-left: 18px;
    border-radius: 4px;
  }
`;

const NotesInidicator = styled.section`
  margin-top: 16px;
  background-color: var(--color-background-light);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  h3 {
    display: inline-block;
    font-weight: 600;
    font-size: 1rem;
    color: var(--text-light-high);
  }
`;

const NotesTitle = styled.span`
  font-weight: 400;
  color: var(--text-light-medium);
`;
const IndicatorNotes = styled.span`
  font-size: 0.75rem;
  line-height: 1.7;
`;
