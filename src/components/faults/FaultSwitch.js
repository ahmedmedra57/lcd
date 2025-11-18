import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  handleDisplayForceMessageBox,
  handleDisplayForceSelectionBox,
  handleEsAttendButtonClick,
  handleEsFaultsReset,
  handleForceButtonClick,
  handleGsAttendButtonClick,
  handleGsFaultsReset,
  selectFaults,
  setReceivedThermocoupleSetting,
} from '../../store/slices/faultsSlice';

import { flexboxCenter } from '../../styles/commonStyles';
import styled, { css } from 'styled-components';

import SettingConfirmedMessage from '../userMessages/SettingConfirmedMessage';
import ExpandButton from './ExpandButton';
import FaultsComments from './FaultsComments';
import FaultsDetails from './FaultsDetails';
import SelectForce from './SelectForce';
import { resetFault } from '../../helpers/helpers';
import messages from '../../helpers/faultsMessages.json';
const faultsMessages = messages.data;

const FaultSwitch = ({
  title,
  number,
  name,
  message,
  comments,
  isTesSwitch,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayCommentBox, setDisplayCommentBox] = useState(false);
  const [faultsIndexNumber, setFaultsIndexNumber] = useState(null);
  const [selectedTcNo,setSelectedTcNo]=useState(null)
  const faultsState = useSelector(selectFaults);
  const { receivedThermocoupleSetting } = faultsState;
  const { displayForceSelectionBox, displayForceMessageBox } = faultsState.ess;
  const [attendFaultsNumber,setAttendFaultsNumber]=useState(null);
  const isFaults = message.length > 0;
  const mode = JSON.parse(localStorage.getItem("themeMode"));
  const dispatch = useDispatch();
  const imgSrcNormal = isTesSwitch
    ? name === 'ess'
      ? '/static/images/fault-ess-normal.svg'
      : name === 'tgs'
      ? '/static/images/fault-tgs-normal.svg'
      : '/static/images/fault-tes-normal.svg'
    : '/static/images/fault-without-tes.svg';

  const imgSrcActivated =
    name === 'ess'
      ? '/static/images/fault-ess-activated.svg'
      : name === 'tgs'
      ? '/static/images/fault-tgs-activated.svg'
      : '/static/images/fault-tes-activated.svg';

  const handleDisplayFaults = () => {
    if (isFaults) {
      if (isExpanded) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    }
  };
  const faultsKeys = {
    ssr_fault: "ssr_reset",
    srr_over_current: "Load_exceeded_reset",
    thermocouple_fault: "thermocouple_reset",
  };
  const faultsKeysNumbers = {
    ssr_fault: "ssr_no",
    srr_over_current: "ssr_no",
    thermocouple_fault: "tc_no",
  };
  const faultKey = (faultMessage) => {
    let faultItem = [];
    Object.values(faultsMessages).forEach((item) => {
      if (item.includes(faultMessage)) {
        faultItem.push(item);
      }
    });
    const objectKey = Object.keys(faultsMessages).find(
      (key) => faultsMessages[key] === faultItem[0]
    );
    return {
      faultsKeys: faultsKeys[objectKey],
      noKey: faultsKeysNumbers[objectKey],
    };
  };
  
  function getFirstDigit(str) {
    const index = str.search(/[0-9]/);
  
    return Number(str[index]);
  }
  
  const handleButtonClick = (switchName, buttonName, column, faultsTypeIdx, setResetBtnActivated) => {
    const faultMessageArray = message[column].split(' ');
    let faultNumber = getFirstDigit(message[column]) || 0;
    if (buttonName === 'attend') {
      // display comment box
      if (switchName === 'tgs') {
        dispatch(handleGsAttendButtonClick(faultsTypeIdx));
      } else {
        dispatch(handleEsAttendButtonClick(faultsTypeIdx));
      }
      setAttendFaultsNumber(faultNumber-1)
      setFaultsIndexNumber(faultsTypeIdx);
      setDisplayCommentBox(true);
    } else if (buttonName === 'force') {
      // 1. make the button click state true for the styling
      dispatch(handleForceButtonClick(true));
      setSelectedTcNo(faultNumber)
      // 2. display select force box
      dispatch(handleDisplayForceSelectionBox(true));
    } else {
      // buttonName === 'reset'
      // 1. send to reset to backend
      // 2. remove all the faults in the faults slice    
      setResetBtnActivated(true)  
      if (switchName === 'tes'||switchName === 'ess') {
        dispatch(handleEsFaultsReset(column));
        resetFault('electrical_command', {
          [faultKey(faultMessageArray[0] + " " + faultMessageArray[1]).noKey]:
            faultNumber - 1,
          [faultKey(faultMessageArray[0] + " " + faultMessageArray[1])
            .faultsKeys]: 0,
        });

        if ((faultMessageArray[0] + " " + faultMessageArray[1]) === 'THERMOCOUPLE FAILURE') {
          dispatch(setReceivedThermocoupleSetting(faultNumber - 1));
        }
      } else {
        // switchName === 'tgs'
        dispatch(handleGsFaultsReset(column));
        if ((faultMessageArray[0] + " " + faultMessageArray[1]) === 'THERMOCOUPLE FAILURE') {
          resetFault('gas_command', { thermocouple_fault_reset: 0 });
        } else {
          resetFault('gas_command', { fault_reset: 1 });}
      }
    }
  };

  return (
    <Wrapper isExpanded={isExpanded}>
      <ItemInnerHole isFaults={isFaults} isExpanded={isExpanded}>
        <MainWrapper>
          <ItemTop isTesSwitch={isTesSwitch}>
            <LogoAndTitleWrapper>
              <SwitchLogo isFaults={isFaults} isTesSwitch={isTesSwitch}>
                <img src={isExpanded ? imgSrcActivated : imgSrcNormal} />
              </SwitchLogo>
              <Title isFaults={isFaults}>{title}</Title>
              <Divider isFaults={isFaults} name={name}></Divider>
            </LogoAndTitleWrapper>
            <DisplayAndButtonWrapper>
              <DisplayFaults isTesSwitch={isTesSwitch}>
                <FaultsDetailsNumber isFaults={isFaults}>
                  {number ? number : 0}
                </FaultsDetailsNumber>
                <FaultsDetailsTitle isFaults={isFaults}>
                  faults
                </FaultsDetailsTitle>
                <FaultsLogo isFaults={isFaults} isTesSwitch={isTesSwitch}>
                  <img
                    src={
                      isTesSwitch
                        ? isFaults
                          ? '/static/images/fault-alarm-fault.svg'
                          : '/static/images/fault-alarm-normal.svg'
                        : `/static/images/fault-alarm-without-tes.svg`
                    } alt=""
                  />
                </FaultsLogo>
              </DisplayFaults>

              <ExpandButton
                handleOnClick={handleDisplayFaults}
                isExpanded={isExpanded}
                name={isExpanded ? 'close' : 'expand'}
                isTesSwitch={isTesSwitch}
              />
            </DisplayAndButtonWrapper>
          </ItemTop>
        </MainWrapper>
        {isExpanded && (
          <DetailWrapper>
            <DetailInnerWrapper>
              <DetailInnerTop>
                {message.map((msg, index) => (
                  <FaultsDetails
                    name={name}
                    key={msg+name}
                    column={index}
                    handleButtonClick={handleButtonClick}
                    faultContents={msg}
                  />
                ))}
              </DetailInnerTop>
            </DetailInnerWrapper>
          </DetailWrapper>
        )}
      </ItemInnerHole>
      {displayCommentBox && (
        <FaultsComments
          handleClose={() => {
            setDisplayCommentBox(false);
          }}
          faultsIndexNumber={faultsIndexNumber}
          name={name}
          attendFaultsNumber={attendFaultsNumber}
        />
      )}
      {displayForceSelectionBox && (
        <SelectForce
          title='thermocouple failure'
          handleClose={() => dispatch(handleDisplayForceSelectionBox(false))}
          handleAlertMessageBox={() =>
            dispatch(handleDisplayForceMessageBox(true))
          }
          selectedTcNo={selectedTcNo}
        />
      )}
      {displayForceMessageBox && (
        <SettingConfirmedMessage
          onClose={() => dispatch(handleDisplayForceMessageBox(false))}
          title='thermocouple failure'
          alert={true}
          src={'/static/images/heater-off-alert.svg'}
          message='SYSTEM OFF UNTIL RELEASE FAULT OR BY forcing the SYSTEM.'
        />
      )}
    </Wrapper>
  );
};
export default FaultSwitch;

const Wrapper = styled.div`
  width: 901px;
  ${(p) =>
    p.isExpanded
      ? css`
          height: none;
        `
      : css`
          height: 80px;
        `}
  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 4px #000000;
  border: 1px solid ${props => props.theme.layout.sidebar.bg};
  border-radius: 41px;

  ${flexboxCenter}
  margin-top: 0.5rem;

  ${(p) =>
    p.isExpanded &&
    css`
      padding-top: 0.25rem;
    `}
`;
const ItemInnerHole = styled.div`
  width: 895px;
  ${(p) =>
    p.isExpanded
      ? css`
          height: none;
        `
      : css`
          height: 76px;
        `}

  background: ${props => props.theme.layout.sidebar.bgDark};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 38px;

  ${flexboxCenter}
  flex-direction:column;

  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid ${props => props.theme.status.error.border};
    `}
`;
const ItemTop = styled.div`
  width: 887px;
  height: 70px;
  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 1px 2px #ffffff29, 0px 0px 2px #000000;
  border: 1px solid ${props => props.theme.layout.sidebar.bg};
  border-radius: 36px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 0.8rem 0rem 0.3rem;

  ${(p) =>
    p.isTesSwitch ||
    css`
      background: ${props => props.theme.button.secondary.bgGradient};
      box-shadow: inset 0px 1px 2px #ffffff29, 0px 0px 2px #000000;
      border: 1px solid ${props => props.theme.layout.card.border};
    `}
`;

const LogoAndTitleWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 59%;
`;

const SwitchLogo = styled.div`
  width: 61px;
  height: 61px;
  background: ${props => props.theme.layout.sidebar.bgDark};
  box-shadow: inset 0px 0px 6px #000000;
  border: 2px solid ${props => props.theme.layout.sidebar.bg};

  border-radius: 50%;
  ${flexboxCenter}
  margin-right: 1.75rem;
  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid ${props => props.theme.status.error.border};
    `}

  ${(p) =>
    p.isTesSwitch ||
    css`
      background: ${props => props.theme.input.disabled} 0% 0% no-repeat padding-box;
      box-shadow: inset 0px 0px 6px #000000;
      border: 0.5px solid ${props => props.theme.layout.card.border};
    `}
`;

const Title = styled.span`
  font-size: 12px;

  margin-right: 6px;
  letter-spacing: 1.2px;

  ${(p) =>
    p.isFaults &&
    css`
      color: ${props => props.theme.status.error.text};
    `}
`;
const Divider = styled.div`
  border: 1px solid ${props => props.theme.label.primary};

  ${(p) =>
    p.name === 'ess'
      ? css`
          width: 149px;
        `
      : p.name === 'tgs'
      ? css`
          width: 200px;
        `
      : css`
          width: 154px;
        `}
  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid ${props => props.theme.status.error.border};
    `}
`;

const DisplayAndButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 45%;
`;

const DisplayFaults = styled.div`
  width: 282px;
  height: 62px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border: 1px solid ${props => props.theme.layout.sidebar.bg};
  border-radius: 31px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 0.2rem;
  padding-left: 2rem;

  ${(p) =>
    p.isTesSwitch ||
    css`
      background: ${props => props.theme.button.secondary.bg} 0% 0% no-repeat padding-box;
      box-shadow: inset 0px 0px 6px #000000;
      border: 2px solid ${props => props.theme.button.secondary.bg};
    `}
`;

const FaultsDetailsNumber = styled.span`
  font-size: 48px;
  ${(p) =>
    p.isFaults
      ? css`
          color: ${props => props.theme.status.error.border};
        `
      : css`
          color: ${props => props.theme.label.secondary};
        `}
`;
const FaultsDetailsTitle = styled.span`
  text-align: center;
  width: 80%;
  font-size: 12px;

  ${(p) =>
    p.isFaults &&
    css`
      color: ${props => props.theme.status.error.text};
    `}
`;
const FaultsLogo = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.theme.chart.background} 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 6px #000000;
  border: 2px solid ${props => props.theme.layout.card.border};
  opacity: 1;

  ${flexboxCenter}

  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid ${props => props.theme.status.error.border};
    `}

    ${(p) =>
    p.isTesSwitch ||
    css`
      background: ${props => props.theme.button.secondary.bg} 0% 0% no-repeat padding-box;
      box-shadow: inset 0px 0px 6px #000000;
      border: 2px solid ${props => props.theme.button.secondary.bg};
    `}
`;

const MainWrapper = styled.div``;
const DetailWrapper = styled.div`
  margin-top: 0.5rem;
  padding: 0.3rem 0;
  width: 882px;
  margin-bottom: 0.4rem;
  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  border: 1px solid ${props => props.theme.layout.card.border};
  border-radius: 14px 14px 32px 32px;

  ${flexboxCenter}
`;
const DetailInnerWrapper = styled.div`
  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border: 0.5px solid ${props => props.theme.layout.card.border};
  border-radius: 16px 16px 34px 34px;

  ${flexboxCenter}
  margin-bottom: 1.2rem;
`;

const DetailInnerTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;

  width: 869px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 9px;
`;
