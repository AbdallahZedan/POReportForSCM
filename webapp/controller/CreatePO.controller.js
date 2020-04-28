sap.ui.define([
	"POReportForSCM/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
], function(BaseController, JSONModel, MessageBox) {
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
				// docNo = this.getView().getModel("dataModel").getProperty("/Ebeln"),
				oRouter = sap.ui.core.UIComponent.getRouterFor(this),

				oEntry = {};
			// oEntry.Ebeln = dataModel.getProperty("/Ebeln");
			oEntry.Bukrs = dataModel.getProperty("/Bukrs");
			oEntry.Bsart = dataModel.getProperty("/Bsart");
			oEntry.Loekz = dataModel.getProperty("/Loekz");
			oEntry.Ernam = dataModel.getProperty("/Ernam");
			oEntry.Lifnr = dataModel.getProperty("/Lifnr");

			oEntry.POItemSet = dataModel.getProperty("/POItemSet");

			oModel.create("/POHeaderSet", oEntry, {

				success: function(oData, oResponse) {
					//GET RECENTLY EBELN
					MessageBox.success("Purchase order Updated successfully");
					oRouter.navTo("Route_DisplayPO", {
						selectedPO: docNo
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
				Loekz: false,
				Matnr: "",
				Statu: "",
				Txz01: "",
				oIndex: "0"
			});

			dataModel.setProperty("/POItemSet", oRows);
			dataModel.refresh(true);
			var results = dataModel.getProperty("/POItemSet");
			// oFlag = results[oIndex].oIndex;
			oTable.setSelectedItem(oTable.getItems()[0]);
			//  var a = oTable.getSelectedItem();
			var oItem = oTable.getSelectedItem();
			var oIndex = oTable.indexOfItem(oItem);

			results[0].oIndex = oIndex;
		},

		onEdit: function(oEvent) {

			var oItem = oEvent.getSource(),
				oTable = this.getView().byId("itemTableId"),
				oIndex = oTable.indexOfItem(oItem),
				// flageModel = this.getView().getModel("dataModel"),
				dataModel = this.getView().getModel("dataModel"),
				results = dataModel.getProperty("/POItemSet"),
				oFlag = results[oIndex].oIndex;
			if (oFlag === undefined) {
				// oModel.setProperty("/oIndex", oIndex);
				results[0].oIndex = oIndex
				this.onPress(oItem, true);
				dataModel.setProperty("/POItemSet", results);
			} else {
				debugger;
				//reset 
				MessageBox.error("Can't edit two items on same time");
			}
		},

		onCancelPressed: function(oEvent) {
			this.onNavBack();
		},

		// onPress: function(oItem, oFlag) {
		// 	oItem.getDetailControl().setVisible(!oFlag);
		// 	var oCells = oItem.getCells();
		// 	$(oCells).each(function(i) {
		// 		var oCell = oCells[i];
		// 		if (oCell instanceof sap.m.Input) {
		// 			oCell.setEnabled(oFlag);
		// 		}
		// 	});
		// },

		// onSaveEdit: function(oEvent) {
		// 	//POST
		// 	this.changeBack(oEvent);
		// },

		// onCancelEdit: function(oEvent) {
		// 	this.changeBack(oEvent);
		// },

		// changeBack: function(oEvent) {
		// 	var oItem = oEvent.getSource().getParent(),
		// 		oModel = this.getView().getModel("dataModel");
		// 	oModel.setProperty("/oIndex", undefined);
		// 	this.onPress(oItem, false);
		// },
		// onFilterPO: function(oEvent) {

		// 	// build filter array
		// 	var aFilter = [];
		// 	var sQuery = oEvent.getSource().getValue();
		// 	var aFilter = new Filter(
		// 		"Bsart",
		// 		FilterOperator.Contains,
		// 		sQuery
		// 	);

		// 	// if (sQuery) {
		// 	// 	aFilter.push(new Filter("Bsart", FilterOperator.Contains, sQuery));
		// 	// }
		// 	debugger;
		// 	// filter binding
		// 	var oBinding = this.getView().byId("POList").getBinding("items");
		// 	// var oBinding = oList;
		// 	oBinding.filter(aFilter, FilterType.Application);
		// }

	});

});