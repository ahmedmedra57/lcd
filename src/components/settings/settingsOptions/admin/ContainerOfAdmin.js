import styled from 'styled-components';
import {
  flexboxCenter,
  justifyContentSpaceEvenly,
  // justifyContentSpaceBetween,
  // alignItemsFlexStart,
} from '../../../../styles/commonStyles';
import { useContext, useEffect, useState } from 'react';
import { useSettingsStore, useUserStore, useTgsSwitchStore, useHeaterStatusStore, useTgsSettingsStore } from '../../../../store/zustand';
import SystemHeader from './SystemHeader';
// import Control from './sysControl/Control';
import ContainerLogin from '../../../adminPassword/ContainerLogin';
import ContainerValveSettings from './valvetSettings/ContainerValvetSettings';
import Thermocouple from './sysControl/Thermocouple';
import ForceGasElectricSystem from './sysControl/ForceGasElectricSystem';
import TgsTesSwitch from './systemConfiguration/systemConfiguration';
import AddElementToBank from './AddElementToBank';
import InvisibleDivForEditButton from '../editAndApplyMessageBoxes/InvisibleDivForEditButton';

import EditCancelApplyButtons from '../EditCancelApplyButtons';
import { SettingsContext } from '../../../../context/ContextOfSettings';

import SettingAppliedMessage from '../../../userMessages/SettingAppliedMessage';
import ApplyButtonInvisibleDiv from '../editAndApplyMessageBoxes/ApplyButtonInvisibleDiv';
import {
  addAdminHeater,
  updateDeviceInfo,
  updateHeaterSSr,
  updateSettingsValues,
  updateSsrSetting,
  updateSysIdentification,
} from '../../../../helpers/helpers';
import NewSystemIdentification from './systemIdentification/NewSystemIdentification';

function ContainerOfAdmin() {
  // all the buttons for headers. blue and green.
  const tgsButton = './static/images/blueTgsButton.svg';
  const tgsButtonActive = './static/images/greenTgsButton.svg';
  const tesButton = './static/images/blueTesButton.svg';
  const tesButtonActive = './static/images/greenTesButton.svg';
  const essButton = './static/images/blueEssButton.svg';
  const essButtonActive = './static/images/greenEssButton.svg';
  const sysButton = './static/images/blueSysButton.svg';
  const sysButtonActive = './static/images/greenSysButton.svg';
  const sfButton = './static/images/blueSfButton.svg';
  const sfButtonActive = './static/images/greenSfButton.svg';
  // enable disable switches
  const enableSwitch = './static/images/greenEnableSwitch.png';
  const disableSwitch = './static/images/redDisableSwitch.png';
  const notActiveSwitch = './static/images/greyEnableDisableSwitch.png';

  const faultsTitles = [
    'ess - simulate faults',
    'tgs - simulate faults',
    'tes - simulate faults',
  ];

  // Zustand stores
  const { isAdministrator: adminAccess, isEssSwitch: essSwitch, isTesSwitch: tesSwitch, setAdminAccess, setTesSwitch } = useUserStore();
  const { buttonState, interfaceMode: mode } = useSettingsStore();
  const { settings, gasInfo } = useTgsSwitchStore();
  const { addElementToBank } = useHeaterStatusStore();
  const { gasType, valveInputs, setGasType, setValveInputs, setThermocouple } = useTgsSettingsStore();

  const settingsEditButton = buttonState === 'edit';
  const settingsApplyButton = buttonState === 'apply';
  const sysIdentificationData = settings?.switch_panels?.[0] || {};

  // the names of 3 main buttons to make changes
  const buttonsName = ['edit', 'cancel', 'apply'];
  // the height of invisible div for editing

  const tgsHeight = '235px';
  const tesHeight = '312px';
  const sysHeight = '362px';

  // states

  const [toggleSysButton, setToggleSysButton] = useState(sysButtonActive);
  const [toggleTgsButton, setToggleTgsButton] = useState(tgsButton);
  const [toggleTesButton, setToggleTesButton] = useState(tesButton);
  const [toggleEssButton, setToggleEssButton] = useState(essButton);
  const [toggleSfButton, setToggleSfButton] = useState(sfButton);
  const [options, setOptions] = useState('');

  const [toggleThermocoupleSwitch, setToggleThermocoupleSwitch] = useState();
  const [checkPrevThermocoupleState, setCheckPrevThermocoupleState] =
    useState();
  const [toggleEnableDisableSwitch, setToggleEnableDisableSwitch] =
    useState(disableSwitch);
  const [forceGasElectric, setForceGasAndElectric] = useState(false);
  const [messageBox, setMessageBox] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState({});

  // Tgs Tes Sys headers information
  const tgsTesSysHeaderData = [
    { title: 'typhoon gas system', button: toggleTgsButton },
    { title: 'typhoon electrical system', button: toggleTesButton },
    { title: 'system commands', button: toggleSysButton },
  ];

  // Ess and Sys headers information
  const essHeaders = [
    {
      button: toggleEssButton,
      title: 'electric switch system',
    },
    {
      button: toggleSysButton,
      title: 'system commands',
    },
  ];

  // useContext
  const {
    activeSelect,
    gasSelection,
    setGasSelection,
    inputValue,
    inputElement,
    sysIdentification,
    inputData,
    sysConfiguration,
    saveButtonColor,
    valveButtonColor,
    setValveButtonColor,
    gasTypeButtonColor,
    setGasTypeButtonColor,
    setSaveButtonColor,
    setSysIdentification,
    setSysConfiguration,
    setButtonNames,
    setSaveButtonName,
    setConfigurationButtonName,
    setValveButtonName,
    setGasButtonName,
    setInputElement,
    setInputValue,
    setInputData,
    optionsSysConfiguration,
    setOptionsSysConfiguration,
  } = useContext(SettingsContext);


  useEffect(() => {
    setToggleEnableDisableSwitch(
      settings.force === 1 ? enableSwitch : disableSwitch
    );
  }, [settings.force]);

  const systemConfiguration = JSON.stringify(settings?.system_configuration);
  useEffect(() => {
    setOptionsSysConfiguration(systemConfiguration?.includes('TES') ? true : false);
    setTesSwitch(systemConfiguration?.includes('TES') ? true : false);
  }, [systemConfiguration, setTesSwitch]);

  // useEffect sets back the selections to previous selection
  useEffect(() => {
    setToggleSysButton(sysButtonActive);
    setForceGasAndElectric(false);
    setGasSelection(gasType ? 1 : 0);
    setValveButtonColor(false);
    setGasTypeButtonColor(false);
    setSaveButtonColor(false);
    return function cleanup() {
      setAdminAccess(false);
    };
  }, []);

  // toggles the the expend & close buttons and changes the color of Ess Tgs Tes and sys buttons to either blue or green
  useEffect(() => {
    if (!essSwitch) {
      switch (options) {
        case '': {
          setToggleSysButton(sysButton);
          setToggleTgsButton(tgsButton);
          setToggleTesButton(tesButton);
          setToggleSfButton(sfButton);
          break;
        }
        case 0: {
          setToggleSysButton(sysButton);
          setToggleTgsButton(tgsButtonActive);
          setToggleTesButton(tesButton);
          break;
        }
        case 1: {
          setToggleSysButton(sysButton);
          setToggleTgsButton(tgsButton);
          setToggleTesButton(tesButtonActive);
          break;
        }
        case 2: {
          setToggleSysButton(sysButtonActive);
          setToggleTgsButton(tgsButton);
          setToggleTesButton(tesButton);
          break;
        }
        case 3: {
          setToggleSfButton(sfButtonActive);
          setToggleSysButton(sysButton);
          setToggleTgsButton(tgsButton);
          setToggleTesButton(tesButton);
          break;
        }
        default:
          return;
      }
    } else {
      switch (options) {
        case '': {
          setToggleEssButton(essButton);
          setToggleSysButton(sysButton);
          setToggleSfButton(sfButton);
          break;
        }
        case 0: {
          setToggleEssButton(essButtonActive);
          setToggleSysButton(sysButton);
          setToggleSfButton(sfButton);
          break;
        }
        case 1: {
          setToggleSysButton(sysButtonActive);
          setToggleEssButton(essButton);
          setToggleSfButton(sfButton);
          break;
        }
        case 2: {
          setToggleSfButton(sfButtonActive);
          setToggleEssButton(essButton);
          setToggleSysButton(sysButton);
          break;
        }
        default:
          return;
      }
    }
  }, [options]);

  useEffect(() => {
    setToggleThermocoupleSwitch(settings?.tc_mode === 1 ? false : true);
    setCheckPrevThermocoupleState(settings?.tc_mode === 1 ? false : true);
  }, [settings?.tc_mode]);

  // set toggle for to close or expand the contents of each system
  const handleSelect = (value) =>
    options !== value ? setOptions(value) : setOptions('');

  // handles Ess dispatch once pressed on Apply button, Edit button or Cancel button
  const handleEssDispatches = (value) => {
    const buttonsIndex = Number(value);
    switch (buttonsIndex) {
      case 0:
        // setEditMode();
        break;
      case 1:
        setInputElement({
          elementName: '',
          partNumber: '',
          current: '',
          wattage: '',
          voltage: '',
          lengths: '',
        });
        setToggleThermocoupleSwitch(settings?.tc_mode === 1 ? false : true);
        setCheckPrevThermocoupleState(settings?.tc_mode === 1 ? false : true);
        // setCancelMode();
        setSaveButtonColor(false);
        setSaveButtonName('save');
        break;
      case 2:
        setMessageBox(true);
        handleEssMessageBox();
        // resetButtons();
        if (toggleThermocoupleSwitch !== checkPrevThermocoupleState) {
          setCheckPrevThermocoupleState(!checkPrevThermocoupleState);
          setThermocouple(toggleThermocoupleSwitch);
          updateDeviceInfo(
            'tc_mode',
            toggleThermocoupleSwitch === false ? 1 : 0,
            'setting_command'
          );
        }
        if (saveButtonColor) {
          addAdminHeater(inputElement);
          setSaveButtonColor(false);
          setSaveButtonName('save');
          setInputElement({
            elementName: '',
            partNumber: '',
            current: '',
            wattage: '',
            voltage: '',
            lengths: '',
          });
          addElementToBank(inputElement);
        }
        break;
      default:
        return;
    }
  };

  // handles Ess Sys dispatch once pressed on Apply button, Edit button or Cancel button
  const handleEssSysDispatches = (value) => {
    const buttonsIndex = Number(value);
    switch (buttonsIndex) {
      case 0:
        // setEditMode();
        break;
      case 1:
        // setCancelMode();
        setSysIdentification(false);
        setInputData({
          locationName: sysIdentificationData.locationName || '',
          switchName: sysIdentificationData.switchName || '',
          heatingSystem: sysIdentificationData.heatingSystem || '',
          application: sysIdentificationData.application || '',
          switchSize: sysIdentificationData.switchSize || '',
          ssrRating: sysIdentificationData.ssrRating + ' amps' || '',
          sysId: sysIdentificationData.sysId || '',
        });
        break;
      case 2:
        if (sysIdentification) {
          let data={
            location_name: inputData.selectedUOSInfo.location,
              location_address: inputData.selectedUOSInfo.address,
              lat: inputData.selectedUOSInfo.latitude,
              lon: inputData.selectedUOSInfo.longitude,
              device_name: inputData.selectedUOSName,
              selected_device_id:inputData.selectedUOSInfo.selected_device_id,
              zone_id:inputData.selectedUOSInfo.locationId,
              switch_panels: 
                inputData.selectedUOSInfo.switchInfo.map((item,index)=>{
                  return {
                    switch_size:item.switchSize.slice(1),
                    application:item.application,
                    system_id:item.sysId,
                    heating_system:"ESS",
                    ssr_rating:+item.ssrRating.slice(0,-5),
                    name:item.switchName,
                    ssr_uts:item.ssr_uts,
                  }
              })
            };

            try {
              updateSysIdentification(data);
              let ssrSettingsArrayToUpdate = [];
              inputData?.selectedUOSInfo?.ssr_setting &&
                inputData?.selectedUOSInfo?.ssr_setting?.forEach(
                  async (item) => {
                    ssrSettingsArrayToUpdate.push(item['ssr_setting']);
                  }
                );
                updateSsrSetting({
                  ssr_setting: ssrSettingsArrayToUpdate,
                });
              // updateSettingsValues(settings, {"heater_thermocouple_map":inputData.selectedUOSInfo.heater_thermocouple_map});
            } catch (error) {}
          // dispatch(handleAdditionalSystemIdentification(inputData));

          setSysIdentification(false);
        }
        setMessageBox(true);
        handleEssSysMessageBox();
        // resetButtons();
        break;
      default:
        return;
    }
  };

  // handles the Tgs dispatch once pressed on Apply button, Edit button or Cancel button
  const handleTgsDispatches = (value) => {
    const buttonsIndex = Number(value);
    switch (buttonsIndex) {
      case 0:
        // setEditMode();
        break;
      case 1:
        // setCancelMode();
        setValveButtonColor(false);
        setGasTypeButtonColor(false);
        setValveButtonName('confirm');
        setGasButtonName('confirm');
        // set default values for valve settings and gas type
        setGasSelection(gasInfo.Gas_type === 'NG' ? 1 : 0);
        setInputValue({
          first: valveInputs.start,
          second: valveInputs.min,
          third: valveInputs.max,
        });
        break;
      case 2:
        if (gasTypeButtonColor) {
          setGasType(activeSelect);
          setGasTypeButtonColor(false);
          setGasButtonName('confirm');
          updateDeviceInfo(
            'Gas_type',
            gasSelection === 1 ? 'NG' : 'LP',
            'gas_command'
          );
        }
        if (valveButtonColor) {
          setValveInputs(inputValue);
          setValveButtonColor(false);
          setValveButtonName('confirm');
          updateDeviceInfo(
            'gas_valve',
            {
              initial_open: inputValue.first,
              min_open: inputValue.second,
              max_open: inputValue.third,
            },
            'admin'
          );
        }
        if (sysIdentification) {
          setSysIdentification(false);
        }
        if (sysIdentification) {
          setSysIdentification(false);
        }
        setMessageBox(true);
        handleTgsMessageBox();
        // resetButtons();
        break;
      default:
        return;
    }
  };

  // handles the Tes dispatch once pressed on Apply button, Edit button or Cancel button
  const handleTesDispatches = (value) => {
    const buttonsIndex = Number(value);
    switch (buttonsIndex) {
      case 0:
        // setEditMode();
        break;
      case 1:
        setInputElement({
          elementName: '',
          partNumber: '',
          current: '',
          wattage: '',
          voltage: '',
          lengths: '',
        });
        setToggleThermocoupleSwitch(settings?.tc_mode === 1 ? false : true);
        setCheckPrevThermocoupleState(settings?.tc_mode === 1 ? false : true);
        // setCancelMode();
        setSaveButtonColor(false);
        setSaveButtonName('save');
        break;
      case 2:
        setMessageBox(true);
        handleTesMessageBox();
        // resetButtons();
        if (toggleThermocoupleSwitch !== checkPrevThermocoupleState) {
          setCheckPrevThermocoupleState(!checkPrevThermocoupleState);
          setThermocouple(toggleThermocoupleSwitch);
          updateDeviceInfo(
            'tc_mode',
            toggleThermocoupleSwitch === false ? 1 : 0,
            'setting_command'
          );
        }
        if (saveButtonColor) {
          addAdminHeater(inputElement);
          setSaveButtonColor(false);
          setSaveButtonName('save');
          setInputElement({
            elementName: '',
            partNumber: '',
            current: '',
            wattage: '',
            voltage: '',
            lengths: '',
          });
          addElementToBank(inputElement);
        }
        if (sysIdentification) {
          setSysIdentification(false);
        }
        if (sysIdentification) {
          setSysIdentification(false);
        }
        break;
      default:
        return;
    }
  };

  // handles the Tgs Tes Sys dispatch once pressed on Apply button, Edit button or Cancel button
  const handleTgsTesSysDispatches = (value) => {
    const buttonsIndex = Number(value);
    switch (buttonsIndex) {
      case 0:
        // setEditMode();
        break;
      case 1:
        // setCancelMode();
        setForceGasAndElectric(false);
        // setButtonNames(['edit system', 'save']);
        setSysIdentification(false);
        setOptionsSysConfiguration(settings?.system_configuration?.includes('TES') ? true : false);
        setTesSwitch(settings?.system_configuration?.includes('TES') ? true : false);
        setSysConfiguration(false);
        setConfigurationButtonName('save');
        setToggleEnableDisableSwitch(
          settings.force === 1 ? enableSwitch : disableSwitch
        );
        setInputData({
          locationName: sysIdentificationData?.locationName || '',
          switchName: sysIdentificationData?.switchName || '',
          heatingSystem: sysIdentificationData?.heatingSystem || '',
          application: sysIdentificationData?.application || '',
          switchSize: sysIdentificationData?.switchSize || '',
          ssrRating: sysIdentificationData?.ssrRating + ' amps' || '',
          sysId: sysIdentificationData?.sysId || '',
        });
        break;
      case 2:
        if (forceGasElectric) {
          // setForceGasAndElectricSystem(forceGasElectric);
          setForceGasAndElectric(false);
          updateDeviceInfo(
            'force',
            toggleEnableDisableSwitch === './static/images/redDisableSwitch.png'
              ? 0
              : 1,
            'setting_command'
          );
        }
        if (sysIdentification) {
          let data = {
            location_name: inputData.selectedUOSInfo.location,
            location_address: inputData.selectedUOSInfo.address,
            lat: inputData.selectedUOSInfo.latitude,
            lon: inputData.selectedUOSInfo.longitude,
            device_name: inputData.selectedUOSName,
            selected_device_id: inputData.selectedUOSInfo.selected_device_id,
            zone_id: inputData.selectedUOSInfo.locationId,
            switch_panels: inputData.selectedUOSInfo.switchInfo.map(
              (item, index) => {
                return {
                  switch_size: item.switchSize.slice(1),
                  gas_type: item.gasType || null,
                  application: item.application,
                  system_id: item.sysId,
                  heating_system: item.heatingSys
                    .toUpperCase()
                    .replace('/', ','),
                  ssr_rating: +item.ssrRating.slice(0, -5) || null,
                  name: item.switchName,
                  ssr_uts: item.ssr_uts,
                };
              }
            ),
          };
            try {
              updateSysIdentification(data);
              let ssrSettingsArrayToUpdate = [];
              inputData?.selectedUOSInfo?.ssr_setting?.forEach((item) => {
                ssrSettingsArrayToUpdate.push(item['ssr_setting']);
              });
              updateSsrSetting({
                ssr_setting: ssrSettingsArrayToUpdate,
              });
              // updateSettingsValues(settings, {"heater_thermocouple_map":inputData.selectedUOSInfo.heater_thermocouple_map});
            } catch (error) {
              console.log(error)
            }
            // dispatch(handleAdditionalSystemIdentification(inputData));
          setSysIdentification(false);
          // setButtonNames(['edit system', 'save']);
        }
        if (sysConfiguration) {
          updateDeviceInfo('system_configuration', optionsSysConfiguration ? ["TGS", "TES"] : ["TGS"], 'setting_command');
          setTesSwitch(optionsSysConfiguration);
          setSysConfiguration(false);
          setConfigurationButtonName('save');
        }

        setMessageBox(true);
        handleSysMessageBox();
        // resetButtons();
        break;
      default:
        return;
    }
  };

  // thermocouple in tes content
  const handleThermocoupleSwitch = () => {
    setToggleThermocoupleSwitch(!toggleThermocoupleSwitch);
  };

  // for gas electric in sys content
  const handleForceGasElectricSwitch = () => {
    if (toggleEnableDisableSwitch === enableSwitch) {
      return setToggleEnableDisableSwitch(disableSwitch);
    } else setToggleEnableDisableSwitch(enableSwitch);
  };

  // these variables are used in the 5 functions below
  const messageDescription = 'settings have been applied';
  const noModification = 'no modifications done';

  // admin : Ess : message box shows what was changed
  const handleEssMessageBox = () => {
    const titleThermocouple = 'thermocouple';
    const titleAddElementToBank = 'add element to bank';
    if (
      toggleThermocoupleSwitch !== checkPrevThermocoupleState &&
      saveButtonColor
    ) {
      setMessageBoxContent({
        title: [titleThermocouple, titleAddElementToBank],
        content: messageDescription,
      });
    } else if (toggleThermocoupleSwitch !== checkPrevThermocoupleState) {
      setMessageBoxContent({
        title: [titleThermocouple],
        content: messageDescription,
      });
    } else if (saveButtonColor) {
      setMessageBoxContent({
        title: [titleAddElementToBank],
        content: messageDescription,
      });
    } else {
      setMessageBoxContent({ title: [noModification], content: '' });
    }
    return;
  };

  // admin : Ess : Sys : message box shows what was changed
  const handleEssSysMessageBox = () => {
    const titleOfIdentification = 'system identification';
    if (sysIdentification) {
      setMessageBoxContent({
        title: [titleOfIdentification],
        content: messageDescription,
      });
    } else {
      setMessageBoxContent({ title: [noModification], content: '' });
    }
    return;
  };

  // admin : Tgs : message box shows what was changed
  const handleTgsMessageBox = () => {
    const titleValveSettings = 'valve settings';
    const titleSelectGasType = 'select gas type';
    if (gasTypeButtonColor && valveButtonColor) {
      setMessageBoxContent({
        title: [titleValveSettings, titleSelectGasType],
        content: messageDescription,
      });
    } else if (gasTypeButtonColor) {
      setMessageBoxContent({
        title: [titleSelectGasType],
        content: messageDescription,
      });
    } else if (valveButtonColor) {
      setMessageBoxContent({
        title: [titleValveSettings],
        content: messageDescription,
      });
    } else {
      setMessageBoxContent({ title: [noModification], content: '' });
    }
    return;
  };

  // admin : Tes : message box shows what was changed
  const handleTesMessageBox = () => {
    const titleThermocouple = 'track temperature control t/c ';
    const titleAddElementToBank = 'add element to bank';
    if (
      toggleThermocoupleSwitch !== checkPrevThermocoupleState &&
      saveButtonColor
    ) {
      setMessageBoxContent({
        title: [titleThermocouple, titleAddElementToBank],
        content: messageDescription,
      });
    } else if (toggleThermocoupleSwitch !== checkPrevThermocoupleState) {
      setMessageBoxContent({
        title: [titleThermocouple],
        content: messageDescription,
      });
    } else if (saveButtonColor) {
      setMessageBoxContent({
        title: [titleAddElementToBank],
        content: messageDescription,
      });
    } else {
      setMessageBoxContent({ title: [noModification], content: '' });
    }
    return;
  };

  // admin : sys : message box shows what was changed
  const handleSysMessageBox = () => {
    const titleOfForce =
      'force - gas & electric system simultaneously on for 15 minutes';
    const titleOfConfiguration = 'system configuration';
    const titleOfIdentification = 'system identification';
    if (forceGasElectric && sysIdentification && sysConfiguration) {
      setMessageBoxContent({
        title: [titleOfForce, titleOfConfiguration, titleOfIdentification],
        content: messageDescription,
      });
    } else if (forceGasElectric && sysIdentification) {
      setMessageBoxContent({
        title: [titleOfForce, titleOfIdentification],
        content: messageDescription,
      });
    } else if (forceGasElectric && sysConfiguration) {
      setMessageBoxContent({
        title: [titleOfForce, titleOfConfiguration],
        content: messageDescription,
      });
    } else if (sysIdentification && sysConfiguration) {
      setMessageBoxContent({
        title: [titleOfConfiguration, titleOfIdentification],
        content: messageDescription,
      });
    } else if (forceGasElectric) {
      setMessageBoxContent({
        title: [titleOfForce],
        content: messageDescription,
      });
    } else if (sysIdentification) {
      setMessageBoxContent({
        title: [titleOfIdentification],
        content: messageDescription,
      });
    } else if (sysConfiguration) {
      setMessageBoxContent({
        title: [titleOfConfiguration],
        content: messageDescription,
      });
    } else {
      setMessageBoxContent({ title: [noModification], content: '' });
    }
    return;
  };

  const handleCloseMessageBox = () => {
    setMessageBox(false);
    setOptions('');
    return;
  };

  return (
    <Wrapper>
      <Wrapper2>
        <Wrapper3 mode={mode}>
          {/* ess system */}
          {essSwitch
            ? essHeaders.map((value, index) => {
                return (
                  <div key={index}>
                    <Wrapper4>
                      <EssWrapper>
                        {/* invisible div to display message box if the changes done weren't applied */}
                        {settingsApplyButton && (
                          <WrapperApplyButton>
                            <ApplyButtonInvisibleDiv />
                          </WrapperApplyButton>
                        )}
                        {/* headers of ess and sys */}
                        <SystemHeader
                          name={value.title}
                          toggleButtonColor={value.button}
                          handleSelect={handleSelect}
                          index={index}
                          options={options}
                          essSwitch={essSwitch}
                          tesSwitch={tesSwitch}
                          adminAccess={adminAccess}
                        />
                      </EssWrapper>
                      {/* the content of ess */}
                      {adminAccess && index === 0 && options === index && (
                        <WrapperThermocoupleEss>
                          {!settingsEditButton && (
                            <InvisibleDivForEditButton height={'284px'} />
                          )}
                          <SectionWrapperEss>
                            <WrapperThermocouple2>
                              <Thermocouple
                                changeButtonColor={toggleThermocoupleSwitch}
                                handleLeftSwitch={handleThermocoupleSwitch}
                              />
                            </WrapperThermocouple2>
                          </SectionWrapperEss>

                          <SectionAddElementToBank>
                            <AddElementToBank />
                          </SectionAddElementToBank>
                          <WrapperButtons>
                            <EditCancelApplyButtons
                              handleClick={handleEssDispatches}
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
                        </WrapperThermocoupleEss>
                      )}
                      {/* content of general sys*/}
                      {adminAccess && options === index && index === 1 && (
                        <WrapperEss5
                          changeBorder1={options === index && index === 1}
                        >
                          <Wrapper6>
                            {!settingsEditButton && (
                              <InvisibleDivForEditButton height={'158px'} />
                            )}

                            <SectionWrapper>
                              {/* <SystemIdentification zones={zones} /> */}
                              <NewSystemIdentification
                                setSysIdentification={setSysIdentification}
                                sysIdentification={sysIdentification}
                              />
                            </SectionWrapper>
                            {/* the 3 buttons edit cancel and apply */}
                            {messageBox && (
                              <SettingAppliedMessage
                                title={'change options'}
                                message={messageBoxContent}
                                onClose={handleCloseMessageBox}
                              />
                            )}
                          </Wrapper6>
                          <WrapperButtons>
                            <EditCancelApplyButtons
                              handleClick={handleEssSysDispatches}
                              buttonsName={buttonsName}
                            />
                          </WrapperButtons>
                        </WrapperEss5>
                      )}
                     
                      {!adminAccess && (
                        <LoginWrapper>
                          {/* login in pop up */}
                          <ContainerLogin />
                        </LoginWrapper>
                      )}
                      {/* )} */}
                      {/* </WrapperEss5> */}
                    </Wrapper4>
                  </div>
                );
              })
            : tgsTesSysHeaderData.map((data, index) => {
                return (
                  <Wrapper4 key={index}>
                    <Wrapper5
                      changeBorder0={options === index && index === 0}
                      changeBorder1={options === index && index === 1}
                      changeBorder2={options === index && index === 2}
                    >
                      <TgsTesSysWrapper>
                        {/* invisible div to display message box if the changes done weren't applied */}
                        {settingsApplyButton && (
                          <WrapperApplyButton>
                            <ApplyButtonInvisibleDiv />
                          </WrapperApplyButton>
                        )}
                        <SystemHeader
                          handleSelect={handleSelect}
                          name={data.title}
                          toggleButtonColor={data.button}
                          index={index}
                          options={options}
                          adminAccess={adminAccess}
                          tesSwitch={tesSwitch}
                          essSwitch={essSwitch}
                        />
                      </TgsTesSysWrapper>
                      {/* tgs content */}
                      {index === 0 && adminAccess && options === index && (
                        <ValveWrapper>
                          {!settingsEditButton && (
                            <InvisibleDivForEditButton height={tgsHeight} />
                          )}
                          <ContainerValveSettings />
                          <WrapperButtons>
                            <EditCancelApplyButtons
                              handleClick={handleTgsDispatches}
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
                        </ValveWrapper>
                      )}
                      {/* tes content */}
                      {tesSwitch &&
                        index === 1 &&
                        adminAccess &&
                        options === index && (
                          <WrapperThermocoupleAndSimulateFaults>
                            {!settingsEditButton && (
                              <InvisibleDivForEditButton height={tesHeight} />
                            )}
                            <WrapperThermocouple1>
                              <SectionWrapperEss>
                                <WrapperThermocouple2>
                                  <Thermocouple
                                    changeButtonColor={toggleThermocoupleSwitch}
                                    handleLeftSwitch={handleThermocoupleSwitch}
                                  />
                                </WrapperThermocouple2>
                              </SectionWrapperEss>

                              <SectionWrapper1>
                                <AddElementToBank />
                              </SectionWrapper1>
                            </WrapperThermocouple1>
                            <WrapperButtons>
                              <EditCancelApplyButtons
                                handleClick={handleTesDispatches}
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
                          </WrapperThermocoupleAndSimulateFaults>
                        )}
                      {!adminAccess && index === 2 && (
                        <LoginWrapper>
                          {/* login pop up for tgs tes */}
                          <ContainerLogin />
                        </LoginWrapper>
                      )}
                      {/* general sys content */}
                      {index === 2 && adminAccess && options === index && (
                        <WrapperSys>
                          {!settingsEditButton && (
                            <InvisibleDivForEditButton height={sysHeight} />
                          )}
                          <Wrapper6>
                            <SectionWrapper>
                              <ControlWrapper>
                                <ForceGasElectricSystem
                                  handleRightSwitch={
                                    handleForceGasElectricSwitch
                                  }
                                  toggleRightEnableDisable={
                                    toggleEnableDisableSwitch
                                  }
                                  handleSave={setForceGasAndElectric}
                                  buttonColor={forceGasElectric}
                                />

                                <WrapperTgsTesSwitch>
                                  <TgsTesSwitch tesSwitch={tesSwitch} />
                                </WrapperTgsTesSwitch>
                              </ControlWrapper>
                            </SectionWrapper>

                            <SectionWrapper>
                              {/* <SystemIdentification zones={zones} /> */}
                              <NewSystemIdentification
                                setSysIdentification={setSysIdentification}
                                sysIdentification={sysIdentification}
                              />
                            </SectionWrapper>
                          </Wrapper6>
                          {/* the 3 buttons edit cancel and apply
                           */}
                          <WrapperButtons>
                            <EditCancelApplyButtons
                              handleClick={handleTgsTesSysDispatches}
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
                        </WrapperSys>
                      )}
                      
                    </Wrapper5>
                  </Wrapper4>
                );
              })}
        </Wrapper3>
      </Wrapper2>
    </Wrapper>
  );
}

export default ContainerOfAdmin;

const Wrapper = styled.div`
  width: 594px;
  height: auto;
  margin-top: 2px;
  margin-bottom: 6px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 6px;
  opacity: 1;
  ${flexboxCenter};
  justify-content: space-around;
  flex-direction: column;
`;

const Wrapper2 = styled.div`
  width: 590px;
  height: auto;
  margin-bottom: 2px;
  margin-top: 2px;

  background-image: ${props => props.theme.layout.header.bgGradientVertical_90degree};

  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
  box-shadow: 0px 0px 2px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.disabled};
  border-radius: 4px;
  opacity: 1;

  ${flexboxCenter}
  flex-direction: column;
  justify-content: space-evenly;
`;

const Wrapper3 = styled.div`
  width: 566px;
  height: auto;
  margin-top: 10px;
  margin-bottom: 8px;

  background: ${props => props.theme.layout.card.bg};

  box-shadow: inset 0px 1px 5px #000000, 0px 0px 2px #00000080;
  border-radius: 31px;
  opacity: 1;
  ${flexboxCenter};
  flex-direction: column;
`;

const Wrapper4 = styled.div`
  width: 566px;
  height: auto;
  margin-bottom: 2px;
  margin-top: 3px;
  padding-left: 2px;
  padding-right: 2px;

  background-color: ${props => props.theme.layout.card.bg};

  border-radius: 31px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WrapperEss5 = styled.div`
  width: 560px;
  height: auto;
  ${({ changeBorder1 }) => changeBorder1 && 'margin-bottom: 2px'};

  background: ${props => props.theme.layout.card.bgGradient};
  border-radius: ${({ changeBorder1 }) =>
    changeBorder1 ? '14px 14px 28px 28px' : '28px'};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Wrapper5 = styled.div`
  width: 560px;
  height: auto;
  ${({ changeBorder2 }) => changeBorder2 && 'margin-bottom: 2px'};

  background: transparent linear-gradient(0deg, ${props => props.theme.button.secondary.hover} 0%, ${props => props.theme.button.secondary.bg} 100%) 0% 0% no-repeat padding-box;
  border-radius: ${({ changeBorder0, changeBorder1 }) =>
    changeBorder0 || changeBorder1 ? '28px 28px 14px 14px' : '28px'};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EssWrapper = styled.div`
  width: 560px;
  height: 56px;
  padding: 1px;
`;

const WrapperApplyButton = styled.div`
  width: 558px;
  height: 48px;
  position: absolute;
`;

const TgsTesSysWrapper = styled.div`
  width: 560px;
  height: 56px;
  padding: 1px;
  border-radius: 16px;

  background: ${props => props.theme.layout.sidebar.bg};
 border-radius: 28px;
  ${flexboxCenter}
  flex-direction: column;
`;

const ValveWrapper = styled.div`
  width: 558px;
  height: auto;
  margin-top: 5px;
  margin-bottom: 1px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: 0px 0px 2px #000000;
  border: 0.5px solid ${props => props.theme.label.tertiary};
  border-radius: 14px;
  opacity: 1;
  ${flexboxCenter};
  align-items: flex-start;
  flex-direction: column;
`;

const WrapperThermocoupleEss = styled.div`
  width: 554px;
  height: auto;
  margin-top: 5px;
  margin-bottom: 3px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: 0px 0px 2px #000000;
  border: 0.5px solid ${props => props.theme.label.tertiary};
  border-radius: 12px;
  opacity: 1;
  ${flexboxCenter};

  flex-direction: column;
`;

const WrapperThermocoupleAndSimulateFaults = styled.div`
  width: 558px;
  height: auto;
  margin-top: 5px;
  margin-bottom: 1px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: 0px 0px 2px #000000;
  border: 0.5px solid ${props => props.theme.label.tertiary};
  border-radius: 14px;
  opacity: 1;
  ${flexboxCenter};
  flex-direction: column;
`;

const WrapperThermocouple1 = styled.div`
  width: 554px;
  height: auto;
  margin-top: 1px;
  margin-bottom: 10px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 13px;
  opacity: 1;

  display: flex;
  flex-direction: column;
`;

const WrapperButtons = styled.div`
  width: 542px;
  height: auto;
  margin-bottom: 10px;

  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const WrapperSys = styled.div`
  width: 558px;
  height: auto;
  margin-top: 5px;
  margin-bottom: 1px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: 0px 0px 6px #000000;
  border: 0.5px solid ${props => props.theme.label.tertiary};
  border-radius: 14px 14px 27px 27px;
  opacity: 1;
  ${flexboxCenter};
  flex-direction: column;
`;

const SectionWrapperEss = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: -3px;
  margin-bottom: 3px;
`;

const SectionWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 3px;
  margin-bottom: 5px;
`;

const SectionAddElementToBank = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 3px;
  margin-bottom: 10px;
`;

const SectionWrapper1 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2px;
  width: 100%;
`;

const WrapperThermocouple2 = styled.div`
  width: auto;
  height: auto;
  margin-left: 2px;
  margin-bottom: 2px;
`;

const SysWrapper = styled.div`
  width: 564px;
  height: 52px;
  margin-bottom: 3px;
`;

const Wrapper6 = styled.div`
  width: 554px;
  height: auto;
  margin-top: 1px;
  margin-bottom: 10px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 13px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoginWrapper = styled.div`
  width: 603px;
  height: 391px;

  position: absolute;
  top: 100px;
  left: 180px;

  z-index: 1000;
  ${flexboxCenter};
  align-items: flex-start;
`;

const WrapperSf = styled.div`
  width: 556px;
  height: auto;
  margin-top: 5px;
  margin-bottom: 2px;
  padding: 2px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: 0px 0px 2px #000000;
  border: 0.5px solid ${props => props.theme.label.tertiary};
  border-radius: 16px 16px 27px 27px;
  opacity: 1;
  ${flexboxCenter};
`;

const WrapperSf1 = styled.div`
  width: auto;
  height: auto;
  padding: 2px;
  margin-bottom: 2rem;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 14px;
  opacity: 1;
  ${justifyContentSpaceEvenly}
  flex-direction: column;
`;

const WrapperContent = styled.div``;

const ControlWrapper = styled.div`
  width: 554px;
  height: auto;
  /* margin-top: 4px;
  margin-bottom: 10px; */
  display: flex;
  /* flex-direction: row; */
  align-items: flex-start;
  justify-content: space-evenly;
`;

const WrapperTgsTesSwitch = styled.div``;
