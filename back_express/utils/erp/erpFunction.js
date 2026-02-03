const { callERPNextAPI } = require('../../services/erp/erpService');

// ==========================
// Fonctions générales CRUD
// ==========================

// async function fetchAll(resource, params = {}) {
//   params.fields = params.fields || '["*"]';
//   const result = await callERPNextAPI(`/api/resource/${resource}`, 'GET', null, params);
//   return result.data || [];
// }

async function fetchAll(resource, params = {}) {
  params.fields = params.fields || '["*"]';
  let allResults = [];
  let page = 0;
  const limit = 100; // ou 500 selon vos besoins
  
  while (true) {
    params.limit_start = page * limit;
    params.limit_page_length = limit;
    
    const result = await callERPNextAPI(`/api/resource/${resource}`, 'GET', null, params);
    
    if (!result.data || result.data.length === 0) {
      break;
    }
    
    allResults = allResults.concat(result.data);
    
    // Si on a moins de résultats que la limite, c'est la dernière page
    if (result.data.length < limit) {
      break;
    }
    
    page++;
  }
  
  return allResults;
  // return allResults.slice(1);
}


async function fetchAll2(resource, params = {}) {
  params.fields = params.fields || '["*"]';
  let allResults = [];
  let page = 0;
  const limit = 100; // ou 500 selon vos besoins
  
  while (true) {
    params.limit_start = page * limit;
    params.limit_page_length = limit;
    
    const result = await callERPNextAPI(`/api/resource/${resource}`, 'GET', null, params);
    
    if (!result.data || result.data.length === 0) {
      break;
    }
    
    allResults = allResults.concat(result.data);
    
    // Si on a moins de résultats que la limite, c'est la dernière page
    if (result.data.length < limit) {
      break;
    }
    
    page++;
  }
  
  // return allResults;
  return allResults.slice(1);
}

async function fetchAllWithoutFirst(resource, params = {}) {
  params.fields = params.fields || '["*"]';
  let allResults = [];
  let page = 0;
  const limit = 100; // ou 500 selon vos besoins
  
  while (true) {
    params.limit_start = page * limit;
    params.limit_page_length = limit;
    
    const result = await callERPNextAPI(`/api/resource/${resource}`, 'GET', null, params);
    
    if (!result.data || result.data.length === 0) {
      break;
    }
    
    allResults = allResults.concat(result.data);
    
    // Si on a moins de résultats que la limite, c'est la dernière page
    if (result.data.length < limit) {
      break;
    }
    
    page++;
  }
  
  // Retourne tous les résultats sauf le premier (indice 0)
  // return allResults.length > 0 ? allResults.slice(1) : [];
  return allResults;
}

async function fetchOne(resource, name, params = {}) {
  const result = await callERPNextAPI(`/api/resource/${resource}/${name}`, 'GET', null, params);
  return result.data || result;
}

async function create(resource, data) {
  const result = await callERPNextAPI(`/api/resource/${resource}`, 'POST', data);
  return result.data || result;
}

async function createAndSubmit(resource, data) {
  const created = await create(resource, data);
  const name = created.name;
  const submitted = await callERPNextAPI(
    `/api/resource/${resource}/${name}`,
    'POST',
    null,
    { run_method: 'submit' }
  );
  return submitted.data || submitted;
}

async function update(resource, name, data) {
  const result = await callERPNextAPI(`/api/resource/${resource}/${name}`, 'PUT', data);
  return result.data || result;
}

async function cancel(resource, name) {
  const result = await callERPNextAPI(
    `/api/resource/${resource}/${name}`,
    'POST',
    null,
    { run_method: 'cancel' }
  );
  return result.data || result;
}

async function submit(resource, name) {
  const result = await callERPNextAPI(
    `/api/resource/${resource}/${name}`,
    'POST',
    null,
    { run_method: 'submit' }
  );
  return result.data || result;
}

async function updateWithCancelAndSubmit(resource, name, newData) {
  await cancel(resource, name);
  await update(resource, name, newData);
  return await submit(resource, name);
}

async function deleteSafe(resource, name) {
//   await cancel(resource, name);
  const result = await callERPNextAPI(`/api/resource/${resource}/${name}`, 'DELETE');
  return result.data || result;
}

async function deleteWithCancel(resource, name) {
  await cancel(resource, name);
  const result = await callERPNextAPI(`/api/resource/${resource}/${name}`, 'DELETE');
  return result.data || result;
}

async function cancelDeleteCreateAndSubmit(resource, oldName, newData) {
  // Étape 1: Annuler le document existant
  await cancel(resource, oldName);
  
  // Étape 2: Supprimer le document annulé
  await deleteSafe(resource, oldName);
  
  // Étape 3: Créer un nouveau document
  const createdDoc = await create(resource, newData);
  const newDocName = createdDoc.name || createdDoc.data.name;
  
  // Étape 4: Soumettre le nouveau document
  const submittedDoc = await submit(resource, newDocName);
  
  return {
    newDocumentName: newDocName,
    submittedDocument: submittedDoc
  };
}

// Version alternative qui retourne seulement le nom du nouveau document
async function cancelDeleteCreateAndSubmitSimple(resource, oldName, newData) {
  // Annuler et supprimer l'ancien document
  await cancel(resource, oldName);
  await deleteSafe(resource, oldName);
  
  // Créer et soumettre le nouveau document
  const created = await createAndSubmit(resource, newData);
  return created.name || created.data.name;
}


module.exports = {
  fetchAll,
  fetchAll2,
  fetchAllWithoutFirst,
  fetchOne,
  create,
  createAndSubmit,
  update,
  cancel,
  submit,
  updateWithCancelAndSubmit,
  deleteWithCancel,
  deleteSafe,
  cancelDeleteCreateAndSubmit,
  cancelDeleteCreateAndSubmitSimple
};
