function fetchLimit(passedArray, limit) {
  let slicedArray = passedArray.slice(0, limit);
  return slicedArray;
}

export default fetchLimit;