const debounce = (func: Function, wait: number) => {
  let timeoutId: any;
  return (...args: any[]) => {
    const later = () => {
      timeoutId = null;
      func(...args);
    };
    clearTimeout(timeoutId);
    timeoutId = setTimeout(later, wait);
  };
};

export default debounce;
