import styled from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles';

/**
 * SystemBasicsForm Component
 * Handles civic address input and number of switches input
 */
const SystemBasicsForm = ({
  inputData,
  isEditable,
  handleOnChange,
  setActivateKeyboard,
  setKeyboardPosition,
  setFocusedName,
  displayInfo,
}) => {
  return (
    <>
      {/* Civic Address Input */}
      <Section isSectionOne={true}>
        <TitleWrapper>
          <Title>civic address</Title>
        </TitleWrapper>
        <ContentInput
          isCivicAddress={true}
          type="text"
          value={inputData.civicAddress}
          placeholder="tap to type"
          readOnly={!isEditable[0] && !isEditable[1]}
          onChange={(e) => handleOnChange(e.target.value, 'civicAddress')}
          onClick={() => {
            (isEditable[0] || isEditable[1]) && setActivateKeyboard(true);
            setKeyboardPosition(0);
            setFocusedName('civicAddress');
          }}
        />
      </Section>

      {/* Number of Switches Input */}
      <Section isSectionOne={true}>
        <TitleWrapper isNumOfSwitches={true}>
          <Title># of switches</Title>
        </TitleWrapper>
        <div>
          <ContentInput
            isNumOfSwitches={true}
            type="number"
            value={inputData.numOfSwitches}
            placeholder="0"
            readOnly={!isEditable[0]}
            onChange={(e) => handleOnChange(e.target.value, 'numOfSwitches')}
            onClick={() => {
              isEditable[0] && setActivateKeyboard(true);
              setKeyboardPosition(1);
              setFocusedName('numOfSwitches');
            }}
          />
          <DisplayBox isDisplayed={displayInfo ? true : false}>
            {displayInfo}
          </DisplayBox>
        </div>
      </Section>
    </>
  );
};

export default SystemBasicsForm;

// Styled Components
const Section = styled.div`
  width: 539px;
  ${(p) =>
    p.isSectionOne &&
    `
      position: relative;
      margin-top: 8px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    `}
`;

const TitleWrapper = styled.div`
  width: 59px;
  height: 20px;
  ${(p) =>
    p.isNumOfSwitches &&
    `
      width: 77px;
      height: 22px;
      margin-left: 9px;
    `}
  ${flexboxCenter}
`;

const Title = styled.span`
  font-size: 9px;
  letter-spacing: 0.9px;
`;

const ContentInput = styled.input`
  width: 194px;
  height: 20px;
  padding-left: 7px;

  font-size: 9px;
  letter-spacing: 0.9px;
  color: ${(props) => props.theme.label.primary};

  background: ${(props) => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border: none;
  border-radius: 12px;

  ${(p) =>
    p.isCivicAddress &&
    `
      margin-left: 4px;
      width: 446px;
    `}

  ${(p) =>
    p.isNumOfSwitches &&
    `
      width: 65px;
      margin-left: 5px;
    `}

  &::placeholder {
    color: ${(props) => props.theme.label.disabled};
  }

  &:focus {
    outline: none;
  }

  &:read-only {
    cursor: default;
  }
`;

const DisplayBox = styled.div`
  display: ${(p) => (p.isDisplayed ? 'inline' : 'none')};
  width: 368px;
  min-height: 15px;
  margin-left: 9px;
  padding: 2px;
  padding-left: 5px;

  font-size: 8px;
  letter-spacing: 0.8px;
  overflow-wrap: break-word;
  word-wrap: break-word;

  color: ${(props) => props.theme.label.primary};
  background: ${(props) => props.theme.background.list[31]};
  border-radius: 12px;
`;
