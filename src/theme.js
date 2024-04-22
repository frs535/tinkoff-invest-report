// color design tokens export
// export const tokensDark = {
//     grey: {
//         0: "#ffffff", // manually adjusted
//         10: "#f6f6f6", // manually adjusted
//         50: "#f0f0f0", // manually adjusted
//         100: "#e0e0e0",
//         200: "#c2c2c2",
//         300: "#a3a3a3",
//         400: "#858585",
//         500: "#666666",
//         600: "#525252",
//         700: "#3d3d3d",
//         800: "#292929",
//         900: "#141414",
//         1000: "#000000", // manually adjusted
//     },
//     primary: {
//         // blue
//         100: "#d3d4de",
//         200: "#a6a9be",
//         300: "#7a7f9d",
//         400: "#4d547d",
//         500: "#21295c",
//         600: "#191F45", // manually adjusted
//         700: "#141937",
//         800: "#0d1025",
//         900: "#070812",
//     },
//     secondary: {
//         // yellow
//         50: "#f0f0f0", // manually adjusted
//         100: "#fff6e0",
//         200: "#ffedc2",
//         300: "#ffe3a3",
//         400: "#ffda85",
//         500: "#ffd166",
//         600: "#cca752",
//         700: "#997d3d",
//         800: "#665429",
//         900: "#332a14",
//     },
// };

// export const tokens = (mode) => ({
//     ...(mode === "dark"
//         ? {
//             grey: {
//                 100: "#e0e0e0",
//                 200: "#c2c2c2",
//                 300: "#a3a3a3",
//                 400: "#858585",
//                 500: "#666666",
//                 600: "#525252",
//                 700: "#3d3d3d",
//                 800: "#292929",
//                 900: "#141414",
//             },
//             primary: {
//                 100: "#d0d1d5",
//                 200: "#a1a4ab",
//                 300: "#727681",
//                 400: "#1F2A40",
//                 500: "#141b2d",
//                 600: "#101624",
//                 700: "#0c101b",
//                 800: "#080b12",
//                 900: "#040509",
//             },
//             greenAccent: {
//                 100: "#dbf5ee",
//                 200: "#b7ebde",
//                 300: "#94e2cd",
//                 400: "#70d8bd",
//                 500: "#4cceac",
//                 600: "#3da58a",
//                 700: "#2e7c67",
//                 800: "#1e5245",
//                 900: "#0f2922",
//             },
//             redAccent: {
//                 100: "#f8dcdb",
//                 200: "#f1b9b7",
//                 300: "#e99592",
//                 400: "#e2726e",
//                 500: "#db4f4a",
//                 600: "#af3f3b",
//                 700: "#832f2c",
//                 800: "#58201e",
//                 900: "#2c100f",
//             },
//             blueAccent: {
//                 100: "#e1e2fe",
//                 200: "#c3c6fd",
//                 300: "#a4a9fc",
//                 400: "#868dfb",
//                 500: "#6870fa",
//                 600: "#535ac8",
//                 700: "#3e4396",
//                 800: "#2a2d64",
//                 900: "#151632",
//             },
//         }
//         : {
//             grey: {
//                 100: "#141414",
//                 200: "#292929",
//                 300: "#3d3d3d",
//                 400: "#525252",
//                 500: "#666666",
//                 600: "#858585",
//                 700: "#a3a3a3",
//                 800: "#c2c2c2",
//                 900: "#e0e0e0",
//             },
//             primary: {
//                 100: "#040509",
//                 200: "#080b12",
//                 300: "#0c101b",
//                 400: "#f2f0f0", // manually changed
//                 500: "#141b2d",
//                 600: "#1F2A40",
//                 700: "#727681",
//                 800: "#a1a4ab",
//                 900: "#fafafb",
//             },
//             greenAccent: {
//                  50: "#EFF9EB",
//                 100: "#D8F0CD",
//                 200: "#BEE7AB",
//                 300: "#A3DD89",
//                 400: "#90D570",
//                 500: "#7CCE57",
//                 600: "#74C94F",
//                 700: "#69C246",
//                 800: "#5FBC3C",
//                 900: "#4CB02C",
//                 A100: "#F5FFF2",
//                 A200: "#CEFFBF",
//                 A400: "#A6FF8C",
//                 A700: "#92FF73",
//             },
//             redAccent: {
//                 100: "#2c100f",
//                 200: "#58201e",
//                 300: "#832f2c",
//                 400: "#af3f3b",
//                 500: "#db4f4a",
//                 600: "#e2726e",
//                 700: "#e99592",
//                 800: "#f1b9b7",
//                 900: "#f8dcdb",
//             },
//             blueAccent: {
//                  50: "#EEF5FB",
//                 100: "#D4E5F5",
//                 200: "#B7D4EE",
//                 300: "#9AC2E7",
//                 400: "#85B5E1",
//                 500: "#6FA8DC",
//                 600: "#67A0D8",
//                 700: "#5C97D3",
//                 800: "#528DCE",
//                 900: "#407DC5",
//                 A100: "#FFFFFF",
//                 A200: "#E3EFFF",
//                 A400: "#B0D3FF",
//                 A700: "#96C4FF",
//             },
//         }),
// });

// function that reverses the color palette
function reverseTokens(tokens) {
    const reversedTokens = {};
    Object.entries(tokens).forEach(([key, val]) => {
        const keys = Object.keys(val);
        const values = Object.values(val);
        const length = keys.length;
        const reversedObj = {};
        for (let i = 0; i < length; i++) {
            reversedObj[keys[i]] = values[length - i - 1];
        }
        reversedTokens[key] = reversedObj;
    });
    return reversedTokens;
}
// export const tokensLight = reverseTokens(tokens);

// mui theme settings
export const themeSettings = (mode) => {
    // const colors = tokens(mode);
    return {
        palette: {
            mode: mode,
            ...(mode === "dark"
                ? {
                    // palette values for dark mode
                }
                : {
                    // palette values for light mode
                }),
        },
        typography: {
            fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 40,
            },
            h2: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 32,
            },
            h3: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 24,
            },
            h4: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 20,
            },
            h5: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 16,
            },
            h6: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 14,
            },
        },
    };
};