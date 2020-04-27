sap.ui.define([
	"POReportForSCM/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
], function(BaseController, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("POReportForSCM.controller.ChangePO", {

		onInit: function() {
			var oModel = this.getOwnerComponent().getModel(),
				oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Route_ChangePO1").attachMatched(this._onRouteFound, this);
		},

		_onRouteFound: function(oEvent) {

			//excute function import of release purchase order
			//make model for release status and bind it to footer
			var oArgument = oEvent.getParameter("arguments"),
				oView = this.getView(),
				dataModel = new JSONModel(),
				releaseModel = new JSONModel(),
				oModel = this.getOwnerComponent().getModel(),
				oTable = this.getView().byId("itemTableId"),
				// get expanded entity 
				poPath = "/POHeaderSet('" + oArgument.selectedPO + "')",
				oFilters = [];

			this.getView().setModel(dataModel, "dataModel");
			this.getView().setModel(releaseModel, "releaseModel");
			// oView.bindElement({
			// 	path: "/POHeaderSet('" + oArgument.SelectedItem + "')"
			// });
			oModel.read(poPath, {

				filters: oFilters,
				urlParameters: {
					"$expand": "POItemSet"
				},
				method: "GET",
				success: function(data) {
					dataModel.setData(data);
					oTable.setBusy(false);
				},
				error: function() {
					oTable.setBusy(false);
				}

			});
			debugger;

		},
		onSavePressed: function(oEvent) {
			debugger;
			var dataModel = this.getView().getModel("dataModel"),
				oModel = this.getOwnerComponent().getModel(),
				docNo = this.getView().getModel("dataModel").getProperty("/Ebeln"),
				oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oEntry = {};
			oEntry.Ebeln = dataModel.getProperty("/Ebeln");
			oEntry.Bukrs = dataModel.getProperty("/Bukrs");
			oEntry.Bsart = dataModel.getProperty("/Bsart");
			oEntry.Loekz = dataModel.getProperty("/Loekz");
			oEntry.Ernam = dataModel.getProperty("/Ernam");
			oEntry.Lifnr = dataModel.getProperty("/Lifnr");

			oEntry.POItemSet = dataModel.getProperty("/POItemSet/results");

			oModel.create("/POHeaderSet", oEntry, {

				success: function(oData, oResponse) {
					MessageBox.success("Purchase order Updated successfully");
					oRouter.navTo("Route_ChangePO1", {
						selectedPO: docNo
					});
				},
				error: function(oError) {
					MessageBox.error("Failure - OData Service could not be called. Please check the Network Tab at Debug.");
				}
			});

		},

		onReleasePressed: function(oEvent) {
			var oModel = this.getOwnerComponent().getModel(),
				oRouter = sap.ui.core.UIComponent.getRouterFor(this),
				docNo = this.getView().getModel("dataModel").getProperty("/Ebeln");
			//call functionImport of release purchase order

			oModel.callFunction("/releasePO", {
				filters: oFilters,
				urlParameters: {
					Ebeln: docNo
				},
				method: "POST",
				success: function(data) {
					releaseModel.setData(data);
					// messagebox for released correctly.	
					MessageBox.success("Purchase Order No. " + docNo + " released successfully");
				},
				error: function() {
					debugger;
					MessageBox.error("unable to release Purchase order No. " + docNo);
				}

			});

		},

		onDelete: function(oEvent) {

			debugger;
			var oTable = this.getView().byId("itemTableId");
			var dataModel = this.getView().getModel("dataModel");
			var oRows = dataModel.getProperty("/POItemSet/results");
			var oContexts = oTable.getSelectedContexts();

			for (var i = 0; i < oContexts.length; i++) {

				var oObject = oContexts[i].getObject();

				var index = $.map(oRows, function(obj, index) {

					if (obj === oObject) {
						return index;
					}
				});

				// The splice() method adds/removes items to/from an array
				oRows.splice(index, 1);
			}

			dataModel.setProperty("/POItemSet/results", oRows);
			oTable.removeSelections(true);

		},

		onPickPressed: function(oEvent) {
			debugger;

			var oTable = this.getView().byId("itemTableId"),
				dataModel = this.getView().getModel("dataModel"),
				docNo = dataModel.getProperty("/Ebeln"),
				oRows = dataModel.getProperty("/POItemSet/results");

			oRows.unshift({
				Ebeln: docNo,
				Ebelp: "",
				Ktmng: "",
				Loekz: false,
				Matnr: "",
				Statu: "",
				Txz01: "",
				oIndex: "0"
			});

			dataModel.setProperty("/POItemSet/resultss", oRows);
			var results = dataModel.getProperty("/POItemSet/results");
			// oFlag = results[oIndex].oIndex;
			oTable.setSelectedItem(oTable.getItems()[0]);
			//  var a = oTable.getSelectedItem();
			var oItem = oTable.getSelectedItem();
			var oIndex = oTable.indexOfItem(oItem);

			results[0].oIndex = oIndex;
			this.onPress(oItem, true);
			dataModel.setProperty("/POItemSet/results", results);
		},

		onEdit: function(oEvent) {

			var oItem = oEvent.getSource(),
				oTable = this.getView().byId("itemTableId"),
				oIndex = oTable.indexOfItem(oItem),
				// flageModel = this.getView().getModel("dataModel"),
				dataModel = this.getView().getModel("dataModel"),
				results = dataModel.getProperty("/POItemSet/results"),
				oFlag = results[oIndex].oIndex;
			if (oFlag === undefined) {
				// oModel.setProperty("/oIndex", oIndex);
				results[0].oIndex = oIndex
				this.onPress(oItem, true);
				dataModel.setProperty("/POItemSet/results", results);
			} else {
				debugger;
				//reset 
				MessageBox.error("Can't edit two items on same time");
			}
		},

		onPress: function(oItem, oFlag) {
			oItem.getDetailControl().setVisible(!oFlag);
			var oCells = oItem.getCells();
			$(oCells).each(function(i) {
				var oCell = oCells[i];
				if (oCell instanceof sap.m.Input) {
					oCell.setEnabled(oFlag);
				}
			});
		},

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