sap.ui.define([
	"POReportForSCM/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, MessageBox, MessageToast) {
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
				error: function(oError) {
					oTable.setBusy(false);
					MessageToast.show("Failed to load purchase order detail")
				}

			});
			debugger;

			oModel.callFunction("/GetReleaseStatus", {
				filters: oFilters,
				urlParameters: {
					Ebeln: oArgument.selectedPO
				},
				method: "GET",
				success: function(data) {
					releaseModel.setData(data);
				},
				error: function(oError) {
					MessageToast.show("Can't get Status of purchase order");
					debugger;
				}

			});
			debugger;

		},
		onSavePressed: function(oEvent) {
			debugger;
			var dataModel = this.getView().getModel("dataModel"),
				oModel = this.getOwnerComponent().getModel(),
				docNo = this.getView().getModel("dataModel").getProperty("/Ebeln"),
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
				oEntry = {};

			oItems.forEach(function(x) {
				var itemOb = {
					id: x.mAggregations.cells[3],
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

			oEntry.Ebeln = dataModel.getProperty("/Ebeln");
			oEntry.Bukrs = dataModel.getProperty("/Bukrs");
			oEntry.Bsart = dataModel.getProperty("/Bsart");
			// oEntry.Loekz = dataModel.getProperty("/Loekz");
			oEntry.Ernam = dataModel.getProperty("/Ernam");
			oEntry.Lifnr = dataModel.getProperty("/Lifnr");
			// oEntry.Aedat = dataModel.getProperty("/Aedat");
			oEntry.POItemSet = dataModel.getProperty("/POItemSet/results");

			oModel.create("/POHeaderSet", oEntry, {

				success: function(oData, oResponse) {
					MessageBox.success("Purchase order Updated successfully.", {
						actions: ["Go to Overview", MessageBox.Action.CLOSE],
						emphasizedAction: "Go to Overview",
						onClose: function(sAction) {
							if (sAction === "CLOSE") {
								oRouter.navTo("Route_DisplayPO", {
									selectedPO: docNo
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

		onReleasePressed: function(oEvent) {
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this),
			//call functionImport of release purchase order
			var oModel = this.getOwnerComponent().getModel(),
				oRouter = sap.ui.core.UIComponent.getRouterFor(this),
				docNo = this.getView().getModel("dataModel").getProperty("/Ebeln"),
				releaseMode = this.getView().getModel("releaseModel");
			// releasePoUrl = "/releasePO?Ebeln='" + docNo + "'",
			// xCSRFToken = oModel.getSecurityToken();
			//call functionImport of release purchase order
			// var urlParam = {
			// 	Ebeln: docNo
			// };
			// oModel.bTokenHandling = false;
			// oModel.setHeaders({
			// 	"X-CSRF-Token": xCSRFToken
			// });
			var urlParam = {
				Ebeln: docNo
			};

			oModel.callFunction("/releasePO", {
				method: "POST",
				urlParameters: urlParam,
				success: function(oData, responce) {
					releaseMode.setData(oData);
					MessageBox.success("Purchase order Updated successfully.", {
						actions: [MessageBox.Action.OK],
						emphasizedAction: "Go to Overview",
						onClose: function(sAction) {
							oRouter.navTo("Route_DisplayPO", {
								selectedPO: docNo
							});
						}
					});
				},
				error: function(oError) {
					MessageToast.show("Failure release po request!");
				}
			});

		},

		onDelete: function(oEvent) {

			debugger;
			var oTable = this.getView().byId("itemTableId");
			var dataModel = this.getView().getModel("dataModel");
			var oRows = dataModel.getProperty("/POItemSet/results");
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
				// Loekz: false,
				Matnr: "",
				Statu: "",
				Txz01: ""
					// oIndex: "0"
			});

			dataModel.setProperty("/POItemSet/results", oRows);
			var results = dataModel.getProperty("/POItemSet/results");
			// oFlag = results[oIndex].oIndex;
			oTable.setSelectedItem(oTable.getItems()[0]);
			//  var a = oTable.getSelectedItem();
			var oItem = oTable.getSelectedItem();
			// var oIndex = oTable.indexOfItem(oItem);

			// results[0].oIndex = oIndex;
			this.onPress(oItem, true);
			// dataModel.setProperty("/POItemSet/results", results);
		},

		onEdit: function(oEvent) {

			var oItem = oEvent.getSource(),
				oTable = this.getView().byId("itemTableId"),
				// oIndex = oTable.indexOfItem(oItem),
				// flageModel = this.getView().getModel("dataModel"),
				dataModel = this.getView().getModel("dataModel"),
				results = dataModel.getProperty("/POItemSet/results");
			// oFlag = results[oIndex].oIndex;
			// if (oFlag === undefined) {
			// oModel.setProperty("/oIndex", oIndex);
			// results[0].oIndex = oIndex
			this.onPress(oItem, true);
			// dataModel.setProperty("/POItemSet/results", results);
			// } else {
			// 	debugger;
			// 	//reset 
			// 	MessageBox.error("Can't edit two items on same time");
			// }
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

		CreatePO: function(oEvent) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Route_CreatePO1", {});

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