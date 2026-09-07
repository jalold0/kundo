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

export const IconDownload = ({ size = 20, color, strokeWidth = 1.7 }: P) =>
  wrap(
    <Path
      d="M12 3.5 V14.8 M7.6 10.6 L12 15 L16.4 10.6 M4.5 18.8 H19.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    size,
  );

export const IconUpload = ({ size = 20, color, strokeWidth = 1.7 }: P) =>
  wrap(
    <Path
      d="M12 15.2 V3.9 M7.6 8.3 L12 3.9 L16.4 8.3 M4.5 18.8 H19.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    size,
  );

export const IconTable = ({ size = 20, color, strokeWidth = 1.6 }: P) =>
  wrap(
    <>
      <Rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M3.5 9.5 H20.5 M9.5 9.5 V19.5 M3.5 14.5 H20.5"
        stroke={color}
        strokeWidth={strokeWidth - 0.35}
      />
    </>,
    size,
  );

export const IconShield = ({ size = 20, color, strokeWidth = 1.6 }: P) =>
  wrap(
    <Path
      d="M12 3 L19 5.8 V11.4 C19 15.5 16.2 19.2 12 21 C7.8 19.2 5 15.5 5 11.4 V5.8 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />,
    size,
  );

export const IconHelp = ({ size = 20, color, strokeWidth = 1.6 }: P) =>
  wrap(
    <>
      <Circle cx="12" cy="12" r="8.6" stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M9.5 9.6 A2.6 2.6 0 1 1 12 12.9 V14.2"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Circle cx="12" cy="17" r="0.95" fill={color} />
    </>,
    size,
  );

export const IconMail = ({ size = 20, color, strokeWidth = 1.6 }: P) =>
  wrap(
    <>
      <Rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M4 7.2 L12 13 L20 7.2"
        stroke={color}
        strokeWidth={strokeWidth - 0.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>,
    size,
  );

export const IconTag = ({ size = 20, color, strokeWidth = 1.6 }: P) =>
  wrap(
    <>
      <Path
        d="M12.6 3.5 H19 a1.5 1.5 0 0 1 1.5 1.5 V11.4 L11.4 20.5 a1.5 1.5 0 0 1-2.1 0 L3.5 14.7 a1.5 1.5 0 0 1 0-2.1 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Circle cx="16.4" cy="7.6" r="1.35" fill={color} />
    </>,
    size,
  );
