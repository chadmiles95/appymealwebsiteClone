//ANDROID CAN NOT RUN HTTP LOCALLY. CAN ONLY RUN HTTPS. USE LIVE API TO TEST ANDROID APIS IF ISSUE OR USE - npx ngrok http url

//FIREBASE API
const liveHost = "https://us-central1-mealstogo-dabbc.cloudfunctions.net";

//LOCAL API
const localHost =
  "https://7f3d-2600-1700-5bd1-c0-98df-c7a3-868b-2876.ngrok.io/mealstogo-dabbc/us-central1";

// export const isDevelopment = process.env.NODE_ENV === "development";
export const isDevelopment = process.env.NODE_ENV === "testhost";

export const host = isDevelopment ? localHost : liveHost;
