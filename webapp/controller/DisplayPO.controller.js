sap.ui.define([
	"POReportForSCM/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"POReportForSCM/controller/formatter"
], function(BaseController, JSONModel, MessageBox, MessageToast, formatter) {
	"use strict";

	return BaseController.extend("POReportForSCM.controller.DisplayPO", {
		formatter: formatter,
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
				error: function(error) {
					oTable.setBusy(false);
					MessageToast.show("Failed to fetch purchase order document detail");
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
					MessageToast.show("Can't get Status of purchase order");
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
			oRouter.navTo("Route_ChangePO1", {
				selectedPO: docNo
			});
		},

		CreatePO: function(oEvent) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Route_CreatePO1", {});
		},

		onReleasePressed: function(oEvent) {
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this),
			//call functionImport of release purchase order
			var oModel = this.getOwnerComponent().getModel(),
				// oRouter = sap.ui.core.UIComponent.getRouterFor(this),
				docNo = this.getView().getModel("dataModel").getProperty("/Ebeln"),
				releaseMode = this.getView().getModel("releaseModel");
			// releasePoUrl = "/releasePO?Ebeln='" + docNo + "'",
			// xCSRFToken = oModel.getSecurityToken();
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

			oModel.callFunction("/releasePO", {
				method: "POST",
				urlParameters: urlParam,
				success: function(oData, responce) {
					releaseMode.setData(oData);
				},
				error: function(oError) {
					MessageToast.show("Failure release po request!")
				}
			});

		},

	});

});