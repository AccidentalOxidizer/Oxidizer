var testPost = function(postFunction, dummyObject, dbModel, t){
    var recordId;
    return postFunction(dummyObject)
      .then(function(obj){
        recordId = obj.id;
        // checks if the user was added using a sequelize method
        return dbModel.findAndCountAll({where: dummyObject});
      })
      .then(function(objCount){
        // check if findAndCountAll returned the one record we added
        t.equal(objCount.count, 1, 'posted ' + dummyObject +' to db!');
        // clean up - remove the data we posted in our test  
        return dbModel.destroy({where: {id: recordId}});
      })
      .catch(function(err){
        // if we get an error while posting or counting, we console.log, then delete the user if it was made
        console.log(err, ' deleting');
        return dbModel.destroy({where: dummyObject})
          .then(function(){
            console.log('deleted after posting');
          })
          .catch(function(err){
            console.log(err, ' unable to delete after posting...');
          });
      });
  };

var testPut = function(putFunction, dummyObject, dummyUpdates, dbModel, t){
  var dummyId;
  var attributesToCheck = [];

  // make array of the fields we want to test
  for (var key in dummyUpdates){
    if (dummyUpdates.hasOwnProperty(key)){
      attributesToCheck.push(key);
    }
  }

  var newInstance = dbModel.build(dummyObject);
  return newInstance.save()
    .then(function(newObj){
      dummyId = newObj.id;
      return putFunction(dummyId, dummyUpdates);
    })
    .then(function(obj){
      // save the id on the dummy for the update test
      // get the model we just updated
      return dbModel.findById(dummyId);
    })
    .then(function(obj){
      for (var i = 0; i < attributesToCheck.length; i++){
        var attr = attributesToCheck[i];
        t.equal(obj[attr], dummyUpdates[attr], 'put func updates ' + attr);
      }
      return dbModel.destroy({where: {id: dummyId}});
    })
    .catch(function(err){
      console.log(err);
      return dbModel.destroy({where: {id: dummyId}});
    });
};

module.exports = {
  testPost: testPost,
  testPut: testPut
};