// src/app.js

import { Auth, getUser } from "./auth";
import {
  getUserFragments,
  saveUserFragment,
  getFragmentDataById,
  getFragmentMetaDataById,
  deleteFragmentById,
  putFragment,
  convertFragment,
} from "./api";

async function init() {
  // Get our UI elements
  const userSection = document.querySelector("#user");
  const loginBtn = document.querySelector("#login");
  const logoutBtn = document.querySelector("#logout");
  const createFragment = document.querySelector("#create-fragment");
  const fragmentText = document.querySelector("#text-input-title");
  const createInfo = document.querySelector("#createInfo");
  const fragType = document.querySelector("#Type");
  const checkOldFragmentBtn = document.querySelector("#checkOldFragmentBtn");
  const uploadedImg = document.querySelector("#image");
  const getFragDataByID = document.querySelector("#getFragDataByID");
  const getDataByID = document.querySelector("#getDataByID");
  const frag_content = document.querySelector("#frag_byID");
  const getFragMeta = document.querySelector("#getFragMeta");
  const deleteFragment = document.querySelector("#deleteFragBtn");
  const deleteFragId = document.querySelector("#id_delete");
  const deleteInfo = document.querySelector("#deleteInfo");
  const putFragmentBtn = document.querySelector("#updateDataBtn");
  const putID = document.querySelector("#IdUpdate");
  const putContent = document.querySelector("#UpdateFragData");
  const updateInfo = document.querySelector("#updateInfo");
  const updateType = document.querySelector("#updateType");
  const existFrag = document.querySelector("#existFrag");
  const convertBtn = document.querySelector("#convertbtn");
  const convertFrag = document.querySelector("#convertFrag");
  const convertOption = document.querySelector("#convert_option");
  const convertFragmentID = document.querySelector("#convert_fragmentId");

  checkOldFragmentBtn.onclick = () => {
    existFrag.innerHTML = "";
    getUserFragments(user, 1)
      .then(function (userFragments) {
        // Check if userFragments is an array or object and convert it to HTML fragments
        if (Array.isArray(userFragments)) {
          // Convert array to HTML fragments
          userFragments.forEach(function (fragment) {
            if (typeof fragment === "object") {
              // Convert object to string
              fragment = JSON.stringify(fragment);
            }
            existFrag.innerHTML += fragment + "<br>" + "<br>";
          });
        } else if (typeof userFragments === "object") {
          // Convert object to HTML fragments
          for (var key in userFragments) {
            var fragment = userFragments[key];
            if (typeof fragment === "object") {
              // Convert object to string
              fragment = JSON.stringify(fragment);
            }
            existFrag.innerHTML += fragment + "<br>" + "<br>";
          }
        } else if (userFragments) {
          // If userFragments is a single fragment (string), append it directly
          existFrag.innerHTML += userFragments + "<br>" + "<br>";
        } else {
          // If no fragments available, display a message
          existFrag.innerHTML = "No fragments available for user";
        }
      })
      .catch(function (error) {
        // Handle any errors that occurred during fetching fragments
        console.error("Error fetching user fragments:", error);
      });
  };

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a user object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  createFragment.onclick = () => {
    if (
      fragType.options[fragType.selectedIndex].value == "text/plain" ||
      fragType.options[fragType.selectedIndex].value == "text/markdown" ||
      fragType.options[fragType.selectedIndex].value == "text/html" ||
      fragType.options[fragType.selectedIndex].value == "application/json"
    ) {
      saveUserFragment(
        user,
        fragType.options[fragType.selectedIndex].value,
        fragmentText.value
      );
      createInfo.innerHTML = "Fragment has been created";
    } else {
      saveUserFragment(
        user,
        fragType.options[fragType.selectedIndex].value,
        uploadedImg.files
      );
      createInfo.innerHTML = "Fragment has been created";
    }
  };

  convertBtn.onclick = async () => {
    var res = await convertFragment(
      user,
      convertFragmentID.value,
      convertOption.options[convertOption.selectedIndex].value
    );
    console.log(res);
    convertFrag.innerHTML = res;
  };

  getFragDataByID.onclick = async () => {
    var res = await getFragmentDataById(user, getDataByID.value);
    console.log(res);
    frag_content.innerHTML = res;
  };

  getFragMeta.onclick = async () => {
    var res = await getFragmentMetaDataById(user, getDataByID.value);
    console.log(res);
    frag_content.innerHTML = JSON.stringify(res);
  };

  deleteFragment.onclick = async () => {
    deleteFragmentById(user, deleteFragId.value);
    deleteInfo.innerHTML =
      "Fragment with ID: " + deleteFragId.value + " has been deleted";
  };

  putFragmentBtn.onclick = async () => {
    putFragment(
      user,
      putID.value,
      updateType.options[updateType.selectedIndex].value,
      putContent.value
    );
    updateInfo.innerHTML =
      "Fragment with ID: " + putID.value + " has been updated";
  };

  // Do an authenticated request to the fragments API server and log the result
  getUserFragments(user, 1);

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector(".username").innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
}

// Wait for the DOM to be ready, then start the app
addEventListener("DOMContentLoaded", init);
