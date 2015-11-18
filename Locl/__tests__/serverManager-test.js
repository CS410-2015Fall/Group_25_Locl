'use strict';
jest.setMock('react-native', {
    NativeModules: {}
});
jest.dontMock('../serverManager.js');

// describe('sum', function() {
//  it('adds 1 + 2 to equal 3', function() {
//    var serverManager = require('../serverManager');
//    expect(serverManager.sum(1, 2)).toBe(3);
//  });
});
