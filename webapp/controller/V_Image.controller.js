sap.ui.define([
	"POReportForSCM/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("POReportForSCM.controller.V_Image", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POReportForSCM.view.V_Image
		 */
		onInit: function() {
			debugger;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Route_ShowImage").attachMatched(this._onRouteFound, this);
		},

		// onBeforeRendering: function() {
		// 	debugger;
		// 	// var imageUrl = "https://cicwd.cic.ae:44301//sap/opu/odata/sap/ZGW_PO3_SRV/ZFILE1Set(Mandt='100',Filename='12.webp')/$value";

		// },

		_onRouteFound: function(oEvt) {
			debugger;
			var oArgument = oEvt.getParameter("arguments");
			// var oView = this.getView().byId("image_id");
			// oView.bindElement({
			// 	path: "ZFILE1Set(Mandt='100',Filename='" + oArgument.fileName + "')"
			// 		// like ZFILE1Set(Mandt='100',Filename='data')
			// });
			var servicePath = this.getOwnerComponent().getModel().sServiceUrl;
			var imageUrl = servicePath + "/ZFILE1Set(Mandt='100',Filename='" + oArgument.fileName +
				"')/$value";
			this.getView().byId("image_id").setSrc(imageUrl);
		},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf POReportForSCM.view.V_Image
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf POReportForSCM.view.V_Image
		 */
		//	onExit: function() {
		//
		//	}

	});

});