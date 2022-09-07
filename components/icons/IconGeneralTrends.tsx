import { SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconGeneralTrends = (props: Props) => (
  <svg
    viewBox="0 0 24 24"
    width={props.width ? props.width : '24px'}
    {...props}
  >
    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM8 17C7.45 17 7 16.55 7 16V11C7 10.45 7.45 10 8 10C8.55 10 9 10.45 9 11V16C9 16.55 8.55 17 8 17ZM12 17C11.45 17 11 16.55 11 16V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V16C13 16.55 12.55 17 12 17ZM16 17C15.45 17 15 16.55 15 16V14C15 13.45 15.45 13 16 13C16.55 13 17 13.45 17 14V16C17 16.55 16.55 17 16 17Z" />
  </svg>
);

export { IconGeneralTrends };
