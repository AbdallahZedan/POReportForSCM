sap.ui.define([
	"POReportForSCM/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, MessageToast, Fragment, Filter, FilterOperator, FilterType, MessageBox) {
	"use strict";

	return BaseController.extend("POReportForSCM.controller.V_Find_Item", {

		onInit: function() {
			debugger;
			var oModel = this.getOwnerComponent().getModel(),
				dataModel = new JSONModel();

			// dataModel.setProperty("/Ebeln", "");
			// dataModel.setProperty("/Ebelp", "");
			oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			// var sPath = jQuery.sap.getModulePath("POReportForSCM","/model/POColumnModel.json");
			// this.jsonModel = new sap.ui.model.json.JSONModel(sPath);
			// var aCols = this.jsonModel.getData().cols;
			// debugger;
			oModel.setSizeLimit(999);
			this.getView().setModel(dataModel, "dataModel");
			sap.ui.getCore().setModel(this.myModel);
		},

		onFindPressed: function(oEvent) {

			var oView = this.getView(),
				oModel = this.getOwnerComponent().getModel(),
				dataModel = oView.getModel("dataModel"),
				ebeln = dataModel.getProperty("/Ebeln"),
				ebelp = dataModel.getProperty("/Ebelp"),
				ebelnOb = {
					id: this.getView().byId("ebeln_input"),
					type: "num",
					max: 10
				},
				ebelpOb = {
					id: this.getView().byId("ebelp_input"),
					type: "num",
					max: 5
				},
				oValidator = [ebelnOb, ebelpOb],
				validatorFlag = this.validator(oValidator);

			// var ebeln = oView.byId("ebeln_input").getValue();
			// var ebelp = oView.byId("ebelp_input").getValue();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			if (validatorFlag) {
				var oPath = "/POItemSet(Ebeln='" + ebeln + "',Ebelp='" + ebelp + "')"
				oModel.read(oPath, {
					method: "GET",
					success: function(data) {
						dataModel.setData(data);
						sap.ui.getCore().setModel(dataModel, "dataModel");
						oRouter.navTo("Route_ItemDetail", {
							// po: ebeln,
							// item: ebelp
						});
					},
					error: function(oError) {
						MessageToast.show("Failed to load item")
					}

				});

			} else {
				MessageBox.error("Please Enter Valid purchase document and item");
			}
		},

		handleValueHelp: function(oEvent) {

			var oModel = this.getOwnerComponent().getModel(),
				oView = this.getView(),
				dataModel = oView.getModel("dataModel"),
				// ebeln = dataModel.getProperty("/Ebeln"),
				// ebelp = dataModel.getProperty("/Ebelp"),
				ebeln = this.getView().byId("ebeln_input").getValue(),
				ebelp = this.getView().byId("ebelp_input").getValue(),
				// oFlage = false,
				oFilters = [];

			oFilters.push(new Filter("Type", FilterOperator.EQ, "poAndItem"));

			if (ebeln) {
				oFilters.push(new Filter("Value1", FilterOperator.Contains, ebeln));
			}

			if (ebelp) {
				oFilters.push(new Filter("Value2", FilterOperator.Contains, ebelp));
			}

			this.getView().setModel(dataModel, "dataModel");
			// var sInputValue = oEvent.getSource().getValue();

			oModel.read("/searchHelpSet", {
				filters: oFilters,
				method: "GET",
				success: function(data) {

					dataModel.setProperty("/results", data.results);
					// oFlag = true;
				},
				error: function(error) {
					MessageToast.show("Failed on load the search help, please try again");
				}

			});

			// setTimeout(function() {
			// if (oFlage) {
			// if (!this._oValueHelpDialog) {
			this._oValueHelpDialog = sap.ui.xmlfragment(this.getView().getId(), "POReportForSCM.view.SearchHelp", this);
			this.getView().addDependent(this._oValueHelpDialog);
			this._oValueHelpDialog.setModel(dataModel);
			// this._configValueHelpDialog(sInputValue);
			this._oValueHelpDialog.open();

			// } else {
			// 	// this._configValueHelpDialog(sInputValue);
			// 	this._oValueHelpDialog.open();
			// }
			// }
			// }, 1000);

		},

		onCloseDialog: function(oEvent) {
			debugger;
			var oTabele = this.getView().byId("searchHelpTableId");
			var oItem = oEvent.getSource();
			var ebeln = oItem.mAggregations.cells[0].mProperties.text;
			var ebelp = oItem.mAggregations.cells[1].mProperties.text;
			// 			var oTable = this.getView().getDependent();
			// var ebeln = oEvent.getSource().getBindingContext().getProperty("Ebeln");
			// var ebelp = oEvent.getSource().getBindingContext().getProperty("Ebelp");
			// this.oView.byId("ebeln_input").setValue(ebeln);
			// this.oView.byId("ebelp_input").setValue(ebelp);
			var dataModel = this.getView().getModel("dataModel");
			dataModel.setProperty("/Ebeln", ebeln);
			dataModel.setProperty("/Ebelp", ebelp);
			this.getView().setModel(dataModel);
			this._oValueHelpDialog.destroy();
		},

		onCancelPressed: function(oEvent) {
			debugger;
			this._oValueHelpDialog.destroy();
		},

		validator: function(oArray) {
			// }
			var oFlag = true,
				letterFlag = true,
				that = this,
				oValue = "";

			oArray.forEach(function(x) {
				switch (x.type) {
					case "char":
						oValue = x.id.getValue();
						letterFlag = that.validateAlph(oValue);
						break;
					case "num":
						oValue = x.id.getValue();
						letterFlag = that.validateAllNumber(oValue);
						break;
					default:
						letterFlag = true;
				}

				if (x.id.getValue().length === 0 || x.id.getValue().length > x.max || letterFlag === false) {
					x.id.setValueState(sap.ui.core.ValueState.Error);
					oFlag = false;
					letterFlag = true;
				} else {
					x.id.setValueState(sap.ui.core.ValueState.None);
				}
			});
			return oFlag;
		},

		validateAlph: function(oValue) {

			var letters = /^[A-Za-z]+$/;
			if (oValue.match(letters)) {
				// alert('Your name have accepted : you can try another');
				return true;
			} else {
				// alert('Please input alphabet characters only');
				return false;
			}

		},

		validateAllNumber: function(oValue) {
			var numbers = /^[-+]?[0-9]+$/;
			if (oValue.match(numbers)) {
				return true;
			} else {
				return false;
			}
		},
	});

});