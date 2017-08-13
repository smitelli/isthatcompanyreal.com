({
    // The path that represents the project's root folder
    // This path is relative to this file (build.js)
    appDir : '../',

    // This is the main path to which our modules are relative.
    // This path is relative to the `appDir` option.
    baseUrl : 'js',

    // This is where the build will be created.
    // This path is relative to this file (build.js)
    dir: '../../build',

    // This is the runtime configuration options
    // This path is relative to this file (build.js)
    mainConfigFile : 'require-config.js',

    // Finds require() dependencies inside a require() or define call.
    // This allows our main moduleto have its dependencies properly traced
    // without having to list them in the module's `include` array in the
    // `modules` array below.
    findNestedDependencies : true,

    // Use almond in the built JS to reduce everything down to one file.
    include: ['lib/almond/almond'],
    name: 'main',

    // Misc output twiddling.
    optimize                : 'uglify',
    optimizeCss             : 'standard',
    inlineText              : true,
    preserveLicenseComments : false
})
