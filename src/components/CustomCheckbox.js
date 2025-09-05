import React from 'react';
import styled from 'styled-components';

const CustomCheckbox = ({ id, checked, onChange, className = "" }) => {
  return (
    <StyledWrapper className={className}>
      <div className="container">
        <input 
          type="checkbox" 
          id={id}
          checked={checked}
          onChange={onChange}
          style={{display: 'none'}} 
        />
        <label htmlFor={id} className="check">
          <svg width="24px" height="24px" viewBox="0 0 18 18">
            <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z" />
            <polyline points="1 9 7 14 15 4" />
          </svg>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Variation of work by @mrhyddenn for Radios */

  .check {
    cursor: pointer;
    position: relative;
    margin: auto;
    width: 24px;
    height: 24px;
    -webkit-tap-highlight-color: transparent;
    transform: translate3d(0, 0, 0);
  }

  .check:before {
    content: "";
    position: absolute;
    top: -18px;
    left: -18px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(34, 50, 84, 0.03);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .check svg {
    position: relative;
    z-index: 1;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: #c8ccd4;
    stroke-width: 1.3;
    transform: translate3d(0, 0, 0);
    transition: all 0.2s ease;
  }

  .check svg path {
    stroke-dasharray: 60;
    stroke-dashoffset: 0;
  }

  .check svg polyline {
    stroke-dasharray: 22;
    stroke-dashoffset: 66;
  }

  .check:hover:before {
    opacity: 1;
  }

  .check:hover svg {
    stroke: #3b82f6;
  }

  input:checked + .check svg {
    stroke: #3b82f6;
  }

  input:checked + .check svg path {
    stroke-dashoffset: 60;
    transition: all 0.3s linear;
  }

  input:checked + .check svg polyline {
    stroke-dashoffset: 42;
    transition: all 0.2s linear;
    transition-delay: 0.15s;
  }
`;

export default CustomCheckbox;
