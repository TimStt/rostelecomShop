const addScriptToHead = (url: string) => {
  const script = document.createElement("script");
  script.src = url;
  document.head.appendChild(script);
};

export default addScriptToHead;
