import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type P = { size?: number; color: string; strokeWidth?: number };

const wrap = (children: React.ReactNode, size: number, box = 24) => (
  <Svg width={size} height={size} viewBox={`0 0 ${box} ${box}`} fill="none">
    {children}
  </Svg>
);

/** Girih yulduzi — ilova belgisi */
export const StarMark = ({ size = 24, color, strokeWidth = 1.6 }: P) =>
  wrap(
    <>
      <Path d="M12 2 L22 12 L12 22 L2 12 Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Rect
        x="5"
        y="5"
        width="14"
        height="14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </>,
    size,
  );

export const IconList = ({ size = 22, color, strokeWidth = 1.8 }: P) =>
  wrap(
    <Path d="M4 6 H20 M4 12 H20 M4 18 H14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />,
    size,
  );

export const IconGrid = ({ size = 22, color, strokeWidth = 1.7 }: P) =>
  wrap(
    <>
      <Rect x="3" y="3" width="18" height="18" rx="2.5" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M3 9 H21 M9 9 V21 M15 9 V21" stroke={color} strokeWidth={strokeWidth - 0.3} />
    </>,
    size,
  );

export const IconWallet = ({ size = 22, color, strokeWidth = 1.7 }: P) =>
  wrap(
    <>
      <Rect x="2.5" y="5.5" width="19" height="14" rx="3" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M2.5 10 H21.5" stroke={color} strokeWidth={strokeWidth - 0.3} />
      <Circle cx="17" cy="15" r="1.5" fill={color} />
    </>,
    size,
  );

export const IconGear = ({ size = 22, color, strokeWidth = 1.7 }: P) =>
  wrap(
    <>
      <Circle cx="12" cy="12" r="3.2" stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M12 2.6 L13.4 5 M12 21.4 L10.6 19 M21.4 12 L19 10.6 M2.6 12 L5 13.4 M18.6 5.4 L17 7.6 M5.4 18.6 L7 16.4 M18.6 18.6 L17 16.4 M5.4 5.4 L7 7.6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </>,
    size,
  );

export const IconCheck = ({ size = 14, color, strokeWidth = 2.4 }: P) =>
  wrap(
    <Path
      d="M3 7.5 L6 10.5 L11 3.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    size,
    14,
  );

export const IconChevron = ({
  size = 16,
  color,
  strokeWidth = 1.9,
  dir = 'right',
}: P & { dir?: 'left' | 'right' }) =>
  wrap(
    <Path
      d={dir === 'left' ? 'M11 3 L5 8 L11 13' : 'M5 3 L11 8 L5 13'}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    size,
    16,
  );

export const IconPlus = ({ size = 20, color, strokeWidth = 2 }: P) =>
  wrap(<Path d="M12 5 V19 M5 12 H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />, size);

export const IconTrash = ({ size = 18, color, strokeWidth = 1.6 }: P) =>
  wrap(
    <>
      <Path
        d="M4 6.5 H20 M9.5 6.5 V4.5 H14.5 V6.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path d="M6 6.5 L7 20 H17 L18 6.5" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </>,
    size,
  );

export const IconArrowRight = ({ size = 18, color, strokeWidth = 1.7 }: P) =>
  wrap(
    <Path
      d="M4 12 H19 M14.5 7.5 L19 12 L14.5 16.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    size,
  );

export const IconRepeat = ({ size = 14, color, strokeWidth = 1.5 }: P) =>
  wrap(
    <Path
      d="M3 9 a6 6 0 0 1 6-6 h6 M13 0.6 L16 3 L13 5.4 M21 15 a6 6 0 0 1-6 6 H9 M11 18.6 L8 21 L11 23.4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    size,
  );
