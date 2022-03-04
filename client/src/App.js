import React, { useEffect, createContext, useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import socketIOClient from 'socket.io-client';
import { FacturePDF, Topbar, Feedback } from "./Components";
import NavigationFacturation from "./modules/Facturation/navigation";
import NavigationStock from "./modules/Stock/navigation";
import { getUserData, getreqState, getAuth } from "./app/reducers/assujetti";
import { useDispatch, useSelector } from "react-redux";
import { Chargement } from "./Components";
import { getLoginRedirectUrl } from "./utilities/helpers";
import Configuration from "./modules/Stock/pages/Configuration";

export const FeedbackContext = createContext({});
export const SocketContext = createContext();
const socket = socketIOClient('http://127.0.0.1:8082');

function App() {
	const loading = useSelector(getreqState) === "loading";
	const isAuth = useSelector(getAuth);
	const dispatch = useDispatch();

	// Feedback context value
	const [openState, setOpenState] = useState(false);
	const [messageState, setMessageState] = useState("");
	const [typeState, setTypeState] = useState();
	const [idState, setIdState] = useState("global-feed-back");
	// const [socket, setSocket] = useState();

	// Creation de la valeur par defaut du context feedback
	const feedbackContextValue = {
		onClose: () => {
			setOpenState(false);
			setMessageState("");
		},
		createFeedback: (message, id, type) => {
			setOpenState(true);
			setMessageState(message);
			setIdState(id);
			setTypeState(type);
		},
		getFeedback: () => {
			return {
				messageState,
				openState,
				idState,
				typeState,
			};
		},
	};

	useEffect(() => {
		// Recuperation des données de l'utilisateur
		dispatch(getUserData()).then((res) => {
			const data = res.payload;
			// Verification si l'utilisateur est connecté.
			// Si oui il accède à l'application
			// Sinon il est redirigé vers le login
			if (!data || !data.connected) {
				const href = getLoginRedirectUrl();
				window.location.href = href;
				// Création du socket
				// setSocket(socket);
			}
		});
	}, [dispatch]);

	return (
		<>
			{loading || !isAuth ? (
				<Chargement
					message="Chargement..."
					sx={{
						minHeight: "100vh",
					}}
				/>
			) : (
				<SocketContext.Provider value={socket}>
					<FeedbackContext.Provider value={feedbackContextValue}>
						<div>
							<Topbar />
							<Routes>
								<Route path="/configurations" element={<Configuration />} />
								<Route
									path="/stock/*"
									element={<NavigationStock />}
								/>
								<Route
									path="/facturation/*"
									element={<NavigationFacturation />}
								/>
								<Route
									path="/facture/:numFacture"
									element={<FacturePDF />}
								/>
								<Route
									path="*"
									element={<Navigate to="/stock" />}
								/>
							</Routes>
						</div>
						<Feedback />
					</FeedbackContext.Provider>
				</SocketContext.Provider>
			)}
		</>
	);
}

export default App;
