import React from "react";

import numeral from "numeral";

import "./Table.css";

const Table = ({ tableData }) => {
	return (
		<div className="table">
			<table style={{ width: "100%" }}>
				{/* <thead>
					<tr>
						<th>Country</th>
						<th>Confirmed</th>
						<th>Recovered</th>
						<th>Deaths</th>
					</tr>
				</thead> */}
				<tbody>
					{tableData.map(({ country, cases, todayCases, todayRecovered, todayDeaths }) => (
						<tr key={country}>
							<td>{country}</td>
							{/* <td>
								{todayCases}
							</td>
							<td>
								{todayRecovered}
							</td>
							<td>
								{todayDeaths}
							</td> */}
							<td>
								<strong>{numeral(cases).format("0,0")}</strong>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
