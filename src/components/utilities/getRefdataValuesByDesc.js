import orderBy from 'lodash/orderBy';

const getRefdataValuesByDesc = (refdata, desc) => {
  return orderBy(refdata?.find(rd => rd.desc === desc)?.values ?? [], 'label', 'asc');
};

export default getRefdataValuesByDesc;
