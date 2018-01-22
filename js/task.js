function initialize() {

    var bottomPopup = new BottomPopup();

    localStorage.setItem("seenGithubUsersIDs", [1, 2, 3]);

}

function BottomPopup() {

    function initInitialMarkup() {
        var initialMarkup = '<h1 id="title">Some Title</h1><span style="display:inline-block; width=100px;">Some arbitrary text</span>';
        appendHtml(document.body, initialMarkup);
    }

    function initUserList() {

    }

    function filterUsers(responseObject, seenUsers) {
        console.log(seenUsers);
        var newUsersObject = {};
        for (var key in responseObject) {
            console.log(key);
        }
        return newUsersObject;
    }

    getAllUsers();

    function getSingleUser(username) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.github.com/users/' + username);
        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log("Response:");
                console.log(xhr);
                var usersObject = JSON.parse(xhr.response);
                console.log(usersObject);

            }
            else {
                console.log("FAIL");
                console.log(xhr);
            }
        };
        xhr.send();

    }

    function getAllUsers() {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.github.com/users');
        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log("Response:");
                console.log(xhr);
                var usersObject = JSON.parse(xhr.response);
                console.log(usersObject);

                var filteredUsers = filterUsers(usersObject, localStorage.getItem("seenGithubUsersIDs"));
            }
            else {
                console.log("FAIL");
                console.log(xhr);
            }
        };
        xhr.send();

    }

    var PublicAPI = {
        initInitialMarkup: initInitialMarkup,

    };

    return PublicAPI;
}

function appendHtml(el, str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    while (div.children.length > 0) {
        el.appendChild(div.children[0]);
    }
}

$(document).ready(initialize);
