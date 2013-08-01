/*
 * Build profile
 * From your terminal, cd into the directory of this file and execute the following command:
 *
 *  r.js -o require-profile.js
 *
 * See all options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
 */
({
    // The path that represents the project's root folder
    // This path is relative to this file (require-profile.js)
    appDir : '../',

    // This is the main path to which our modules are relative.
    // This path is relative to the `appDir` option.
    baseUrl : 'js/',

    // This is where the build will created.
    // This path is relative to this file (require-profile.js)
    dir : '../../build',

    // This is the runtime configuration options
    // This path is relative to this file (require-profile.js)
    mainConfigFile : 'require-config.js',

    // Set 'none' so you can see how the files are concatenated.
    //optimize : 'none',

    // Used for filtering out matches from your build.
    fileExclusionRegExp : /^\.|node_modules/,

    // Finds require() dependencies inside a require() or define call.
    // This allows our bootstrap module (home.js) to have its dependencies
    // properly traced without having to list them in the module's
    // `include` array in the `modules` array below.
    findNestedDependencies : true,

    // List the modules that will be optimized. All their immediate
    // and deep dependencies will be built into the main module's file.
    modules : [
        {   // This is the bootstrap home.js module. It is the one the that is
            // defined in the require.js script tag's `data-main` attribute
            // and is dynamically loaded by require.js.
            name : 'main'
        }
    ],

    optimize: "uglify",
    removeCombined: true,
    inlineText: true,
    optimizeCss: "standard"
})
