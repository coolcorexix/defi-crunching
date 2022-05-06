export function convertFontSizeToPixel(fontSize: number) {
  // Ref: https://accessibility.psu.edu/legibility/fontsize/
  const oneFontSizeToPixel = 16 / 12;
  return oneFontSizeToPixel * fontSize;
}
