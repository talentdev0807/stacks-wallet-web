import { Box, BoxProps } from '@stacks/ui';
import { keyframes } from '@emotion/react';

const shine = keyframes`
  0% {
    background-position: -50px;
  }
  100% {
    background-position: 500px;
  }
`;
export const LoadingRectangle = (props: BoxProps) => {
  return (
    <Box
      backgroundImage="linear-gradient(90deg, rgba(219,219,219,1) 0%, rgba(192,192,247,0.5) 35%, rgba(219,219,219,1) 100%)"
      backgroundColor="rgb(219,219,219)"
      animation={`${shine} 5s infinite linear`}
      {...props}
    />
  );
};
