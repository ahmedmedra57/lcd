import styled, { css } from 'styled-components';
import {
  flexboxCenter,
  justifyContentSpaceAround,
} from '../../../../../styles/commonStyles';
import { useEffect } from 'react';
import { useState } from 'react';

const SelectBox = ({
  select,
  data,
  handleAssignButton,
  setSelect,
  handleSelectBox,
}) => {
  const [dataList, setDataList] = useState([]);
    const mode = JSON.parse(localStorage.getItem("themeMode"));

  useEffect(() => {
    // format the UOS names depending on the data received from backend.
    if (data) {

      setDataList(data);
    }
  }, [data]);
if(!dataList) return;
  return (
    <Wrapper>
      <FlexWrapper>
        <Display>
          <Text>{select?.select?.selected_device_name||""}</Text>
        </Display>
        <Icon src={mode? 'static/images/arrow-down_light.svg':'static/images/arrow-down.svg'} onClick={handleSelectBox} />
      </FlexWrapper>
      <ListWrapper>
        <List>
            {dataList?.map((device, deviceIndex) => {
              return (
                <IndivSelectionWrapper
                  key={deviceIndex}
                  onClick={() =>
                    setSelect({
                      deviceIndex,
                      select: device,
                    })
                  }
                >
                  <OuterCircle>
                    <InnerCircle
                      isSelected={
                        device?.selected_device_id === select?.select?.selected_device_id||false /* &&
                        locationIdx === select?.locationIdx */
                      }
                    ></InnerCircle>
                  </OuterCircle>
                  <IndivSelection>
                    <Text>{device.selected_device_name}</Text>
                  </IndivSelection>
                </IndivSelectionWrapper>
              );
          })}
        </List>
      </ListWrapper>
      <ButtonWrapper>
        <Button onClick={() => handleAssignButton(select)}>
          <ButtonIndent>
            <ButtonTop>assign</ButtonTop>
          </ButtonIndent>
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default SelectBox;

const Wrapper = styled.div`
  width: 364px;
  height: 144px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 11px 11px 14px 14px;

  ${justifyContentSpaceAround}
  flex-direction: column;
`;

const FlexWrapper = styled.div`
  width: 100%;
  margin-top: -1px;
  margin-left: 1px;
  ${justifyContentSpaceAround};
`;

const Display = styled.div`
  width: 341px;
  height: 18px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 10px;
  ${flexboxCenter}
`;

const Text = styled.div`
  width: 96%;

  font-size: 8px;
  letter-spacing: 0.8px;

  text-align: center;
  white-space: nowrap;

  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const Icon = styled.img`
  cursor: pointer;
  margin-top: 2px;
  margin-right: 1px;
`;

const ListWrapper = styled.div`
  width: 360px;
  height: 82px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 13px 8px 8px 13px;

  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const List = styled.ul`
  width: 356px;
  max-height: 78px;
  min-height: 60px;
  padding: 2px;

  background: transparent;
  border-radius: 13px 8px 8px 13px;

  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    width: 10px;
    border: 1px solid ${props => props.theme.layout.card.border};
    border-radius: 13px;
  }
  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.label.primary};
    border-radius: 13px;
    border: 1.5px solid ${props => props.theme.label.success};
    background-clip: padding-box;
    height: 60%;
  }

  ::-webkit-scrollbar-button:start:decrement {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background: url('/static/images/scrollbar-button-start.svg');
  }
  ::-webkit-scrollbar-button:end:increment {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background: url('/static/images/scrollbar-button-end.svg');
  }

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2px;
  flex-direction: column;
`;

const IndivSelectionWrapper = styled.li`
  width: 340px;
  height: 24px;

  border: 1px solid ${props => props.theme.layout.card.border};
  border-radius: 12px;

  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const IndivSelection = styled.li`
  max-width: 317px;
  margin-left: 2px;

  text-overflow: clip;
  font-size: 8px;
  letter-spacing: 0.8px;
  color: ${props => props.theme.label.primary};
`;

const OuterCircle = styled.div`
  min-width: 18px;
  height: 18px;
  margin-left: 1px;
  margin-right: 2px;

  border-radius: 50%;

  border: 1px solid ${props => props.theme.layout.card.border};

  ${flexboxCenter}
`;

const InnerCircle = styled.div`
  width: 12px;
  height: 12px;

  ${({ isSelected }) =>
    isSelected &&
    css`
      border-radius: 50%;
      background-color: ${props => props.theme.label.success};
    `}
`;

const ButtonWrapper = styled.div`
  width: 360px;
  height: 24px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 27px;

  ${flexboxCenter}
`;

const Button = styled.button`
  width: 358px;
  height: 22px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 25px;

  ${flexboxCenter}
`;

const ButtonIndent = styled.div`
  width: 352px;
  height: 16px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 20px;

  ${flexboxCenter}
`;

const ButtonTop = styled.div`
  width: 350px;
  height: 14px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 25px;

  font-size: 8px;
  letter-spacing: 0.8px;
  color: ${props => props.theme.label.primary};
`;
