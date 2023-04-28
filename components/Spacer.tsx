// // Import React and useTheme from styled-components
// import React, { ReactNode } from "react";
// import { useTheme } from "styled-components";

// interface SizeVariant {
//   [key: string]: number;
// }

// const sizeVariant: SizeVariant = {
//   small: 1,
//   medium: 2,
//   large: 3,
//   xl: 4,
//   xxl: 5,
// };

// interface PositionVariant {
//   [key: string]: string;
// }

// const positionVariant: PositionVariant = {
//   top: "marginTop",
//   left: "marginLeft",
//   right: "marginRight",
//   bottom: "marginBottom",
// };

// const getVariant = (position: string, size: string, theme: any): string => {
//   const sizeIndex = sizeVariant[size];
//   const property = positionVariant[position];
//   const value = theme.space[sizeIndex];
//   return `${property}:${value};`;
// };

// interface SpacerProps {
//   position?: string;
//   size?: string;
//   children?: ReactNode;
// }

// export const Spacer: React.FC<SpacerProps> = ({
//   position = "top",
//   size = "small",
//   children,
// }) => {
//   const theme = useTheme();
//   const variant = getVariant(position, size, theme);

//   return (
//     <div>
//       <span>{children}</span>
//       <style jsx>{`
//         span {
//           display: inline-block;
//           ${variant}
//         }
//       `}</style>
//     </div>
//   );
// };

///////////////////////////////////////////////////////
// import React from "react";
// import styled, { useTheme } from "styled-components";

// interface SizeVariant {
//   [key: string]: number;
// }

// const sizeVariant: SizeVariant = {
//   small: 1,
//   medium: 2,
//   large: 3,
//   xl: 4,
//   xxl: 5,
// };

// interface PositionVariant {
//   [key: string]: string;
// }

// const positionVariant: PositionVariant = {
//   top: "marginTop",
//   left: "marginLeft",
//   right: "marginRight",
//   bottom: "marginBottom",
// };

// const getVariant = (position: string, size: string, theme: any): string => {
//   const sizeIndex = sizeVariant[size];
//   const property = positionVariant[position];
//   const value = theme.space[sizeIndex];
//   return `${property}:${value};`;
// };

// interface SpacerProps {
//   position?: string;
//   size?: string;
// }

// const StyledSpacer = styled.div<SpacerProps>`
//   ${({ position = "top", size = "small", theme }) =>
//     getVariant(position, size, theme)};
// `;

// export const Spacer: React.FC<SpacerProps> = (props) => {
//   return <StyledSpacer {...props} />;
// };

// import React, { ReactNode } from "react";
// import styled, { useTheme } from "styled-components";
// import { theme } from "../infastructure/theme/index";

// interface SpacerProps {
//   position?: keyof typeof positionVariant;
//   size?: keyof typeof sizeVariant;
//   children?: ReactNode;
// }

// const sizeVariant = {
//   small: 1,
//   medium: 2,
//   large: 3,
//   xl: 4,
//   xxl: 5,
// } as const;

// const positionVariant = {
//   top: "marginTop",
//   left: "marginLeft",
//   right: "marginRight",
//   bottom: "marginBottom",
// } as const;

// const getVariant = (
//   position: keyof typeof positionVariant,
//   size: keyof typeof sizeVariant,
//   theme: theme
// ): string => {
//   const sizeIndex = sizeVariant[size];
//   const property = positionVariant[position];
//   const value = theme.space[sizeIndex];
//   return `${property}:${value}`;
// };

// const SpacerView = styled.div<{ variant: string }>`
//   ${({ variant }) => variant}
// `;

// export const Spacer: React.FC<SpacerProps> = ({
//   position = "top",
//   size = "small",
//   children,
// }) => {
//   const theme = useTheme();
//   const variant = getVariant(position, size, theme);
//   return <SpacerView variant={variant}>{children}</SpacerView>;
// };

import React, { ReactNode } from "react";
import styled, { useTheme } from "styled-components";
import { theme } from "../infastructure/theme";
import { Theme } from "../infastructure/theme/theme.types";

interface SpacerProps {
  position?: keyof typeof positionVariant;
  size?: keyof typeof sizeVariant;
  children?: ReactNode;
}

const sizeVariant = {
  small: 1,
  medium: 2,
  large: 3,
  xl: 4,
  xxl: 5,
} as const;

const positionVariant = {
  top: "marginTop",
  left: "marginLeft",
  right: "marginRight",
  bottom: "marginBottom",
} as const;

const getVariant = (
  position: keyof typeof positionVariant,
  size: keyof typeof sizeVariant,
  theme: Theme
): string => {
  const sizeIndex = sizeVariant[size];
  const property = positionVariant[position];
  const value = theme.space[sizeIndex];

  return `${property}:${value}`;
};

const SpacerView = styled.div<{ variant: string }>`
  ${({ variant }) => variant} !important;
`;
export const Spacer: React.FC<SpacerProps> = ({
  position = "top",
  size = "small",
  children,
}) => {
  const theme = useTheme() as Theme;
  const variant = getVariant(position, size, theme);
  return <SpacerView variant={variant}>{children}</SpacerView>;
};
