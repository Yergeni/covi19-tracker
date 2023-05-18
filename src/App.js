import { useEffect, useState } from "react";

import InfoBox from "./components/InfoBox/InfoBox";
import Map from "./components/Map/Map";
import Table from "./components/Table/Table";
import LineGraph from "./components/LineGraph/LineGraph";

import {
	Card,
	CardContent,
	FormControl,
	MenuItem,
	Select,
} from "@material-ui/core";

import { prettyPrintStat, sortData } from "./utils/utils";

import "./App.css";
// Leaflet Map CSS
import "leaflet/dist/leaflet.css";

function App() {
	// STATES
	const [loading, setLoading] = useState(true);
	const [countries, setCountries] = useState([]);
	const [selectedCountry, setSelectedCountry] = useState("worldwide");
	const [countryName, setCountryName] = useState("Worldwide");
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [selectedCasesType, setSelectedCasesType] = useState("cases");
	const [selectedDays, setSelectedDays] = useState("30");
	// Map states
	const [mapCountries, setMapCountries] = useState([]);
	const [mapCenter, setMapCenter] = useState({ lat: 46.473323, lng: 8.472003 });
	const [mapZoom, setMapZoom] = useState(2);

	// Fetch the country list
	// TODO: Save to LS for fast access
	useEffect(() => {
		const getCountriesData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then((response) => response.json())
				.then((data) => {
					const countriesData = data.map((data) => ({
						name: data.country, // United States, Cuba
						countryCode: data.countryInfo.iso2, // US, CU
					}));
					const sortedData = sortData(data);
					setMapCountries(data); // Save all countries data to be used on the map component
					setTableData(sortedData);
					setCountries(countriesData);
				});
		};

		getCountriesData();
	}, []);

	// Fetch the worldwide data
	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all")
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data);
				setLoading(false);
			});
	}, []);

	// Country select change
	const onCountryChange = async (event) => {
		const countryCode = event.target.value;

		// https://disease.sh/v3/covid-19/all for worldwide data
		// https://disease.sh/v3/covid-19/countries/{country} for a specific country data
		const url =
			countryCode === "worldwide"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setCountryName(data.country);
				setSelectedCountry(countryCode);
				setCountryInfo(data);
				setMapCenter(
					countryCode !== "worldwide"
						? {
								lat: data.countryInfo.lat,
								lng: data.countryInfo.long,
						  }
						: { lat: 46.473323, lng: 8.472003 }
				);
				setMapZoom(countryCode === "worldwide" ? 7 : 4);
			});
	};

	return (
		<div className="app">
			{/* LEFT SIDE */}
			<div className="app__left">
				{/* Header (Title + Select input) */}
				<div className="app__header">
					<h1>COVID-19 TRACKER</h1>
					<FormControl className="app__dropdown" variant="outlined">
						<Select
							value={selectedCountry}
							id="country"
							onChange={onCountryChange}
						>
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{countries.map((country) => (
								<MenuItem key={country.name} value={country.countryCode}>
									{country.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>

				{/* Statistic Boxes */}
				<div className="app__stats">
					<InfoBox
						active={selectedCasesType === "cases"}
						onClick={(e) => setSelectedCasesType("cases")}
						title="Confirmed Cases"
						cases={prettyPrintStat(countryInfo.todayCases)}
						total={prettyPrintStat(countryInfo.cases)}
						loading={loading}
					/>
					<InfoBox
						active={selectedCasesType === "recovered"}
						onClick={(e) => setSelectedCasesType("recovered")}
						title="Recovered"
						cases={prettyPrintStat(countryInfo.todayRecovered)}
						total={prettyPrintStat(countryInfo.recovered)}
						loading={loading}
					/>
					<InfoBox
						active={selectedCasesType === "deaths"}
						onClick={(e) => setSelectedCasesType("deaths")}
						title="Deaths"
						cases={prettyPrintStat(countryInfo.todayDeaths)}
						total={prettyPrintStat(countryInfo.deaths)}
						loading={loading}
					/>
				</div>

				{/* Map */}
				<Map
					countries={mapCountries}
					center={mapCenter}
					zoom={mapZoom}
					casesType={selectedCasesType}
				/>
			</div>

			{/* RIGHT SIDE */}
			<Card className="app__right">
				<CardContent>
					{/* Table */}
					<h4>Total Confirmed Cases by Country</h4>
					<Table tableData={tableData} />

					{/* GRAPH CASES TYPE */}
					<div className="app__rightGraphTitle">
						<h4>{countryName} new </h4>
						<FormControl className="app__rightGraphCases">
							<Select
								value={selectedCasesType}
								id="casesType"
								onChange={(event) => setSelectedCasesType(event.target.value)}
								// onChange={onCasesTypeChange}
							>
								<MenuItem key="cases" value="cases">
									Cases
								</MenuItem>
								<MenuItem key="deaths" value="deaths">
									Deaths
								</MenuItem>
								<MenuItem key="recovered" value="recovered">
									Recovered
								</MenuItem>
							</Select>
						</FormControl>

						{/* GRAPH DAYS */}
						<h4>in the last </h4>
						<FormControl className="app__rightGraphDays">
							<Select
								value={selectedDays}
								id="days"
								onChange={(event) => setSelectedDays(event.target.value)}
							>
								<MenuItem key="30" value="30">
									30
								</MenuItem>
								<MenuItem key="60" value="60">
									60
								</MenuItem>
								<MenuItem key="120" value="120">
									120
								</MenuItem>
							</Select>
						</FormControl>
						<h4>days</h4>
					</div>

					{/* GRAPH */}
					<LineGraph
            className="app_graph"
						casesType={selectedCasesType}
						country={selectedCountry}
						countryName={countryName}
						lastDays={selectedDays}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
