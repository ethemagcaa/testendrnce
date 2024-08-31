/* eslint-disable jsx-a11y/anchor-is-valid, @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef } from "react";
import ApexCharts, { ApexOptions } from "apexcharts";

import { getCSS } from "@assets/ts/_utils";
import { SeriesModel } from "@components/widget/apex-charts/model/SeriesModel";
import { useThemeMode } from "@modules/admin/layout/context/theme-mode-context";
import { useSearchParams } from "react-router-dom";

type Props = {
  className: string,
  chartObj: {
      title: string,
      colors?: string[] | undefined,
      series: SeriesModel[] | undefined,
      categories: object[] | undefined
  }
}

const ChartsWidgetStackedColumn: React.FC<Props> = ({ className, chartObj }) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const { mode } = useThemeMode();
    const [searchParams, setSearchParams] = useSearchParams();

    const refreshMode = useCallback(() => {
        if (!chartRef.current)
            return;

        const height = parseInt(getCSS(chartRef.current, "height"));

        const chart = new ApexCharts(chartRef.current, getChartOptions(height, chartObj.colors, chartObj.series, chartObj.categories));
        if (chart)
            (async () => await chart.render())();

        return chart;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartObj.categories, chartObj.colors, chartObj.series]);

    useEffect(() => {
        const chart = refreshMode();

        return () => {
            if (chart)
                chart.destroy();

        };
    }, [chartRef, mode, chartObj, refreshMode]);

    const getChartOptions = (height: number, colors: string[] | undefined, series: SeriesModel[] | undefined, categories: any | object[] | undefined): ApexOptions => {
        return {
            colors,
            series,
            xaxis: {
                type: "category",
                categories: categories?.map((data: any) => data[0]),
            },
            chart: {
                fontFamily: "inherit",
                type: "bar",
                height,
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                },
                events: {
                    dataPointSelection: function(event, chartContext, opts) {
                        if (categories) {
                            searchParams.set("suiteId", categories[opts.dataPointIndex][1]);
                            setSearchParams(searchParams);
                        }
                    },
                    dataPointMouseEnter: function(event) {
                        event.target.style.cursor = "pointer";
                    }
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: "bottom",
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            plotOptions: {
                bar: {
                    horizontal: false,
                    dataLabels: {
                        total: {
                            enabled: true,
                            style: {
                                fontSize: "13px",
                                fontWeight: 900
                            }
                        }
                    }
                },
            },
            legend: {
                position: "right",
                offsetY: 40
            },
            fill: {
                opacity: 1
            }
        };
    };

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

export { ChartsWidgetStackedColumn };
