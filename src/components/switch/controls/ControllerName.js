import styled, { css } from 'styled-components';
import { updateDeviceInfo } from '../../../helpers/helpers';
import { useTgsSwitchStore } from '../../../store/zustand';

const gas='gas';
const electrical='electrical';

const ControllerName = ({ name, imgSrc, isEnable, type }) => {
  const electricalInfo = useTgsSwitchStore((state) => state.electricalInfo);
  const gasInfo = useTgsSwitchStore((state) => state.gasInfo);
  const triggerSnowSensor=()=>{
    const newGasValue=gasInfo?.snow_trigger===1?0:1;
    const newElectricalValue=electricalInfo?.snow_trigger===1?0:1;
    if(type===gas){
      updateDeviceInfo('snow_trigger',newGasValue,'gas_command')
    }else if(type===electrical){
      updateDeviceInfo('snow_trigger',newElectricalValue,'electrical_command')
    }
  }
  return (
    <Wrapper isEnable={isEnable}>
      <Title isEnable={isEnable}>{name}</Title>
      <ImageWrapper>
        <Img src={imgSrc} onClick={triggerSnowSensor}/>
      </ImageWrapper>
    </Wrapper>
  );
};

export default ControllerName;

const Wrapper = styled.div`
  
  
  display: flex;
  align-items: center;
  justify-content: space-between;

  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 4px;

  ${(p) =>
    p.isEnable
      ? css`
          background: var(--unnamed-color-233a54) 0% 0% no-repeat padding-box;
          box-shadow: inset 0px 0px 6px var(--unnamed-color-000000);
          background: ${props => props.theme.layout.card.bgGradient};
          box-shadow: inset 0px 0px 6px #000000;

          opacity: 1;
        `
      : css`
          background: var(--unnamed-color-3b3b3b) 0% 0% no-repeat padding-box;
          box-shadow: inset 0px 0px 6px var(--unnamed-color-000000);
          background: ${props => props.theme.layout.container.bgDark} 0% 0% no-repeat padding-box;
          box-shadow: inset 0px 0px 6px #000000;
          border-radius: 16px;
          opacity: 1;
        `}
`;

const Title = styled.span`
  height: 12px;
  width: fit-content;
  font-size: 10px;
  color: ${(p) => p.isEnable ? p.theme.label.primary : p.theme.label.disabled};
  display: inline-block;
`;
const ImageWrapper = styled.div`
  height: 18px;
  width: 18px;
`;

const Img = styled.img`
  width: 100%;
  height: auto;
`;
