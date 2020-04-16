sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function(Controller, Fragment, JSONModel /*, Fragment*/ ) {
	"use strict";

	return Controller.extend("POReportForSCM.controller.V_Create_PO", {
		_oDialog: null,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POReportForSCM.view.V_Create_PO
		 */
		onInit: function() {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oModel = new JSONModel();

			this.myLocalModel = new sap.ui.model.json.JSONModel();
			// 			var oArgument = oEvt.getParameter("arguments");
			// 			var po = oArgument.selectedPO;
			this.getView().byId("packItem").setModel(oModel);
			oRouter.getRoute("Route_ChangePO").attachMatched(this._onRouteFound, this);
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.getRoute("Route_createPO").attachMatched(this._onRouteFound, this);

			// var oRouter, oTarget;
			// oRouter = this.getRouter();
			// oTarget = oRouter.getTarget("Target_CreatePO");
			// oTarget.attachDisplay(function (oEvent) {
			// 	var getFrom = oEvent.getParameter("data");	// store the data
			// }, this);	dataModel 
		},

		_onRouteFound: function(oEvt) {

			//var v_res = oEvent.getSource().getParent().getBindingContext().getObject().Ebeln;
			var oArgument = oEvt.getParameter("arguments");
			var po = oArgument.selectedPO;
			var SRVModel = this.getOwnerComponent().getModel();
			// var oTable = this.getView().byId("packItem");
			var packItemModel = this.getView().byId("packItem").getModel();
			var itemData = packItemModel.getProperty("/data");
			var json;
			if (po) {
				var service_url = "/POHeaderSet('" + po + "')";
				var ebeln_url = service_url + "/Ebeln";
				var lifnr_url = service_url + "/Lifnr";
				var bukrs_url = service_url + "/Bukrs";
				var items_url = service_url + "/POItemSet";
				var ebeln = SRVModel.getObject(ebeln_url);
				var lifnr = SRVModel.getObject(lifnr_url);
				var bukrs = SRVModel.getObject(bukrs_url);
				this.getView().byId("companyCode_input").setValue(bukrs);
				this.getView().byId("vendor_input").setValue(lifnr);
				this.getView().byId("save_button").setText("Change");
				this.getView().byId("save_button").setIcon("sap-icon://edit-outside");
				var oJson = {};
				oJson.ebeln = ebeln;
				this.myLocalModel.setData(oJson);
				// var object = SRVModel.getObject(service_url+"/POItemSet");

				SRVModel.read(items_url, {
					success: function(oRetrievedResult) {
						var json = new sap.ui.model.json.JSONModel(oRetrievedResult);
						var result = json.getProperty("/results");
						for (var i = 0; i < result.length; i++) {
							// oData.popup.menuitem[1].onclick
							var itemRow = {
								Material: result[i].Matnr,
								Status: result[i].Statu,
								short_text: result[i].Txz01,
								item_text: result[i].Ebelp
									// Unit: unit
							};

							if (typeof itemData !== "undefined" && itemData !== null && itemData.length > 0) {
								//apend to existed rows
								itemData.push(itemRow);
							} else {
								//append empty row
								itemData = [];
								itemData.push(itemRow);
							}
							packItemModel.setData({
								data: itemData
							});
						}

					},
					error: function(oError) { /* do something */

					}
				});
				// oTable.setModel(json);
				// oTable.bindAggregation("data", { path: "/results"});				
			}
		},

		onPickPressed: function(oEvent) {

			var companyCode = this.getView().byId("companyCode_input").getValue();
			var vendor = this.getView().byId("vendor_input").getValue();

			if (companyCode == "" && vendor == "") {
				alert("invalid");
			}

			var material = this.getView().byId("material_input").getValue();
			var status = this.getView().byId("status_input").getValue();
			var short_text = this.getView().byId("txz01_input").getValue();
			// var unit = this.getView().byId("UOM_input").getValue();
			if (material != "" && status != "" && short_text != "" /*&& unit != ""*/ ) {

				var itemRow = {
					Material: material,
					Status: status,
					short_text: short_text,
					// Unit: unit
				};
				//initalize model to bind item rows
				var oModel = this.getView().byId("packItem").getModel();
				var itemData = oModel.getProperty("/data");

				if (typeof itemData !== "undefined" && itemData !== null && itemData.length > 0) {
					//apend to existed rows
					itemData.push(itemRow);
				} else {
					//append empty row
					itemData = [];
					itemData.push(itemRow);
				}

				//set model
				oModel.setData({
					data: itemData
				});

				//clear all inputs to be ready insert another item
				this.getView().byId("material_input").setValue("");
				this.getView().byId("status_input").setValue("");
				this.getView().byId("txz01_input").setValue("");
				// this.getView().byId("UOM_input").setValue("");

			} else {
				alert("Material/status/short text cannot be blank");
			};

		},

		onDelete: function(oEvent) {

			var oTable = this.getView().byId("packItem");

			var oModel2 = oTable.getModel();
			var aRows = oModel2.getData().data;
			//get all selected items
			var aContexts = oTable.getSelectedContexts();

			for (var i = aContexts.length - 1; i >= 0; i--) {
				var oThisObj = aContexts[i].getObject();

				// $.map() is used for changing the values of an array.

				var index = $.map(aRows, function(obj, index) {

					if (obj === oThisObj) {
						return index;
					}
				});

				// The splice() method adds/removes items to/from an array
				aRows.splice(index, 1);
			}
			// Set the Model with the Updated Data after Deletion
			oModel2.setData({
				data: aRows
			});

			oTable.removeSelections(true);
		},

		onSave: function(oEvent) {
			var nameOfButton = this.getView().byId("save_button").getText();
			var ebeln = this.myLocalModel.oData.ebeln;
			var oTable = this.getView().byId("packItem");
			var oModel = oTable.getModel();
			var oItems = oTable.getItems();
			var itemData = [];

			for (var iRowIndex = 0; iRowIndex < oItems.length; iRowIndex++) {
				var l_material = oModel.getProperty("Material", oItems[iRowIndex].getBindingContext());
				var l_status = oModel.getProperty("Status", oItems[iRowIndex].getBindingContext());
				var l_short_text = oModel.getProperty("short_text", oItems[iRowIndex].getBindingContext());
				var l_item = oModel.getProperty("item_text", oItems[iRowIndex].getBindingContext());
				// var l_unit = oModel.getProperty("Unit", oItems[iRowIndex].getBindingContext());

				itemData.push({
					Matnr: l_material,
					Statu: l_status,
					Txz01: l_short_text,
					Ebelp: l_item
						// Uom: l_unit,
				});
			}

			//get header data
			var companyCode = this.getView().byId("companyCode_input").getValue();
			var vendor = this.getView().byId("vendor_input").getValue();

			//create an object to hold all data
			var oEntry1 = {};

			oEntry1.Bukrs = companyCode;
			oEntry1.Lifnr = vendor;
			//item table
			oEntry1.POItemSet = itemData;
			if (nameOfButton == "Change") {
				oEntry1.Ebeln = ebeln;
			}
			var POModel = this.getOwnerComponent().getModel();

			POModel.create("/POHeaderSet", oEntry1, {

				success: function(oData, oResponse) {
					alert("The backend SAP System is Connected Successfully");

					// var successObj = oResponse.data.HandlingUnit;
					var message; /*= "Batch : " + successObj + "  " + "updated successfully";*/

					var successResponse = oResponse.data.Bukrs;

					switch (successResponse) {
						case "S":
							message = "Database Table updated Successfuly";
							break;
						case "F":
							message = "Database Table were not updated";
							break;
						case "B":
							message = "Blank table(s) were sent. Nothing updated";
							break;
						default:
							message = "Unknown";
					}

					jQuery.sap.require("sap.m.MessageBox");

					sap.m.MessageBox.show(message, {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Backend Table(s) Update Status",
						actions: [sap.m.MessageBox.Action.OK]
					});
				},
				error: function(oError) {
					alert("Failure - OData Service could not be called. Please check the Network Tab at Debug.");
				}
			});

		},

		/*onItemPressed*/
		onIconPress: function(oEvent) {
			// var aa = event.getSource().getSelectedItem();
			// var oColumnListItem = oEvent.getSource().getBindingContext("itemlist").getObject();
			// var oTable = this.getView().byId("packItem");
			// var aContexts = oTable.getSelectedContexts();
			// var oModel2 = oTable.getModel();
			// var aRows = oModel2.getData().data;
			// debugger;
			// var a = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
			// alert(a);

			var oSelectedItem = oEvent.getSource().getParent();
			var oBindingContext = oSelectedItem.getBindingContext();
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("POReportForSCM.view.EditDialog", this);
			}
			var oModel = this.getView().byId("packItem").getModel();
			this._oDialog.setBindingContext(oBindingContext);
			this._oDialog.setModel(oModel);
			this._oDialog.open();

		},

		onButtonPress: function(oEvent) {
			var oDialog = oEvent.getSource().getParent();
			oDialog.close();
		},

		onExit: function() {
			this.getView().destroy();

			this.getView().byId("companyCode_input").setValue("");
			this.getView().byId("vendor_input").setValue("");

			var oModel = this.getView().byId("packItem").getModel();
			var itemData = oModel.getProperty("/data");
			itemData = [];
			oModel.setData({
				data: itemData
			});
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf POReportForSCM.view.V_Create_PO
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf POReportForSCM.view.V_Create_PO
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf POReportForSCM.view.V_Create_PO
		 */
		//	onExit: function() {
		//
		//	}

	});

});