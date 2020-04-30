sap.ui.define([
	"POReportForSCM/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, MessageBox, MessageToast) {
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

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf POReportForSCM.view.V_Find_Invoice
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf POReportForSCM.view.V_Find_Invoice
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf POReportForSCM.view.V_Find_Invoice
		 */
		//	onExit: function() {
		//
		//	}

	});

});