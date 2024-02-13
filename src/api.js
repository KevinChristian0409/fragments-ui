// src/api.js

// fragments microservice API to use, defaults to localhost:8080 if not set in env
const apiUrl = process.env.API_URL || "http://localhost:8080";

export async function getUserFragments(user) {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Successfully got user fragments data", { data });
    return data;
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

// Function to save user fragment
export async function saveUserFragment(user, text) {
  console.log("Sending Data to create a new Fragment");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      headers: {
        Authorization: Bearer`${user.idToken}`,
      },
      body: JSON.stringify({ text }), // Send the text in the request body
    });
    if (!res.ok) {
      throw new Error(`${res.status}``${res.statusText}`);
    }
    const data = await res.json();
    console.log("Fragment has been successfully created", { data });
  } catch (error) {
    console.error("Error saving fragment", error);
    throw error;
  }
}
