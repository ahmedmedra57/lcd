import moment from "moment";
import { socket } from "../adapters/socket";
import messages from "./faultsMessages.json";
import { getHeaters } from "../services/systemIdentification";
const message = messages.data;

const updateDeviceInfo = async (key, newValue, systemTarget) => {
  await socket.send(
    JSON.stringify({
      [systemTarget]: {
        [key]: newValue,
      },
    })
  );
};

const isTargetAlreadyRunning = (target, currenSystem) => {
  switch (target) {
    case "system":
      return currenSystem?.on_switch === 1;
      break;
    case "snowSensor":
      return currenSystem?.snow_enabled === 1;
      break;

    default:
  }
};

const isAnotherSystemRunning = (anotherSystem, currentRunning) => {
  return anotherSystem === currentRunning;
};

const settingsAttributesToUpdate = [
  "activated_heaters",
  "blower_snow_threshold",
  "blower_temp_ch",
  "burner_temp_ch",
  "display_temp_ch",
  "electrical_snow_threshold",
  "enclosure_temp_ch",
  "heater_thermocouple_map",
  "tc_mode",
  "unit",
  "outside_temp_ch"
];

const extractSettingsValues = (settingsObj) => {
  let newSettings = {};
  settingsAttributesToUpdate.forEach((attribue) => {
    newSettings = { ...newSettings, [attribue]: settingsObj[attribue] };
  });
  return newSettings;
};

const updateSettingsValue = async (settings, key, value) => {
  const newSettings = { ...extractSettingsValues(settings), [key]: value };
  await socket.send(
    JSON.stringify({
      ["save_settings"]: newSettings,
    })
  );
};

const updateSnowSensorSettingstempreture = async (
  settings,
  key1,
  key2,
  value1,
  value2
) => {
  const newSettings = {
    ...extractSettingsValues(settings),
    [key1]: value1,
    [key2]: value2,
  };
  await socket.send(
    JSON.stringify({
      ["save_settings"]: newSettings,
    })
  );
};

const updateSettingsValues = async (settings, newValues) => {
  const newSettings = {
    ...extractSettingsValues(settings),
    ...newValues,
  };
  await socket.send(
    JSON.stringify({
      ["save_settings"]: newSettings,
    })
  );
};

const addAdminHeater = async (data) => {
  await socket.send(
    JSON.stringify({
      ["admin"]: {
        Add_Heater: data,
      },
    })
  );
};

const addHeaterToSSr = async (data) => {
  await socket.send(
    JSON.stringify({
      ["ssr_update"]: {
        Add_Heater: data,
      },
    })
  );
};

const forceFaultHandler = async (data) => {
  await socket.send(
    JSON.stringify({
      ["thermocouple_setting"]: data,
    })
  );
};

const updateHeaterSSr = async (data) => {
  await socket.send(
    JSON.stringify({
      ["setting_command"]: data,
    })
  );
};

const updateSsrSetting = async (data) => {
  await socket.send(JSON.stringify(data));
};

const resetFault = async (key, data) => {
  await socket.send(
    JSON.stringify({
      [key]: data,
    })
  );
};

const convertFahrenheitToCelsius = (temp, unit) => {
  if (temp == null) return null;
  if (temp) {
    return unit === "f" ? (temp - 32) * (5 / 9) : temp;
  }
  return 0;
};

const convertCelsiusToFahrenheit = (temp) => {
  if (temp == null) return null;
  if (temp) {
    return temp * (9 / 5) + 32;
  }
  return 0;
};

const isEmpty = (obj) => {
  return !!Object.keys(obj).length;
};

const isAdded = (obj, list = []) => {
  return !!list.find((item) => item === obj);
};

const gasFaultsList = (gasInfo, settings) => {
  // gas faults could be timeout_fault, hplp_fault, bms_fault, thermocouple_fault
  if (isEmpty(gasInfo)) {
    let headerFaults = [];
    let faultsList = [];
    if (gasInfo["timeout_fault"] === 1) {
      if (isAdded(gasInfo["timeout_fault"], headerFaults)) return;
      headerFaults.push(message.timeout_fault);
      faultsList.push(message.timeout_fault);
    }
    if (gasInfo["hplp_fault"] === 1) {
      if (isAdded(gasInfo["hplp_fault"], headerFaults)) return;
      headerFaults.push(message.hplp_fault);
      faultsList.push(message.hplp_fault);
    }
    if (gasInfo["bms_fault"] === 1) {
      if (isAdded(gasInfo["bms_fault"], headerFaults)) return;
      headerFaults.push(message.bms_fault);
      faultsList.push(message.bms_fault);
    }
    if (gasInfo["thermocouple_fault"] === 1) {
      headerFaults.push(message.thermocouple_fault);
      faultsList.push(`THERMOCOUPLE FAILURE - MBTA-${settings?.zone_name} - ${settings?.device_name}`);
    }
    return {
      headerFaults,
      faultsList,
    };
  }
  return [];
};

const electricalFaultsList = (electricalInfo, settings, ssr_setting, thermocoupleSetting) => {
  // electrical faults could be ground_fault, ssr_fault, thermocouple_fault, srr_over_current
  if (isEmpty(electricalInfo)) {
    let headerFaults = [];
    let faultsList = [];
    if (electricalInfo["ground_fault"] === 1) {
      if (isAdded(electricalInfo["ground_fault"], headerFaults)) return;
      headerFaults.push(message.ground_fault);
      faultsList.push(message.ground_fault);
    }
    if (electricalInfo["ssr_fault"].includes(1)) {
      if (isAdded(electricalInfo["ssr_fault"], headerFaults)) return;
      const faultArrayMessage = message["ssr_fault"].split(" ");
      const faultNumbers = [];
      electricalInfo["ssr_fault"]?.map((val, key) => {
        if (val) {
          const ssrFault = ssr_setting?.find((item) => item.No === key);
          faultNumbers.push(key + 1);
          faultsList.push(`SSR FAULT ${key + 1} - MBTA-${settings?.zone_name} - ${' '}
            ${settings?.device_name} - TIME & DATE: ${moment.unix(ssrFault?.fault_time).format("h:mma - DD/MM/YYYY")}`);
        }
      });
      faultArrayMessage.splice(2, 0, faultNumbers.join(","));
      headerFaults.push(faultArrayMessage.join(" "));
    }
    if (electricalInfo["thermocouple_fault"].includes(1)) {
      if (isAdded(electricalInfo["thermocouple_fault"], headerFaults)) return;
      const faultArrayMessage = message["thermocouple_fault"].split(" ");
      const faultNumbers = [];
      electricalInfo["thermocouple_fault"]?.map((val, key) => {
        if (val) {
          const thermocoupleFault = thermocoupleSetting?.find((item) => item.tc_no === key);
          faultNumbers.push(key + 1);
          faultsList.push(`THERMOCOUPLE FAILURE ${key + 1} - MBTA-${settings?.zone_name} - ${' '}
            ${settings?.device_name} - TIME & DATE: ${moment.unix(thermocoupleFault?.time).format("h:mma - DD/MM/YYYY")}`);
        }
      });
      faultArrayMessage.splice(2, 0, faultNumbers.join(","));
      headerFaults.push(faultArrayMessage.join(" "));
    }
    if (electricalInfo["srr_over_current"].includes(1)) {
      if (isAdded(electricalInfo["srr_over_current"], headerFaults)) return;
      const faultArrayMessage = message["srr_over_current"].split(" ");
      const faultNumbers = [];
      electricalInfo["srr_over_current"]?.map((val, key) => {
        if (val) {
          const ssrFault = ssr_setting?.find((item) => item.No === key);
          faultNumbers.push(key + 1);
          faultsList.push(`SSR LOAD ${key + 1} EXCEED - MBTA-${settings?.zone_name} - ${' '}
            ${settings?.device_name} - TIME & DATE: ${moment.unix(ssrFault?.fault_time).format("h:mma - DD/MM/YYYY")}`);
        }
      });
      faultArrayMessage.splice(2, 0, faultNumbers.join(","));
      headerFaults.push(faultArrayMessage.join(" "));
    }
    return {
      headerFaults,
      faultsList,
    };
  }
  return [];
};

const updateSchedule = async (data) => {
  await socket.send(
    JSON.stringify({
      ["electrical_command"]: data,
    })
  );
};

const tgsUpdateSchedule = async (data) => {
  await socket.send(
    JSON.stringify({
      ["gas_command"]: data,
    })
  );
};

const unixTime = (date, time) => {
  const { hour, minute, division } = time;

  let hour24 = hour;
  if (division === "pm") {
    hour24 = Number(hour) + 12;
  } else {
    hour24 = hour;
  }

  const combinedDateTime = moment.unix(date).hours(hour24).minutes(minute);

  return combinedDateTime.utc().unix();
};

const readableTime = (time) => {
  const date = moment.unix(time);
  const hour = date.format("hh");
  const minute = date.format("mm");
  const division = date.format("a");

  const timeObject = {
    date: moment.unix(time).startOf("day").unix(),
    time: {
      hour,
      minute,
      division,
    }
  };

  return timeObject;
};

const countdownTimer = (time) => {
  const duration = moment.duration(time, 'seconds');
  const countdown = {
    hours:
      duration._data.hours + duration._data.days * 24 < 10
        ? '0' + duration.hours()
        : duration._data.hours + duration._data.days * 24,
    minutes:
      duration.minutes() < 10
        ? '0' + duration.minutes()
        : duration.minutes(),
    seconds:
      duration.seconds() < 10
        ? '0' + duration.seconds()
        : duration.seconds(),
  };
  return `${countdown.hours}:${countdown.minutes}:${countdown.seconds}`;
}

const updateSysIdentification = async (data) => {
  try {
    await socket.send(
      JSON.stringify({
        ["system_id"]: data,
      })
    );
    await addHeaterTosSocket()

  } catch (error) {

  }
}

const addHeaterTosSocket = async () => {
  try {
    const heaters = await getHeaters()
    heaters.data.forEach(
      async ({ deletedAt, id, createdAt, updatedAt, ...resHeaterProp }) => {
        await socket.send(
          JSON.stringify({
            admin: { Add_Heater: resHeaterProp },
          })
        )
      }
    )
  } catch (error) {}
}

const calculatedTime = (estimated, init) => {
  if (estimated && init) {
      if (estimated > init) {
          return (estimated - init).toFixed();
      }
  }
  return 0;
}



export {
  isTargetAlreadyRunning,
  isAnotherSystemRunning,
  updateSettingsValue,
  updateSnowSensorSettingstempreture,
  convertFahrenheitToCelsius,
  convertCelsiusToFahrenheit,
  gasFaultsList,
  electricalFaultsList,
  updateDeviceInfo,
  updateSettingsValues,
  addAdminHeater,
  addHeaterToSSr,
  updateHeaterSSr,
  resetFault,
  forceFaultHandler,
  updateSchedule,
  tgsUpdateSchedule,
  unixTime,
  readableTime,
  countdownTimer,
  updateSysIdentification,
  updateSsrSetting,
  calculatedTime
};
