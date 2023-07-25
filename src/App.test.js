import React from "react";
import App from "./App";
import { render, cleanup, fireEvent, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import players from "./players.json";
import "@testing-library/jest-dom/extend-expect";

const AVAILABLE_PLAYERS = players.length;
let selectedPlayers = [];
const randomNumberGenerator = (n) => {
	return Math.floor(Math.random() * n);
};

const testIds = {
	availablePlayersName: "available-players-name",
	availablePlayersRole: "available-players-role",
	availablePlayersBat: "available-players-bat",
	availablePlayersBowl: "available-players-bowl",
	availablePlayersTableBody: "available-players-table-body",
	availablePlayersRow: "available-players-row",
	selectedPlayersName: "selected-players-name",
	selectedPlayersRole: "selected-players-role",
	selectedPlayersTableBody: "selected-players-table-body",
	selectedPlayersRow: "selected-players-row",
	selectionRules: "selection-rules",
	closeWelcome: "close-welcome"
};

afterEach(() => {
	cleanup();
});

let app,
	getByTestId,
	queryByTestId,
	getByText,
	availablePlayersTableBody,
	selectedPlayersTableBody;
beforeEach(() => {
	app = render(<App />);
	getByTestId = app.getByTestId;
	queryByTestId = app.queryByTestId;
	getByText = app.getByText;
	availablePlayersTableBody = getByTestId(testIds.availablePlayersTableBody);
	selectedPlayersTableBody = getByTestId(testIds.selectedPlayersTableBody);
});

it("Initially Selected players should be empty, all 25 players getting rendered in Available Players", () => {
	expect(availablePlayersTableBody.children.length).toBe(25);
	expect(selectedPlayersTableBody.children.length).toBe(0);
	expect(true);
});

it("Show welcome instructions initially and disappear on clicking close button", () => {
	const welcomeInstructions = getByTestId(testIds.selectionRules);
	expect(welcomeInstructions).toBeInTheDocument();
	const closeButton = getByTestId(testIds.closeWelcome);
	fireEvent.click(closeButton);
	expect(queryByTestId(testIds.selectionRules)).not.toBeInTheDocument();
})

it("Select first player in Available Players", () => {
	let playerButton = getByTestId(
		`available-${players[0]["name"].split(" ").join("-")}-select`
	);
	fireEvent.click(playerButton);
	expect(selectedPlayersTableBody.children.length).toBe(1);
	expect(selectedPlayersTableBody.children[0].children[0].textContent).toBe(
		players[0]["name"]
	);
	expect(playerButton).toBeDisabled();
});

it("Remove Selected player", () => {
	let playerButton = getByTestId(
		`available-${players[0]["name"].split(" ").join("-")}-select`
	);
	fireEvent.click(playerButton);
	expect(selectedPlayersTableBody.children.length).toBe(1);
	expect(selectedPlayersTableBody.children[0].children[0].textContent).toBe(
		players[0]["name"]
	);
	expect(playerButton).toBeDisabled();

	let playerRemoveButton = getByTestId(
		`selected-${players[0]["name"].split(" ").join("-")}-remove`
	);
	fireEvent.click(playerRemoveButton);
	expect(selectedPlayersTableBody.children.length).toBe(0);
});

it("Select 5 players", () => {
	for (let i = 0; i < 5; i++) {
		let playerSelectButton = getByTestId(
			`available-${players[i]["name"].split(" ").join("-")}-select`
		);
		fireEvent.click(playerSelectButton);
	}
	expect(selectedPlayersTableBody.children.length).toBe(5);
	for (let i = 0; i < 5; i++) {
		expect(selectedPlayersTableBody.children[i].children[0].textContent).toBe(
			players[i]["name"]
		);
	}
});

it("Add 5 players and remove them", () => {
	for (let i = 0; i < 5; i++) {
		let playerSelectButton = getByTestId(
			`available-${players[i]["name"].split(" ").join("-")}-select`
		);
		fireEvent.click(playerSelectButton);
	}
	expect(selectedPlayersTableBody.children.length).toBe(5);
	for (let i = 0; i < 5; i++) {
		let playerRemoveButton = getByTestId(
			`selected-${players[i]["name"].split(" ").join("-")}-remove`
		);
		fireEvent.click(playerRemoveButton);
		expect(selectedPlayersTableBody.children.length).toBe(4 - i);
	}
	expect(selectedPlayersTableBody.children.length).toBe(0);
});

it("Player card select button should be disabled for already selected player", () => {
	const rohitSharmaSelect = getByTestId("available-Rohit-Sharma-select");
	fireEvent.click(rohitSharmaSelect)
	console.log("rohitSharmaSelect----->", rohitSharmaSelect)
	expect(rohitSharmaSelect).toBeDisabled();

	const rohitSharmaName = getByTestId("available-Rohit-Sharma-name");
	fireEvent.click(rohitSharmaName)

	expect(queryByTestId("player-Rohit-Sharma-details")).toBeInTheDocument()
	expect(queryByTestId("player-detail-Rohit-Sharma-add")).toBeDisabled()
})

it("Select Player on Card and close card", () => {
	const rohitSharmaName = getByTestId("available-Rohit-Sharma-name");
	fireEvent.click(rohitSharmaName)
	const rohitSharmaDetails = queryByTestId("player-Rohit-Sharma-details")
	expect(rohitSharmaDetails).toBeInTheDocument()
	const addButton = getByTestId("player-detail-Rohit-Sharma-add");
	const closeButton = getByTestId("player-detail-Rohit-Sharma-close");

	fireEvent.click(addButton);
	fireEvent.click(closeButton);
	expect(rohitSharmaDetails).not.toBeInTheDocument()


	expect(selectedPlayersTableBody.children.length).toBe(1)
})

it("Check limit on adding more than 6 batsman", () => {
	const alertMock = jest.spyOn(window, 'alert').mockImplementation();
	for (let i = 0; i < 6; i++) {
		let playerSelectButton = getByTestId(
			`available-${players[i]["name"].split(" ").join("-")}-select`
		);
		fireEvent.click(playerSelectButton);
	}
	expect(selectedPlayersTableBody.children.length).toBe(6);

	let playerSelectButton = getByTestId(
		`available-${players[6]["name"].split(" ").join("-")}-select`
	);
	fireEvent.click(playerSelectButton);
	expect(alertMock).toHaveBeenCalledWith('Batsmen can not be more than 6');
})

it("Check limit on adding more than 4 allrounders", () => {
	const alertMock = jest.spyOn(window, 'alert').mockImplementation();
	for (let i = 11; i < 15; i++) {
		let playerSelectButton = getByTestId(
			`available-${players[i]["name"].split(" ").join("-")}-select`
		);
		fireEvent.click(playerSelectButton);
	}
	expect(selectedPlayersTableBody.children.length).toBe(4);

	let playerSelectButton = getByTestId(
		`available-${players[15]["name"].split(" ").join("-")}-select`
	);
	fireEvent.click(playerSelectButton);
	expect(alertMock).toHaveBeenCalledWith('All Rounders can not be more than 4');
})


it("Check limit on adding more than 6 Bowlers", () => {
	const alertMock = jest.spyOn(window, 'alert').mockImplementation();
	for (let i = 17; i < 23; i++) {
		let playerSelectButton = getByTestId(
			`available-${players[i]["name"].split(" ").join("-")}-select`
		);
		fireEvent.click(playerSelectButton);
	}
	expect(selectedPlayersTableBody.children.length).toBe(6);

	let playerSelectButton = getByTestId(
		`available-${players[23]["name"].split(" ").join("-")}-select`
	);
	fireEvent.click(playerSelectButton);
	expect(alertMock).toHaveBeenCalledWith('Bowlers can not be more than 6');
})

it("check limit on adding 11 players", () => { 
	const alertMock = jest.spyOn(window, 'alert').mockImplementation();
	for (let i = 0; i < 6; i++) {
		let playerSelectButton = getByTestId(
			`available-${players[i]["name"].split(" ").join("-")}-select`
		);
		fireEvent.click(playerSelectButton);
	}
	for (let i = 17; i < 22; i++) {
		let playerSelectButton = getByTestId(
			`available-${players[i]["name"].split(" ").join("-")}-select`
		);
		fireEvent.click(playerSelectButton);
	}
	expect(selectedPlayersTableBody.children.length).toBe(11);

	let playerSelectButton = getByTestId(
		`available-${players[23]["name"].split(" ").join("-")}-select`
	);
	fireEvent.click(playerSelectButton);
	expect(alertMock).toHaveBeenCalledWith('Only 11 players are allowed in a team');
})
