const getRefdataValuesByDesc = (refdata, desc) => {
  return refdata?.find(rd => rd.desc === desc)?.values ?? [];
};

export default getRefdataValuesByDesc;
