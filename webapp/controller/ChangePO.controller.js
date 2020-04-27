sap.ui.define([
	"POReportForSCM/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
], function(BaseController, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("POReportForSCM.controller.ChangePO", {

		onInit: function() {
			var oModel = this.getOwnerComponent().getModel(),
				oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Route_ChangePO1").attachMatched(this._onRouteFound, this);
		},

		_onRouteFound: function(oEvent) {

			//excute function import of release purchase order
			//make model for release status and bind it to footer
			var oArgument = oEvent.getParameter("arguments"),
				oView = this.getView(),
				dataModel = new JSONModel(),
				releaseModel = new JSONModel(),
				oModel = this.getOwnerComponent().getModel(),
				oTable = this.getView().byId("itemTableId"),
				// get expanded entity 
				poPath = "/POHeaderSet('" + oArgument.selectedPO + "')",
				oFilters = [];

			this.getView().setModel(dataModel, "dataModel");
			this.getView().setModel(releaseModel, "releaseModel");
			// oView.bindElement({
			// 	path: "/POHeaderSet('" + oArgument.SelectedItem + "')"
			// });
			oModel.read(poPath, {

				filters: oFilters,
				urlParameters: {
					"$expand": "POItemSet"
				},
				method: "GET",
				success: function(data) {
					dataModel.setData(data);
					oTable.setBusy(false);
				},
				error: function() {
					oTable.setBusy(false);
				}

			});
			debugger;

		},
		onSavePressed: function(oEvent) {
			debugger;
			var dataModel = this.getView().getModel("dataModel"),
				oModel = this.getOwnerComponent().getModel(),
				oEntry = {};
			oEntry.Ebeln = dataModel.getProperty("/Ebeln");
			oEntry.Bukrs = dataModel.getProperty("/Bukrs");
			oEntry.Bsart = dataModel.getProperty("/Bsart");
			oEntry.Loekz = dataModel.getProperty("/Loekz");
			oEntry.Ernam = dataModel.getProperty("/Ernam");
			oEntry.Lifnr = dataModel.getProperty("/Lifnr");

			oEntry.POItemSet = dataModel.getProperty("/POItemSet/results");

			oModel.create("/POHeaderSet", oEntry, {

				success: function(oData, oResponse) {
					var message;
					var successResponse = oResponse.data.Bukrs;

					switch (successResponse) {
						case "S":
							message = "Database Table updated Successfuly";
							break;
						case "F":
							message = "Database Table were not updated";
							break;
						case "B":
							message = "Blank table(s) were sent. Nothing updated";
							break;
						default:
							message = "Unknown";
					}
				},
				error: function(oError) {
					MessageBox.error("Failure - OData Service could not be called. Please check the Network Tab at Debug.");
				}
			});

		},

		onReleasePressed: function(oEvent) {
			var oModel = this.getOwnerComponent().getModel(),
				oRouter = sap.ui.core.UIComponent.getRouterFor(this),
				docNo = this.getView().getModel("dataModel").getProperty("/Ebeln");
			//call functionImport of release purchase order

			oModel.callFunction("/releasePO", {
				filters: oFilters,
				urlParameters: {
					Ebeln: docNo
				},
				method: "POST",
				success: function(data) {
					releaseModel.setData(data);
					// messagebox for released correctly.	
					MessageBox.success("Purchase Order No. " + docNo + " successfuly released!");
				},
				error: function() {
					debugger;
					MessageBox.error("unable to release Purchase order No. " + docNo);
				}

			});

		},

		onDelete: function(oEvent) {

		},

		onPickPressed: function(oEvent) {

		}

		// onFilterPO: function(oEvent) {

		// 	// build filter array
		// 	var aFilter = [];
		// 	var sQuery = oEvent.getSource().getValue();
		// 	var aFilter = new Filter(
		// 		"Bsart",
		// 		FilterOperator.Contains,
		// 		sQuery
		// 	);

		// 	// if (sQuery) {
		// 	// 	aFilter.push(new Filter("Bsart", FilterOperator.Contains, sQuery));
		// 	// }
		// 	debugger;
		// 	// filter binding
		// 	var oBinding = this.getView().byId("POList").getBinding("items");
		// 	// var oBinding = oList;
		// 	oBinding.filter(aFilter, FilterType.Application);
		// }

	});

});