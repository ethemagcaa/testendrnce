/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useRef } from "react";
import ApexCharts, { ApexOptions } from "apexcharts";

import { getCSS, getCSSVariableValue } from "@assets/ts/_utils";
import { SeriesModel } from "@components/widget/apex-charts/model/SeriesModel";
import { useThemeMode } from "@modules/admin/layout/context/theme-mode-context";

type Props = {
  className: string,
  chartObj: {
    title: string,
    chartColor?: string,
    series: SeriesModel | undefined,
    categories: string[]
  }
}

const ChartsWidgetLine: React.FC<Props> = ({ className, chartObj }) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const { mode } = useThemeMode();

    const refreshMode = useCallback(() => {
        if (!chartRef.current)
            return;


        const height = parseInt(getCSS(chartRef.current, "height"));

        const chart = new ApexCharts(chartRef.current, getChartOptions(height, chartObj.chartColor, chartObj.series, chartObj.categories));
        if (chart)
            (async () => await chart.render())();

        return chart;
    }, [chartObj.categories, chartObj.chartColor, chartObj.series]);

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

export { ChartsWidgetLine };

function getChartOptions(height: number, colorPattern: string = "info", series: SeriesModel = { name: "", data: [] }, categories: string[]): ApexOptions {

    const labelColor = getCSSVariableValue("--bs-gray-500");
    const borderColor = getCSSVariableValue("--bs-gray-200");
    const baseColor = getCSSVariableValue(`--bs-${colorPattern}`);
    const lightColor = getCSSVariableValue(`--bs-${colorPattern}-light`);

    return {
        series: [ series ],
        chart: {
            fontFamily: "inherit",
            type: "area",
            height,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {},
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            type: "solid",
            opacity: 1,
        },
        stroke: {
            curve: "smooth",
            show: true,
            width: 3,
            colors: [baseColor],
        },
        xaxis: {
            categories: categories,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    colors: labelColor,
                    fontSize: "12px",
                },
            },
            crosshairs: {
                position: "front",
                stroke: {
                    color: baseColor,
                    width: 1,
                    dashArray: 3,
                },
            },
            tooltip: {
                enabled: true,
                formatter: undefined,
                offsetY: 0,
                style: {
                    fontSize: "12px",
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: labelColor,
                    fontSize: "12px",
                },
                formatter: (value) => {
                    return value.toFixed(0);
                },
            },
        },
        states: {
            normal: {
                filter: {
                    type: "none",
                    value: 0,
                },
            },
            hover: {
                filter: {
                    type: "none",
                    value: 0,
                },
            },
            active: {
                allowMultipleDataPointsSelection: false,
                filter: {
                    type: "none",
                    value: 0,
                },
            },
        },
        tooltip: {
            style: {
                fontSize: "12px",
            }
        },
        colors: [lightColor],
        grid: {
            borderColor: borderColor,
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        markers: {
            strokeColors: baseColor,
            strokeWidth: 3,
        },
    };
}
