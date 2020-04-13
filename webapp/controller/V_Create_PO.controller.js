sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("POReportForSCM.controller.V_Create_PO", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POReportForSCM.view.V_Create_PO
		 */
		onInit: function() {
			var oModel = new JSONModel();
			this.getView().byId("packItem").setModel(oModel);

			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.getRoute("Route_createPO").attachMatched(this._onRouteFound, this);

			// var oRouter, oTarget;
			// oRouter = this.getRouter();
			// oTarget = oRouter.getTarget("Target_CreatePO");
			// oTarget.attachDisplay(function (oEvent) {
			// 	var getFrom = oEvent.getParameter("data");	// store the data
			// }, this);	dataModel 
		},

		onPickPressed: function(oEvent) {


			var companyCode = this.getView().byId("companyCode_input").getValue();
			var plant = this.getView().byId("plant_input").getValue();

			if (companyCode == "" && plant == "") {
				alert("invalid");
			}

			var material = this.getView().byId("material_input").getValue();
			var batch = this.getView().byId("batch_input").getValue();
			var quantity = this.getView().byId("quantity_input").getValue();
			// var unit = this.getView().byId("UOM_input").getValue();
			if (material != "" && batch != "" && quantity != "" /*&& unit != ""*/) {

				var itemRow = {
					Material: material,
					Batch: batch,
					Quantity: quantity,
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
				this.getView().byId("quantity_input").setValue("");
				this.getView().byId("batch_input").setValue("");
				// this.getView().byId("UOM_input").setValue("");

			} else {
				alert("Material/Batch/Quantity/UOM cannot be blank");
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
			debugger;
			var oTable = this.getView().byId("packItem");
			var oModel = oTable.getModel();
			var oItems = oTable.getItems();
			var itemData = [];

			for (var iRowIndex = 0; iRowIndex < oItems.length; iRowIndex++) {
				var l_material = oModel.getProperty("Material", oItems[iRowIndex].getBindingContext());
				var l_batch = oModel.getProperty("Batch", oItems[iRowIndex].getBindingContext());
				var l_quantity = oModel.getProperty("Quantity", oItems[iRowIndex].getBindingContext());
				// var l_unit = oModel.getProperty("Unit", oItems[iRowIndex].getBindingContext());

				itemData.push({
					Batch: l_batch,
					Matnr: l_material,
					Qty: l_quantity,
					// Uom: l_unit,
				});
			}

			//get header data
			var companyCode = this.getView().byId("companyCode_input").getValue();
			var plant = this.getView().byId("plant_input").getValue();

			//create an object to hold all data
			var oEntry1 = {};

			oEntry1.Bukrs = companyCode;
			oEntry1.Werks = plant;
			//item table
			oEntry1.Stack_HU_Pack_MatSet = itemData;
			var createPOModel = this.getOwnerComponent().getModel();

			createPOModel.create("/Stack_HU_HeadSet", oEntry1, {

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

		// _onRouteFound: function(oEvent) {
		// 	var oArgument = oEvent.getParameter("arguments");
		// 	var oView = this.getView();
		// 	oView.bindElement({
		// 		path: "/POHeaderSet('" + oArgument.SelectedItem + "')"
		// 	});
		// },

		CreatePO: function(evt) {

			var oView = this.getView();
			var poValue = oView.byId("po_input").getValue();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.navTo("Router_CreateItems", {
				po_input: poValue
			});
		}

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