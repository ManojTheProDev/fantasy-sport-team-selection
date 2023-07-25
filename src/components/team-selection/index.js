import React, { useEffect } from "react";

import PlayerDetail from "../player-info";
import playersList from "../../players.json";
export default function TeamSelection() {
	const [players, setPlayers] = React.useState([...playersList]);
	const [selectedPlayers, setSelectedPlayers] = React.useState([]);
	const [showPlayerDetail, setShowPlayerDetail] = React.useState(false);
	const [idx, setIdx] = React.useState(null);
	const [welcome, setWelcome] = React.useState(true);
	const [noBat, setNoBat] = React.useState(0);
	const [noBowl, setNoBowl] = React.useState(0);
	const [noAR, setNoAR] = React.useState(0);
	const [noWk, setNoWK] = React.useState(0);

	useEffect(() => {
		let temp = [...players];
		temp = temp.map(player => {return {...player, isSelected: false}});
		setPlayers(temp);
	}, [])

	const addPlayer = (index) => {
		if(selectedPlayers?.length >= 11) {
			alert("Only 11 players are allowed in a team");
			return;
		}
		if(noBat >= 6 && players[index]["type"] === "Batsman") {
			alert("Batsmen can not be more than 6");
			return;
		} 
		if(noBowl >= 6 && players[index]["type"] === "Bowler") {
			alert("Bowlers can not be more than 6");
			return;
		} 
		if(noAR >= 4 && players[index]["type"] === "AllRounder") {
			alert("All Rounders can not be more than 4");
			return;
		} 
		if(noWk >= 1 && players[index]["type"] === "WicketKeeper") {
			alert("Wicket Keeper can not be more than 1");
			return;
		}
		let playersTemp = [...players];
		let selectedPlayersTemp = [...selectedPlayers];
		let temp = playersTemp[index];
		temp.isSelected = true;
		switch(temp.type) {
			case "Batsman":
				setNoBat(val => val + 1);
				break;
			case "Bowler":
				setNoBowl(val => val + 1);
				break;
			case "AllRounder":
				setNoAR(val => val + 1);
				break;
			default:
				setNoWK(val => val + 1);
		}
		playersTemp.splice(index, 1, temp);
		setPlayers(playersTemp);
		selectedPlayersTemp.push(temp);
		setSelectedPlayers(selectedPlayersTemp);
		return;
	};

	const removePlayer = (index) => {
		let playersTemp = [...players];
		let selectedPlayersTemp = [...selectedPlayers];
		let temp = selectedPlayersTemp[index];
		temp.isSelected = false;
		switch(temp.type) {
			case "Batsman":
				setNoBat(val => val - 1);
				break;
			case "Bowler":
				setNoBowl(val => val - 1);
				break;
			case "AllRounder":
				setNoAR(val => val - 1);
				break;
			default:
				setNoWK(val => val - 1);
		}
		selectedPlayersTemp.splice(index, 1);
		let playerIndex = playersTemp.findIndex(player => player.name === temp.name);
		playersTemp.splice(playerIndex, 1, temp);
		setPlayers(playersTemp);
		setSelectedPlayers(selectedPlayersTemp);
		return
	};

	const showplayerDetailsCard = (i) => {
		setIdx(i);
		setShowPlayerDetail(true);
		return;
	};

	const closeCard = () => {
		setIdx(null)
		setShowPlayerDetail(false);
		return;
	};

	return (
		<div className="mt-50 layout-column justify-content-center align-items-center">
			<div style={{ display: "flex", width: "80%" }}>
					{showPlayerDetail ? <PlayerDetail
						selectedPlayers={selectedPlayers}
						i={idx}
						close={() => closeCard()}
						index={idx}
						addPlayer={(i) => addPlayer(i)}
						players={players}
					/> : ""}
				<div
					className="card outlined mt-0"
					style={{
						width: "50%",
						marginRight: "10px",
						overflow: "scroll",
						height: "80vh",
					}}
				>
					<div className="card-text">
						<h4 style={{ textAlign: "center" }}>Available Players</h4>
						<table>
							<thead>
								<tr>
									<th
										data-testid="available-players-name"
									>
										Name
									</th>
									<th>Role</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody data-testid="available-players-table-body">
									{welcome ? <tr>
										<td data-testid="selection-rules" colSpan="3" className="card pb-20">
											<p data-testid="close-welcome" style={{textAlign:'right'}} onClick={()=>setWelcome(false)}>X</p>
											<h3 style={{ textAlign: "center" }}>
												<strong>Welcome to Team Selection</strong>
											</h3>
											11 players are required in a team <br />
											3-6 batsmen and bowlers are allowed in a team
											<br />
											Only 1 Wicket Keeper required in a team
											<br />
											1-4 All Rounders are allowed in a team
										</td>
									</tr> : ""}
										{/* <tr
											data-testid="available-Rohit-Sharma-row"
										>
											<td
												data-testid="available-Rohit-Sharma-name"
												onClick={() => showplayerDetailsCard(0)}
											>
												Rohit Sharma
											</td>
											<td onClick={() => showplayerDetailsCard(0)}>
												Batsman
											</td>
											<td>
												<button
													data-testid="available-Rohit-Sharma-select"
													onClick={() => addPlayer(0)}
													disabled={false}
													className="btn btn-primary text"
												>
													Select
												</button>
											</td>
										</tr> */}
										{players?.length ? players.map((player, index) => {
											return (<tr
												data-testid={`available-${player.name.split(' ').join('-')}-row`}
											>
												<td
													data-testid={`available-${player.name.split(' ').join('-')}-name`}
													onClick={() => showplayerDetailsCard(index)}
												>
													{player.name}
												</td>
												<td onClick={() => showplayerDetailsCard(index)}>
													{player.type}
												</td>
												<td>
													<button
														data-testid={`available-${player.name.split(' ').join('-')}-select`}
														onClick={() => addPlayer(index)}
														disabled={player.isSelected || selectedPlayers?.length > 11}
														className="btn btn-primary text"
													>
														Select
													</button>
												</td>
											</tr>)
										}) : ""}
							</tbody>
						</table>
					</div>
				</div>
				<div
					className="card outlined mt-0"
					style={{
						width: "50%",
						marginRight: "10px",
						overflow: "scroll",
						height: "80vh",
					}}
				>
					<div className="card-text">
						<h4 style={{ textAlign: "center" }}>Selected Players</h4>
						<table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Role</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody data-testid="selected-players-table-body">
								{selectedPlayers.map((player, index) => {
									return (
										<tr
											data-testid={`selected-${player.name
												.split(" ")
												.join("-")}-row`}
											key={index}
										>
											<td>{player.name}</td>
											<td>{player.type}</td>
											<td>
												<button
													data-testid={`selected-${player.name
														.split(" ")
														.join("-")}-remove`}
													onClick={() => removePlayer(index)}
													className="btn danger text"
												>
													Remove
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
