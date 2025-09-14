import * as React from "react";

type FynliSVGProps = React.SVGProps<SVGSVGElement>;

export function FynliSVG(props: FynliSVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props} // permite sobrescrever width, height, className, etc
    >
      <path
        d="M11.5466 13.6521H13.5466C14.0771 13.6521 14.5858 13.4414 14.9608 13.0663C15.3359 12.6912 15.5466 12.1825 15.5466 11.6521C15.5466 11.1217 15.3359 10.613 14.9608 10.2379C14.5858 9.86281 14.0771 9.6521 13.5466 9.6521H10.5466C9.94663 9.6521 9.44663 9.8521 9.14663 10.2521L1.54663 17.1521"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.54663 19.6521L9.14663 18.2521C9.44663 17.8521 9.94663 17.6521 10.5466 17.6521H14.5466C15.6466 17.6521 16.6466 17.2521 17.3466 16.4521L21.9466 12.0521C22.3325 11.6875 22.5577 11.1844 22.5727 10.6537C22.5877 10.123 22.3913 9.60802 22.0266 9.22213C21.662 8.83624 21.1589 8.61102 20.6282 8.59602C20.0975 8.58101 19.5825 8.77745 19.1966 9.14213L14.9966 13.0421"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.04656 16.152L6.98299 19.7388C7.17717 19.9195 7.29164 20.1698 7.30122 20.4349C7.31079 20.6999 7.21468 20.9579 7.03404 21.1521L6.04663 22.1521"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.29889 3.97652L7.10904 8.70241L3.32833 6.95054L2.01442 9.78607"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.9196 5.51051C19.1056 5.41958 19.1843 5.1937 19.0753 5.01781C18.6195 4.28235 17.9233 3.72715 17.1049 3.44633C16.2865 3.16551 15.3961 3.17636 14.5848 3.47703C14.3904 3.5491 14.3141 3.7755 14.405 3.96146L15.7228 6.65657C15.7664 6.74592 15.8438 6.81425 15.9379 6.84654C16.032 6.87883 16.135 6.87242 16.2244 6.82874L18.9196 5.51051Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5974 6.74772C19.6309 7.35935 19.5478 8.00867 19.2908 8.56471C19.0338 9.12075 18.6446 9.60538 18.157 9.97622C17.6695 10.3471 16.6511 11.5529 16.0466 11.6521C15.4422 11.7513 15.1271 10.1718 14.5466 9.97622C13.9661 9.78067 13.5853 10.015 13.1641 9.57026C12.7429 9.12553 12.437 8.58439 12.2732 7.99414C12.1095 7.40389 12.0928 6.78251 12.2247 6.18432C12.3565 5.58613 12.6329 5.02936 13.0296 4.56266"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
