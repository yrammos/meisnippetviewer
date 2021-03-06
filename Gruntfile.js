module.exports = function (grunt) {

  'use strict';

  // Load plugins. 
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-closurecompiler');

  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),

    requirejs : {
      compile : {
        options : {
          name : 'main',
          baseUrl : 'src',
          mainConfigFile: "src/config.js",
          out : 'tmp/<%= pkg.name %>.build.js',
          exclude : [
            'jquery',
            'vex'
          ],

          optimize : "none",

          done : function (done, output) {
            var duplicates = require('rjs-build-analysis').duplicates(output);
            if (duplicates.length > 0) {
              grunt.log.subhead('Duplicates found in requirejs build:');
              grunt.log.warn(duplicates);
              done(new Error('r.js built duplicate modules, please check the excludes option.'));
            }
            done();
          },
          // based on jQuery's convert function, see https://github.com/jquery/jquery/blob/master/build/tasks/build.js
          onBuildWrite : function (name, path, contents) {
            var rdefineEnd = /\}\);[^}\w]*$/;
            var amdName;
            // Convert var modules
            if (/.\/var\//.test(path)) {
              contents = contents.replace(/define\([\w\W]*?return/, "var " + (/var\/([\w-]+)/.exec(name)[1]) +
                                                                    " =").replace(rdefineEnd, "");

            } else {

              // Ignore jQuery's exports (the only necessary one)
              if (name !== "jquery") {
                contents = contents.replace(/\s*return\s+[^\}]+(\}\);[^\w\}]*)$/, "$1")// Multiple exports
                  .replace(/\s*exports\.\w+\s*=\s*\w+;/g, "");
              }

              // Remove define wrappers, closure ends, and empty declarations
              contents = contents.replace(/define\([^{]*?{/, "").replace(rdefineEnd, "");

              // Remove anything wrapped with
              // /* ExcludeStart */ /* ExcludeEnd */
              // or a single line directly after a // BuildExclude comment
              contents =
              contents.replace(/\/\*\s*ExcludeStart\s*\*\/[\w\W]*?\/\*\s*ExcludeEnd\s*\*\//ig, "").replace(/\/\/\s*BuildExclude\n\r?[\w\W]*?\n\r?/ig, "");

              // Remove empty definitions
              contents = contents.replace(/define\(\[[^\]]+\]\)[\W\n]+$/, "");
            }
            return contents;
          }
        }
      }
    },

    concat : {
      license : {
        options : {
          separator : ';'
        },
        src : [
          'src/licenses.js',
          'tmp/<%= pkg.name %>.closure.js'
        ],
        dest : 'build/<%= pkg.name %>.min.js'
      },

      bower_js : {
        options : {
          separator : ';',
          banner : "(function($, undefined) {var MEI2VF = {}, m2v=MEI2VF;",
          footer : ";var VF=Vex.Flow;})(jQuery);"
        },
        src : [
          'src/licenses.js',
          'bower_components/vexflow/releases/vexflow-debug.js',
          'src/build/post-vexflow.js',
          'tmp/<%= pkg.name %>.build.js'
        ],
        dest : 'build/<%= pkg.name %>.js'
      }
    },

    closurecompiler : {
      minify : {
        files : {
          'tmp/<%= pkg.name %>.closure.js' : ['build/<%= pkg.name %>.js']
        },
        options : {
          "compilation_level" : "SIMPLE_OPTIMIZATIONS",
          "max_processes" : 5,
          "language_in" : "ECMASCRIPT5" // not compatible with IE8, used for trailing commas in VF
        }
      }
    },

    connect : {
      server : {
        options : {
          port : 8000
        }
      }
    },

    watch : {
      scripts : {
        files : ['src/**/*.js'],
        options : {
          livereload : true
        }
      }
    },

  });


  // Tasks.
  grunt.registerTask('default', [
    'requirejs:compile',
    'concat:bower_js',
    'closurecompiler:minify',
    'concat:license'
  ]);

  grunt.registerTask('run', [
    'connect',
    'watch'
  ]);

  grunt.registerTask('compile', ['requirejs:compile']);
  grunt.registerTask('minify', ['closurecompiler:minify']);
}