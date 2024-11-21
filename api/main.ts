import { serve } from "std/http/server.ts";
import { DOMParser } from "deno_dom/deno-dom-wasm.ts";

// Function to fetch the developer excuse quote
async function fetchQuote(): Promise<string> {
  try {
    const response = await fetch("http://developerexcuses.com/");
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // Target the first <a> tag and get its innerHTML
    const link = doc?.querySelector("a");
    return link ? link.innerHTML.trim() : "Error fetching quote.";
  } catch {
    return "Failed to fetch a quote.";
  }
}

