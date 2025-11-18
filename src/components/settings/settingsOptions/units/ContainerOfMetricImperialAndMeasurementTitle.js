import styled from 'styled-components';
import { flexboxCenter } from '../../../../../src/styles/commonStyles';
import TitleOfSelectUnitsOfMeasurement from './TitleOfSelectUnitsOfMeasurement';
import ImperialMetricMeasurementReader from './ImperialMetricMeasurementReader';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectSettingsOfEss,
  setResetAllSettingsButtons,
  setSettingsApplyUnitsButton,
  setSettingsCancelButton,
  setSettingsEditButton,
} from '../../../../store/slices/settingsOfEssSlice';
import { useEffect } from 'react';

import { useContext } from 'react';
import { SettingsContext } from '../../../../context/ContextOfSettings';
import InvisibleDivForEditButton from '../editAndApplyMessageBoxes/InvisibleDivForEditButton';
import EditCancelApplyButtons from '../EditCancelApplyButtons';
import { useState } from 'react';
import SettingAppliedMessage from '../../../userMessages/SettingAppliedMessage';
import { selectTgsSwitch } from '../../../../store/slices/tgsSwitchSlice';
import { updateSettingsValue } from '../../../../helpers/helpers';

function ContainerOfMetricImperialAndMeasurementTitle() {
  const devicesStates = useSelector(selectTgsSwitch);
  const { electricalInfo, gasInfo, settings } = devicesStates;
  const measurementsArr = [
    {
      title: 'Imperial',
      temp: 'F °- FAHRENHEIT',
      energy: 'Kw - KILOWATTS',
      measure: 'In - INCHES/Ft - FEET',
      gas: 'FT³- CUBIC FEET',
      backgroundColor: '360',
    },
    {
      title: 'Metric',
      temp: 'C ° - CENTIGRADE',
      energy: 'Kw - KILOWATTS',
      measure: 'M - METERS',
      gas: 'M³ - CUBIC METERS',
      backgroundColor: '180',
    },
  ];

  const buttonsName = ['edit', 'cancel', 'apply'];
  const height = '230px';

  // useContext
  const { selectUnitsState, setSelectUnitsState } = useContext(SettingsContext);

  // useState
  const [messageBox, setMessageBox] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState({});
  const [metricImperialToggle, setMetricImperialToggle] = useState(0);
  // redux
  const state = useSelector(selectSettingsOfEss);
  const mode = state.interfaceMode;
  const dispatch = useDispatch();
  const settingsEditButton = state.buttonsOfSettings.settingsEditButton;
  const unitsMeasurement = state.buttonsOfSettings.unitsMeasurement;
  const cancelState = state.buttonsOfSettings.settingsCancelButton;

  // // keeps track and render last state saved either to imperial or metric
  // useEffect(() => {
  //   dispatch(setResetAllSettingsButtons());

  //   if (unitsMeasurement === false) {
  //     setMetricImperialToggle(1);
  //     setSelectUnitsState(false);
  //   } else {
  //     setMetricImperialToggle(0);
  //     setSelectUnitsState(true);
  //   }
  // }, []);

  // // keeps track and render last state change of either imperial or metric  when pressing cancel button
  // useEffect(() => {
  //   if (unitsMeasurement === false) {
  //     setMetricImperialToggle(1);
  //     setSelectUnitsState(false);
  //   } else {
  //     setMetricImperialToggle(0);
  //     setSelectUnitsState(true);
  //   }
  // }, [cancelState]);

  useEffect(() => {
    if (settings.unit && !settingsEditButton) {
      setMetricImperialToggle(settings.unit === 'f' ? 0 : 1);
    }
  }, [settings.unit]);

  const handleClick = (index) => {
    if (index !== metricImperialToggle) {
      return (
        setSelectUnitsState(!selectUnitsState), setMetricImperialToggle(index)
      );
    }
  };

  const handleButtons = (value) => {
    const buttonsIndex = Number(value);
    switch (buttonsIndex) {
      case 0:
        dispatch(setSettingsEditButton());
        break;
      case 1:
        dispatch(setSettingsCancelButton());
        setMetricImperialToggle(settings.unit === 'f' ? 0 : 1);
        break;
      case 2:
        const unitValue = (val) => {
          return val === 0 ? 'f' : 'c';
        };
        // send new unit value for settings
        updateSettingsValue(settings, 'unit', unitValue(metricImperialToggle));
        dispatch(setSettingsApplyUnitsButton(selectUnitsState));
        setMessageBox(true);
        handleEssSysMessageBox();
        dispatch(setResetAllSettingsButtons());
        break;
      default:
        return;
    }
  };

  const handleEssSysMessageBox = () => {
    const messageDescription = 'settings have been applied';
    const titleOfIdentification = 'select units of measurement';

    setMessageBoxContent({
      title: [titleOfIdentification],
      content: messageDescription,
    });

    return;
  };

  const handleCloseMessageBox = () => {
    setMessageBox(false);
    return;
  };

  return (
    <Wrapper>
      {!settingsEditButton && <InvisibleDivForEditButton height={height} />}
      <Wrapper2 mode={mode}>
        <TitleOfSelectUnitsOfMeasurement />
        <ContainerMetricImperial>
          {measurementsArr.map((value, index) => {
            return (
              <div key={index}>
                <ImperialMetricMeasurementReader
                  value={value}
                  index={index}
                  handleClick={handleClick}
                  metricImperialToggle={metricImperialToggle}
                  unitsMeasurement={unitsMeasurement}
                />
              </div>
            );
          })}
        </ContainerMetricImperial>
        <WrapperButtons>
          <EditCancelApplyButtons
            handleClick={handleButtons}
            buttonsName={buttonsName}
          />
        </WrapperButtons>
        {messageBox && (
          <SettingAppliedMessage
            title={'change options'}
            message={messageBoxContent}
            onClose={handleCloseMessageBox}
          />
        )}
      </Wrapper2>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 594px;
  height: 318px;

  background: ${props => props.theme.layout.header.bgGradient};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 12px 12px 18px 18px;
  opacity: 1;
  ${flexboxCenter};
`;

const Wrapper2 = styled.div`
  width: 592px;
  height: 316px;

  border: 0.5px solid ${props => props.theme.layout.card.border};
  border-radius: 12px 12px 18px 18px;
  box-sizing: border-box;
  background-image: ${props => props.theme.layout.header.bgGradientVertical_360degree};
  box-shadow: ${props => props.theme.layout.main.shadow};
  opacity: 1;
  ${flexboxCenter}
  flex-direction: column;
  justify-content: space-evenly;
`;

const ContainerMetricImperial = styled.div`
  display: flex;
  width: 592px;
  /* ${flexboxCenter} */
  justify-content: space-around;
  align-items: center;
`;

const WrapperButtons = styled.div`
  width: 578px;
  height: auto;

  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export default ContainerOfMetricImperialAndMeasurementTitle;
