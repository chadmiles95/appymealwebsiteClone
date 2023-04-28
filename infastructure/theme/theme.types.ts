// infastructure/theme/theme.types.ts
import { colors } from "./colors";
import { space, lineHeights } from "./spacing";
import { sizes } from "./sizes";
import { fonts, fontWeights, fontSizes } from "./fonts";

export interface Theme {
  colors: typeof colors;
  space: typeof space;
  lineHeights: typeof lineHeights;
  sizes: typeof sizes;
  fonts: typeof fonts;
  fontSizes: typeof fontSizes;
  fontWeights: typeof fontWeights;
}
