sap.ui.define([
	"POReportForSCM/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType"
], function(BaseController, JSONModel, MessageBox, MessageToast, Fragment, Filter, FilterOperator, FilterType) {
	"use strict";

	return BaseController.extend("POReportForSCM.controller.V_Find_Invoice", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POReportForSCM.view.V_Find_Invoice
		 */
		onInit: function() {
			// debugger;
			var dataModel = new JSONModel();
			this.getView().setModel(dataModel, "dataModel");
		},

		onPressFind: function(oEvent) {

			debugger;
			var dataModel = this.getView().getModel("dataModel"),
				oModel = this.getOwnerComponent().getModel(),
				xblnr = dataModel.getProperty("/Xblnr"),
				xblnrOb = {
					id: this.getView().byId("invoice_input"),
					type: "num",
					max: 16
				},
				oValidator = [xblnrOb],
				validatorFlag = sap.ui.controller("POReportForSCM.controller.V_Find_Item").validator(oValidator),
				oRouter = sap.ui.core.UIComponent.getRouterFor(this),
				oPath = "";

			if (validatorFlag) {
				oPath = "/DocDetailSet('" + xblnr + "')";
				oModel.read(oPath, {
					method: "GET",
					success: function(data) {
						dataModel.setData(data);
						sap.ui.getCore().setModel(dataModel, "dataModel");
						oRouter.navTo("Route_InvoiceDetail", {
							InvoiceRef: xblnr
						});
					},
					error: function(oError) {
						MessageToast.show("Failed to load item")
					}
				});

			} else {
				MessageToast.show("Please enter valid refrence number");
			}
		},

		onPressValueHelp: function(oEvent) {
			var oModel = this.getOwnerComponent().getModel(),
				oView = this.getView(),
				dataModel = oView.getModel("dataModel"),
				// ebeln = dataModel.getProperty("/Ebeln"),
				// ebelp = dataModel.getProperty("/Ebelp"),
				xblnr = dataModel.getProperty("/Xblnr"),
				// oFlage = false,
				oFilters = [];

			oFilters.push(new Filter("Type", FilterOperator.EQ, "rseg_help_"));

			if (xblnr) {
				oFilters.push(new Filter("Value1", FilterOperator.Contains, xblnr));
			}
			
			this.getView().setModel(dataModel, "dataModel");
			// var sInputValue = oEvent.getSource().getValue();

			oModel.read("/searchHelpSet", {
				filters: oFilters,
				method: "GET",
				success: function(data) {

					dataModel.setProperty("/results", data.results);
					// oFlag = true;
				},
				error: function(error) {
					MessageToast.show("Failed on load the search help, please try again");
				}

			});

			// setTimeout(function() {
			// if (oFlage) {
			// if (!this._oValueHelpDialog) {
			this._oValueHelpDialog = sap.ui.xmlfragment(this.getView().getId(), "POReportForSCM.view.InvoiceSearchHelp", this);
			this.getView().addDependent(this._oValueHelpDialog);
			this._oValueHelpDialog.setModel(dataModel);
			// this._configValueHelpDialog(sInputValue);
			this._oValueHelpDialog.open();

		},
		
		onCloseDialog: function(oEvent) {
			debugger;
			var oTabele = this.getView().byId("searchHelpTableId");
			var oItem = oEvent.getSource();
			var xblnr = oItem.mAggregations.cells[0].mProperties.text;
			var dataModel = this.getView().getModel("dataModel");
			dataModel.setProperty("/Xblnr", xblnr);
			this.getView().setModel(dataModel);
			this._oValueHelpDialog.destroy();
		},

		onCancelPressed: function(oEvent) {
			debugger;
			this._oValueHelpDialog.destroy();
		},
		
	});

});