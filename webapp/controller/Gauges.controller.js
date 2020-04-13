sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("POReportForSCM.controller.Gauges", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POReportForSCM.view.Gauges
		 */
			onInit: function() {
				
			},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf POReportForSCM.view.Gauges
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf POReportForSCM.view.Gauges
		 */
		onAfterRendering: function() {
			this.GauegeDisplay();
		},

		GauegeDisplay: function() {
			new JustGage({
				id: this.getView().byId("id_Gauge1").sId,
				value: 67,
				min: 0,
				max: 100,
				title: "Sample 1 with HTML"
			});

			new JustGage({
				id: this.getView().byId("id_Gauge2").sId,
				value: getRandomInt(0, 100),
				min: 0,
				max: 100,
				title: "Sample 2 with FlexBox",
				label: "pounds",
				view: this.oView,
				size: 900,
			});

			new JustGage({
				id: this.getView().byId("id_Gauge3").sId,
				value: getRandomInt(0, 100),
				min: 0,
				max: 100,
				title: "Shadow effects",
				label: "",
				shadowOpacity: 1,
				shadowSize: 5,
				shadowVerticalOffset: 10,
				view: this.oView,
				size: 400,
			});
		},
		createGauge: function(container, label, min, max) {
			var config = {
				size: 120,
				label: label,
				min: undefined != min ? min : 0,
				max: undefined != max ? max : 100,
				minorTicks: 5
			};

			var range = config.max - config.min;
			config.greenZones = [{
				from: config.min,
				to: config.min + range * 0.75
			}];
			config.yellowZones = [{
				from: config.min + range * 0.75,
				to: config.min + range * 0.9
			}];
			config.redZones = [{
				from: config.min + range * 0.9,
				to: config.max
			}];

			this.gauges[container] = new Gauge(container, config);
			this.gauges[container].render();
			return this.gauges[container];
		}
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf POReportForSCM.view.Gauges
		 */
		//	onExit: function() {
		//
		//	}

	});

});