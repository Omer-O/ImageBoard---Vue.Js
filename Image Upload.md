# Image Upload - Part 2

As alluded to [earlier](https://github.com/spicedacademy/salt/blob/master/wk10_image_upload), storing uploaded files on your server's file system is not adequate in most production environments. Why is that? Well, imagine you are deploying your site to [Heroku](https://github.com/spicedacademy/salt/blob/master/wk8_heroku). The file system on Heroku dynos is ephemeral - it goes away every time you deploy. So with every update to your site, all the previously uploaded files will disappear. Many other deployment environments will have a similar situation. Apart from that, imagine that for scaling purposes your code is running on multiple different servers. If the files are stored on the server that receives them, none of the other servers would have them or be able to handle requests for them.

What is needed is a centralized location where files can be reliably stored. There are many services that offer precisely this along with many other benefits. One of the most widely used is Amazon's Simple Storage Service, which is usually referred to as [S3](https://aws.amazon.com/s3).



To sign up to amazon - after CC put it. 

we need to start a bucket: 

up in the menue select: services => storage: S3 => create bucket => name bucket => object can be public!! remember to tick out the box if needed. => create bucket. 

Now we need to create groups and users: => Services => Security, Identity & compliance: IAM => left menu: Groups => create new group => after naming the group we want to target in the search bar the: AmazonS3FullAccess => in AWS tick the box: programmatic accesses => after we check the final page we press: create USER => than we get the  credentials - will shown only once!!



than we store it in the secrets.json - 

the 1st value copied to replace in secrets.json with "AWS_KEY":

the 2nd value copied to replace in secrets.json with "AWS_SECRET":

After I need to change in the s3.js file the name of the bucket: 

so in the file: 

bucket: 'spicedling' (now - but if I got new one I need to change it)

You can create your own [Amazon Web Services account](https://aws.amazon.com/free/) and use 5GB of S3 storage for free for one year (as well as many other AWS offerings with similar limitations). However, to create your account you have to enter a credit card to cover expenses if you go over the free tier limits. If you would rather not do that, you can use an account that has already been set up (see your friendly neighborhood SPICED instructor for credentials). If you do set up your own account, what you'll have to do afterwards is retrieve your credentials from the 'Security Credentials' section of the management console (or, as is advised when you navigate to that section, create a subuser that only has access to S3 and retrieve that subuser's credentials using the IAM service) and also create an S3 bucket. When you create a bucket, you will be able to select a region for it. If you select a region other than US East (Virginia), you may encounter a delay before you can access the bucket in the method described below. Because of an [unresolved knox issue](https://github.com/Automattic/knox/issues/254), you should NOT select the EU (Frankfurt) region.

## knox

knox is an easy-to-use S3 client you will want to install.

```
npm install knox-s3 --save
```

Once it is installed, you can use it to send the files users have uploaded to S3. First, you create a client.

```
const knox = require('knox-s3');
let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // secrets.json is in .gitignore
}
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'thenameofmybucket'
});
```

If you select a region outside the United States when you create your bucket, you will have to tell `knox` what region you selected by adding a `region` property to the object you pass to `createClient`. The value to give the `region` property can be found [here](http://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region). For example, if you created your bucket in the EU (Ireland) region, the value of the `region` property should be `'eu-west-1'`.

You can call the `put` method of the `client` you've created to create a request object using the data in the `file` object that `multer` added to the `req`.

```
const s3Request = client.put(req.file.filename, {
    'Content-Type': req.file.mimetype,
    'Content-Length': req.file.size,
    'x-amz-acl': 'public-read'
});
```

The first argument to `put` is the name you want the file to have in the bucket. If you'd like the file to go into a subdirectory of the bucket, you prepend the desired path to the filename. The second argument is an object with additional parameters. The `Content-Type` and `Content-Length` parameters are the headers you want S3 to use when it serves the file. The `x-amz-acl` parameter tells S3 to serve the file to anybody who requests it (the default is for files to be private).

You can now create a read stream out of the file and pipe it to the request you've created.

```
const fs = require('fs');
const readStream = fs.createReadStream(req.file.path);
readStream.pipe(s3Request);
```

The request object will emit an event when it is finished. You can handle this event and check the status code of the response to determine if the `put` was successful.

```
s3Request.on('response', s3Response => {
    const wasSuccessful = s3Response.statusCode == 200;
    res.json({
        success: wasSuccessful
    });
});
```

If the `put` was successful, you will be able to access the image at `https://s3.amazonaws.com/:yourBucketName/:filename`.

### When to do this

Obviously, it is required for `multer` to have done it's thing for you to be able to do this. The code above depends on there being a `req.file`, and there won't be one until the function returned by your call to `uploader.single` has run. You probably also want to upload the image to S3 before you update your database with the file name and send a response to the user. It would be better not to store the file name if you could not get the file onto S3, and if you don't store the file name, your response should inform the user of the failure.

One option would be to do the `client.put` in a middleware function that runs after the function returned by `uploader.single`. This function could call `next` after success, giving the route the opportunity to update the database and send a response.

Another alternative would be to write a function that you can call from the route. The route would have to pass `req.file` to the function and the function would have to return a promise that is resolved or rejected in the `'response'` event handler (or call a callback).