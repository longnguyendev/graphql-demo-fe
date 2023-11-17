export const truncate = (text: string, length = 10) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};
