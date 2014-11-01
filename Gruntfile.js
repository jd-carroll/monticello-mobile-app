module.exports = function(grunt) {
    'use strict';

    // Load Grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take
    require('time-grunt')(grunt);

    var appConfig = {
        app: 'www',
        dist: ''
    };



  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.loadNpmTasks('grunt-serve');

};