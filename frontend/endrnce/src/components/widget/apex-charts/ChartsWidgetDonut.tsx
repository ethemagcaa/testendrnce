/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useRef } from "react";
import ApexCharts, { ApexOptions } from "apexcharts";

import { getCSS } from "@assets/ts/_utils";
import { useThemeMode } from "@modules/admin/layout/context/theme-mode-context";
import { useIntl } from "react-intl";

type Props = {
  className: string,
  chartObj: {
      title: string,
      colors?: string[] | undefined,
      series: number[] | undefined,
      labels: string[] | undefined
  }
}

const ChartsWidgetDonut: React.FC<Props> = ({ className, chartObj }) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const { mode } = useThemeMode();
    const intl = useIntl();

    const refreshMode = useCallback(() => {
        if (!chartRef.current)
            return;


        const height = parseInt(getCSS(chartRef.current, "height"));

        const chart = new ApexCharts(chartRef.current, getChartOptions(height, chartObj.colors, chartObj.series, chartObj.labels, intl.formatMessage({ id: "Total" })));
        if (chart)
            (async () => await chart.render())();

        return chart;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartObj.labels, chartObj.colors, chartObj.series]);

    useEffect(() => {
        const chart = refreshMode();

        return () => {
            if (chart)
                chart.destroy();

        };
    }, [chartRef, mode, chartObj, refreshMode]);

    return (
        <div className={`card ${className}`}>
            {/* begin::Header */}
            <div className='card-header border-0 pt-5'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-3 mb-1'>{chartObj.title}</span>
                </h3>
            </div>
            {/* end::Header */}

            {/* begin::Body */}
            <div className='card-body'>
                {/* begin::Chart */}
                <div ref={chartRef} id='kt_charts_widget_3_chart' style={{ height: "350px" }}></div>
                {/* end::Chart */}
            </div>
            {/* end::Body */}
        </div>
    );
};

export { ChartsWidgetDonut };

function getChartOptions(height: number, colors: string[] | undefined, series: number[] | undefined, labels: string[] | undefined, totalLabel: string): ApexOptions {

    return {
        colors,
        series,
        chart: {
            width: 380,
            type: "donut",
            dropShadow: {
                enabled: true,
                color: "#111",
                top: -1,
                left: 3,
                blur: 3,
                opacity: 0.2
            }
        },
        stroke: {
            width: 0,
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            showAlways: true,
                            show: true,
                            label: totalLabel
                        }
                    }
                }
            }
        },
        labels,
        dataLabels: {
            dropShadow: {
                blur: 3,
                opacity: 0.8
            }
        },
        states: {
            hover: {
                filter: {
                    type: "none",
                    value: 0,
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: "bottom",
                    showForZeroSeries: false
                }
            }
        }]
    };
}
