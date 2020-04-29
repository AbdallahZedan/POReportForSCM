sap.ui.define([], function() {
	"use-strict";

	return {

		currencyFormat: function(oCurrency) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (oCurrency) {
				case "USD":
					return resourceBundle.getText("usd");
				case "EU":
					return resourceBundle.getText("eu");
				case "LE":
					return resourceBundle.getText("le");
				default:
					return oCurrency;
			}
		}

	};

});