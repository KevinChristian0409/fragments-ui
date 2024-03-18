// src/api.js

// fragments microservice API to use, defaults to localhost:8080 if not set in env
const apiUrl = "http://localhost:8080";

export async function getUserFragments(user, expand = 0) {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=${expand}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments data", { data });
    return data.fragments;
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

// Function to save user fragment
export async function saveUserFragment(user, fragType, fragmentVal) {
  console.log("Sending Data to create a new Fragment");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        "Content-Type": `${fragType}`,
      },
      body: `${fragmentVal}`, // Send the text in the request body
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Fragment has been successfully created", { data }); // Log the response data
  } catch (error) {
    console.error("Error saving fragment", error);
    throw error;
  }
}

export async function getFragmentDataById(user, id) {
  console.log("Testing to get the Fragment data");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const headers = res.headers.get("content-type");
    var data;
    if (
      headers.includes("text/plain") ||
      headers.includes("text/html") ||
      headers.includes("text/markdown") ||
      headers.includes("application/json")
    ) {
      console.log("Content-type", headers);
      data = await res.text();
      console.log("Got user fragments data", { data });
      return [data];
    } else {
      data = await res.blob();
      console.log("Got user fragments data", { data });
      return [data];
    }
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

export async function getFragmentMetaDataById(user, id) {
  console.log("Testing to get the Fragment data!!!");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments data", { data });
    return data;
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}
