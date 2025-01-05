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
  const primary: string = "#133F58";
  const secondary: string = "#BD9028";

  const theme = {
    primary: primary,
    secondary: secondary,
    "primary-lighten": useLighten(primary, 0.93),
    "secondary-lighten": useLighten(secondary, 0.93),
  };

  return theme;
};
