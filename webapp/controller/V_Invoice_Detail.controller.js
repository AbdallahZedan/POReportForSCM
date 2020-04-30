sap.ui.define([
	"POReportForSCM/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("POReportForSCM.controller.V_Invoice_Detail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POReportForSCM.view.V_Invoice_Detail
		 */
		onInit: function(oEvent) {
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.getRoute("Route_InvoiceDetail").attachMatched(this._onRouteFound, this);
			var dataModel = sap.ui.getCore().byId("dataModel");
			this.getView().setModel(dataModel, "dataModel");
		},

		// _onRouteFound: function(oEvent) {
		// 	var oArgument = oEvent.getParameter("arguments");
		// 	var xblnr = oArgument.InvoiceRef;
		// 	var oView = this.getView();
		// 	oView.bindElement({
		// 		path: "/DocDetailSet('" + xblnr + "')"
		// 	});
		// }

	});

});