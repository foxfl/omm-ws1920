var Auth = /** @class */ (function () {
    function Auth(username, password) {
        this.username = username;
        this.password = password;
    }
    return Auth;
}());
var Database = /** @class */ (function () {
    function Database() {
        this.users = [];
    }
    Database.prototype.store = function (user) {
        // TODO: complete the following code to store the given user into
        // this.users, then render the given user via this.displayUsers().
        this.users.push(user);
        document.getElementById("users-imported").innerHTML = "" + this.users.length;
        this.displayUsers();
    };
    Database.prototype.displayUsers = function () {
        document.getElementById("users-view").innerHTML = "";
        this.users.forEach(function (aUser) {
            var userView = document.createElement("div");
            userView.className = "a-user";
            var name = document.createElement("h2");
            name.innerHTML = "" + aUser.name;
            userView.append(name);
            var age = document.createElement("p");
            age.innerHTML = "age: " + aUser.age + " years";
            userView.append(age);
            var image = document.createElement("img");
            image.src = aUser.photo;
            userView.append(image);
            document.getElementById("users-view").append(userView);
        });
    };
    return Database;
}());
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());
// Fictional database & authentication
var db = new Database();
var auth = new Auth("string", "string");
document.addEventListener("DOMContentLoaded", function () {
    var usersLoaded = 0;
    var selected = [];
    fetch("https://uinames.com/api/?amount=10&ext").then(function (response) {
        response.json().then(function (users) {
            // TODO: handle the response and parse it into User class, then select
            // all adults (age > 18) and save them in selected array.
            selected = users.filter(function (_a) {
                var age = _a.age;
                return age > 18;
            });
            usersLoaded = selected.length;
            document.getElementById("users-counter").innerHTML = usersLoaded + " users found";
        });
    });
    document.querySelector(".save-btn").addEventListener("click", function () {
        selected.forEach(function (user) { return db.store(user); });
    });
});
