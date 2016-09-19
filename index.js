'use strict';

var request = require('request');

/**
 * Recherche une liste de documents ISTEX
 * Exemple pour la variable search : ?q=brain
 */
exports.find = function (search,  callback) {

  if (!search && search.length != 40) {
    return callback(new Error('index istex is incorrect'));
  }
  var urlistex = 'https://api.istex.fr/document/' + search ;
  var options = {
    url: urlistex,
    headers: {
      'User-Agent': 'ezpaarse'
    }
  };

  request.get(options, function (err, req, body) {
    if (err) { return callback(err); }

    try {
      var result = JSON.parse(body);
    } catch (e) {
      return callback(e);
    }

    if (result.error) {
      return callback(new Error(result.error));
    }
    callback(null, result);

  });
};

/**
 * Recherche une liste de documents ISTEX
 * en partant d'une liste d'identifiants ISTEX
 * Exemple pour la variable search :
 * [ '128CB89965DA8E531EC59C61102B0678DDEE6BB7', 'F1F927C3A43BC42B161D4BBEC3DD7719001E0429' ]
 */
exports.findByIstexIds = function (istexIds, callback) {
  if (istexIds.length > 200) {
    var err = new Error('node-istex findByIstexIds cannot be called with more than 200 istex ids (' + istexIds.length + ' requested)');
    return callback(err);
  }
  if (istexIds.length <= 0) {
    var err = new Error('node-istex findByIstexIds should be called with 1 or more istex ids (' + istexIds.length + ' requested)');
    return callback(err);
  }

  var url = 'https://api.istex.fr/document/?size=200&output=*&q=id:(';
  url += istexIds.join(' OR ');
  url += ')';

  var options = {
    url: url,
    headers: {
      'User-Agent': 'ezpaarse'
    }
  };

  request.get(options, function (err, req, body) {
    if (err) { return callback(err); }

    try {
      var result = JSON.parse(body);
    } catch (e) {
      return callback(e);
    }

    if (result.total == 0 && result.error) {
      return callback(new Error('erreur de requette'));
    }
    callback(null, result.hits);

  });
};
/**
 * Deprecated: bad naming
 */
var findlotWarningDisplayed = false;
exports.findlot = function (search, callback, noWarning) {
  if (!findlotWarningDisplayed && !noWarning) {
    console.error('node-istex: findlot is deprecated, use findByIstexIds instead');
    findlotWarningDisplayed = true;
  }
  return exports.findByIstexIds(search, callback);
};

