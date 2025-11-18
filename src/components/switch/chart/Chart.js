import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

import moment from 'moment';

import { flexboxCenter } from '../../../styles/commonStyles';
import styled from 'styled-components';
import {
  useSystemIdentificationStore,
  useSettingsStore,
  useTgsSwitchStore,
  useUserStore
} from '../../../store/zustand';
import { useMemo } from 'react';
import { convertCelsiusToFahrenheit } from '../../../helpers/helpers';
import { useTheme } from 'styled-components';

const Chart = () => {
  const { buttonsOfSettings } = useSettingsStore();
  const { unitsMeasurement } = buttonsOfSettings;
  const { outsideGraphData, enclosureGraphData, heaterGraphData, gasGraphData, settings } = useTgsSwitchStore();
  const { sysIdentification } = useSystemIdentificationStore();
  const { isGas } = useUserStore();
  const theme = useTheme();

  const isThermocouple = useMemo(() => {
    return settings?.tc_mode === 1 ? true : false;
  }, [settings]);

  const sortedValues = (type) => {
    // type: 0 - time, 1 - temp
    const heaterGraph = isThermocouple ? heaterGraphGasElectrical : [];
    const mergedArray = [...outsideGraphData, ...enclosureGraphData, ...heaterGraph];
    const uniqueValues = [...new Set(mergedArray.map(item => Math.floor(item[type])))];
    const sortedValues = uniqueValues.sort((a, b) => a - b);
    return sortedValues;
  };

  const convertArrayToObject = (arr) => {
    if (arr.length > 0) {
      return arr.reduce((obj, item) => {
        obj[item[0]] = unitsMeasurement ? Math.floor(convertCelsiusToFahrenheit(item[1])) : Math.floor(item[1]);
        return obj;
      }, {});
    }
    return {};
  };

  const heaterGraphGasElectrical = useMemo(() => {
    return isGas ? gasGraphData : heaterGraphData;
  }, [isGas, gasGraphData, heaterGraphData]);

  const dataGraph = useMemo(() => {
    if (Array.isArray(outsideGraphData) && Array.isArray(heaterGraphGasElectrical) && Array.isArray(enclosureGraphData)) {
      const sortedTimestamps = sortedValues(0);
      const outsideGraph = convertArrayToObject(outsideGraphData);
      const enclosureGraph = convertArrayToObject(enclosureGraphData);
      const heaterGraph = convertArrayToObject(heaterGraphGasElectrical);
      const result = sortedTimestamps.map((time) => {
        const outsideTemp = Math.floor(outsideGraph[time]);
        const enclosureTemp = Math.floor(enclosureGraph[time]);
        const heaterTemp = Math.floor(heaterGraph[time]);
        return {
          name: time,
          HT: !isNaN(heaterTemp) ? heaterTemp : null,
          ET: !isNaN(enclosureTemp) ? enclosureTemp : null,
          OT: !isNaN(outsideTemp) ? outsideTemp : null,
        };
      });

      if (result.length > 0) {
        result.reduce((prev, curr) => {
          if (
            curr.HT === null &&
            prev.HT !== null &&
            curr.name - prev.name < 600
          ) {
            curr.HT = prev.HT;
          }
          return curr;
        });
      }

      return result;
    }
    return [{
      name: '1',
      HT: -50,
      ET: null,
      OT: 200,
      date: 13,
    }];
  }, [ outsideGraphData, enclosureGraphData, heaterGraphGasElectrical ]);

  const timePointsX = useMemo(() => {
    if (Array.isArray(outsideGraphData) && Array.isArray(heaterGraphGasElectrical) && Array.isArray(enclosureGraphData)) {
      const sortedTimestamps = sortedValues(0);
      if (sortedTimestamps.length > 0) {
        const timeRange =
          sortedTimestamps[sortedTimestamps.length - 1] - sortedTimestamps[0];
        const timeIncrement = timeRange / 5;
        const result = [];
        for (let i = 0; i <= 5; i++) {
          const time = sortedTimestamps[0] + i * timeIncrement;
          const actualTime = sortedTimestamps.find((item) => item >= time);
          result.push(actualTime);
        }
        return result;
      }
      return [];
    }
    return [];
  }, [ outsideGraphData, enclosureGraphData, heaterGraphGasElectrical ]);

  const tempPointsY = useMemo(() => {
    if (Array.isArray(outsideGraphData) && Array.isArray(heaterGraphGasElectrical) && Array.isArray(enclosureGraphData)) {
      const sortedTemps = sortedValues(1);
      if (sortedTemps.length > 0) {
        const tempRange = sortedTemps[sortedTemps.length - 1] - sortedTemps[0];
        const tempIncrement = (tempRange / 4) % 5 !== 0 ? tempRange / 4 : tempRange / 4 * 1.25;
        const result = [];
        sortedTemps[0] = sortedTemps[0] - (tempIncrement * 0.5)
        for (let i = 0; i <= 5; i++) {
          const value = sortedTemps[0] + i * tempIncrement
          result.push(Math.ceil(unitsMeasurement ? convertCelsiusToFahrenheit(value) : value));
        }
        return result;
      }
      return [];
    }
    return [];
  }, [ outsideGraphData, enclosureGraphData, heaterGraphGasElectrical ]);

  const unitValue = unitsMeasurement
    ? 'HEATER TEMPERATURE (°F)'
    : 'HEATER TEMPERATURE (°C)';

  const CustomTooltip = ({ active, payload, label }) => {
    // const switchName =
    //   sysIdentification.switchName.length < 1
    //     ? 'switch information'
    //     : sysIdentification.locationName +
    //       '-' +
    //       sysIdentification.switchName +
    //       '-' +
    //       sysIdentification.switchSize +
    //       ' ' +
    //       sysIdentification.application +
    //       '-' +
    //       sysIdentification.heatingSystem.split(' - ')[0];

    let payloadName1st = '';
    let payloadName2nd = '';
    let payloadName3rd = '';

    if (active) {
      const unit = unitsMeasurement ? '°F' : '°C';
      // payloadName1st = switchName;
      payloadName2nd = Array.isArray(payload)
        ? `( ` +
          (typeof payload[0]?.payload?.HT === 'number'
            ? `H.T- ${payload[0]?.payload?.HT} ${unit}`
            : '') +
          (typeof payload[0]?.payload?.HT === 'number' &&
          typeof payload[0]?.payload?.ET === 'number'
            ? `, `
            : '') +
          (typeof payload[0]?.payload?.ET === 'number'
            ? `E.T- ${payload[0]?.payload?.ET} ${unit}`
            : '') +
          (typeof payload[0]?.payload?.ET === 'number' &&
          typeof payload[0]?.payload?.OT === 'number'
            ? `, `
            : '') +
          (typeof payload[0]?.payload?.OT === 'number' &&
          typeof payload[0]?.payload?.HT === 'number' &&
          typeof payload[0]?.payload?.ET !== 'number'
            ? `, `
            : '') +
          (typeof payload[0]?.payload?.OT === 'number'
            ? `O.T- ${payload[0]?.payload?.OT} ${unit}`
            : '') +
          ` )`
        : '';
      payloadName3rd = Array.isArray(payload)
        ? `${moment
            .unix(payload[0]?.payload?.name)
            .format('MMMM dddd DD, YYYY - HH:mm')}`
        : '';
    }

    return (
      <PayloadWrapper className='custom-tooltip'>
        {/* <PayloadItem className='label'>{payloadName1st}</PayloadItem> */}
        <PayloadItem className='label'>{payloadName2nd}</PayloadItem>
        <PayloadItem className='label'>{payloadName3rd}</PayloadItem>
      </PayloadWrapper>
    );
  };

  return (
    <>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          width={100}
          height={100}
          data={dataGraph}
          margin={{
            top: 15,
            right: 10,
            left: 60,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray=' 1 solid' />
          <XAxis
            tick={{ fontSize: 8 }}
            stroke={theme.label.primary}
            dataKey='name'
            ticks={timePointsX}
            tickFormatter={(unixTime) => moment.unix(unixTime).format('HH:mm')}
            label={{
              value: 'TIME',
              position: 'BottomRight',
              fill: theme.label.primary,
              dx: 285,
              dy: 10,
              fontSize: 11,
            }}
          />
          <YAxis
            stroke={theme.label.primary}
            type='number'
            tick={{ fontSize: 11 }}
            ticks={tempPointsY}
            domain={['dataMin', 'dataMax']}
            unit={unitsMeasurement ? '°F' : '°C'}
            label={{
              fill: theme.label.primary,
              value: unitValue,
              position: 'outsideLeft',
              angle: -90,
              dx: -55,
              dy: 0,
              fontSize: 11,
              letterSpacing: 1.1,
            }}
            width={20}
          />

          <Tooltip
            wrapperStyle={{
              backgroundColor: theme.status.info.bg,
              outline: `1px solid ${theme.status.info.border}`,
            }}
            content={<CustomTooltip />}
          />

          {isThermocouple && (
            <Line
              type='monotone'
              dataKey='HT'
              stroke={theme.chart.line.secondary}
              strokeWidth={2}
              dot={false}
            />
          )}
          <Line
            type='monotone'
            dataKey='ET'
            stroke={theme.chart.line.primary}
            dot={false}
            strokeWidth={2}
            connectNulls={true}
          />
          <Line
            type='monotone'
            dataKey='OT'
            stroke={theme.chart.line.tertiary}
            dot={false}
            strokeWidth={2}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default Chart;

const PayloadWrapper = styled.div`
  ${flexboxCenter}
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  padding: 0.3rem;
`;
const PayloadItem = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
`;
