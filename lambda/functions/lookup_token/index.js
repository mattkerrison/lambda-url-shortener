console.log('Loading event');
var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();
exports.handle = function(event, context, callback) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));
    var destination_url = '';
    var content = '';
    var params = {
        TableName: "redir_urls",
        Key: {
            "token": event.token
        },
        UpdateExpression: "set clicks = clicks + :c",
        ExpressionAttributeValues: {
            ":c":1
        },
        ReturnValues:"ALL_NEW",
    };

    docClient.update(params, function(err, data) {

    if (err) {
    console.log(err); // an error occurred
    content = "<html><body><h1>Not Found</h1></body></html>";
    context.fail(content);
    } else {
    if ("Attributes" in data && "destination_url" in data.Attributes) {
        destination_url = data.Attributes.destination_url;
        content = "<html><body>Moved: <a href=\"" + destination_url + "\">" + destination_url + "</a></body></html>";
        context.succeed({ "destination_url": destination_url, "content": content });
    } else { 
        console.log(JSON.stringify(data.Attributes.destination_url));
        content = "<html><body><h1>Not Found</h1></body></html>";
        context.fail(content);
       }
   }
    });
}