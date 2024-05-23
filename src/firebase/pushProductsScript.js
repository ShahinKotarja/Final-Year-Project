const { db } = require("./firebaseAdminInit");
const productsData = require("../groceriesDataset/groceryStoreDataset.json");

const importDataToFirestore = async () => {
  let batch = db.batch();
  let batchCount = 0;

  for (const [index, product] of productsData.entries()) {
    const docRef = db.collection("products").doc(); // Generates a new document ID for each product
    batch.set(docRef, product);
    batchCount++;

    if (batchCount % 500 === 0) {
      await batch.commit(); // Commit the batch
      batch = db.batch(); // Start a new batch
      console.log(`Committed batch at index ${index}`);
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    // Commit any remaining products in the last batch
    await batch.commit();
    console.log("Final batch committed.");
  }

  console.log("All products have been imported to Firestore.");
};

importDataToFirestore().catch((err) =>
  console.error("Failed to import products:", err)
);
