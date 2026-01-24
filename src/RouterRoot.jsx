import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

export default function RouterRoot({ children }) {
  useEffect(() => {
    // If user lands on /#/<route>, convert it to /<route> once
    // Example: https://site.com/#/blaze -> https://site.com/blaze
    const { hash, search } = window.location;
    if (hash && hash.startsWith("#/")) {
      const newPath = hash.slice(1); // remove leading "#"
      window.history.replaceState(null, "", newPath + search);
    }
  }, []);

  return <BrowserRouter>{children}</BrowserRouter>;
}
