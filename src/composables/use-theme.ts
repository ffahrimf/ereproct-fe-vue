export const useLighten = (hexColor: string, factor: number): string => {
  factor = Math.min(1, Math.max(0, factor));

  let r: number = parseInt(hexColor.slice(1, 3), 16);
  let g: number = parseInt(hexColor.slice(3, 5), 16);
  let b: number = parseInt(hexColor.slice(5, 7), 16);

  r = Math.round(r + (255 - r) * factor);
  g = Math.round(g + (255 - g) * factor);
  b = Math.round(b + (255 - b) * factor);

  const resultHex: string =
    "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);

  return resultHex;
};

export const useTheme = () => {
  const primary: string = "#4D4DFF";
  const primaryHover: string = "#3A3AD6";
  const secondary: string = "#C8C0F3";
  const word: string = "#373D52";
  const panel: string = "#F2F4F7";

  const theme = {
    primary: primary,
    primaryHover: primaryHover,
    secondary: secondary,
    word: word,
    panel: panel,
    "primary-lighten": useLighten(primary, 0.93),
    "secondary-lighten": useLighten(secondary, 0.93)
  };

  return theme;
};
