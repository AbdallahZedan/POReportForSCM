sap.ui.define([
	"POReportForSCM/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("POReportForSCM.controller.V_ItemDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POReportForSCM.view.V_ItemDetail
		 */
		onInit: function(oEvent) {
			debugger;
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.getRoute("Route_ItemDetail").attachMatched(this._onRouteFound, this);
			
			var dataModel = sap.ui.getCore().byId("dataModel");
			this.getView().setModel(dataModel,"dataModel");
		},

		// _onRouteFound: function(oEvent) {
		// 	debugger;
		// 	var oArgument = oEvent.getParameter("arguments");
		// 	var po = oArgument.po;
		// 	var item = oArgument.item;
		// 	var oView = this.getView();
		// 	oView.bindElement({
		// 		path: "/POItemSet(Ebeln='" + po + "',Ebelp='" + item + "')"
		// 	});
		// 	debugger;
		// }

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf POReportForSCM.view.V_ItemDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf POReportForSCM.view.V_ItemDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf POReportForSCM.view.V_ItemDetail
		 */
		//	onExit: function() {
		//
		//	}

	});

});