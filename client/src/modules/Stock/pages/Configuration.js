import React from "react";
import { useSelector } from "react-redux";
import styled from "@emotion/styled";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
	Typography,
	Button,
	Avatar,
	Box,
	FormControlLabel,
	Checkbox,
	Radio,
	Divider,
	Fade,
	TextField,
} from "@mui/material";
import { getAssujetti } from "../../../app/reducers/assujetti";
import ConfigurationTabs from "./ConfigTabs";
import LargeDialog from "../../../Components/Dialogs/LargeDialog";
import { Select } from "../../../Components";

const StyledContainer = styled("div")(() => ({
	width: "100%",
	minHeight: "100vh",
}));

const StyledWrapper = styled("div")(() => ({
	marginLeft: "250px",
	marginTop: 54,
	minHight: "calc(100% - 245px)",
	overflowX: "hidden",
	padding: "20px",
	"& > .actions": {
		marginTop: 15,
		padding: "0 10px",
		display: "flex",
		justifyContent: "flex-end",
		maxWidth: 600,
		"& > *:not(:last-child)": {
			marginRight: 15,
		},
	},
}));

const StyledTreeController = styled(Box)(() => ({
	display: "flex",
	flexDirection: "column",
	"& > label span:last-child": {
		color: "#000",
	},
	"&:not(:last-child)": {
		marginBottom: 15,
	},
	"&.inline": {
		marginBottom: 0,
		"&:not(:last-child)": {
			marginRight: 15,
		},
	},
	"& .child1": {
		marginLeft: 27,
	},
	"& .child2": {
		marginLeft: 50,
	},
	"& .title": {
		color: "#444",
		fontWeight: "600",
		lineHeight: 1.3,
		marginBottom: "8px!important",
	},
	"& .description": {
		color: "#666",
		lineHeight: 1.3,
		marginBottom: "8px!important",
	},
}));

const tabs = [
	{ id: 1, label: "Organisation des stocks" },
	{ id: 2, label: "Méthode de gestion" },
	{ id: 3, label: "Méthode de valorisation" },
];

const methodesValorisation = [
	{
		id: 0,
		label: "Coût unitaire moyen pondéré (CUMP)",
	},
	{
		id: 1,
		label: "Premier entré - premier sorti (PEPS ou FIFO)",
	},
];

const variantesFIFO = [
	{
		id: 0,
		label: "FIFO avec contrainte des dates d'expiration",
		description:
			"Dans ce cas la contrainte des dates d'expiration est prioritaire, et puis vient la contrainte des dates d'entrée.",
	},
	{
		id: 1,
		label: "FIFO sans contrainte des dates d'expiration",
		description:
			"Les produits sortent du stock selon la méthode du premier entrée - premier sorti sans tenir compte des dates d'expiration.",
	},
];

const variantesCUMP = [
	{
		id: 0,
		label: "CUMP après chaque entrée (Inventaire permanent)",
		description: "Dans ce cas, le coût unitaire est calculé après chaque entrée."
	},
	{
		id: 1,
		label: "CUMP calculé sur la durée moyenne de stockage (Inventaire intermittent)",
		description: "Le coût unitaire est calculé sur les entrées enregistrée pendant une période bien déterminée."
	},
];

export default function Configuration() {
	const [value, setValue] = React.useState(0);
	const [organisation, setOrganisation] = React.useState("rangées");
	const [subdivisionStock, setSubdivisionStock] = React.useState("block");
	const [customeSubdivision, setCustomeSubdivision] = React.useState("");
	const [errors, setErrors] = React.useState({});
	const [confirm, setConfirm] = React.useState(false);
	const [refEmplacement, setRefEmplacement] = React.useState("personnalisé");
	const [refProduits, setRefProduits] = React.useState("simple");
	const [gestionStockMethod, setGestionStockMethod] = React.useState(
		"par produit"
	);
	const [
		openGestionStockMethods,
		setOpenGestionStockMethods,
	] = React.useState(false);
	const [methodeValorisation, setMethodeValorisation] = React.useState(
		methodesValorisation[1]
	);
	const [variantCUMP, setVariantCUMP] = React.useState(variantesCUMP[0]);
	const [contrainteFIFO, setContrainteFIFO] = React.useState(variantesFIFO[1]);

	const isActiveOrganisation = (val) => organisation === val;
	const handleSelectOrganisation = (newValue) => {
		if (isActiveOrganisation(newValue)) setOrganisation("");
		else setOrganisation(newValue);
	};

	const isActiveSubdivision = (val) => subdivisionStock === val;
	const handleSubdivision = (val) => {
		setSubdivisionStock(val);
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const isActiveRefEmplacement = (val) => val === refEmplacement;
	const isActiveRefProduits = (val) => val === refProduits;
	const isActiveMethodeGestionStock = (val) => val === gestionStockMethod;
	const isActiveContrainteFIFO = (val) => val === contrainteFIFO.id;
	const isActiveVarianteCUMP = (val) => val === variantCUMP.id;

	const toggleGestionStockMethodes = () => {
		setOpenGestionStockMethods(!openGestionStockMethods);
	};

	const canSave = () => {
		let valid = true;
		if (
			isActiveOrganisation("rangées") &&
			isActiveSubdivision("personnaliser") &&
			customeSubdivision === ""
		) {
			valid = false;
			setErrors((errors) => ({
				...errors,
				subdivisionStock: "Compllétez ce champs.",
			}));
		} else {
			setErrors((errors) => ({ ...errors, subdivisionStock: null }));
		}

		return valid;
	};

	const toggleConfirmation = () => {
		if (canSave() && !confirm) {
			setConfirm(true);
		} else {
			setConfirm(false);
		}
	};
	const handleSaveChanges = () => {
		const data = {
			organisation_stock: organisation,
			organisation_label: organisation,
			subdivision_organisation: subdivisionStock,
			subdivision_label:
				customeSubdivision !== ""
					? customeSubdivision
					: subdivisionStock,
			reference_emplacement: refEmplacement,
			reference_produits: refProduits,
		};
		console.log(data);
	};

	const handleSelectMethodeValorisation = (selected) => {
		setMethodeValorisation(selected);
	};
	return (
		<StyledContainer>
			{confirm && (
				<LargeDialog
					open={confirm}
					title="Configuration des stock"
					message="Voulez-vous Enregistrer les modifications apporées aux configurations ?"
					agreeBtnText="Oui"
					disagreeBtnText="Non"
					onDisagree={toggleConfirmation}
					onAgree={handleSaveChanges}
					onClose={toggleConfirmation}
					agreeBtnProps={{
						variant: "contained",
						disableElevation: true,
					}}
				/>
			)}
			<ConfigLeftAside />
			<StyledWrapper>
				<ConfigurationTabs
					tabs={tabs}
					value={value}
					handleChange={handleChange}
				>
					<>
						<TabPanel index={0} value={value}>
							<Box pt={1}>
								<Box
									component="fieldset"
									border="1px solid #eaeaea"
									borderRadius={1}
									p={1}
								>
									<StyledTreeController>
										<Typography
											variant="caption"
											className="small title"
										>
											Organisation par rangées
										</Typography>
										<Typography
											variant="caption"
											className="small description"
										>
											Lorsque vous choisissez d'organiser
											les stocks par rangées, ce logiciel
											vous permettra de retrouver les
											stocks des produits facilement et
											rapidement en utilisant la référence
											de la rangée où se trouve le
											produit.
										</Typography>
										<FormControlLabel
											className="child1"
											sx={{
												mb: 1,
												width: "fit-content",
												"& > span:first-of-type": {
													marginRight: 0.5,
												},
											}}
											label={
												isActiveOrganisation("rangées")
													? "Desactiver"
													: "Activer"
											}
											componentsProps={{
												typography: {
													variant: "caption",
													className: "small",
												},
											}}
											control={
												<Checkbox
													size="small"
													onChange={() =>
														handleSelectOrganisation(
															"rangées"
														)
													}
													checked={isActiveOrganisation(
														"rangées"
													)}
												/>
											}
										/>
									</StyledTreeController>
									<Box ml={23 / 8}>
										<Divider sx={{ mb: 1.5 }} />
										<Typography
											variant="h2"
											className="small"
										>
											Comment voulez-vous organiser (ou
											subdiviser) les rangées ?
										</Typography>
										<Box display="flex" alignItems="center">
											<StyledTreeController className="inline">
												<FormControlLabel
													onChange={() =>
														handleSubdivision(
															"block"
														)
													}
													disabled={
														!isActiveOrganisation(
															"rangées"
														)
													}
													label="En blocks"
													componentsProps={{
														typography: {
															variant: "caption",
															className: "small",
														},
													}}
													checked={isActiveSubdivision(
														"block"
													)}
													control={
														<Radio
															color="default"
															size="small"
														/>
													}
													sx={{
														width: "fit-content",
														"& > span:first-of-type": {
															marginRight: 0.5,
														},
													}}
												/>
											</StyledTreeController>
											<StyledTreeController className="inline">
												<FormControlLabel
													onChange={() =>
														handleSubdivision(
															"niveau"
														)
													}
													checked={isActiveSubdivision(
														"niveau"
													)}
													disabled={
														!isActiveOrganisation(
															"rangées"
														)
													}
													label="En niveaux"
													componentsProps={{
														typography: {
															variant: "caption",
															className: "small",
														},
													}}
													control={
														<Radio
															color="default"
															size="small"
														/>
													}
													sx={{
														width: "fit-content",
														"& > span:first-of-type": {
															marginRight: 0.5,
														},
													}}
												/>
											</StyledTreeController>
											<StyledTreeController className="inline">
												<FormControlLabel
													onChange={() =>
														handleSubdivision(
															"personnaliser"
														)
													}
													checked={isActiveSubdivision(
														"personnaliser"
													)}
													disabled={
														!isActiveOrganisation(
															"rangées"
														)
													}
													label="Personnaliser"
													componentsProps={{
														typography: {
															variant: "caption",
															className: "small",
														},
													}}
													control={
														<Radio
															color="default"
															size="small"
														/>
													}
													sx={{
														width: "fit-content",
														"& > span:first-of-type": {
															marginRight: 0.5,
														},
													}}
												/>
											</StyledTreeController>
										</Box>
										{isActiveOrganisation("rangées") &&
											isActiveSubdivision(
												"personnaliser"
											) && (
												<Fade
													in={
														isActiveOrganisation(
															"rangées"
														) &&
														isActiveSubdivision(
															"personnaliser"
														)
													}
												>
													<Box mt={2.5}>
														<Typography
															variant="h2"
															className="small title"
														>
															Personnaliser
															l'emplacement dans
															les rangées
														</Typography>
														<TextField
															id="Subdivision des rangées"
															name="subdivision"
															placeholder="Nom de la subdivision des rangées"
															variant="outlined"
															fullWidth
															value={
																customeSubdivision
															}
															onChange={(e) =>
																setCustomeSubdivision(
																	e.target
																		.value
																)
															}
															error={
																errors.subdivisionStock
																	? true
																	: false
															}
															helperText={
																errors.subdivisionStock
															}
															sx={{
																backgroundColor:
																	"#f6f8fa80",
															}}
														/>
													</Box>
												</Fade>
											)}
									</Box>
								</Box>
								<Box
									component="fieldset"
									border="1px solid #eaeaea"
									borderRadius={1}
									p={1}
									mt={2}
								>
									<StyledTreeController>
										<Typography
											variant="caption"
											className="small title"
										>
											Référencement des stocks
										</Typography>
										<Typography
											variant="caption"
											className="small description"
										>
											Définissez comment vous voulez
											référencer vos rangées et produits
											dans vos stocks pour facilité la
											recherche.
										</Typography>
									</StyledTreeController>
									<StyledTreeController>
										<Typography
											variant="caption"
											className="small"
										>
											1. Rangées et autres emplacements
										</Typography>
										<FormControlLabel
											className="child2"
											onChange={() =>
												setRefEmplacement(
													"personnalisé"
												)
											}
											disabled={
												!isActiveOrganisation("rangées")
											}
											label="Référencer par codes personnalisés"
											componentsProps={{
												typography: {
													variant: "caption",
													className: "small",
												},
											}}
											checked={isActiveRefEmplacement(
												"personnalisé"
											)}
											control={
												<Radio
													color="default"
													size="small"
												/>
											}
											sx={{
												mb: 1,
												mt: 1,
												width: "fit-content",
												"& > span:first-of-type": {
													marginRight: 0.5,
												},
											}}
										/>
										<FormControlLabel
											className="child2"
											onChange={() =>
												setRefEmplacement("automatique")
											}
											disabled={
												!isActiveOrganisation("rangées")
											}
											label="Référencer par codes générés automatiquement"
											componentsProps={{
												typography: {
													variant: "caption",
													className: "small",
												},
											}}
											checked={isActiveRefEmplacement(
												"automatique"
											)}
											control={
												<Radio
													color="default"
													size="small"
												/>
											}
										/>
									</StyledTreeController>
									<StyledTreeController>
										<Typography
											variant="caption"
											className="small"
										>
											2. Produits/articles
										</Typography>
										<FormControlLabel
											className="child2"
											onChange={() =>
												setRefProduits("simple")
											}
											label="Référencer par codes simples"
											componentsProps={{
												typography: {
													variant: "caption",
													className: "small",
												},
											}}
											checked={isActiveRefProduits(
												"simple"
											)}
											control={
												<Radio
													color="default"
													size="small"
												/>
											}
											sx={{
												mb: 1,
												mt: 1,
												width: "fit-content",
												"& > span:first-of-type": {
													marginRight: 0.5,
												},
											}}
										/>
										<FormControlLabel
											className="child2"
											onChange={() =>
												setRefProduits("sku")
											}
											label="Référencer par codes SKU (codes-barres internes)"
											componentsProps={{
												typography: {
													variant: "caption",
													className: "small",
												},
											}}
											checked={isActiveRefProduits("sku")}
											control={
												<Radio
													color="default"
													size="small"
												/>
											}
											sx={{
												mb: 1,
												width: "fit-content",
												"& > span:first-of-type": {
													marginRight: 0.5,
												},
											}}
										/>
										<FormControlLabel
											className="child2"
											onChange={() =>
												setRefProduits("upc")
											}
											disabled={
												!isActiveOrganisation("rangées")
											}
											label="Référencer par codes-barres universels (UPC)"
											componentsProps={{
												typography: {
													variant: "caption",
													className: "small",
												},
											}}
											checked={isActiveRefProduits("upc")}
											control={
												<Radio
													color="default"
													size="small"
												/>
											}
											sx={{
												width: "fit-content",
												"& > span:first-of-type": {
													marginRight: 0.5,
												},
											}}
										/>
									</StyledTreeController>
								</Box>
							</Box>
						</TabPanel>
						<TabPanel index={1} value={value}>
							<StyledTreeController>
								<Typography
									variant="h2"
									className="small title"
								>
									La méthode de réapprovisionnement des stocks
								</Typography>
								<Typography
									variant="caption"
									className="small description"
								>
									Vous recevrez les notifications de
									réapprovisionnement de stock selon la
									méthode que vous choisissez.
								</Typography>
								<FormControlLabel
									onChange={() => {
										setGestionStockMethod("par produit");
										toggleGestionStockMethodes();
									}}
									label="Chaque produit a sa méthode de réapprovisionnement"
									componentsProps={{
										typography: {
											variant: "caption",
											className: "small",
										},
									}}
									checked={isActiveMethodeGestionStock(
										"par produit"
									)}
									control={
										<Radio color="default" size="small" />
									}
									sx={{
										mb: 1,
										mt: 1,
										width: "fit-content",
										"& > span:first-of-type": {
											marginRight: 0.5,
										},
									}}
								/>
								<Typography
									variant="caption"
									className="small description child1"
								>
									La méthode d'approvisionnement sera choisie
									et ajoutée à chaque produit lors de sa
									création.
								</Typography>
								<Box
									display="flex"
									alignItems="center"
									onClick={toggleGestionStockMethodes}
								>
									<Typography
										variant="caption"
										className="small"
										sx={{ mb: 1, mt: 1, cursor: "pointer" }}
									>
										Une méthode pour tous les produits
									</Typography>
									<Divider
										sx={{
											flex: 1,
											ml: 1,
											cursor: "pointer",
										}}
									/>
									{!openGestionStockMethods ? (
										<KeyboardArrowDownIcon
											sx={{
												border: "1px solid #eaeaea",
												ml: 1,
												borderRadius: "50%",
												cursor: "pointer",
											}}
											fontSize="medium"
											color="default"
											onClick={toggleGestionStockMethodes}
										/>
									) : (
										<KeyboardArrowUpIcon
											sx={{
												border: "1px solid #eaeaea",
												ml: 1,
												borderRadius: "50%",
												cursor: "pointer",
											}}
											fontSize="medium"
											color="default"
											onClick={toggleGestionStockMethodes}
										/>
									)}
								</Box>
							</StyledTreeController>
							{openGestionStockMethods && (
								<Fade in={openGestionStockMethods}>
									<div>
										<StyledTreeController>
											<FormControlLabel
												className="child1"
												onChange={() =>
													setGestionStockMethod(
														"Réapprovisionnement calendaire"
													)
												}
												label="Réapprovisionnement par la méthode calendaire"
												componentsProps={{
													typography: {
														variant: "caption",
														className: "small",
													},
												}}
												checked={isActiveMethodeGestionStock(
													"Réapprovisionnement calendaire"
												)}
												control={
													<Radio
														color="default"
														size="small"
													/>
												}
												sx={{
													mb: 0.5,
													"& > span:first-of-type": {
														marginRight: 0.5,
													},
												}}
											/>
											<Typography
												variant="caption"
												className="small description child2"
											>
												Avec cette méthode, une
												notification vous sera envoyée à
												une date fixe pour
												approvisionner un produit donné
												pour une quantité fixe.
											</Typography>
										</StyledTreeController>
										<StyledTreeController>
											<FormControlLabel
												className="child1"
												onChange={() =>
													setGestionStockMethod(
														"méthode de recomplètement"
													)
												}
												label="Réapprovisionnement par la méthode de recomplètement"
												componentsProps={{
													typography: {
														variant: "caption",
														className: "small",
													},
												}}
												checked={isActiveMethodeGestionStock(
													"méthode de recomplètement"
												)}
												control={
													<Radio
														color="default"
														size="small"
													/>
												}
												sx={{
													mb: 0.6,
													"& > span:first-of-type": {
														marginRight: 0.5,
													},
												}}
											/>
											<Typography
												variant="caption"
												className="small description child2"
											>
												Avec cette méthode, vous
												commandez autant que nécessaire
												pour revenir au niveau de stock
												maximum défini au préalable.
											</Typography>
										</StyledTreeController>
										<StyledTreeController>
											<FormControlLabel
												className="child1"
												onChange={() =>
													setGestionStockMethod(
														"méthode du point de commande"
													)
												}
												label="Réapprovisionnement par la méthode du point de commande (juste-à-temps)"
												componentsProps={{
													typography: {
														variant: "caption",
														className: "small",
													},
												}}
												checked={isActiveMethodeGestionStock(
													"méthode du point de commande"
												)}
												control={
													<Radio
														color="default"
														size="small"
													/>
												}
												sx={{
													mb: 0.6,
													alignItems: "baseline",
													"& > span:first-of-type": {
														marginRight: 1,
													},
													"& > span:last-child": {
														marginTop: -1,
													},
												}}
											/>
											<Typography
												variant="caption"
												className="small description child2"
											>
												Avec cette méthode, vous
												recevrez une notification
												lorsque le stock critique d'un
												des produits est atteint.
											</Typography>
										</StyledTreeController>
										<StyledTreeController>
											<FormControlLabel
												className="child1"
												onChange={() =>
													setGestionStockMethod(
														"méthode de réapprovisionnement à la commande"
													)
												}
												label="Réapprovisionnement à la commande"
												componentsProps={{
													typography: {
														variant: "caption",
														className: "small",
													},
												}}
												checked={isActiveMethodeGestionStock(
													"méthode de réapprovisionnement à la commande"
												)}
												control={
													<Radio
														color="default"
														size="small"
													/>
												}
												sx={{
													mb: 0.6,
													"& > span:first-of-type": {
														marginRight: 0.5,
													},
												}}
											/>
											<Typography
												variant="caption"
												className="small description child2"
											>
												Avec cette méthode, vous allez
												commander des quantités
												variables à des dates variables.
											</Typography>
										</StyledTreeController>
									</div>
								</Fade>
							)}
						</TabPanel>
						<TabPanel index={2} value={value}>
							<StyledTreeController>
								<Typography variant="h2">
									Méthode de valorisation des stocks
								</Typography>
								<Typography
									variant="caption"
									className="small description child1"
								>
									Pour la valorisation des sorties de stock,
									séléctionnez une méthode. Lors des sorties
									le coût unitaire sera calculé en fonction de
									cette méthode.
								</Typography>
								<div className="child1">
									<Select
										options={methodesValorisation}
										value={methodeValorisation}
										onChange={
											handleSelectMethodeValorisation
										}
									/>
								</div>
							</StyledTreeController>
							<StyledTreeController>
								{methodeValorisation.id === 0 && (
									<Fade in={methodeValorisation.id === 0}>
										<Box>
											{variantesCUMP.map((variante) => (
												<FormControlLabel
													className="child1"
													key={variante.id}
													onChange={() => {
														setVariantCUMP(
															variante
														);
													}}
													label={variante.label}
													componentsProps={{
														typography: {
															variant: "caption",
															className: "small",
														},
													}}
													checked={isActiveVarianteCUMP(
														variante.id
													)}
													control={
														<Radio
															color="default"
															size="small"
														/>
													}
													sx={{
														mb: 0.6,
														"& > span:first-of-type": {
															marginRight: 1,
														},
													}}
												/>
											))}
										</Box>
									</Fade>
								)}
								{methodeValorisation.id === 1 && (
									<Fade in={methodeValorisation.id === 1}>
										<Box>
											{variantesFIFO.map((variante) => (
												<FormControlLabel
													className="child1"
													key={variante.id}
													onChange={() => {
														setContrainteFIFO(
															variante
														);
													}}
													label={variante.label}
													componentsProps={{
														typography: {
															variant: "caption",
															className: "small",
														},
													}}
													checked={isActiveContrainteFIFO(
														variante.id
													)}
													control={
														<Radio
															color="default"
															size="small"
														/>
													}
													sx={{
														mb: 0.6,
														"& > span:first-of-type": {
															marginRight: 1,
														},
													}}
												/>
											))}
										</Box>
									</Fade>
								)}
							</StyledTreeController>
						</TabPanel>
					</> 
				</ConfigurationTabs>
				<div className="actions">
					<Button
						variant="contained"
						color="primary"
						disableElevation
						size="small"
						onClick={toggleConfirmation}
					>
						Enregistrer les modifications
					</Button>
					<Button
						variant="outlined"
						color="default"
						disableElevation
					>
						Configurations par défaut
					</Button>
					<Button variant="outlined" color="default" size="small">
						Annuler
					</Button>
				</div>
			</StyledWrapper>
		</StyledContainer>
	);
}

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <>{children}</>}
		</div>
	);
}

const ConfigLeftAside = () => {
	const assujetti = useSelector(getAssujetti);
	return (
		<aside className="left-aside">
			<div className="aside-header">
				<Avatar
					variant="rounded"
					style={{ width: 40, height: 40 }}
				></Avatar>
				<Typography
					variant="h2"
					sx={{ mt: 1, textTransform: "lowercase" }}
				>
					{assujetti.raison_sociale}
				</Typography>
			</div>
			<div className="aside-body">
				<Typography variant="h2" sx={{ fontWeight: "bold" }}>
					Configuration de la gestion des stocks
				</Typography>
				<Box mt={2.5}>
					
					<Button
						variant="contained"
						color="primary"
						disableElevation
					>
						Ajouter stock
					</Button>
				</Box>
			</div>
		</aside>
	);
};
