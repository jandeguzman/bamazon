var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

// var itemsCost = "";

connection.connect(function(err) {
    if (err) {
  console.log(err);
    } else {
  showDb();
  setTimeout(function() {
      purchasePrompts();
  }, 1000);
    }
});


// function to show products available
function showDb() {
    connection.query("select * from products", function(err, data) {
  for(var i = 0; i < data.length; i++) {
      console.log("Id: " + data[i].item_id +
                "||" +
                "Product: " + data[i].product_name +
                "||" +
                "Department: " + data[i].department_name +
                "||" +
                "Price: $" + data[i].price +
                "||" +
                "Stock Quantity: " + data[i].stock_quantity
            );
  };
    });
}

//Question prompts for user to make purchase
function purchasePrompts() {
    inquirer.prompt([{
            name: "id",
            type: "input",
            message: "What is the product ID that you want to purchase?",
            validate: function(value) {
              if (isNaN(value) === false) {
                  return true;
                }
                return ("input must be a number. Try again.");
              }
        },

        {
            name: "quantity",
            type: "input",
            message: "How many do you want to buy?",

            validate: function(value) {
              if (isNaN(value) === false) {
                  return true;
                }
                return ("input must be a number. Try again.");
              }
        },

        {
            name: "purchase",
            type: "rawlist",
            message: "Confirm purchase?",
            choices: ["Confirm", "Go Back"]
        }

    ])// end iquirer.prompt
    .then(function(answer) {

        if (user.purchase === "Go Back"){
          return(purchasePrompts());
          


// issues faced: everytime I run the ID it says the query cannot be found or defined 
          
        } else {
        var quantityCheck = "SELECT * FROM products WHERE ?";
        connection.query(quantityCheck, { item_id: answer.id }, function(err, res) {
           for (var i = 0; i < res.length; i++) {
                if (res[i].stock_quantity < user.quantity){
                  console.log("------------------" + "\nINSUFFICIENT QUANTITY IN STOCK" + "\nPlease select another item.");
                  
                  //restart prompts
                  purchasePrompts();

                } else {

                  var updateStock = res[i].stock_quantity - user.quantity;

                  totalCost = user.quantity * res[i].price;

                  var queryStock = connection.query("UPDATE products SET stock_quantity=" + updateStock + " WHERE item_id=" + user.id,
                    function(err, res) {
                    }
                  );

                  console.log( 
                  "\nYou purchased: " + user.quantity + " of " + "Product Id #" + user.id + "||" + res[i].product_name + 
                  "\nTotal cost: $" + totalCost +
                  "\nThank you for your purchase."
                  );

                  console.log(
                  "\n--------INVENTORY CHECK----------" +
                  "\nConfirm purchase: " + user.purchase +
                  "\nItem: " + res[i].product_name + 
                  "\nOriginal stock quantity: " + res[i].stock_quantity +
                  "\nRemaining stock quantity: " + updateStock
                  );
                  connection.end();

                }
            } 
          })
        }
    })
 }



