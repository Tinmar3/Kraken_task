// I've used some newer JS functions, like 'querySelector', 'filter', and I would usually polyfill them in separate file for better browser support.
// No need putting the function in document.ready as it needs to be loaded asynchronously when page starts to load.

// localStorage.removeItem("seenGithubUsersIDs"); // for reseting a storage

new BottomPopup();

function BottomPopup() {

    var filteredUsers;
    var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var popup, popupTitle, popupHeader, listView, detailsScreenFieldCompany, detailsScreenFieldImage, detailsScreenFieldRepos, detailsScreenFieldGists, backButton, hideButton;

    function User(id, loginName, company, avatarUrl, repos, gists) {
        this.id = id;
        this.loginName = loginName;
        this.company = company || 'No company';
        this.avatarUrl = avatarUrl;
        this.repos = repos;
        this.gists = gists;
    }

    function initInitialMarkup() {

        appendHtml(document.body, getMarkup());

        popup = document.querySelector('.bottom-popup');
        popupTitle = document.querySelector('.popup-title');
        popupHeader = document.querySelector('.popup-header');
        listView = document.querySelector('.popup-list');
        detailsScreenFieldCompany = document.querySelector('.popup-company-field');
        detailsScreenFieldImage = document.querySelector('.github-image');
        detailsScreenFieldGists = document.querySelector('.popup-gists-field');
        detailsScreenFieldRepos = document.querySelector('.popup-repos-field');
        hideButton = document.querySelector('.popup-button-hide');
        backButton = document.querySelector('.popup-back');

        backButton.addEventListener('click', function () {
            popup.classList.remove('details-opened');
            popupTitle.innerHTML = popupTitle.getAttribute('data-default-title');
        });

        hideButton.addEventListener('click', function (e) {
            e.stopPropagation();
            popup.classList.add('hidden');
        });

        popupHeader.addEventListener('click', function () {
            if (popup.classList.contains('hidden')) {
                popup.classList.remove('hidden');
            }
        });

        if (viewportWidth < 993) {
            // hidden on the load, for smaller devices
            popup.classList.add('hidden');
        }

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
        var listItems = document.querySelectorAll('.popup-list-item');
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

    function updateDetailsScreen(user) {
        popupTitle.innerHTML = user.loginName;
        detailsScreenFieldCompany.innerHTML = user.company;
        detailsScreenFieldImage.setAttribute('src', user.avatarUrl);
        detailsScreenFieldGists.innerHTML = user.gists;
        detailsScreenFieldRepos.innerHTML = user.repos;
        updateStorage(user.id);
        filteredUsers = filterUsers(filteredUsers, localStorage.getItem("seenGithubUsersIDs"));
    }

    function getSingleUser(username) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.github.com/users/' + username);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var rsp = JSON.parse(xhr.response);
                var user = new User(rsp.id, rsp.login, rsp.company, rsp.avatar_url, rsp.public_repos, rsp.public_gists);
                updateDetailsScreen(user);
                // small delay for better UI/UX:
                setTimeout(function () {
                    popup.classList.remove('loading');
                    popup.classList.add('details-opened');
                    document.querySelector('[data-user-id="' + user.id + '"]').style.display = 'none';
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
        var newUsersObject = responseObject.filter(function (obj) {
            return this.indexOf(obj.id) < 0;
        }, seenUsersList);
        return newUsersObject;
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