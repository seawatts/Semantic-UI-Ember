/* jshint node: true */
'use strict';

var path = require('path');

var components = {
  behaviors: {
    api: true,
    colorize: true,
    form: true,
    state: true,
    visibility: true,
    visit: true
  },
  collections: {
    breadcrumb: true,
    form: true,
    grid: true,
    menu: true,
    message: true,
    table: true
  },
  elements: {
    button: true,
    container: true,
    divider: true,
    flag: true,
    header: true,
    icon: true,
    image: true,
    input: true,
    label: true,
    list: true,
    loader: true,
    rail: true,
    reveal: true,
    segment: true,
    step: true
  },
  globals: {
    reset: true,
    site: true
  },
  modules: {
    accordion: true,
    checkbox: true,
    dimmer: true,
    dropdown: true,
    embed: true,
    modal: true,
    nag: true,
    popup: true,
    progress: true,
    rating: true,
    search: true,
    shape: true,
    sidebar: true,
    sticky: true,
    tab: true,
    transition: true
  },
  views: {
    ad: true,
    card: true,
    comment: true,
    feed: true,
    item: true,
    statistic: true
  }
};

var defaults = {
  import: {
    css: true,
    javascript: true,
    components: components,
    images: true,
    fonts: true
  },
  source: {
    css: 'bower_components/semantic-ui/dist',
    javascript: 'bower_components/semantic-ui/dist',
    components: 'bower_components/semantic-ui/dist/components',
    images: 'bower_components/semantic-ui/dist/themes/default/assets/images',
    fonts: 'bower_components/semantic-ui/dist/themes/default/assets/fonts'
  },
  destination: {
    images: 'assets/themes/default/assets/images',
    fonts: 'themes/default/assets/fonts'
  }
};

var getDefault = require('./lib/utils/get-default');

function importComponents(app, importComponentCategories, sourceComponent, componentCategory, includeJs) {
  if (!importComponentCategories[componentCategory]) {
    return;
  }

  // console.log('importing ' + componentCategory + ' ------------------------------');
  for (var component in importComponentCategories[componentCategory]) {
    if (!importComponentCategories[componentCategory].hasOwnProperty(component)) {
      return;
    }

    var shouldImportComponent = importComponentCategories[componentCategory][component];

    if (!shouldImportComponent) {
      return;
    }

    if (componentCategory !== 'behaviors') {
      // console.log('importing ' + component + '.css');
      app.import({
        development: path.join(sourceComponent, component + '.css'),
        production: path.join(sourceComponent, component + '.min.css')
      });
    }

    // There is one exception to this which is the site.js global
    if (includeJs || component === 'site') {
      // console.log('importing ' + component + '.js');
      app.import({
        development: path.join(sourceComponent, component + '.js'),
        production: path.join(sourceComponent, component + '.min.js')
      });
    }
  }
}

module.exports = {
  name: 'semantic-ui-ember',

  included: function(app) {
    var options = (app && app.project.config(app.env)['SemanticUI']) || {};
    var importComponent = getDefault('import', 'components', [options, defaults]);
    var sourceComponent = getDefault('source', 'components', [options, defaults]);
    // var importCss = getDefault('import', 'css', [options, defaults]);
    // var importJavascript = getDefault('import', 'javascript', [options, defaults]);

    importComponents(app, importComponent, sourceComponent, 'behaviors', true);
    importComponents(app, importComponent, sourceComponent, 'collections');
    importComponents(app, importComponent, sourceComponent, 'elements');
    importComponents(app, importComponent, sourceComponent, 'globals');
    importComponents(app, importComponent, sourceComponent, 'modules', true);
    importComponents(app, importComponent, sourceComponent, 'views');

    // var importCss = getDefault('import', 'css', [options, defaults]);
    // if (importCss) {
    //   var sourceCss = getDefault('source', 'css', [options, defaults]);
    //   app.import({
    //     development: path.join(sourceCss, 'semantic.css'),
    //     production: path.join(sourceCss, 'semantic.min.css')
    //   });
    // }

    // var importJavascript = getDefault('import', 'javascript', [options, defaults]);
    // if (importJavascript) {
    //   var sourceJavascript = getDefault('source', 'javascript', [options, defaults]);
    //   app.import({
    //     development: path.join(sourceJavascript, 'semantic.js'),
    //     production: path.join(sourceJavascript, 'semantic.min.js')
    //   });
    // }

    var importImages = getDefault('import', 'images', [options, defaults]);
    if (importImages) {
      var sourceImage = getDefault('source', 'images', [options, defaults]);
      var imageOptions = { destDir: getDefault('destination', 'images', [options, defaults]) };
      app.import(path.join(sourceImage, 'flags.png'), imageOptions);
    }

    var importFonts = getDefault('import', 'fonts', [options, defaults]);
    if (importFonts) {
      var fontExtensions = ['.eot', '.otf', '.svg', '.ttf', '.woff', '.woff2'];
      var sourceFont = getDefault('source', 'fonts', [options, defaults]);
      var fontOptions = { destDir: getDefault('destination', 'fonts', [options, defaults]) };
      for (var i = fontExtensions.length - 1; i >= 0; i--) {
        app.import(path.join(sourceFont, 'icons' + fontExtensions[i]), fontOptions);
      }
    }
  }
};
