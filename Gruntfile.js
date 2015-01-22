'use strict';

module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var yeoman = {
    app:      'src',
    dist:     '',

    htmlDir:  'html',

    scssDir:  'scss',
    cssDir:   'styles',

    imagesDir:  'images',
    jsDir:      'scripts'
  };

  grunt.initConfig({

    yeoman: yeoman,

    /*
    * Watches files for changes and runs tasks based on the changed files
    */
    watch: {
      options: {
      },
      bower: {
        files: ['bower.json'],
        tasks: ['install:bower', 'bower:require']
      },
      sass: {
        files: ['<%= yeoman.app %>/<%= yeoman.scssDir %>/**/*.scss'],
        tasks: ['sass:dist','autoprefixer']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/<%= yeoman.cssDir %>/{,*/}*.css',
          '<%= yeoman.app %>/<%= yeoman.jsDir %>/**/*.js',
          '<%= yeoman.app %>/<%= yeoman.imagesDir %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    /*
    * The actual grunt server settings
    */
    connect: {
      options: {
        port: 9000,
        hostname: '127.0.0.1',
        livereload: false,
        keepalive: false
      },
      server: {
        options: {
          open: 'http://127.0.0.1:9000/index.html'
        }
      }
    },

    usemin: {
      options: {
        assetsDirs: ['.']
      },
      html: ['*.html'],
      css: ['<%= yeoman.cssDir %>/{,*/}*.css']
    },

    /*
    * Minify images
    */
    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/<%= yeoman.imagesDir %>',
            src: '**/*.{png,jpg,jpeg,gif,svg}',
            dest: '<%= yeoman.imagesDir %>'
          }
        ]
      }
    },

    /*
    * Copy compiled html to `dist` folder
    */
    copy: {
      images: {
        expand: true,
        cwd: '<%= yeoman.app %>/images/',
        src: '**',
        dest: 'images/'
      }
    },

    /*
    * Copy compiled html to `dist` folder with procesing conditional blocks
    */
    targethtml: {
      dist: {
        expand: true,
        cwd: '<%= yeoman.app %>/',
        src: '*.html',
        dest: '',
        ext: '.html'
      }
    },

    /*
    * Clean task
    */
    clean: {
      app: {
        src: [
        ]
      },
      dist: {
        src: [
          '*.html',
          'scripts/**/*.*',
          'styles/**/*.*',
          'images/**/*.*'
        ]
      }
    },

    /*
    * Minification of CSS
    */
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.cssDir %>/main.min.css': '<%= yeoman.app %>/<%= yeoman.cssDir %>/main.css'
        }
      }
    },

    /*
    * Install bower components
    */
    install: {
      bower: {}
    },

    /*
    * Compile Sass to CSS using node-sass
    */
    sass: {
      dist: {
        options: {
          sourceMap: true,
          includePaths: ['bower_components/normalize-scss']
        },
        files: {
          '<%= yeoman.app %>/<%= yeoman.cssDir %>/main.css': '<%= yeoman.app %>/<%= yeoman.scssDir %>/main.scss'
        }
      }
    },

    /*
    * Parses CSS and adds vendor-prefixed CSS properties using the Can I Use database
    */
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      },
      dist: {
        files: [{
          src: '<%= yeoman.app %>/<%= yeoman.cssDir %>/main.css',
          dest: '<%= yeoman.app %>/<%= yeoman.cssDir %>/main.css'
        }]
      }
    },

    /*
    * Make sure code styles are up to par and there are no obvious mistakes
    */
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/<%= yeoman.jsDir %>/**/*.js'
      ]
    },

    /*
    * Open in browser
    */
    open: {
      server: {
        path: 'http://127.0.0.1:9000',
        app: 'chrome'
      }
    },

    uglify: {
      my_target: {
        files: {
          'scripts/main.min.js': ['<%= yeoman.app %>/scripts/main.js']
        }
      }
    },

    /*
    * Change pathes from `app` to `dist` in img src attribute and css url property
    */
    replace: {
      imgsrc: {
        options: {
          patterns: [
            {
              match: /src=\"\/src\/images\//g,
              replacement: 'src="/images/'
            }
          ]
        },

        files: [
          {
            expand: true,
            cwd: '',
            src: '*.html',
            dest: ''
          }
        ]
      },
      cssurl: {
        options: {
          patterns: [
            {
              match: /url\(\/src/g,
              replacement: 'url(/'
            },
            {
              match: /url\(\'\/app/g,
              replacement: 'url(\'/'
            },
            {
              match: /url\(\"\/app/g,
              replacement: 'url(\"/'
            }
          ]
        },

        files: [
          {
            expand: true,
            cwd: '<%= yeoman.cssDir %>',
            src: '{,*/}*.css',
            dest: '<%= yeoman.cssDir %>'
          }
        ]
      }
    }

  });

  grunt.registerTask('install', 'install/restore npm and bower dependencies', function(cmd) {
    var exec = require('child_process').exec;
    var done = this.async();
    exec(cmd + ' install', {cwd: '.'}, function(err, stdout/*, stderr */) {
      console.log(stdout);
      done();
    });
  });

  grunt.registerTask('serve', function () {

    grunt.task.run([
      'clean:app',
      'install:bower',
      'sass:dist',
      'autoprefixer',
      'connect:server',
      'watch'
    ]);

  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'install:bower',
    'sass:dist',
    'autoprefixer',
    'uglify',
    'targethtml:dist',
    'cssmin',
    'usemin',
    'copy:images',
    'replace:imgsrc',
    'replace:cssurl'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);

};
