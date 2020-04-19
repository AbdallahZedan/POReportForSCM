sap.ui.define([
	"POReportForSCM/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/odata/ODataModel",
	"sap/m/MessageToast",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/MessageBox",
	"sap/m/List",
	"sap/m/StandardListItem"
], function(BaseController, Filter, FilterOperator, ODataModel, MessageToast, Button, Dialog, MessageBox, List, StandardListItem) {
	"use strict";

	var name;
	var mandt;

	return BaseController.extend("POReportForSCM.controller.V_Upload_File", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POReportForSCM.view.V_Upload_File
		 */
		onInit: function() {
			debugger;
			this.myLocalModel = new sap.ui.model.json.JSONModel();
		},

		handleUploadComplete: function() {
			sap.m.MessageToast.show("File Uploaded");
			var oFilerefresh = this.getView().byId("itemlist");
			oFilerefresh.getModel("Data").refresh(true);
			sap.m.MessageToast.show("File refreshed");

		},

		handleUploadPress: function() {
			var oModel = this.getOwnerComponent().getModel();

			var oFileUploader = this.getView().byId("fileUploader");

			var oJson = {};
			oJson.fileName = oFileUploader.getValue();
			this.myLocalModel.setData(oJson);

			if (oFileUploader.getValue() === "") {
				MessageToast.show("Please Choose any File");
			}
			oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				name: "SLUG",
				value: oFileUploader.getValue()
			}));
			oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				name: "po",
				value: "12234"
			}));

			oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				name: "x-csrf-token",
				value: oModel.getSecurityToken()
			}));
			oFileUploader.setSendXHR(true);

			oFileUploader.upload();

			this.getView().byId("shoWImage_button").setEnabled(true);

		},

		onShowImagePress: function(oEvent) {
			var fileName = this.myLocalModel.oData.fileName;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Route_ShowImage", {
				fileName: fileName
			});

		}

		// fun: function(oEvent) {
		// 	var ctx = oEvent.getSource().getBindingContext("Data");
		// 	name = ctx.getObject().Filename;
		// 	mandt = ctx.getObject().Mandt;
		// 	var oModel = new sap.ui.model.odata.ODataModel("Put path of Odata with destination Here");
		// 	oModel.getData("/Data");
		// 	oModel.read("/ZFILE1Set(Mandt='" + mandt + "',Filename='" + name + "')/$value", {

		// 		success: function(oData, response) {
		// 			var file = response.requestUri;
		// 			window.open(file);

		// 		},
		// 		error: function() {

		// 		}
		// 	});

		// }
	});

});