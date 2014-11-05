var express = require('express');    //Express Web Server 
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');   //File System - for file manipulation
var mime = require('mime'); //use for setting mime type
var fs1 = require('fs');


var app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, '/public')));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.route('/')
    .get(function (req, res){
		var dir=__dirname + '/upload/';
		var arr = [];
		fs1.readdir(dir,function(err,files){
			if (err) throw err;
			files.forEach(function(file){				
				arr.push(file);
		   });	
		   res.render('homepage.html', {
            filenameList: arr,
		   });
			
		});
	});
app.route('/success')
	.get(function(req, res){
	
		res.writeHead(200,{'Content Type' : 'text/plain'});
		res.end('<html><body> <span>File Uploaded Successfully</span> <a href="/download?filename='+req.param('filename')+'">Click Here to download</a> </body></html>');
		//res.end('<html><body><form id="downlad" action="/download?filename='+req.param('filename')+'" method="GET" >'+
		//+'<span>File Uploaded Successfully - </span> '+req.param('filename')+' <input type="submit" id="submit" name="submit" value="Click here to //Download"></form></body></html>');
	});
	
app.route('/download')
	.get(function(req, res){
		console.log("inside download : "+req.param('filename'));
		 var file = __dirname + '/upload/'+ req.param('filename');
		 var filename = path.basename(file);
		 var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var filestream = fs.createReadStream(file);
		filestream.pipe(res);
	});
/*========================================================== 
Create a Route (/upload) to handle the Form submission 
(handle POST requests to /upload)
Express v4  Route definition
============================================================ */
app.route('/upload')
    .post(function (req, res, next) {
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);
           
            fstream = fs.createWriteStream(__dirname + '/upload/' + filename); //Path where file will be uploaded
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                //res.redirect('/success?filename='+filename); //where to go next
				res.redirect('/'); // back to homepage
            });
        });
    });

var server = app.listen(3001, function() {
    console.log('Listening on port %d', server.address().port);
});