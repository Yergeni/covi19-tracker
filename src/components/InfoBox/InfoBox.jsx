import React from "react";

import { Card, CardContent, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import "./InfoBox.css";

// NOTE: onClick method is passing in the rest of the props
const InfoBox = ({ title, cases, total, loading, active, ...props }) => {
	return loading ? (
		<Card className="infoBox">
			<CardContent>
				<Skeleton animation="wave" width={150} />
				<Skeleton animation="wave" height={40} />
				<Skeleton animation="wave" />
			</CardContent>
		</Card>
	) : (
		<Card
			className={`infoBox ${active && "infoBox--selected"}`}
			onClick={props.onClick}
		>
			<CardContent>
				{/* Title */}
				<Typography color="textSecondary" className="infoBox__title">
					{title}
				</Typography>

				{/* Number of cases */}
				<h2
					className={
						title === "Recovered"
							? "infoBox__recovered"
							: title === "Deaths"
							? "infoBox__deaths"
							: "infoBox__cases"
					}
				>
					{cases}
				</h2>

				{/* Total cases */}
				<Typography className="infoBox__total">{total} Total</Typography>
			</CardContent>
		</Card>
	);
	// <Card className="infoBox">
	// 	<CardContent>
	// 		{/* Title */}
	// 		<Typography color="textSecondary" className="infoBox__title">
	// 			{title}
	// 		</Typography>

	// 		{/* Number of cases */}
	// 		<h2 className="infoBox__cases">{cases}</h2>

	// 		{/* Total cases */}
	// 		<Typography className="infoBox__total">{total} Total</Typography>
	// 	</CardContent>
	// </Card>
};

export default InfoBox;
