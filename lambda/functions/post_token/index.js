console.log('Loading event');

var shortid = require('shortid');
var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handle = function(event, context) {

    var token = (shortid.generate());
    var url = (event.url == undefined ? "NO URL" : event.url);
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));
    console.log(token);

    table = "redir_urls";

    var params = {
        TableName: table,
        Item:{
            "token": token,
            "destination_url": url,
            "clicks": Number(0),
        },
        ConditionExpression: "attribute_not_exists(#t)",
        ExpressionAttributeNames: {"#t":"token"},
    };

    console.log("Updating the item...");
    console.log(JSON.stringify(params));
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            context.fail("Failed to Create URL")
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(token, null, 2));
            context.succeed("https://{YOUR-URL-HERE}/" + token);
        }
    });
}
