/*
David Kim
INF 651 VC - Fall 2024
Final Project 
*/

//////// Problem 1

const createElemWithText = (htmlElementString = "p", textContent = "", className) => {
    
    const newElement = document.createElement(htmlElementString);
    newElement.textContent = textContent;

    if (className) {
        newElement.classList.add(className);
    }

    return newElement;
} 


//////// Problem 2

const createSelectOptions = (optionsJson) => {

    if (!optionsJson) { return undefined; }

    const optionsArray = [];

    optionsJson.forEach( (option) => {
        
        const newOption = document.createElement("option");

        newOption.textContent = option.name;
        newOption.value = option.id;

        optionsArray.push(newOption);
    });

    return optionsArray;
}


//////// Problem 3

const toggleCommentSection = (postId) => {

    if(!postId) { return; }

    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    
    if (section) { section.classList.toggle('hide'); }
    
    return section;
}


//////// problem 4

const toggleCommentButton = (postId) => {

    if (!postId) { return; }

    const button = document.querySelector(`button[data-post-id="${postId}"]`);

    const showCommentsString = "Show Comments";
    const hideCommentsString = "Hide Comments";

    if (button) {

        if (button.textContent === showCommentsString) {
            button.textContent = hideCommentsString;
        }
        else {
            button.textContent = showCommentsString;
        }
    }

    return button;
}


//////// problem 5

const deleteChildElements = (parentElement) => {

    if (!parentElement || 
        parentElement.length === 0 || 
        !(parentElement instanceof HTMLElement)) {
            return; 
    }

    let childElement = parentElement.lastElementChild;

    while (childElement) {

        childElement.remove();
        childElement = parentElement.lastElementChild;
    }

    return parentElement;
}

//////// problem 6

const addButtonListeners = () => {

    const buttons = document.querySelectorAll("main button");

    if (buttons?.length) {
        
        buttons.forEach( (button) => {

            const postId = button.dataset.postId;

            if (postId) {
                button.addEventListener("click", function (e) {toggleComments(e, postId)}, false);
            }
        });
    }

    return buttons;
}


//////// problem 7

const removeButtonListeners = () => {

    const buttons = document.querySelectorAll("main button");

    if (buttons?.length) {

        buttons.forEach( (button) => {

            const postId = button.dataset.postId;

            if (postId) {

                button.removeEventListener("click", toggleComments, false);
            }
        });
    }

    return buttons;
}


//////// problem 8

const createComments = (commentsJson) => {

    if(!commentsJson) { return; }

    const fragment = document.createDocumentFragment();

    commentsJson.forEach( (comment) => {

        const article = document.createElement("article");
        const h3 = createElemWithText("h3", comment.name);
        const paragraphBody = createElemWithText("p", comment.body);
        const paragraphFrom = createElemWithText("p",  `From: ${comment.email}`);
        
        article.append(h3);
        article.append(paragraphBody);
        article.append(paragraphFrom);

        fragment.append(article);
    });

    return fragment;
}


//////// problem 9

const populateSelectMenu = (selectMenuJson) => {

    if (!selectMenuJson) { return; }

    const selectMenu = document.querySelector("#selectMenu");

    const selectElementArray = createSelectOptions(selectMenuJson);

    selectElementArray.forEach((selectElement) => {
        selectMenu.append(selectElement);
    });

    return selectMenu;
}


//////// problem 10

const getUsers = async () => {

    let usersJson = null;
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        usersJson = await response.json();
    }
    catch(e) {
        console.log(e);
    }

    return usersJson;
}


//////// problem 11

const getUserPosts = async (userId) => {

    if (!userId) { return; }

    let userPostsJson = []; 
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/`);
        const jsonAllUserPosts = await response.json();
        
        jsonAllUserPosts.forEach( (post) => {

            if(post.userId === userId) {
                userPostsJson.push(post);
            }
        });
    }
    catch(e) {
        console.log(e);
    }

    return userPostsJson;
}


//////// problem 12

const getUser = async (userId) => {

    if (!userId) { return; }

    let userJson = null;

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        userJson = await response.json();
    }
    catch(e) {
        console.log(e);
    }

    return userJson;
}


//////// problem 13

const getPostComments = async (postId) => {

    if (!postId) { return; }

    let commentsJson = null;

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        commentsJson = await response.json();
    }
    catch(e) {
        console.log(e);
    }

    return commentsJson;
}


//////// problem 14

const displayComments = async (postId) => {

    if (!postId) { return; }

    const section = document.createElement("section");

    section.dataset.postId = postId;

    section.classList.add("comments", "hide");

    const commentsJson = await getPostComments(postId);

    const commentsFragment = createComments(commentsJson);

    section.append(commentsFragment);

    return section;
}


//////// problem 15

const createPosts = async (postsJson) => {

    if (!postsJson) { return; }

    const fragment = document.createDocumentFragment();
    
    for (const post of postsJson) {
        
        const h2 = createElemWithText("h2", post.title);
        const paraPostBody = createElemWithText("p", post.body);
        const paraPostId = createElemWithText("p", `Post ID: ${post.id}`);
        
        const author = await getUser(post.userId);
        const paraAuthorAndCompany = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
        const paraCompanyCatchPhrase = createElemWithText("p", author.company.catchPhrase);
        
        const button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;
        
        const section = await displayComments(post.id);
        
        const article = document.createElement("article");
        article.append(
            h2,
            paraPostBody,
            paraPostId,
            paraAuthorAndCompany,
            paraCompanyCatchPhrase,
            button,
            section
        );

        fragment.append(article);
    }

    return fragment;
}


//////// problem 16

const displayPosts = async (postsJson) => {

    const main = document.querySelector("main");

    let postsFragment = null;

    if(postsJson) {
        postsFragment = await createPosts(postsJson);
    }
    else {
        const defaultParagraph = document.querySelector(".default-text");
        postsFragment = createElemWithText("p", defaultParagraph.textContent);
        postsFragment.classList.add("default-text");
    }

    main.append(postsFragment);

    return postsFragment;
}


//////// problem 17

const toggleComments = (event, postId) => {

    if (!event || !postId) { return; }
    
    event.target.listener = true;
    
    const sectionToggled = toggleCommentSection(postId);
    
    const buttonToggled = toggleCommentButton(postId);
    
    const toggledSectionButtonArray = [];
    toggledSectionButtonArray.push(sectionToggled, buttonToggled);

    return toggledSectionButtonArray;
}


//////// problem 18

const refreshPosts = async (postsJson) => {

    if (!postsJson) { return; }

    const buttonsWithoutEventListeners = removeButtonListeners();

    const main = document.querySelector("main");

    const mainWithoutChildren = deleteChildElements(main);

    const postsFragment = await displayPosts(postsJson);

    const buttonsWithEventListeners = addButtonListeners();

    const refreshedPostsArray = [];

    refreshedPostsArray.push(
        buttonsWithoutEventListeners, 
        mainWithoutChildren,
        postsFragment,
        buttonsWithEventListeners
    );

    return refreshedPostsArray;
}


//////// problem 19

const selectMenuChangeEventHandler = async (event) => {

    if (!event) { return; }

    const select = document.getElementById("selectMenu");

    select.disabled = true;
    
    const userId = event?.target?.value || 1;

    const userPostsJson = await getUserPosts(userId);

    const refreshedPostsArray = await refreshPosts(userPostsJson);

    select.disabled = false;

    const array = [];

    array.push(
        userId,
        userPostsJson,
        refreshedPostsArray
    );

    return array;
}


//////// problem 20

const initPage = async () => {

    const usersJson = await getUsers();

    const selectMenu = populateSelectMenu(usersJson);

    const userAndMenuArray = [];

    userAndMenuArray.push(usersJson, selectMenu);

    return userAndMenuArray;
}


//////// problem 21

const initApp = () => {

    initPage();

    const selectMenu = document.getElementById("selectMenu");

    selectMenu.addEventListener("change", () => {
        selectMenuChangeEventHandler();
    });
}