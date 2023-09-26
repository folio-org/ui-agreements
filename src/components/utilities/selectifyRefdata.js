const selectifyRefdata = (
  refdataRecords = [],
  category = null,
  valueType = 'id'
) => {
  // Due to differences in ref data structure, value of refdata can now be set by either id or value
  if (category) {
    // If a category is provided then the incoming refdata will be a different shape
    return (
      refdataRecords
        .filter((obj) => obj.desc === category)[0]
        ?.values?.map((entry) => ({
          label: entry.label,
          value: entry[valueType],
        })) ?? []
    );
  }

  return refdataRecords.map((obj) => ({
    label: obj.label,
    value: obj[valueType],
  }));
};

export default selectifyRefdata;
