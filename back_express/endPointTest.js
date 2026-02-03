const { response } = require('express');
const { callERPNextAPI } = require('./services/erp/erpService');
const ItemService = require('./services/erp/ItemService');
require('dotenv').config();

async function getItems() {
  try {
    const response = await callERPNextAPI('/api/resource/Item', 'GET');
    console.log('Items:', response.data);
    return response.data;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

async function getItems2() {
  try {
    // const response = await callERPNextAPI('/api/resource/Item', 'GET');
    console.log('ERP_API_URL =', process.env.ERP_API_URL);

    const response = await ItemService.getAllItems();
    console.log('Items:', response.data);
    return response.data;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}


async function getItemsWithParams() {
  const params = {
    fields: JSON.stringify(["*"])
    // filters: JSON.stringify([["item_group", "=", "All Item Groups"]]),
    // limit: 10
  };
  const response =  await callERPNextAPI('/api/resource/Item', 'GET', null, params);
    console.log('Items:', response.data);
    return response.data;
}

async function createItem() {
  const data = {
    item_code: "CODE123",
    item_name: "Nom article test",
    item_group: "All Item Groups",
    stock_uom: "Nos"
  };
  return await callERPNextAPI('/api/resource/Item', 'POST', data);
}

// async function updateItem(itemName) {
//   const data = {
//     item_name: "Nom modifié"
//   };
//   // L’endpoint PUT nécessite d’indiquer le nom de l’enregistrement dans l’URL
//   return await callERPNextAPI(`/api/resource/Item/${encodeURIComponent(itemName)}`, 'PUT', data);
// }

// async function deleteItem(itemName) {
//   return await callERPNextAPI(`/api/resource/Item/${encodeURIComponent(itemName)}`, 'DELETE');
// }



// getItems();
getItems();
// getItemsWithParams();
// createItem();
// updateItem("CODE123");
// updateItem("f5");