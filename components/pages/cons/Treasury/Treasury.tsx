import { TreasurySelected } from './TreasurySelected';

const Treasury = ({ schemeList, queryData }) => {
 return (
    <>
     <TreasurySelected schemeList={schemeList} queryData={queryData} />
    </>
 )
};

export default Treasury;
