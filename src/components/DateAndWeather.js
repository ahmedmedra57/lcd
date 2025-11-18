import { useSelector } from 'react-redux';
import { selectUserState } from '../store/slices/userSlice';

import styled, { css } from 'styled-components';
import { flexboxCenter } from '../styles/commonStyles';
import { selectSettingsOfEss } from '../store/slices/settingsOfEssSlice';
import { selectTgsSwitch } from '../store/slices/tgsSwitchSlice';
import { useMemo } from 'react';
import { convertCelsiusToFahrenheit } from '../helpers/helpers'

const DateAndWeather = () => {
  // redux
  const state = useSelector(selectSettingsOfEss);
  const userState = useSelector(selectUserState);
  const mode = state.interfaceMode;
  const { date, weather, iconSrc } = userState.dateAndWeather;
  const devicInfo = useSelector(selectTgsSwitch);
  const { settings } = devicInfo;

  const imageDash = mode
    ? '/static/images/long-dash_light.svg'
    : '/static/images/long-dash.svg';

  const icon = useMemo(() => {
    const src_icon = mode ? `/static/images/weather_light/${settings?.icon}.svg` : `/static/images/weather/${settings?.icon}.svg`;
    return settings?.icon && src_icon;
  }, [settings?.icon, mode]);

  const temp = useMemo(() => {
    return settings?.outside_temp && `${settings?.unit === 'f' 
      ? Math.floor(convertCelsiusToFahrenheit(settings?.outside_temp)) 
        : Math.floor(settings?.outside_temp)} °${settings?.unit} `;
  }, [settings?.outside_temp, settings?.unit]);

  return (
    <Wrapper>
      <LongDash>
        <Img alt='Long dash' src={imageDash} />
      </LongDash>
      <DateAndWeatherWrapper>
        <Date interfaceMode={mode}>
          {date ? date : 'september wednesday 21, 2022'}
        </Date>
        <WeatherIcon alt='weather icon' src={icon || '/static/images/weather/04d.svg'} />
        <Weather interfaceMode={mode}>{temp ? temp : `27 °F `}</Weather>
      </DateAndWeatherWrapper>
      <LongDash>
        <Img alt='Long dash' src={imageDash} />
      </LongDash>
    </Wrapper>
  );
};

export default DateAndWeather;

const Wrapper = styled.div`
  width: 550px;

  display: flex;
  align-items: center;
  justify-content: center;
  /* margin-bottom: var(--space4); */
  margin-bottom: 2px;
`;

const DateAndWeatherWrapper = styled.span`
  width: 350px;
  font-size: 10px;
  color: ${props => props.theme.label.primary};
  margin: 0 10px;
  ${flexboxCenter}
  justify-content: space-evenly;
`;

const LongDash = styled.div`
  width: 71px;
  ${flexboxCenter}
`;

const Img = styled.img``;

const Date = styled.span`
  color: ${props => props.theme.label.primary};
`;

const WeatherIcon = styled.img`
  width: 32px;
  height: 32px;
`;
const Weather = styled.span`
  color: ${props => props.theme.label.primary};
`;
