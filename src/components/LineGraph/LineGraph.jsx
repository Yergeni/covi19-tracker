import React, { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";
import numeral from "numeral";

import "./LineGraph.css";
import { casesTypeColors } from "../../utils/utils";

const LineGraph = ({ casesType, country, countryName, lastDays, ...props }) => {
	// STATES
	const [graphData, setGraphData] = useState(null);
	const [graphErrorMessage, setgraphErrorMessage] = useState("");

	useEffect(() => {
		// BUILD TEH CHART DATA
		const buildChartData = (data) => {
			const chartData = [];
			let lastDataPoint;
			const dates = Object.keys(data[casesType]);
			// console.log(dates);
			// Loop for all dates in the cases array
			dates.forEach((date) => {
				if (lastDataPoint) {
					const newDataPoint = {
						x: date,
						y: data[casesType][date] - lastDataPoint, // Get the new cases by substracting the current date cases minus the previous date cases
						// y: data[casesType][date], // Get the new cases by substracting the current date cases minus the previous date cases
					};
					chartData.push(newDataPoint);
				}
				lastDataPoint = data[casesType][date];
			});

			return chartData;
		};

		const url =
			country === "worldwide"
				? "https://disease.sh/v3/covid-19/historical/all?lastdays=60"
				: `https://disease.sh/v3/covid-19/historical/${country}?lastdays=${lastDays}`;

		const fetchGraphData = async () => {
			// await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=60")
			await fetch(url)
                .then((response) => response.json())
				.then((data) => {
					// console.log(data);
					if (data.message) {
                        setgraphErrorMessage(data.message);
                        setGraphData(null)
					} else {
						// The response is different from all than from a specific country
						const chartData = buildChartData(
							country === "worldwide" ? data : data.timeline
						);
						setGraphData(chartData);
					}
				})
				.catch((error) => {
					console.error(
						`ERROR GETING INFO FROM COUNTRY ${country} >>> `,
						error
					);
					setGraphData(null);
				});
		};

		fetchGraphData();
	}, [casesType, country, lastDays]);

	return (
		// <div className="lineGraph">
		<div className={props.className}>
			<Line
				data={{
					datasets: [
						{
							label: graphData ? `${countryName} new ${casesType}` : graphErrorMessage,
							backgroundColor: casesTypeColors[casesType].half_op,
							borderColor: casesTypeColors[casesType].hex,
							data: graphData || [{ x: 0, y: 0 }],
						},
					],
				}}
				options={{
					legenf: {
						display: false,
					},
					elements: {
						point: {
							radious: 0,
						},
					},
					maintainAspectRatio: false,
					tooltips: {
						mode: "index",
						intersect: false,
						callbacks: {
							label: (tooltipItem, data) => {
								// return numeral(tooltipItem.value).format("0,0");
								return numeral(tooltipItem.value).format("+0,0");
							},
						},
					},
					scales: {
						xAxes: [
							{
								type: "time",
								// time: {
								// 	// format: "MM/DD/YY",
								// 	// displayFormats: {
								// 	//     day: "MMM D"
								// 	// },
								// 	tooltipFormat: "ll",
								// },
							},
						],
						yAxes: [
							{
								gridLines: {
									display: false,
								},
								ticks: {
									// Include a dollar sign in the ticks
									callback: (value, index, values) => {
										return numeral(value).format("0a");
									},
								},
							},
						],
					},
				}}
			/>
		</div>
	);
};

export default LineGraph;
