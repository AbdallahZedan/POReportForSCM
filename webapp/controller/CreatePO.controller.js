sap.ui.define([
	"POReportForSCM/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("POReportForSCM.controller.CreatePO", {

		onInit: function() {

			var dataModel = new JSONModel();
			this.getView().setModel(dataModel, "dataModel");

		},

		onSavePressed: function(oEvent) {

			debugger;
			var dataModel = this.getView().getModel("dataModel"),
				oModel = this.getOwnerComponent().getModel(),
				oRouter = sap.ui.core.UIComponent.getRouterFor(this),
				bukrsInput = this.getView().byId("companyCodeInputId"),
				bsartInput = this.getView().byId("orderTypeInputId"),
				lifnrInput = this.getView().byId("vendorInputId"),
				oTable = this.getView().byId("itemTableId"),
				oItems = oTable.mAggregations.items,

				bukrsOb = {
					id: bukrsInput,
					type: "num",
					max: 4
				},
				bsartOb = {
					id: bsartInput,
					type: "char",
					max: 4
				},
				lifnrOb = {
					id: lifnrInput,
					type: "num",
					max: 10
				},
				oValidator = [bukrsOb, bsartOb, lifnrOb],
				// oValidator = [bukrsInput, bsartInput, lifnrInput],
				oEntry = {};

			oItems.forEach(function(x) {
				var itemOb = {
					id: x.mAggregations.cells[2],
					type: "float",
					max: 13
				};
				oValidator.push(itemOb);
			});
			var validatorFlag = this.validator(oValidator);
			if (!validatorFlag) {
				MessageToast.show("Fill all required inputs");
				return;
			}
			// oEntry.Ebeln = dataModel.getProperty("/Ebeln");
			oEntry.Bukrs = dataModel.getProperty("/Bukrs");
			oEntry.Bsart = dataModel.getProperty("/Bsart");
			oEntry.Statu = dataModel.getProperty("/Statu");
			oEntry.Ernam = dataModel.getProperty("/Ernam");
			oEntry.Lifnr = dataModel.getProperty("/Lifnr");
			// oEntry.Aedat = dataModel.getProperty("/Aedat");
			oEntry.Bstyp = dataModel.getProperty("/Bstyb");
			oEntry.POItemSet = dataModel.getProperty("/POItemSet");

			oModel.create("/POHeaderSet", oEntry, {

				success: function(oData, oResponse) {
					
					MessageBox.success("Purchase order Created successfully.", {
						actions: ["Go to Overview", MessageBox.Action.CLOSE],
						emphasizedAction: "Go to Overview",
						onClose: function(sAction) {
							if (sAction === "CLOSE") {
								oRouter.navTo("Route_DisplayPO", {
									selectedPO: oResponse.data.Ebeln
								});
							} else {
								oRouter.navTo("Route_POHeader", {});
							}
						}

					});

				},
				error: function(oError) {
					MessageBox.error("Failure - OData Service could not be called. Please check the Network Tab at Debug.");
				}
			});

		},

		onDelete: function(oEvent) {

			debugger;
			var oTable = this.getView().byId("itemTableId");
			var dataModel = this.getView().getModel("dataModel");
			var oRows = dataModel.getProperty("/POItemSet");
			var oContexts = oTable.getSelectedContexts();

			for (var i = oContexts.length - 1; i >= 0; i--) {

				var oObject = oContexts[i].getObject();

				var index = $.map(oRows, function(obj, index) {

					if (obj === oObject) {
						return index;
					}
				});

				// The splice() method adds/removes items to/from an array
				oRows.splice(index, 1);
			}

			dataModel.setProperty("/POItemSet", oRows);
			oTable.removeSelections(true);

		},

		onPickPressed: function(oEvent) {
			debugger;

			var oTable = this.getView().byId("itemTableId"),
				dataModel = this.getView().getModel("dataModel"),
				// docNo = dataModel.getProperty("/Ebeln"),
				oRows = dataModel.getProperty("/POItemSet");

			// check if oRows is undefined so we will create empty array 
			if (oRows === undefined) {
				oRows = [];
			}
			oRows.unshift({
				// Ebeln: docNo,
				Ebelp: "",
				Ktmng: "",
				// Loekz: false,
				Matnr: "",
				Statu: "",
				Txz01: ""
					// oIndex: "0"
			});

			dataModel.setProperty("/POItemSet", oRows);
			dataModel.refresh(true);
			var results = dataModel.getProperty("/POItemSet");
			// oFlag = results[oIndex].oIndex;
			oTable.setSelectedItem(oTable.getItems()[0]);
			//  var a = oTable.getSelectedItem();
			var oItem = oTable.getSelectedItem();
			// var oIndex = oTable.indexOfItem(oItem);

			// results[0].oIndex = oIndex;
		},

		onCancelPressed: function(oEvent) {
			this.onNavBack();
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
					case "float":
						oValue = x.id.getValue();
						letterFlag = that.validateFloat(oValue);
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
			var numbers = /^[0-9]+$/;
			if (oValue.match(numbers)) {
				return true;
			} else {
				return false;
			}
		},

		validateFloat: function(oValue) {
			var numbers = /^\d+(\.\d+)?$/;
			if (oValue.match(numbers)) {
				return true;
			} else {
				return false;
			}
		},

	});

});