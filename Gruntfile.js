'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%= config.app %>/scss/**/*.{scss,sass}'],
        tasks: [
          'sass:dev'
        ],
        options: {
        }
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        sourcemap: 'auto',
        style: 'compressed',
      },
      dev: {
        options: {
          sourcemap: 'auto',
          style: 'expanded',
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/scss',
          src: ['*.{scss,sass}'],
          dest: '<%= config.app %>/css',
          ext: '.css'
        }]
      },
      dist: {
        options: {
          sourcemap: 'none',
          style: 'compressed',
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/scss',
          src: ['*.{scss,sass}'],
          dest: '<%= config.dist %>/css',
          ext: '.css'
        }]
      }
    }
  });

  //tasks
  grunt.registerTask('dev', [
    'sass:dev',
    'watch:sass'
  ]);

  grunt.registerTask('build', [
    'sass:dist',
  ]);

  grunt.registerTask('default', [
    'dev'
  ]);
};
