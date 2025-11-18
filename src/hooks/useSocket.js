import { useEffect } from "react";
import { disconnectSocket, initiateSocket, socket } from "../adapters/socket";
import { electricalFaultsList, gasFaultsList, readableTime } from "../helpers/helpers";
import {
  useChartStore,
  useEssSwitchStore,
  useFaultsStore,
  useHeaterStatusStore,
  useSettingsStore,
  useTgsSettingsStore,
  useTgsSwitchStore,
  useUserStore,
  useSystemIdentificationStore,
} from "../store/zustand";

export default function useSocket() {
  // Zustand store selectors
  const setWifiState = useChartStore((state) => state.setWifiState);
  const setEBP = useChartStore((state) => state.setEBP);

  const addEssSchedule = useEssSwitchStore((state) => state.addSchedule);

  const setEssFaultMessages = useFaultsStore((state) => state.setEssFaultMessages);
  const setTgsFaultMessages = useFaultsStore((state) => state.setTgsFaultMessages);
  const setEssSelectedForce = useFaultsStore((state) => state.setEssSelectedForce);
  const setEssCountDownTime = useFaultsStore((state) => state.setEssCountDownTime);
  const addThermocoupleSetting = useFaultsStore((state) => state.addThermocoupleSetting);
  const receivedThermocoupleSetting = useFaultsStore((state) => state.receivedThermocoupleSetting);

  const setUnitsMeasurementFromBoolean = useSettingsStore((state) => state.setUnitsMeasurementFromBoolean);

  const setWindFactorFromSocket = useTgsSettingsStore((state) => state.setWindFactorFromSocket);
  const setValveInputs = useTgsSettingsStore((state) => state.setValveInputs);

  const setGasInfo = useTgsSwitchStore((state) => state.setGasInfo);
  const setElectricalInfo = useTgsSwitchStore((state) => state.setElectricalInfo);
  const setSettings = useTgsSwitchStore((state) => state.setSettings);
  const setTesGraphData = useTgsSwitchStore((state) => state.setTesGraphData);
  const setGasGraphData = useTgsSwitchStore((state) => state.setGasGraphData);
  const setSnowSensorDefaultTemp = useTgsSwitchStore((state) => state.setSnowSensorDefaultTemp);
  const setSSRSettings = useTgsSwitchStore((state) => state.setSSRSettings);
  const setSSRUpdate = useTgsSwitchStore((state) => state.setSSRUpdate);
  const setOutsideGraphData = useTgsSwitchStore((state) => state.setOutsideGraphData);
  const setEnclosureGraphData = useTgsSwitchStore((state) => state.setEnclosureGraphData);
  const setHeaterGraphData = useTgsSwitchStore((state) => state.setHeaterGraphData);
  const addTgsSchedule = useTgsSwitchStore((state) => state.addSchedule);
  const setCurrentRunSystem = useTgsSwitchStore((state) => state.setCurrentRunSystem);
  const ssrSettings = useTgsSwitchStore((state) => state.ssrSettings);
  const settings = useTgsSwitchStore((state) => state.settings);

  const setEssSwitch = useUserStore((state) => state.setEssSwitch);

  const setSystemIdentification = useSystemIdentificationStore((state) => state.setSystemIdentification);

  const loadElementBank = useHeaterStatusStore((state) => state.loadElementBank);
  const addElementToBank = useHeaterStatusStore((state) => state.addElementToBank);

  const updateSettings = (data) => {
    setSettings(data);
    setEssSwitch(data.device_type === "switches");
    setCurrentRunSystem(data.current_run);
    setSnowSensorDefaultTemp(data.blower_snow_threshold);
    setWifiState(data.cloud_connection);
    setUnitsMeasurementFromBoolean(data.unit === "f"); //this value for unit
    setEBP(data.EBP);
    setWindFactorFromSocket({
      windFactor: {
        lowWind: data?.wind_threshold[0],
        medWind: data?.wind_threshold[1],
        highWind: data?.wind_threshold[2],
        extremeWind: data?.wind_threshold[3],
      }
    });
  };

  const updateElectrical = (data) => {
    setElectricalInfo(data);
    setEssFaultMessages(electricalFaultsList(data, settings, ssrSettings, receivedThermocoupleSetting).faultsList);
  };

  const updateGas = (data) => {
    setGasInfo(data);
    setTgsFaultMessages(gasFaultsList(data, settings).faultsList);
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
        addEssSchedule(schedule);
      })
    }else{
      addEssSchedule({
        index: 0,
        start: { date: null, time: null },
        end: { date: null, time: null },
        inputTemp: null,
        id: null,
      });
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
        addTgsSchedule(schedule);
      })
    }else{
      addTgsSchedule({
        index: 0,
        start: { date: null, time: null },
        end: { date: null, time: null },
        inputTemp: null,
        id: null,
      });
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
          setSystemIdentification(data.update_system_id);
        }
        if (data.hasOwnProperty("electrical_graph")) {
          setTesGraphData(data.electrical_graph.graph);
        }
        if (data.hasOwnProperty("gas_graph")) {
          setGasGraphData(data.gas_graph.graph);
        }
        if (data.hasOwnProperty("outside_graph")) {
          setOutsideGraphData(data.outside_graph.graph);
        }
        if (data.hasOwnProperty("enclosure_graph")) {
          setEnclosureGraphData(data.enclosure_graph.graph);
        }
        if (data.hasOwnProperty("heater_graph")) {
          setHeaterGraphData(data.heater_graph.graph);
        }
        if (data.hasOwnProperty("admin_heaters")) {
          loadElementBank(data.admin_heaters);
        }
        if (data.hasOwnProperty("received_admin")) {
          addElementToBank(data.received_admin.Add_Heater);
          if (data.received_admin.hasOwnProperty("gas_valve")) {
            setValveInputs({
              first: data.received_admin.gas_valve.initial_open,
              second: data.received_admin.gas_valve.min_open,
              third: data.received_admin.gas_valve.max_open,
            });
          }
        }
        if (data.hasOwnProperty("ssr_setting")) {
          setSSRSettings(data.ssr_setting);
        }
        if (data.hasOwnProperty("ssr_update")) {
          const newSsrSetting = ssrSettings?.map((item) =>
          item?.No === data.ssr_update?.No ? data.ssr_update : item
        );
        setSSRSettings(newSsrSetting);
          setSSRUpdate(data.ssr_update);
        }
        if (data.hasOwnProperty("received_thermocouple_setting")) {
          addThermocoupleSetting(data.received_thermocouple_setting);
          const { fault_mode, count_down_time } = data.received_thermocouple_setting;
          const message = {
            ["1"]: "max heat for 12 h",
            ["2"]: "max heat for 3 days",
            ["3"]: "change and replace t/c",
          };
          if(message[fault_mode]){
            setEssSelectedForce(message[fault_mode]);
            setEssCountDownTime(count_down_time);
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
  }, [settings, ssrSettings, receivedThermocoupleSetting]);
  return {};
}
