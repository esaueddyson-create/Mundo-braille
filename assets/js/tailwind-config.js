tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        tertiary: "#040607",
        "surface-container": "#f0eded",
        "surface-container-highest": "#e5e2e1",
        "on-surface": "#1c1b1b",
        outline: "#74777f",
        "on-background": "#1c1b1b",
        "on-tertiary-fixed-variant": "#454748",
        "surface-dim": "#dcd9d9",
        "surface-container-low": "#f6f3f2",
        "surface-tint": "#476083",
        "on-surface-variant": "#43474e",
        "primary-fixed-dim": "#afc8f0",
        "inverse-surface": "#313030",
        "secondary-fixed-dim": "#ffb950",
        "surface-container-high": "#eae7e7",
        primary: "#000613",
        "outline-variant": "#c4c6cf",
        secondary: "#825500",
        "tertiary-container": "#1c1f20",
        "inverse-primary": "#afc8f0",
        "on-primary-fixed": "#001c3a",
        "on-secondary": "#ffffff",
        "on-secondary-fixed-variant": "#624000",
        "on-tertiary": "#ffffff",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-tertiary-fixed": "#191c1d",
        "on-secondary-container": "#684300",
        "surface-bright": "#fcf9f8",
        "secondary-container": "#feaa00",
        "tertiary-fixed-dim": "#c5c7c8",
        "surface-variant": "#e5e2e1",
        "tertiary-fixed": "#e1e3e4",
        error: "#ba1a1a",
        "secondary-fixed": "#ffddb3",
        "on-error-container": "#93000a",
        "on-primary-container": "#6f88ad",
        "on-primary": "#ffffff",
        "on-tertiary-container": "#848688",
        background: "#fcf9f8",
        "primary-container": "#001f3f",
        "primary-fixed": "#d4e3ff",
        "on-secondary-fixed": "#291800",
        "surface-container-lowest": "#ffffff",
        surface: "#fcf9f8",
        "inverse-on-surface": "#f3f0ef",
        "on-primary-fixed-variant": "#2f486a"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "container-margin": "24px",
        gutter: "16px",
        "stack-sm": "12px",
        base: "8px",
        "stack-md": "24px",
        "stack-lg": "40px"
      },
      fontFamily: {
        "body-lg": ["Atkinson Hyperlegible Next"],
        "label-sm": ["Atkinson Hyperlegible Next"],
        "headline-lg-mobile": ["Atkinson Hyperlegible Next"],
        "title-md": ["Atkinson Hyperlegible Next"],
        "headline-lg": ["Atkinson Hyperlegible Next"],
        "display-lg": ["Atkinson Hyperlegible Next"],
        "body-md": ["Atkinson Hyperlegible Next"],
        "title-sm": ["Atkinson Hyperlegible Next"]
      },
      fontSize: {
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "label-sm": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "700" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "700" }],
        "title-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "display-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }]
      }
    }
  }
};
