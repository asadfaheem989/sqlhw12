
//These should show up in package.json after installed. 

var mysql = require('mysql');
var inquirer = require('inquirer');

// Create a SQl connection via node using server and daatabase credentials created in mySQL
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
})

// Connect to the database and with a function 
connection.connect(function(err) {
    if (err) throw err;
    productsDisplay();
})


var productsDisplay = function() {
  //This will be a function that pulls queries from the table Products

  var query = 'SELECT * FROM Products'
  connection.query(query, function(err, res) {
      for (var i = 0; i < res.length; i++) {
          console.log("Item ID: " + res[i].itemID + " || Product: " + res[i].productName + " || Department: " + res[i].productDepartment + " || Price: " + res[i].price + " || Stock: " + res[i].stockQuantity);
      }
      shoppingCart();
    })
};
// * -- Users should then be prompted with two messages:
//        -- The first message should ask them the product ID
//        -- The second message should ask them quantity.
var shoppingCart = function() {
    inquirer.prompt([{
        name: "ProductID",
        type: "input",
        message: "Please provide the product ID?",
        //Validation with client side authentication of some sort
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        name: "Quantity",
        type: "input",
        message: "How many would you like to buy?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {

      // * -- Once the customer has placed the order: Your application should...
          // * Check if your store has enough quantity of the product to meet the customer's request.
          //   If not, you should respond to the user by saying: "Insufficient quantity" and prevent the order from going through.
          // * If your store DOES have enough of the product to meet the customer's request, you should fulfill their order.
          //   This means that you should show them the total cost of their puchase. Then update the SQL database to reflect the remaining quantity. --
        var query = 'SELECT * FROM Products WHERE itemID=' + answer.Quantity;
        connection.query(query, function(err, res) {
          if (answer.Quantity <= res) {
            for (var i = 0; i < res.length; i++) {
                console.log("We currently have " + res[i].stockQuantity + " " + res[i].productName + ".");
                console.log("Thank you for your purchase! Your order of "+ res[i].stockQuantity + " " + res[i].productName + " is now being processed.");
              }
            } else {
              console.log("We are currently out of this product");
            }
            productsDisplay();
        })
    })
};