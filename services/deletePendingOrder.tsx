import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../pages/_app"; // import your Firestore instance

async function deletePendingOrder(email) {
  const docRef = doc(db, "pendingOrders", email);
  await deleteDoc(docRef);
}

export default deletePendingOrder;
