function initialize() {
    // localStorage.setItem("seenGithubUsersIDs", [1, 2, 3]);

    // localStorage.getItem("lastname");

    // convert from strings

}

new BottomPopup();

function BottomPopup() {

    var popup, filteredUsers, listItems, loader, detailsScreenPopupTitle, detailsScreenFieldCompany, detailsScreenFieldImage, detailsScreenFieldRepos, detailsScreenFieldGists, popupBackButton;
    var listView = document.getElementsByClassName('popup-list')[0];

    function initInitialMarkup() {
        // var initialMarkup = '<h1 id="title">Some Title</h1><span style="display:inline-block; width=100px;">Some arbitrary text</span>';
        // appendHtml(document.body, initialMarkup);

        popup = document.querySelector('.bottom-popup');
        loader = document.getElementsByClassName('loading-overlay')[0];

        detailsScreenPopupTitle = document.querySelector('.popup-title');
        detailsScreenFieldCompany = document.querySelector('.popup-company-field');
        detailsScreenFieldImage = document.querySelector('.github-image');
        detailsScreenFieldGists = document.querySelector('.popup-gists-field');
        detailsScreenFieldRepos = document.querySelector('.popup-repos-field');

        popupBackButton = document.querySelector('.popup-back');

        popupBackButton.addEventListener('click', function () {
            popup.classList.remove('details-opened');
            detailsScreenPopupTitle.innerHTML = detailsScreenPopupTitle.getAttribute('data-default-title');
        });

    }

    function renderUserList(usersList) {
        for (var i = 0; i < usersList.length; i++) {
            var thisUser = usersList[i];
            var listItem = '<li class="popup-list-item" data-user-login="' + thisUser.login + '" data-user-id=' + '"' + thisUser.id + '"' + '><span class="item-number">' + thisUser.id + '.</span>' + ' ' + thisUser.login + '</li>';
            appendHtml(listView, listItem);
        }

        // assign listener to each item
        listItems = document.getElementsByClassName('popup-list-item');
        for (var i = 0; i < listItems.length; i++) {
            var thisItem = listItems[i];
            let thisUserLogin = thisItem.getAttribute('data-user-login');
            var thisClickListener = function () {
                openDetailsScreen(thisUserLogin);
            };
            thisItem.addEventListener('click', thisClickListener, true);
        }
    }

    function openDetailsScreen(userLogin) {
        popup.classList.add('loading');
        getSingleUser(userLogin);
    }

    function renderDetailsScreen(userObject) {

        detailsScreenPopupTitle.innerHTML = userObject.login;
        detailsScreenFieldCompany.innerHTML = userObject.company;
        detailsScreenFieldImage.setAttribute('src', userObject.avatar_url);
        detailsScreenFieldGists.innerHTML = userObject.public_gists;
        detailsScreenFieldRepos.innerHTML = userObject.public_repos;

        popup.classList.add('details-opened');

        // update storage

    }

    function getSingleUser(username) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.github.com/users/' + username);
        xhr.onload = function () {
            if (xhr.status === 200) {
                popup.classList.remove('loading');
                var userObject = JSON.parse(xhr.response);
                renderDetailsScreen(userObject);
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
                var usersObject = JSON.parse(xhr.response);
                filteredUsers = filterUsers(usersObject, localStorage.getItem("seenGithubUsersIDs"));
                renderUserList(filteredUsers);
            }
            else {
                console.log("FAIL");
                console.log(xhr);
            }
        };
        xhr.send();
    }

    function filterUsers(responseObject, seenUsers) {
        var seenUsersList = JSON.parse("[" + seenUsers + "]");
        var newUsersObject = [];
        for (var key in responseObject) {
            var thisUserObject = responseObject[key];
            var isSeenCheck = false;
            for (var i = 0; i < seenUsersList.length; i++) {
                if (thisUserObject.id === seenUsersList[i]) {
                    // check if ID of an item is saved in storage seen list
                    isSeenCheck = true;
                    break;
                }
                else {
                    isSeenCheck = false;
                }
            }
            if (!isSeenCheck) {
                newUsersObject.push(thisUserObject);
            }
        }
        return newUsersObject;
    }

    /* Initialize
   * ------------------------------------------------------ */

    (function init() {

        initInitialMarkup();
        getAllUsers();

    })();

}

function appendHtml(el, str) {
    console.log("append");
    var div = document.createElement('div');
    div.innerHTML = str;
    while (div.children.length > 0) {
        el.appendChild(div.children[0]);
    }
}

$(document).ready(initialize);
