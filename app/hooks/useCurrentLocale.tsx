import React from "react";

export function getCurrentLocale() {
  const [locale, setLocale] = React.useState('en-US');
  
  React.useEffect(() => {
    const language = document.documentElement.lang;
    if (language) {
      setLocale(language);
    }

  }, []);

  return locale
}