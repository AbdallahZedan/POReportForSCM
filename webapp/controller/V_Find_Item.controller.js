sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("POReportForSCM.controller.V_Find_Item", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POReportForSCM.view.V_Find_Item
		 */
		onInit: function() {
			debugger;

			var myModel = this.getOwnerComponent().getModel();
			myModel.setSizeLimit(999);
		},
		
		onFindPressed: function(oEvent) {
				var oView = this.getView();
				var selectedItem = oView.byId("item_ComboBox").getValue();
				var selectedPO = oView.byId("PO_comboBox").getValue();
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Route_ItemDetail", {
					po: selectedPO,
					item:selectedItem
				});
				debugger;
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf POReportForSCM.view.V_Find_PO
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf POReportForSCM.view.V_Find_PO
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf POReportForSCM.view.V_Find_PO
		 */
		//	onExit: function() {
		//
		//	}

	});

});