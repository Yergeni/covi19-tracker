import React from "react";

import { Map as LeafletMap, TileLayer } from "react-leaflet";
import { showDataOnMap } from "../../utils/utils";

import "./Map.css";

const Map = ({ countries, casesType, center, zoom }) => {
	// console.log(center)
	return (
		<div className="map">
			<LeafletMap center={center} zoom={zoom}>
				<TileLayer
					attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{/* Loop through countries and draw circles on the screen */}
				{showDataOnMap(countries, casesType)}
			</LeafletMap>
		</div>
	);
};

export default Map;
