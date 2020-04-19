sap.ui.define([
	"POReportForSCM/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("POReportForSCM.controller.V_Contact_Us", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POReportForSCM.view.V_Contact_Us
		 */
		onInit: function() {

		},

		_getVal: function(evt) {
			return sap.ui.getCore().byId(evt.getParameter('id')).getValue();
		},

		handleTelPress: function(evt) {
			sap.m.URLHelper.triggerTel(this._getVal(evt));
		},

		handleSmsPress: function(evt) {
			sap.m.URLHelper.triggerSms(this._getVal(evt));
		},

		handleEmailPress: function(evt) {
			sap.m.URLHelper.triggerEmail(this._getVal(evt), "Test subject");
		}

	});

});