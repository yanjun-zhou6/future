const getDefaultExport = module => {
	if (module.__esModule) {
		return module.default;
	}
	return module;
};

module.exports = [
	{
		name: "Button",
		component: getDefaultExport(require("../src/components/button")),
		examplesContext: require.context(
			"../src/components/button/examples",
			true,
			/\.jsx?$/
		),
		examplesContextRaw: require.context(
			"!!raw-loader!../src/components/button/examples",
			true,
			/\.jsx?$/
		)
	},
	{
		name: "Modal",
		component: getDefaultExport(require("../src/components/modal")),
		examplesContext: require.context(
			"../src/components/modal/examples",
			true,
			/\.jsx?$/
		),
		examplesContextRaw: require.context(
			"!!raw-loader!../src/components/modal/examples",
			true,
			/\.jsx?$/
		)
	}
];
