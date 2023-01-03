import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  ToolboxComponent,
} from 'echarts/components';
import { MapChart } from 'echarts/charts';
import { SVGRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';

const MapViz = ({
  newMapItem = (e) => {},
  meta,
  mapFile,
  data,
  vizIndicators,
  onlyLabel = false,
}) => {
  const [mapOptions, setMapOptions] = useState({});
  const memoMap = React.useMemo(() => {
    const tempObj = { ...mapFile };
    tempObj?.features?.forEach(
      (obj) =>
        (obj.properties['Dist_LGD'] = String(obj.properties['Dist_LGD']))
    );
    return tempObj;
  }, [mapFile]);

  useEffect(() => {
    if (memoMap) {
      echarts.registerMap(meta.sabha, memoMap, {});
      const options = {
        backgroundColor: '#EBF0EE',
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: function (params) {
            if (params.data)
              return onlyLabel
                ? params.data.mapName
                : `${params.data.mapName}: ${params.data.value}`;
            else return 'Data not available';
          },
        },
        toolbox: {
          show: true,
          bottom: 16,
          right: 16,
          feature: {
            // dataZoom: {
            //   yAxisIndex: false,
            // },
            brush: {
              type: ['lineX', 'clear'],
            },
            dataView: {
              readOnly: true,
              optionToContent: function (opt) {
                var axisData = opt.series[0].data;
                var table =
                  '<table style="width:100%;text-align:left"><tbody><tr>' +
                  '<td style="width: 300px;"><strong>District</strong></td>' +
                  '<td><strong>Code</strong></td>' +
                  '<td><strong>Value</strong></td>' +
                  '</tr>';
                for (var i = 0, l = axisData.length; i < l; i++) {
                  table +=
                    '<tr>' +
                    '<td>' +
                    axisData[i].mapName +
                    '</td>' +
                    '<td>' +
                    axisData[i].name +
                    '</td>' +
                    '<td>' +
                    axisData[i].value +
                    '</td>' +
                    '</tr>';
                }
                table += '</tbody></table>';
                return table;
              },
            },
            saveAsImage: {
              title: 'Save as SVG',
            },
          },
        },
        visualMap: vizIndicators.length
          ? {
              type: 'piecewise',
              left: '16px',
              bottom: '16px',
              backgroundColor: '#FFFFFF',
              pieces: vizIndicators,
              text: vizIndicators[0].max && [`Units: ${meta.unit}`],
              padding: 8,
              showLabel: true,
            }
          : null,
        series: [
          {
            name: meta.selectedIndicator
              ? meta.selectedIndicator
              : 'Indicator',
            type: 'map',
            roam: true,
            map: meta.sabha,
            nameProperty: 'Dist_LGD',
            zoom: 1.2,
            itemStyle: {
              borderColor: '#ffffff',
              borderWidth: 0.8,
              areaColor: '#abb0ad',
            },
            emphasis: {
              label: {
                show: false,
              },
              itemStyle: {
                areaColor: '#ffd700',
              },
            },
            select: {
              label: {
                show: false,
                color: 'rgb(100,0,0)',
              },
              itemStyle: {
                color: 'rgba(255, 215, 0, 0.8)',
              },
            },
            scaleLimit: {
              min: 1,
              max: 1,
            },
            data: data,
          },
        ],
      };
      setMapOptions(options);
    }
  }, [meta.selectedIndicator, data, memoMap]);

  function handleClick(e) {
    newMapItem(e.data);
  }

  const onEvents = { click: handleClick };

  echarts.use([
    TooltipComponent,
    VisualMapComponent,
    GeoComponent,
    MapChart,
    SVGRenderer,
    ToolboxComponent,
  ]);

  return (
    Object.keys(mapOptions).length > 0 && (
      <ReactEChartsCore
        echarts={echarts}
        onEvents={onEvents}
        option={mapOptions}
        notMerge={true}
        lazyUpdate={true}
        style={{
          height: '100%',
        }}
      />
    )
  );
};
export default React.memo(MapViz);
