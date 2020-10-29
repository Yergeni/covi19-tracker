import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

export const casesTypeColors = {
	cases: {
		hex: "#CC1034", // color
		rgb: "rgb(204, 16, 52)", // background color
		half_op: "rgb(204, 16, 52, 0.5)", // Border opacity
		multiplier: 500, // size of circle
	},
	recovered: {
		hex: "#7dd71d",
		rgb: "rgb(125, 215, 29)",
		half_op: "rgb(125, 215, 29, 0.5)",
		multiplier: 600,
	},
	deaths: {
		hex: "#fb4443",
		rgb: "rgb(251, 68, 67)",
		half_op: "rgb(251, 68, 67, 0.5)",
		multiplier: 1500,
	},
};

/**
 * Sort the giving array in descending mode
 * @param {array[any]} data An unsorted array of data cases
 */
export const sortData = (data) => {
	const sortedData = [...data];

	return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

/**
 * Format a number
 * @param {number} stat A number to be formated
 */
export const prettyPrintStat = (stat) => stat ? `+${numeral(stat).format("0.0a")}` : "+0";

/**
 * Draw circles on the map with interactive tooltip
 * @param {array[any]} data An array of country information
 * @param {string} casesType The cases type (Ex. recovered)
 */
export const showDataOnMap = (
	data,
	casesType // NOTE: using parentesis means a direct return
) =>
	data.map((country) => (
		<Circle
            key={country.country}
			center={{ lat: country.countryInfo.lat, lng: country.countryInfo.long }}
			fillOpacity={0.4}
			color={casesTypeColors[casesType].hex}
			fillColor={casesTypeColors[casesType].rgb}
			radius={
				Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
			}
		>
			<Popup >
				<div className="info__container">
					{/* <div style={{ backgroundImage: `url(${country.countryInfo.flag})` }} /> */}
					<div style={{ display: "flex", alignItems: "center" }}>
						<img
							src={country.countryInfo.flag}
							alt={`${country.country} flag`}
							width="25px"
							height="15px"
						></img>
						<div className="info__name">{country.country}</div>
					</div>
					<div className="info__cases">Cases: {numeral(country.cases).format("0,0")}</div>
					<div className="info__recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
					<div className="info__deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
				</div>
			</Popup>
		</Circle>
	));
