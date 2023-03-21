import React from 'react';
import styled, { keyframes } from 'styled-components';

const azulCeu = '#14A7D8'
const verdeClaro = "#51b85a"
const begeClaro = "#d57748"

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const dash = keyframes`
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 88, 200;
    stroke-dashoffset: -155;
  }
`;

const SpinnerWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: ${p => p.dim ? `${p.dim}px` : '32px'};
  height: ${p => p.dim ? `${p.dim}px` : '32px'};
`;

const Circle = styled.svg`
  animation: ${spin} 2s linear infinite;
`;

const Path = styled.circle`
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  stroke: ${p => p.color === 'red' ?
    begeClaro : p.color === 'green' ?
      verdeClaro : p.color === 'gray' ?
        '#A7A7A7' : p.color === 'blue' ?
          azulCeu : '#000'
  };
  animation: ${dash} 1.5s ease-in-out infinite;
`;

const Spinner = ({ dim, color }) => {
  return (
    <SpinnerWrapper dim={dim}>
      <Circle viewBox="0 0 64 64">
        <Path cx="32" cy="32" r="25" fill="none" strokeWidth="5" color={color} />
      </Circle>
    </SpinnerWrapper>
  );
};

export default Spinner;
