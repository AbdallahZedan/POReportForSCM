sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";
	return Controller.extend("POReportForSCM.controller.V_POItem", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POReportForSCM.view.V_POItem
		 */
		onInit: function() {
			// debugger;
			debugger;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Route_Item").attachMatched(this._onRouteFound, this);
		},
		_onRouteFound: function(oEvent) {
			// debugger;
			// var oArgument = oEvent.getParameter("arguments");
			// var po = oArgument.SelectedPO;
			// var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGW_PO3_SRV/POHeaderSet");
			// this.getView().setModel(oModel);
			// debugger;
			// var filters = new sap.ui.model.Filter({
			// 	and: true,
			// 	filters: []
			// });
			// var binding = this.byId("it_item").getBinding("items");
			// binding.filter(filters);
			// debugger;
			var oArgument = oEvent.getParameter("arguments");
			var oView = this.getView();
			oView.bindElement({
				path: "/POHeaderSet('" + oArgument.SelectedPO + "')"
			});
			debugger;
		},
		/**
		 *@memberOf POReportForSCM.controller.V_POItem
		 */
		GoBack: function(oEvent) {

			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			// Go one screen back if you find a Hash
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			}
			// If you do not find a correct Hash, go to the Source screen using default router;
			else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("", true);
			}
		}
	});
});