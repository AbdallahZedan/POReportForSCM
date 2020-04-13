sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"POReportForSCM/model/models",
	"POReportForSCM/util/raphael-2.1.4.min",
	"POReportForSCM/util/justgage"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("POReportForSCM.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			//enablie # in routing
			this.getRouter().initialize();
		}
	});
});