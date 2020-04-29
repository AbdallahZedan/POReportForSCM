sap.ui.define([
	"POReportForSCM/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("POReportForSCM.controller.V_Basic", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POReportForSCM.view.V_Basic
		 */
		onInit: function() {

			var dataModel = new JSONModel(),
				oModel = this.getOwnerComponent().getModel();

			this.getView().setModel(dataModel, "dataModel");

			oModel.read("/userInfoSet('0001000001')", {

				success: function(data) {
					dataModel.setData(data);
				},
				error: function(error) {
					MessageToast.show("Failed to fetch user info");
				}
			});

		},

		onOverviewPress: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Route_POHeader", {});
		},

		onCreatePoPress: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Route_CreatePO1", {});
		},

		onFindItemPress: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Route_FindItem", {});
		},

		onFindInvoicePress: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Route_FindInvoice", {});

		},

		onGaugesPress: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Route_Gauges", {});
		},

		onContactUsPress: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Route_Contact_us", {});
		},

		onUploadPress: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Route_UploadFile", {});
		},
		
		onPressTel: function(oEvent) {
			sap.m.URLHelper.triggerSms(this._getVal(oEvent));
		},

		onPressEmail: function(oEvent) {
			sap.m.URLHelper.triggerEmail(this._getVal(oEvent), "Test subject");	
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf POReportForSCM.view.V_Basic
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf POReportForSCM.view.V_Basic
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf POReportForSCM.view.V_Basic
		 */
		//	onExit: function() {
		//
		//	}

	});

});