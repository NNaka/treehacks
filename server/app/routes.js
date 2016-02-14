var Subjects = require('./models/SubjectViews');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes	
	// sample api route
 app.get('/api/data', function(req, res) {
  // use mongoose to get all nerds in the database
  Subjects.find({}, {'_id': 0, 'date': 1, 'game_name': 1, 'user_id': 1, 'gender': 1, 'progress': 1, 'completion': 1, 'mental_state': 1, 'mental_score': 1}, function(err, subjectDetails) {
   // if there is an error retrieving, send the error. 
       // nothing after res.send(err) will execute
   if (err) 
   res.send(err);
    res.json(subjectDetails); // return all nerds in JSON format
  });
 });

  app.get('/person', function(req, res) {
    res.sendfile('./public/person.html');
  });
}