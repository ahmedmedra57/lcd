import styled, { css } from 'styled-components';
import {
  flexboxCenter,
  justifyContentSpaceAround,
} from '../../../../styles/commonStyles';
import { useRef } from 'react';
import { isDisabled } from '@testing-library/user-event/dist/utils';
import { useState } from 'react';

const SysIdRadioBox = ({
  data,
  isChecked,
  selectHandler,
  // name,
  switchIdx,
  height,
  margin,
  isInput,
  inputRef,
  isHeatingSys,
}) => {
  const isDisabled = data === 'hp' || data === 'ate';

  return (
    <Wrapper
      onClick={() => selectHandler(data)}
      // width={name}
      height={height}
      isDisabled={isDisabled}
    >
      <OptionChecker margin={margin} isDisabled={isDisabled}>
        {isHeatingSys ? (
          <CheckedCircle
            isChecked={!isDisabled && isChecked?.includes(data?.toLowerCase())}
          ></CheckedCircle>
        ) : (
          <CheckedCircle
            isChecked={
              !isDisabled && isChecked?.toLowerCase() === data?.toLowerCase()
            }
          ></CheckedCircle>
        )}
      </OptionChecker>

      {isInput ? (
        <Input placeholder='---' ref={inputRef} />
      ) : (
        <Label>{data}</Label>
      )}
    </Wrapper>
  );
};
export default SysIdRadioBox;

const Wrapper = styled.li`
  width: 98%;
  ${({ height }) =>
    css`
      height: ${height}px;
    `}

  ${({ isDisabled }) =>
    isDisabled
      ? css`
          border: 1px solid ${props => props.theme.label.muted};
        `
      : css`
          border: 1px solid ${props => props.theme.button.primary.text};
        `}

  border-radius: 14px;
  ${justifyContentSpaceAround}
`;
const OptionChecker = styled.div`
  ${flexboxCenter}

  height: 10px;
  width: 10px;
  ${({ margin }) =>
    css`
      margin-left: ${margin}px;
    `}

  ${({ isDisabled }) =>
    isDisabled
      ? css`
          border: 1px solid ${props => props.theme.label.muted};
        `
      : css`
          border: 1px solid ${props => props.theme.status.error.border};
        `}

  border-radius: 50%;
`;
const CheckedCircle = styled.div`
  border-radius: 50%;
  height: 6px;
  width: 6px;
  ${(p) =>
    p.isChecked &&
    css`
      background: ${props => props.theme.label.success};
    `}
`;

const Input = styled.input`
  width: 80%;
  font-size: 8px;
  text-align: center;
  background: transparent;
  /* &::placeholder {
    color: ${props => props.theme.layout.container.bg};
  } */
`;

const Label = styled.span`
  cursor: pointer;
  text-transform: uppercase;
  font-size: 8px;
  text-align: center;
  width: 100%;
`;
