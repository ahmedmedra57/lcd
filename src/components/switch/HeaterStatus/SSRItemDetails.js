import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { selectSettingsOfEss } from '../../../store/slices/settingsOfEssSlice';
import { selectTgsSwitch } from '../../../store/slices/tgsSwitchSlice';

import {
  flexboxCenter,
  ItemBackground,
  ItemBackgroundDisable,
} from '../../../styles/commonStyles';

import SettingButton from './SettingButton';

const SSRItemDetails = ({
  isEnable,
  isFault,
  option,
  id,
  data,
  isSettingOpen,
  setIsSettingOpen,
  handleButtonClick,
  openPasswordBox,
  overAmp,
}) => {
  const unitsState = useSelector(selectSettingsOfEss);
  const { unitsMeasurement } = unitsState.buttonsOfSettings;

  const systemData = useSelector(selectTgsSwitch);
  const { electricalInfo } = systemData;

  const ssrCurrent = useMemo(() => {
    return electricalInfo?.ssr_current || [];
  }, [electricalInfo]);

  // For mapping
  const { specs } = data;

  const isWarn = data?.warn === 1 ? true : false;

  return (
    <Wrapper>
      <ContentWrapper isEnable={isEnable} isFault={isFault} overAmp={overAmp} isWarn={isWarn}>
        {specs?.map((spec, index) => (
          <ItemWrapper column={index} hiddenNumber={specs.length} key={index}>
            <ItemCurrentWrapper>
              <ItemCurrent isEnable={isEnable}>
                <ItemData isDefault={true} isEnable={isEnable}>
                  {spec.current} t
                </ItemData>
              </ItemCurrent>

              <ItemCurrent isEnable={isEnable}>
                <ItemData isEnable={isEnable}>{ssrCurrent[id - 1]} a</ItemData>
              </ItemCurrent>
            </ItemCurrentWrapper>

            <ItemWattage isEnable={isEnable}>
              <ItemData isEnable={isEnable}>{spec.wattage}</ItemData>
            </ItemWattage>

            <ItemVoltage isEnable={isEnable}>
              <ItemData isEnable={isEnable}>{spec.voltage}</ItemData>
            </ItemVoltage>

            <ItemLength isEnable={isEnable}>
              {unitsMeasurement ? (
                <ItemData isEnable={isEnable}>{spec.lengths}</ItemData>
              ) : (
                <ItemData isEnable={isEnable}>
                  {!isNaN((Number(spec.lengths) / 3.28048).toFixed(1)) && (Number(spec.lengths) / 3.28048).toFixed(1)}
                </ItemData>
              )}
            </ItemLength>

            <DescriptionAndButtonWrapper>
              <ItemDescription isEnable={isEnable}>
                {spec.elementName ? (
                  <ItemData isDescription={true} isEnable={isEnable} >
                    {`${spec.elementName} - ${spec.partNumber}`}
                    <br></br>
                    {`${spec.current} A / ${spec.wattage} W / ${
                      spec.voltage} v / ${(Number(spec.lengths) / 3.28048).toFixed(1)} m - ${
                      spec.lengths
                    } ft`}
                  </ItemData>
                ) : (
                  <ItemData isDescription={true} isEnable={isEnable}>
                    -----------------------------
                  </ItemData>
                  
                )}
              </ItemDescription>

              <SettingButton
                isSettingOpen={isSettingOpen}
                setIsSettingOpen={setIsSettingOpen}
                handleButtonClick={handleButtonClick}
                id={option}
                column={index + 1}
                openPasswordBox={openPasswordBox}

                // when ssr status is fault button will be disable
              />
            </DescriptionAndButtonWrapper>
          </ItemWrapper>
          
        ))}
      </ContentWrapper>
    </Wrapper>
  );
};
export default SSRItemDetails;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
const ContentWrapper = styled.ul`
  width: 692px;
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.2rem;
  padding: 0.2rem;
  border-radius: 12px;
  border: 0.5px solid ${({ theme }) => theme.layout.card.bg};
  ${(p) =>
    p.isEnable
      ? css`
          background: ${({ theme }) => theme.layout.main.bgGradientVertical} 0% 0% no-repeat
            padding-box;
          box-shadow: ${({ theme }) => theme.layout.card.shadow};
        `
      : css`
          background: ${({ theme }) => theme.layout.card.bgGradient};
          box-shadow: ${({ theme }) => theme.layout.card.shadow};
        `}

  border: ${({ theme, isWarn }) => isWarn && `1px solid ${theme.status.warning.text}`};
  border: ${({ theme, isFault }) => isFault ? `1px solid ${theme.label.error}` : ''};
  border: ${({ theme, overAmp }) => overAmp && `1px solid ${theme.status.warning.text}`};
`;

const ItemWrapper = styled.div`
  ${flexboxCenter}
  justify-content: space-between;
  padding: 0 0.1rem;

  &:first-child {
    ${(p) =>
      p.hiddenNumber !== 1 &&
      css`
        margin-bottom: 0rem;
      `}
  }
  &:nth-child(2) {
    margin-bottom: 0rem;
  }
`;

const ItemCurrentWrapper = styled.div`
  display: flex;
  width: 91px;
  justify-content: space-between;
`;

const ItemCurrent = styled.li`
  ${flexboxCenter}

  width: 44px;
  height: 100%;
  ${ItemBackground}

  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;
const ItemWattage = styled.li`
  ${flexboxCenter}
  width: 93px;
  height: 100%;
  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;
const ItemVoltage = styled.li`
  ${flexboxCenter}

  width: 93px;
  height: 100%;
  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;
const ItemLength = styled.li`
  ${flexboxCenter}

  width: 93px;
  height: 100%;
  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;
const ItemDescription = styled.li`
  ${flexboxCenter}

  width: 265px;
  height: 100%;
  gap: 0.3rem;
  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}

  padding: 0 0.1rem;
`;
const ItemData = styled.span`
  font-size: 8px;
  text-align: center;
  padding: 0.5rem;
  ${(p) =>
    p.isDescription &&
    css`
      font-size: 8px;
      line-height: 95%;
      overflow: hidden;
    `}

  color: ${({ theme, isDefault }) => isDefault && theme.label.success};
  color: ${({ theme, isEnable }) => isEnable || theme.label.disabled};
`;

const DescriptionAndButtonWrapper = styled.div`
  width: 285px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;
