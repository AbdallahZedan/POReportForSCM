sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("POReportForSCM.controller.V_POHeader", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POReportForSCM.view.V_POHeader
		 */
			onInit: function() {
		
			},

		onFindPress: function(oEvent) {
			// debugger;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Route_FindItem",{});
		},

		GoToDetails: function(oEvent) {
			debugger;
			//This code was generated by the layout editor.
			var selectPO = oEvent.getSource().getBindingContext().getProperty("Ebeln");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Route_PODetail", {
				SelectedItem: selectPO
			});
		},
		
		onFilterPO : function (oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("Ebeln", FilterOperator.eq, sQuery));
			}
			debugger;
			// filter binding
			var oList = this.getView().byId("POList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		}

	});

});