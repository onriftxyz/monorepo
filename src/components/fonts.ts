import localFont from "next/font/local";

export const matter = localFont({
  src: [
    { weight: "800", path: "./fonts/Matter-Bold.otf" },
    { weight: "600", path: "./fonts/Matter-SemiBold.otf" },
    { weight: "500", path: "./fonts/Matter-Medium.otf" },
    { weight: "400", path: "./fonts/Matter-Regular.otf" },
  ],
});

export const signifier = localFont({
  src: "./fonts/Signifier-Italic.woff2",
  style: "italic",
});
