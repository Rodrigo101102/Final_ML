const { override, addPostcssPlugins, removeLoaders } = require('customize-cra');

module.exports = override(
  // Disable postcss-normalize
  (config) => {
    const rules = config.module.rules;
    
    // Find the rule that handles CSS files
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (rule.oneOf) {
        for (let j = 0; j < rule.oneOf.length; j++) {
          const oneOf = rule.oneOf[j];
          if (oneOf.test && oneOf.test.toString().includes('css')) {
            // Remove postcss-normalize from the postcss-loader options
            if (oneOf.use) {
              oneOf.use.forEach(loader => {
                if (loader.loader && loader.loader.includes('postcss-loader')) {
                  if (loader.options && loader.options.postcssOptions && loader.options.postcssOptions.plugins) {
                    loader.options.postcssOptions.plugins = loader.options.postcssOptions.plugins.filter(plugin => {
                      return typeof plugin !== 'string' || !plugin.includes('postcss-normalize');
                    });
                  }
                }
              });
            }
          }
        }
      }
    }
    
    return config;
  }
);