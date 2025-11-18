import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { disconnectSocket, initiateSocket, socket } from "../adapters/socket";
import { electricalFaultsList, gasFaultsList, readableTime } from "../helpers/helpers";
import { setWifiState } from "../store/slices/chartSlice";
import { addHeatingSchedule } from "../store/slices/essSwitchSlice";
import {
  handleESSFaultsMessages,
  handleForceSelection,
  handleTimerCountdown,
  handleTGSFaultsMessages,
  setReceivedThermocoupleSetting,
  selectFaults,
} from "../store/slices/faultsSlice";
import { setSettingsApplyUnitsButton } from "../store/slices/settingsOfEssSlice";
import { setTgsTesSettingsApplyWindFactor, setValveInputs } from "../store/slices/settingsOfTgsTesSlice";
import { handleAdditionalSystemIdentification } from "../store/slices/settingSystemIdentificationSlice";
import {
  handleAddNewElement,
  handleConfirmAddNewElement,
} from "../store/slices/ssrDescriptionSlice";
import {
  setTgsInfo,
  setTesInfo,
  setSettings,
  setTesGraphData,
  setGasGraphData,
  handleTgsSnowSensorDefaultTemp,
  setSSRSettings,
  setSSRUpdate,
  setOutsideGraphData,
  setEnclosureGraphData,
  setHeaterGraphData,
  tgsAddHeatingSchedule,
  setCurrentRunSystem,
  setEBP,
  selectTgsSwitch,
} from "../store/slices/tgsSwitchSlice";
import { setIsEssSwitch } from "../store/slices/userSlice";

export default function useSocket() {
  const dispatch = useDispatch();
  const { ssr_setting, settings } = useSelector(selectTgsSwitch);
  const { receivedThermocoupleSetting } = useSelector(selectFaults);

  const updateSettings = (data) => {
    dispatch(setSettings(data));
    dispatch(setIsEssSwitch(data.device_type === "switches"));
    dispatch(setCurrentRunSystem(data.current_run));
    dispatch(handleTgsSnowSensorDefaultTemp(data.blower_snow_threshold));
    dispatch(setWifiState(data.cloud_connection));
    dispatch(setSettingsApplyUnitsButton(data.unit === "f")); //this value for unit
    dispatch(setEBP(data.EBP))
    dispatch(setTgsTesSettingsApplyWindFactor({
      windFactor: {
        lowWind: data?.wind_threshold[0],
        medWind: data?.wind_threshold[1],
        highWind: data?.wind_threshold[2],
        extremeWind: data?.wind_threshold[3],
      }
    }));
  };

  const updateElectrical = (data) => {
    dispatch(setTesInfo(data));
    dispatch(handleESSFaultsMessages(electricalFaultsList(data, settings, ssr_setting, receivedThermocoupleSetting).faultsList));
  };

  const updateGas = (data) => {
    dispatch(setTgsInfo(data));
    dispatch(handleTGSFaultsMessages(gasFaultsList(data, settings).faultsList));
  };

  const updateSchedule = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      data.map((item, index) => {
        const { id, threshold, start, end } = item;
        const schedule = {
          start: readableTime(start),
          end: readableTime(end),
          index,
          inputTemp: threshold,
          id,
        }
        dispatch(addHeatingSchedule(schedule));
      })
    }else{
      dispatch(addHeatingSchedule({
        index: 0,
        start: { date: null, time: null },
        end: { date: null, time: null },
        inputTemp: null,
        id: null,
      }));
    }
  }

  const tgsUpdateSchedule = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      data.map((item, index) => {
        const { id, threshold, start, end } = item;
        const schedule = {
          start: readableTime(start),
          end: readableTime(end),
          index,
          inputTemp: threshold,
          id,
        }
        dispatch(tgsAddHeatingSchedule(schedule));
      })
    }else{
      dispatch(tgsAddHeatingSchedule({
        index: 0,
        start: { date: null, time: null },
        end: { date: null, time: null },
        inputTemp: null,
        id: null,
      }));
    }
  }

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      initiateSocket();
      return () => {
        disconnectSocket();
      };
    }
  }, []);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const event = (ev) => {
        const data = JSON.parse(ev.data);
        if (data.hasOwnProperty("gas_update")) {
          updateGas(data.gas_update);
        }
        if (data.hasOwnProperty("electrical_update")) {
          updateElectrical(data.electrical_update);
        }
        if (data.hasOwnProperty("settings_update")) {
          updateSettings(data.settings_update);
        }
        if (data.hasOwnProperty("update_system_id")) {
          dispatch(handleAdditionalSystemIdentification(data.update_system_id));
        }
        if (data.hasOwnProperty("electrical_graph")) {
          dispatch(setTesGraphData(data.electrical_graph.graph));
        }
        if (data.hasOwnProperty("gas_graph")) {
          dispatch(setGasGraphData(data.gas_graph.graph));
        }
        if (data.hasOwnProperty("outside_graph")) {
          dispatch(setOutsideGraphData(data.outside_graph.graph));
        }
        if (data.hasOwnProperty("enclosure_graph")) {
          dispatch(setEnclosureGraphData(data.enclosure_graph.graph));
        }
        if (data.hasOwnProperty("heater_graph")) {
          dispatch(setHeaterGraphData(data.heater_graph.graph));
        }
        if (data.hasOwnProperty("admin_heaters")) {
          dispatch(handleAddNewElement(data.admin_heaters));
        }
        if (data.hasOwnProperty("received_admin")) {
          dispatch(handleConfirmAddNewElement(data.received_admin.Add_Heater));
          if (data.received_admin.hasOwnProperty("gas_valve")) {
            dispatch(setValveInputs({
              first: data.received_admin.gas_valve.initial_open,
              second: data.received_admin.gas_valve.min_open,
              third: data.received_admin.gas_valve.max_open,
            }));
          }
        }
        if (data.hasOwnProperty("ssr_setting")) {
          dispatch(setSSRSettings(data.ssr_setting));
        }
        if (data.hasOwnProperty("ssr_update")) {
          const newSsrSetting = ssr_setting?.map((item) =>
          item?.No === data.ssr_update?.No ? data.ssr_update : item
        );
        dispatch(setSSRSettings(newSsrSetting));
          dispatch(setSSRUpdate(data.ssr_update));
        }
        if (data.hasOwnProperty("received_thermocouple_setting")) {
          dispatch(setReceivedThermocoupleSetting(data.received_thermocouple_setting));
          const { fault_mode, count_down_time } = data.received_thermocouple_setting;
          const message = {
            ["1"]: "max heat for 12 h",
            ["2"]: "max heat for 3 days",
            ["3"]: "change and replace t/c",
          };
          if(message[fault_mode]){
            dispatch(handleForceSelection(message[fault_mode]));
            dispatch(handleTimerCountdown(count_down_time));
          }
        }
        if (data.hasOwnProperty("electrical")) {
          updateSchedule(data.electrical?.schedule_list);
        }
        if (data.hasOwnProperty("gas")) {
          tgsUpdateSchedule(data.gas?.schedule_list);
        }
      }
      socket.addEventListener("message", event);
      return () => {
        socket.removeEventListener("message", event);
      };
    }
  }, [settings, ssr_setting, receivedThermocoupleSetting]);
  return {};
}
