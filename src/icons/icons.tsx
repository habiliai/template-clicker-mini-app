interface IconProps {
  size?: number;
  className?: string;
}

export const Arrow = ({ size = 24, className = '' }: IconProps) => {
  const svgSize = `${size}px`;

  return (
    <svg
      className={className}
      height={svgSize}
      width={svgSize}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M5.29289,3.70711 C4.90237,3.31658 4.90237,2.68342 5.29289,2.29289 C5.68342,1.90237 6.31658,1.90237 6.70711,2.29289 L11.7071,7.29289 C12.0976,7.68342 12.0976,8.31658 11.7071,8.70711 L6.70711,13.7071 C6.31658,14.0976 5.68342,14.0976 5.29289,13.7071 C4.90237,13.3166 4.90237,12.6834 5.29289,12.2929 L9.58579,8 L5.29289,3.70711 Z"
        ></path>{' '}
      </g>
    </svg>
  );
};

export const Time = ({ size = 24, className = '' }: IconProps) => {
  const svgSize = `${size}px`;

  return (
    <svg
      className={className}
      height={svgSize}
      width={svgSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {' '}
        <path
          d="M12 8V12L15 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>{' '}
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2"
        ></circle>{' '}
      </g>
    </svg>
  );
};

export const LoadingCircle = ({
  width,
  height,
  color = '#7439C6',
}: {
  color?: string;
  width?: string;
  height?: string;
}) => {
  return (
    <svg
      className="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      width={width || 16}
      height={height || 16}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M15.4375 8.5625C15.1266 8.5625 14.875 8.31094 14.875 8C14.875 7.07188 14.6938 6.17188 14.3344 5.32344C13.9887 4.50665 13.4884 3.76439 12.8609 3.1375C12.2347 2.50925 11.4923 2.0088 10.675 1.66406C9.82813 1.30625 8.92813 1.125 8 1.125C7.68906 1.125 7.4375 0.873438 7.4375 0.5625C7.4375 0.251563 7.68906 0 8 0C9.07969 0 10.1281 0.210938 11.1141 0.629687C12.0672 1.03125 12.9219 1.60938 13.6563 2.34375C14.3906 3.07812 14.9672 3.93438 15.3703 4.88594C15.7875 5.87188 15.9984 6.92031 15.9984 8C16 8.31094 15.7484 8.5625 15.4375 8.5625Z"
        fill={color}
      />
    </svg>
  );
};
