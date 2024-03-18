// src/app.js

import { Auth, getUser } from "./auth";
import { getUserFragments, saveUserFragment } from "./api";

async function init() {
  // Get our UI elements
  const userSection = document.querySelector("#user");
  const loginBtn = document.querySelector("#login");
  const logoutBtn = document.querySelector("#logout");
  const createFragment = document.querySelector("#create-fragment");
  const fragmentText = document.querySelector("#text-input-title");
  const createInfo = document.querySelector("#createInfo");
  const fragType = document.querySelector("#Type");

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
    }
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
