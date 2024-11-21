import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.48/deno-dom-wasm.ts";

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

// Function to generate SVG with custom parameters
function generateSVG(quote: string, params: Record<string, string>): string {
  const {
    user = "",
    theme = "light",
    card_width = "500",
    card_height = "200",
    font_size = "16",
    font_family = "Arial"
  } = params;

  // Colors based on the theme
  const textColor = theme === "dark" ? "#ffffff" : "#000000";

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${card_width}" height="${card_height}">
      <text x="25" y="25" fill="${textColor}" font-size="${font_size}" font-family="${font_family}">
        ${quote}
      </text>
    </svg>
  `;
}

// Start the server
serve(async (req) => {
  // Parse query parameters
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const quote = await fetchQuote();
  const svg = generateSVG(quote, params);

  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
});
