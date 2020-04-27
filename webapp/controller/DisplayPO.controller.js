sap.ui.define([
	"POReportForSCM/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
], function(BaseController, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("POReportForSCM.controller.DisplayPO", {

		onInit: function() {
			debugger;
			var oModel = this.getOwnerComponent().getModel(),
				oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Route_DisplayPO").attachMatched(this._onRouteFound, this);
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

			oModel.callFunction("/GetReleaseStatus", {
				filters: oFilters,
				urlParameters: {
					Ebeln: oArgument.selectedPO
				},
				method: "GET",
				success: function(data) {
					releaseModel.setData(data);
				},
				error: function() {
					MessageBox.error("Can't get Status of purchase order");
					debugger;
				}

			});
			debugger;
		},

		ChangePO: function(oEvent) {
			debugger;

			//check release status of selected po before going to change screen
			//message box if selected po was released
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this),
				docNo = this.getView().getModel("dataModel").getProperty("/Ebeln");
			oRouter.navTo("Route_DisplayPO", {
				selectedPO: docNo
			});
		},

		CreatePO: function(oEvent) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Route_CreatePO", {});
		},

		onReleasePressed: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//call functionImport of release purchase order
			var oModel = this.getOwnerComponent().getModel(),
				oRouter = sap.ui.core.UIComponent.getRouterFor(this),
				docNo = this.getView().getModel("dataModel").getProperty("/Ebeln"),
				releasePoUrl = "/releasePO?Ebeln='" + docNo + "'",
				xCSRFToken = oModel.getSecurityToken();
			//call functionImport of release purchase order
			// var urlParam = {
			// 	Ebeln: docNo
			// };
			// oModel.bTokenHandling = false;
			// oModel.setHeaders({
			// 	"X-CSRF-Token": xCSRFToken
			// });
			var urlParam = {
					Ebeln: docNo
			};
			
			this.getView().getModel().callFunction("/releasePO", {
				method: "POST",
				urlParameters: urlParam,
				success: function(oData, responce) {
					debugger;
				},
				error: function(oError) {
					debugger;
				}
			});

		},
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