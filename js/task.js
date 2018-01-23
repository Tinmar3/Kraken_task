function initialize() {}

// no need putting the function in document.ready
new BottomPopup();

function BottomPopup() {

    var popup, filteredUsers, listItems, loader, detailsScreenPopupTitle, detailsScreenFieldCompany, detailsScreenFieldImage, detailsScreenFieldRepos, detailsScreenFieldGists, popupBackButton, popupHideButton, listView;

    function initInitialMarkup() {

        appendHtml(document.body, getMarkup());

        popup = document.querySelector('.bottom-popup');

        listView = document.querySelector('.popup-list');
        popupTitle = document.querySelector('.popup-title');
        detailsScreenFieldCompany = document.querySelector('.popup-company-field');
        detailsScreenFieldImage = document.querySelector('.github-image');
        detailsScreenFieldGists = document.querySelector('.popup-gists-field');
        detailsScreenFieldRepos = document.querySelector('.popup-repos-field');
        popupHideButton = document.querySelector('.popup-button-hide');

        popupBackButton = document.querySelector('.popup-back');

        popupBackButton.addEventListener('click', function () {
            popup.classList.remove('details-opened');
            popupTitle.innerHTML = popupTitle.getAttribute('data-default-title');
        });

        popupHideButton.addEventListener('click', function () {
            popup.classList.add('hidden');
        });

    }

    function renderUserList(usersList) {
        for (var i = 0; i < usersList.length; i++) {
            var thisUser = usersList[i];
            var listItem = '<li class="popup-list-item" data-user-login="' + thisUser.login + '" data-user-id=' + '"' + thisUser.id + '"' + '><span class="item-number">' + thisUser.id + '.</span>' + ' ' + thisUser.login + '</li>';
            appendHtml(listView, listItem);
        }
    }

    function initListItemsListeners() {
        // assign listener to each item
        listItems = document.querySelectorAll('.popup-list-item');
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

    function updateDetailsScreen(userObject) {
        popupTitle.innerHTML = userObject.login;
        if (userObject.company !== '' && userObject.company) {
            detailsScreenFieldCompany.innerHTML = userObject.company;
        } else {
            detailsScreenFieldCompany.innerHTML = 'No company';
        }
        detailsScreenFieldImage.setAttribute('src', userObject.avatar_url);
        detailsScreenFieldGists.innerHTML = userObject.public_gists;
        detailsScreenFieldRepos.innerHTML = userObject.public_repos;

        updateStorage(userObject.id);
        filteredUsers = filterUsers(filteredUsers, localStorage.getItem("seenGithubUsersIDs"));
    }

    function updateStorage(seenUserId) {
        var storageListString = localStorage.getItem("seenGithubUsersIDs");
        var storageList = JSON.parse("[" + storageListString + "]");
        if (storageListString) {
            storageList.push(seenUserId);
        } else {
            storageList = [seenUserId];
        }
        localStorage.setItem("seenGithubUsersIDs", storageList);
    }

    function getSingleUser(username) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.github.com/users/' + username);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var userObject = JSON.parse(xhr.response);
                updateDetailsScreen(userObject);

                // small delay for better UI/UX
                setTimeout(function () {
                    popup.classList.remove('loading');
                    popup.classList.add('details-opened');
                    document.querySelector('[data-user-id="' + userObject.id + '"]').style.display = 'none';
                }, 220);
            }
            else {
                alert("Ooops, sorry, something went wrong! \n\n" + xhr.response);
                popup.classList.remove('loading');
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
                initListItemsListeners();
            }
            else {
                alert("Ooops, sorry, something went wrong! \n\n" + xhr.response);
                popup.style.display = 'none';
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

    function getMarkup() {
        var markup = '<div class="bottom-popup">' +
            '<div class="popup-header">' +
            '<span data-default-title="Github users" class="popup-title">Github users</span>' +
            '<i class="fa fa-times popup-button-hide" aria-hidden="true"></i>' +
            '</div >' +
            '<div class="popup-views-wrapper">' +
            '<div class="loading-overlay">' +
            '<div class="sk-fading-circle">' +
            '<div class="sk-circle1 sk-circle"></div>' +
            '<div class="sk-circle2 sk-circle"></div>' +
            '<div class="sk-circle3 sk-circle"></div>' +
            '<div class="sk-circle4 sk-circle"></div>' +
            '<div class="sk-circle5 sk-circle"></div>' +
            '<div class="sk-circle6 sk-circle"></div>' +
            '<div class="sk-circle7 sk-circle"></div>' +
            '<div class="sk-circle8 sk-circle"></div>' +
            '<div class="sk-circle9 sk-circle"></div>' +
            '<div class="sk-circle10 sk-circle"></div>' +
            '<div class="sk-circle11 sk-circle"></div>' +
            '<div class="sk-circle12 sk-circle"></div>' +
            '</div>' +
            '</div>' +
            '<div class="popup-views">' +
            '<div class="popup-view list-view">' +
            '<ul class="popup-list">' +
            '</ul>' +
            '</div>' +
            '<div class="popup-view details-view">' +
            '<img class="github-image" alt="github image" />' +
            '<div class="popup-description">' +
            '<span>Company</span>' +
            '<span class="popup-company-field"></span>' +
            '</div>' +
            '<div class="popup-description-bottom">' +
            '<div class="description-two-rows">' +
            '<span>Repos</span>' +
            '<span class="popup-number popup-repos-field"></span>' +
            '</div>' +
            '<div class="description-two-rows">' +
            '<span>Gists</span>' +
            '<span class="popup-number popup-gists-field"></span>' +
            '</div>' +
            '</div>' +
            '<i class="icon-arrow-right popup-back" aria-hidden="true"></i>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div >';
        return markup;
    }

    /* Initialize
   * ------------------------------------------------------ */

    (function init() {

        initInitialMarkup();
        getAllUsers();

    })();

}

function appendHtml(el, str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    while (div.children.length > 0) {
        el.appendChild(div.children[0]);
    }
}

$(document).ready(initialize);
