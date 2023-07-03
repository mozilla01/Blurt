const setContent = (content) => {
  const sen = content.split("\n");
  const html = sen.join("<br>");
  return html;
};
