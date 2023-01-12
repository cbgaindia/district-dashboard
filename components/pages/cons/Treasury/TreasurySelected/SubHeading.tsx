import styled from 'styled-components';
import React from 'react';
import Image from 'next/image';
import { IconGeneralAdd } from 'components/icons/IconlAdd';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@opub-cdl/design-system';
import { IconMinimize } from 'components/icons';

const SubHeading = ({ meta }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Wrapper>
      <SchemeWrapper>
        <Image
          src={'/assets/images/image.png'}
          width={48}
          height={48}
          layout="fixed"
          alt=""
          className="img-cover"
        /> 
        <TreasuryHeading>
           Treasury Expenditure
        </TreasuryHeading>
      </SchemeWrapper>
      <EditorialWrapper>
        <Collapsible open={open} onOpenChange={setOpen}>
          <EditorialHeader>
            <span>Treasury Flow Editorial Notes</span>
            <CollapsibleTrigger aria-label="Expand treasury editor notes">
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

const TreasuryHeading = styled.div`
   border-radius: 2px;
   border: var(--border-1);
   font-weight: 600;
   background-color: rgb(238,246,253);
   padding: 10px 16px;
  
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
