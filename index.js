const template = require('babel-template');

const drupalBehavior = template(`Drupal.behaviors.NAME = {attach: function (context, settings) {BODY}};`);

module.exports = function(babel) {
  const t = babel.types;

  return {
    inherits: require("babel-plugin-transform-strict-mode"),
    visitor: {
      Program: {
        exit(path) {
          if (!this.drupalBehavior) {
            this.drupalBehavior = true;

            var camelCase = function camelCase(str) {
              return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
            }

            const storyName = camelCase(this.file.opts.sourceFileName.split('.').slice(0, -1).join('.'));

            const addBehavior = drupalBehavior({
              NAME: t.identifier(storyName),
              BODY: path.node.body
            });

            path.replaceWith(
              t.program([addBehavior])
            );
          }
          path.node.directives = [];
        }
      }
    }
  };
};
