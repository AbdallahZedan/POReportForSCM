sap.ui.define([
	"POReportForSCM/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function(BaseController, MessageToast, Fragment) {
	"use strict";

	return BaseController.extend("POReportForSCM.controller.V_Find_Item", {

		onInit: function() {
			debugger;
			var myModel = this.getOwnerComponent().getModel();
			myModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			// var sPath = jQuery.sap.getModulePath("POReportForSCM","/model/POColumnModel.json");
			// this.jsonModel = new sap.ui.model.json.JSONModel(sPath);
			// var aCols = this.jsonModel.getData().cols;
			// debugger;
			myModel.setSizeLimit(999);
			sap.ui.getCore().setModel(this.myModel);
		},

		onFindPressed: function(oEvent) {
			var oView = this.getView();
			// var selectedItem = oView.byId("item_ComboBox").getValue();
			// var selectedPO = oView.byId("PO_comboBox").getValue();
			var ebeln = oView.byId("ebeln_input").getValue();
			var ebelp = oView.byId("ebelp_input").getValue();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			if (ebeln && ebelp) {
				oRouter.navTo("Route_ItemDetail", {
					po: ebeln,
					item: ebelp
				});

			} else {
				var message = "Please Enter Valid purchase document and item";
				this.alertFunc(message);
			}
		},

		alertFunc: function(message) {
			jQuery.sap.require("sap.m.MessageBox");

			sap.m.MessageBox.show(message, {
				icon: sap.m.MessageBox.Icon.SUCCESS,
				title: "Error",
				actions: [sap.m.MessageBox.Action.OK]
			});
		},

		handleValueHelp: function(oEvent) {

			var myModel = this.getOwnerComponent().getModel();
			// var sInputValue = oEvent.getSource().getValue();
			if (!this._oValueHelpDialog) {
				this._oValueHelpDialog = sap.ui.xmlfragment(this.getView().getId(), "POReportForSCM.view.SearchHelp", this);
				this.getView().addDependent(this._oValueHelpDialog);
				this._oValueHelpDialog.setModel(myModel);
				// this._configValueHelpDialog(sInputValue);
				this._oValueHelpDialog.open();

			} else {
				// this._configValueHelpDialog(sInputValue);
				this._oValueHelpDialog.open();
			}
		},

		onCloseDialog: function(oEvent) {
			debugger;
			var ebeln = oEvent.getSource().getBindingContext().getProperty("Ebeln");
			var ebelp = oEvent.getSource().getBindingContext().getProperty("Ebelp");
			this.oView.byId("ebeln_input").setValue(ebeln);
			this.oView.byId("ebelp_input").setValue(ebelp);
			this._oValueHelpDialog.destroy();
		},

		onCancelPressed: function(oEvent) {
				debugger;
				this._oValueHelpDialog.destroy();

			}
			// _configValueHelpDialog: function(sInputValue) {
			// 	var myModel = this.getOwnerComponent().getModel();

		// 	myModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		// 	//var poList = myModel.getProperty('/ZJ1bnfeEbelpForEbelnSet');
		// 	myModel.read("/ZJ1bnfeEbelpForEbelnSet", {
		// 		success: function(oRetrievedResult) {
		// 			var json = new sap.ui.model.json.JSONModel(oRetrievedResult);
		// 			var result = json.getProperty("/results");
		// 			result.forEach(function(oList) {
		// 				oList.selected = (oList.Ebelp === sInputValue);
		// 			});
		// 			myModel.setProperty("/ZJ1bnfeEbelpForEbelnSet", result);
		// 		},
		// 		error: function(oError) { /* do something */
		// 			alert("error");
		// 		}
		// 	});

		// },

		//		// onRecordPressed
		// handleValueHelpClose: function(oEvent) {

		// 	// var s = oEvent.getParameter("item_id");
		// 	// if (s) {
		// 	// 	var a = s.getBindingContext().getObject().Ebelp;
		// 	// 	this.getView().byId("ebeln_input").setValue(a);
		// 	// }
		// 	var oModel = this.getView().getModel(),
		// 		oInput = this.byId("ebelp_input");
		// 	oModel.read("/ZJ1bnfeEbelpForEbelnSet", {
		// 		success: function(oRetrievedResult) {
		// 			var json = new sap.ui.model.json.JSONModel(oRetrievedResult);
		// 			var result = json.getProperty("/results");

		// 			var bHasSelected = result.some(function(oList) {
		// 				if (oList.selected) {
		// 					oInput.setValue(oList.Ebelp);
		// 					return true;
		// 				}

		// 				if (!bHasSelected) {
		// 					oInput.setValue(null);
		// 				}
		// 			});

		// 		},
		// 		error: function(oError) { /* do something */
		// 			alert("error");
		// 		}
		// 	});

		// },

		// handleValueHelp: function(oEvent) {

		// 	var oModel = this.getOwnerComponent().getModel();
		// 	var sInputValue = oEvent.getSource().getValue();
		// 	this.inputId = oEvent.getSource().getId();
		// 	var path;
		// 	var oTableStdListTemplate;
		// 	var oFilterTableNo;
		// 	this.oDialog = sap.ui.xmlfragment("POReportForSCM.view.SearchHelp", this);
		// 	path = "cicwd.cic.ae:44301//sap/opu/odata/sap/ZGW_PO3_SRV/ZJ1bnfeEbelpForEbelnSet";
		// 	oTableStdListTemplate = new sap.m.StandardListItem({
		// 		title: "{Ebeln}",
		// 		description: "{Ebelp}"
		// 	}); // //create a filter for the binding
		// 	oFilterTableNo = new sap.ui.model.Filter("Ebelp", sap.ui.model.FilterOperator.EQ, sInputValue);
		// 	this.oDialog.unbindAggregation("item");
		// 	// this.oDialog.setModel(oModel);
		// 	this.oDialog.bindAggregation("item", {
		// 		path: path,
		// 		template: oTableStdListTemplate,
		// 		filters: [oFilterTableNo]
		// 	}); // }// open value help dialog filtered by the input value
		// 	this.oDialog.open(sInputValue);
		// },

		// handleTableValueHelpConfirm: function(e) {
		// 	debugger;
		// 	var s = e.getParameter("selectedItem");
		// 	if (s) {
		// 		this.byId(this.inputId).setValue(s.getBindingContext().getObject().Bname);
		// 		this.readRefresh(e);
		// 	}
		// 	this.oDialog.destroy();
		// }

	});

});