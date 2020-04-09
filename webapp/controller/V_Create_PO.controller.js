sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("POReportForSCM.controller.V_Create_PO", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POReportForSCM.view.V_Create_PO
		 */
		onInit: function() {
			debugger;
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.getRoute("Route_createPO").attachMatched(this._onRouteFound, this);

			// var oRouter, oTarget;
			// oRouter = this.getRouter();
			// oTarget = oRouter.getTarget("Target_CreatePO");
			// oTarget.attachDisplay(function (oEvent) {
			// 	var getFrom = oEvent.getParameter("data");	// store the data
			// }, this);	dataModel 
		},

		// _onRouteFound: function(oEvent) {
		// 	var oArgument = oEvent.getParameter("arguments");
		// 	var oView = this.getView();
		// 	oView.bindElement({
		// 		path: "/POHeaderSet('" + oArgument.SelectedItem + "')"
		// 	});
		// },

		CreatePO: function(evt) {

			var oView = this.getView();
			var poValue = oView.byId("po_input").getValue();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.navTo("Router_CreateItems", {
				po_input: poValue
			});
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf POReportForSCM.view.V_Create_PO
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf POReportForSCM.view.V_Create_PO
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf POReportForSCM.view.V_Create_PO
		 */
		//	onExit: function() {
		//
		//	}

	});

});