import { useState } from 'react';
import { Label } from 'recharts';

import styled, { css } from 'styled-components';
import { useFaultsStore } from '../../store/faultsStore';
import { flexboxCenter } from '../../styles/commonStyles';
import InputKeyboard from '../keyboard/InputKeyboard';
import SettingConfirmedMessage from '../userMessages/SettingConfirmedMessage';

import CommentButton from './CommentButton';
import { socket } from '../../adapters/socket';

const FaultsComments = ({ handleClose, faultsIndexNumber, name,attendFaultsNumber }) => {
  const { tgs, ess, handleEsAttendButtonClick, handleEsRecordActionTaken, handleGsAttendButtonClick } = useFaultsStore();
  const { faultsTypes, actionTaken } =
    name === 'tgs' ? tgs : ess;


  const initialInputState = {
    name: null,
    comments: null,
  };

  const [inputData, setInputData] = useState(initialInputState);
  const [focusedInput, setFocusedInput] = useState(null);
  const [activateKeyboard, setActivateKeyboard] = useState(false);
  const [activateMessageBox, setActivateMessageBox] = useState(false);
  const [message, setMessage] = useState(null);

  const faultType = faultsTypes[faultsIndexNumber];
  const faultTypeToSendFormat = (faultType) => {
    switch (faultType) {
      case 'TIMEOUT FAULT':
        return 'timeout_fault';
      case 'HP/LP FAULT':
        return 'hplp_fault';
      case 'THERMOCOUPLE FAILURE':
        return 'thermocouple_fault';
      case 'BMS FAULT':
        return 'bms_fault';
      case 'GROUND FAULT':
        return 'ground_fault';
      case 'SSR FAULT':
        return 'ssr_fault';
      case 'SSR LOAD EXCEED':
        return 'srr_over_current';
      default:
        return '';
    }
  };
  const handleCommentButtonClick = async() => {
    let userName = inputData.name;
    let comments = inputData.comments;
    if (userName && comments) {
      if (name === `tgs`) {
        // 1. dispatch remove attend button clicked
        handleGsAttendButtonClick(null);
        // 2. dispatch to tgs with faultsIndexNumber
        await socket.send(
          JSON.stringify({
            attend: {
              user_name: userName,
              fault_type: faultTypeToSendFormat(faultType),
              action_taken: comments,
              fault_index: 0, //index of fault just in (ssr, tc), other equal 0
            },
          })
        );
      } else {
        // 1. dispatch remove attend button clicked
        handleEsAttendButtonClick(null);
        // 2. dispatch to tes with faultsIndexNumber
        handleEsRecordActionTaken({ faultsIndexNumber, inputData });
        await socket.send(
          JSON.stringify({
            attend: {
              user_name: userName,
              fault_type: faultTypeToSendFormat(faultType),
              action_taken: comments,
              fault_index:
                faultType?.includes('SSR') || faultType?.includes('THERMOCOUPLE')
                  ? attendFaultsNumber
                  : 0, 
            },
          })
        );
      }
      handleClose(false);
    } else {
      if (!userName && !comments) {
        setMessage('please fill the user name input and the action taken input ');
      } else if (!userName) {
        setMessage('please fill the  user name input');
      } else {
        setMessage('please fill the action taken input');
      }
      setActivateMessageBox(true);
    }
  };

  const handleOnChange = (input) => {
    const newInput = { ...inputData };
    newInput[focusedInput] = input;
    setInputData(newInput);
  };

  return (
    <InvisibleWrapper>
      <Wrapper>
        <ContentsWrapper>
          <SectionWrapper>
            <TitleWrapper isLogo={true}>
              <img src={'/static/images/attend-logo.svg'} />
              <ComponentTitle>attend</ComponentTitle>
            </TitleWrapper>
            <InputBoxWrapper>
              <InputTitle>uos user name :</InputTitle>
              <InputUserName
                type='text'
                placeholder='please fill the user name input'
                onClick={() => {
                  setFocusedInput('name');
                  setActivateKeyboard(true);
                }}
                onChange={(event) => handleOnChange(event.target.value)}
                value={inputData.name}
              />
            </InputBoxWrapper>
          </SectionWrapper>

          <SectionWrapper>
            <TitleWrapper>
              <ComponentTitle>fault</ComponentTitle>
            </TitleWrapper>
            <FaultsTypeWrapper>
              <ComponentTitle>{faultsTypes[faultsIndexNumber]}</ComponentTitle>
            </FaultsTypeWrapper>
          </SectionWrapper>

          <SectionWrapper>
            <TitleWrapper>
              <ComponentTitle>action taken</ComponentTitle>
            </TitleWrapper>
            <CommentInput
              placeholder='please leave your actions here..'
              onClick={() => {
                if (inputData.name) {
                  setFocusedInput('comments');
                  setActivateKeyboard(true);
                } else {
                  setMessage('please input user name first');
                  setActivateMessageBox(true);
                }
              }}
              onChange={(event) => handleOnChange(event.target.value)}
              value={inputData.comments}
            />
          </SectionWrapper>

          <ButtonLayoutWrapper>
            <ButtonWrapper>
              <CommentButton
                name='confirm'
                handleButtonClick={handleCommentButtonClick}
              />
            </ButtonWrapper>
          </ButtonLayoutWrapper>
        </ContentsWrapper>
      </Wrapper>
      {activateKeyboard && (
        <KeyboardWrapper position={focusedInput}>
          <InputKeyboard
            closeKeyboard={() => setActivateKeyboard(false)}
            handleOnSubmit={handleOnChange}
          />
        </KeyboardWrapper>
      )}
      {activateMessageBox && (
        <SettingConfirmedMessage
          title='fault - attend'
          message={message}
          onClose={() => {
            setActivateMessageBox(false);
          }}
        />
      )}
    </InvisibleWrapper>
  );
};
export default FaultsComments;

const InvisibleWrapper = styled.div`
  width: 900px;
  height: 600px;
  ${flexboxCenter}
  position: absolute;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 314px;
  height: 312px;

  background: ${props => props.theme.layout.card.bgGradientTransparent};
  box-shadow: inset 0px 1px 1px #ffffff29, 0px 0px 4px #000000;
  border: 0.5px solid ${props => props.theme.layout.sidebar.bg};
  border-radius: 14px;

  ${flexboxCenter}
`;

const ContentsWrapper = styled.div`
  width: 300px;
  height: 297px;
  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 1px 1px #00000029;
  border: 0.5px solid ${props => props.theme.layout.sidebar.bg};
  border-radius: 6px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  padding: 0.2rem;

  position: relative;
`;

const SectionWrapper = styled.div`
  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 4px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem;

  width: 100%;
  &:first-child {
    padding: 0.2rem 0.3rem;
    height: 41px;
  }
  &:nth-child(2) {
    height: 95px;
  }
  &:nth-child(3) {
    height: 95px;
  }
`;

const TitleWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.status.error.text};
  display: flex;
  justify-content: flex-end;

  ${(p) =>
    p.isLogo &&
    css`
      align-items: center;
      justify-content: space-between;
    `}
`;

const ComponentTitle = styled.span`
  font-size: 10px;
  color: ${props => props.theme.label.primary};
`;

const FaultsTypeWrapper = styled.div`
  width: 100%;
  height: 80%;

  display: flex;
  justify-content: center;
  padding-top: 1.5rem;
`;

const InputBoxWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const InputUserName = styled.input`
  width: 183px;
  height: 16px;
  border: 1px solid ${props => props.theme.input.border};
  border-radius: 16px;
  background-color: ${props => props.theme.input.bg};
  text-align: left;
  font-size: 8px;
  padding: 0 0.3rem;
  color: ${props => props.theme.input.text};

  ::placeholder {
    color: ${props => props.theme.input.textPlaceholder};
    text-align: left;
    font-size: 8px;
  }
`;
const InputTitle = styled.span`
  color: ${props => props.theme.label.secondary};
  font-size: 8px;
  text-align: left;
`;

const CommentInput = styled.textarea`
  width: 98%;
  height: 80%;
  font-size: 10px;
  color: ${props => props.theme.input.text};
  padding: 0.3rem 1rem;
  font-size: 10px;
  text-align: left;

  background: transparent;
  resize: none;
  ::placeholder {
    font-size: 10px;
    color: ${props => props.theme.input.textPlaceholder};
    text-align: left;
  }
`;

const ButtonLayoutWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
const ButtonWrapper = styled.div`
  width: 74px;
  height: 27px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 18px;

  ${flexboxCenter}
`;

const KeyboardWrapper = styled.div`
  position: absolute;
  bottom: -3.5rem;
  ${(p) =>
    p.position === 'name' &&
    css`
      bottom: 8rem;
    `}
`;
