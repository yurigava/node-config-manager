'use strict';

var expect = require('chai').expect,
    assert = require('chai').assert,
    error = require('../../lib/error');

var NODE_ENV = 'test',
    CONFIG_DIR = '',
    error = require('../../lib/error'),
    rewire = require('rewire'),
    FileManager = null,
    fileManager = null;

describe('FileManager', function() {
    beforeEach(function() {
        FileManager = rewire('../../lib/FileManager');
        fileManager = new FileManager(CONFIG_DIR, NODE_ENV);
    });

    afterEach(function() {
        FileManager = null;
        fileManager = null;
    });

    describe('#new', function() {
        it('should return an error - bad parameter without parameter', function() {
            assert.throw(function() {
                new FileManager();
            }, error.BAD_PARAMETER);
        });
        it('should return an error - bad parameter with invalid configDir', function() {
            assert.throw(function() {
                new FileManager({}, 'string');
            }, error.BAD_PARAMETER);
        });
        it('should return an error - bad parameter with invalid env', function() {
            assert.throw(function() {
                new FileManager('string', {});
            }, error.BAD_PARAMETER);
        });
        it('should return a FileManager instance', function() {
            expect(fileManager).not.to.be.null();

            expect(fileManager.configDir).to.be.a('string');
            expect(fileManager.env).to.be.a('string');

            expect(fileManager.env).to.equal(NODE_ENV);
        });
    });
    describe('#prototype.getFile', function() {
        it('should return null - existsSync must always return false', function() {
            var fsMock = {
                    existsSync: function(path) {
                        return false;
                    }
                },
                pathMock = {
                    resolve: function(path) {
                        return '';
                    }
                };
            FileManager.__set__("fs", fsMock);
            FileManager.__set__("path", pathMock);

            expect(fileManager.getFile('logger')).to.be.null();
        });
        it('should return content of test/logger.json mock', function() {
            var loggerMock = 'logger',
                loggerPathMock = CONFIG_DIR + '/' + NODE_ENV + '/logger.json',
                loggerContentMock = {
                    content: 'mock'
                },
                fsMock = {
                    existsSync: function(path) {
                        return path === loggerPathMock;
                    }
                },
                pathMock = {
                    resolve: function(path) {
                        return path;
                    }
                };

            FileManager.__set__("fs", fsMock);
            FileManager.__set__("path", pathMock);
            fileManager.loadFile = function(path) {
                if (path === loggerPathMock) {
                    return loggerContentMock;
                } else {
                    return null;
                }
            };

            expect(fileManager.getFile('logger')).to.equal(loggerContentMock);
        });
        it('should return content of /logger.json mock', function() {
            var loggerMock = 'logger',
                loggerPathMock = CONFIG_DIR + '/logger.json',
                loggerContentMock = {
                    content: 'mock'
                },
                fsMock = {
                    existsSync: function(path) {
                        return path === loggerPathMock;
                    }
                },
                pathMock = {
                    resolve: function(path) {
                        return path;
                    }
                };

            FileManager.__set__("fs", fsMock);
            FileManager.__set__("path", pathMock);
            fileManager.loadFile = function(path) {
                if (path === loggerPathMock) {
                    return loggerContentMock;
                } else {
                    return null;
                }
            };

            expect(fileManager.getFile('logger')).to.equal(loggerContentMock);
        });
    });
});