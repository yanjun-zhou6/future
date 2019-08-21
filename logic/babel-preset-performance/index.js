const validateBoolOption = (name, value, defaultValue) => {
  if (typeof value === 'undefined') {
    value = defaultValue;
  }

  if (typeof value !== 'boolean') {
    throw new Error (`Preset react-app: '${name}' option must be a boolean.`);
  }

  return value;
};

module.exports = function (api, opts) {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;

  var isEnvProduction = env === 'production';

  var useLodash = validateBoolOption (
    'useLodash',
    opts.lodash,
    isEnvProduction
  );

  var useRemovePropTypes = validateBoolOption (
    'useRemovePropTypes',
    opts.removePropTypes,
    isEnvProduction
  );

  return (
    isEnvProduction && {
      plugins: [
        useLodash && [require ('babel-plugin-lodash')],
        useRemovePropTypes && [
          require ('babel-plugin-transform-react-remove-prop-types'),
        ],
      ],
    }
  );
};
