import React from 'react';
import styled from 'styled-components';
interface Props {
  /**
   * Options to display in the select
   */
  options: {
    value: string;
    title: string;
  }[];

  /**
   * Heading for the select
   */
  heading: string;

  /**
   * return prop
   */
  handleChange: (event: string) => void;
}

const Select = ({ heading, options, handleChange }: Props) => {
  const selectID = React.useId();

  return (
    <SelectComp className="select">
      {heading && (
        <SelectLabel id={selectID}>{heading}&nbsp;&nbsp;</SelectLabel>
      )}
      <NativeSelect
        aria-labelledby={selectID}
        onChange={(e) => handleChange(e.target.value)}
      >
        {options.map((option: any, index: any) => (
          <option value={option.value} key={`selectNative-${index}`}>
            {option.title}
          </option>
        ))}
      </NativeSelect>
    </SelectComp>
  );
};

export default Select;

export const SelectComp = styled.div`
  display: flex;
  align-items: center;
`;

const SelectLabel = styled.span`
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
  color: #545454;
  display: block;
`;

const NativeSelect = styled.select`
  line-height: 1.5;
  padding: 9px 32px 9px 12px;

  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='7' viewBox='0 0 10 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.55152 0.591299L5.00041 4.04019L8.4493 0.591299C8.79596 0.244632 9.35596 0.244632 9.70263 0.591299C10.0493 0.937965 10.0493 1.49797 9.70263 1.84463L5.62263 5.92463C5.27596 6.2713 4.71596 6.2713 4.3693 5.92463L0.289297 1.84463C-0.0573698 1.49797 -0.0573698 0.937965 0.289297 0.591299C0.635964 0.253521 1.20485 0.244632 1.55152 0.591299Z' fill='%236C666E'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat, repeat;
  background-position: right 18px top 18px, 0 0;

  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.08);
  border-radius: 4px;

  &::-ms-expand {
    display: none;
  }

  &:hover {
    border-color: #888;
  }

  &:focus {
    border-color: #aaa;
    box-shadow: 0 0 1px 3px rgb(59, 153, 252);
    outline: none;
  }

  &:disabled,
  &[aria-disabled='true'] {
    color: graytext;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='7' viewBox='0 0 10 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.55152 0.591299L5.00041 4.04019L8.4493 0.591299C8.79596 0.244632 9.35596 0.244632 9.70263 0.591299C10.0493 0.937965 10.0493 1.49797 9.70263 1.84463L5.62263 5.92463C5.27596 6.2713 4.71596 6.2713 4.3693 5.92463L0.289297 1.84463C-0.0573698 1.49797 -0.0573698 0.937965 0.289297 0.591299C0.635964 0.253521 1.20485 0.244632 1.55152 0.591299Z' fill='%236C666E'/%3E%3C/svg%3E%0A"),
      linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
  }

  &:disabled:hover,
  &[aria-disabled='true'] {
    border-color: #aaa;
  }
`;
