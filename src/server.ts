import {app}  from "./app";
import connectToDatabase from "./utils/connecToDb";

const PORT = process.env.PORT;
const PATH = "/users";



// Connect to database
connectToDatabase();

app.listen(PORT, () => {
  console.log(`[Server] is running on port ${PORT} and PATH ${PATH}`);
});
